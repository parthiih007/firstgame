const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./user");
const ChatMessage = require("./chat");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/rockpaperscissors")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// Middleware
app.use(express.json());

// Session configuration
const sessionMiddleware = session({
  secret: "your-secret-key-change-this-to-something-random",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
});

app.use(sessionMiddleware);
app.use(express.static("public"));

// Track active sessions per user
let activeSessions = {};

// Middleware to check authentication
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ROUTES

// Register
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      wins: 0,
      losses: 0,
      draws: 0
    });

    await user.save();
    console.log("✅ User registered:", username, email);

    res.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    res.json({ success: false, message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ success: false, message: "Username and password required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const userId = user._id.toString();

    if (activeSessions[userId]) {
      return res.json({ 
        success: false, 
        message: "Account is already logged in from another device/browser" 
      });
    }

    await User.findByIdAndUpdate(userId, { lastActive: new Date() });

    req.session.userId = userId;
    req.session.username = user.username;
    req.session.email = user.email;
    
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.json({ success: false, message: "Session error" });
      }
      
      activeSessions[userId] = req.session.id;
      console.log("✅ User logged in:", username);
      res.json({ success: true });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.json({ success: false, message: "Server error" });
  }
});

// Get user profile
app.get("/api/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      profile: {
        _id: user._id.toString(),
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        wins: user.wins,
        losses: user.losses,
        draws: user.draws,
        totalGames: user.wins + user.losses + user.draws,
        memberSince: user.createdAt,
        lastActive: user.lastActive
      }
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.json({ success: false, message: "Server error" });
  }
});

// Get user stats
app.get("/api/stats", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      stats: {
        username: user.username,
        wins: user.wins,
        losses: user.losses,
        draws: user.draws,
        totalGames: user.wins + user.losses + user.draws
      }
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.json({ success: false, message: "Server error" });
  }
});

// Get leaderboard
app.get("/api/leaderboard", requireAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('username wins losses draws')
      .sort({ wins: -1 })
      .limit(10);

    const leaderboard = users.map(user => ({
      username: user.username,
      wins: user.wins,
      losses: user.losses,
      draws: user.draws,
      totalGames: user.wins + user.losses + user.draws,
      winRate: user.wins + user.losses + user.draws > 0 
        ? ((user.wins / (user.wins + user.losses + user.draws)) * 100).toFixed(1) 
        : 0
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.json({ success: false, message: "Server error" });
  }
});

// Get chat history
app.get("/api/chat-history/:opponentId", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const opponentId = req.params.opponentId;
    
    const participants = [userId, opponentId].sort();
    
    const messages = await ChatMessage.find({ participants })
      .sort({ timestamp: 1 })
      .limit(100);
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error("Chat history error:", error);
    res.json({ success: false, message: "Server error" });
  }
});

// Logout
app.get("/logout", (req, res) => {
  const userId = req.session.userId;
  
  if (userId && activeSessions[userId]) {
    delete activeSessions[userId];
    console.log("👋 User logged out:", req.session.username);
  }
  
  req.session.destroy();
  res.redirect("/login.html");
});

// Protected route
app.get("/game", requireAuth, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Redirect root
app.get("/", (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect("/game");
  } else {
    res.redirect("/login.html");
  }
});

// GAME LOGIC

let games = {};
let waitingPlayer = null;
let playerToGame = {};

function generateGameId() {
  return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Socket.IO
io.engine.use(sessionMiddleware);

io.on("connection", socket => {
  const session = socket.request.session;
  
  if (!session || !session.userId) {
    console.log("❌ Unauthorized connection");
    socket.emit("unauthorized");
    socket.disconnect();
    return;
  }

  const username = session.username;
  const userId = session.userId;
  const email = session.email;
  
  console.log("🔥 Player connected:", username, socket.id);

  if (waitingPlayer && waitingPlayer !== socket.id) {
    const gameId = generateGameId();
    const player1Socket = waitingPlayer;
    const player2Socket = socket.id;
    
    const player1SocketObj = io.sockets.sockets.get(player1Socket);
    if (!player1SocketObj) {
      waitingPlayer = socket.id;
      socket.emit("playerNumber", 1);
      socket.emit("playerInfo", { username, email });
      socket.emit("message", "Waiting for opponent...");
      return;
    }
    
    const player1Session = player1SocketObj.request.session;
    const player1Username = player1Session.username;
    const player1UserId = player1Session.userId;
    const player1Email = player1Session.email;
    
    games[gameId] = {
      player1: {
        socketId: player1Socket,
        userId: player1UserId,
        username: player1Username,
        email: player1Email
      },
      player2: {
        socketId: player2Socket,
        userId: userId,
        username: username,
        email: email
      },
      moves: {}
    };
    
    playerToGame[player1Socket] = gameId;
    playerToGame[player2Socket] = gameId;
    
    waitingPlayer = null;
    
    Promise.all([
      User.findById(player1UserId),
      User.findById(userId)
    ]).then(([p1User, p2User]) => {
      if (!p1User || !p2User) return;
      
      const player1Stats = {
        username: player1Username,
        email: player1Email,
        wins: p1User.wins || 0,
        losses: p1User.losses || 0,
        draws: p1User.draws || 0
      };
      
      const player2Stats = {
        username: username,
        email: email,
        wins: p2User.wins || 0,
        losses: p2User.losses || 0,
        draws: p2User.draws || 0
      };
      
      io.to(player1Socket).emit("playerNumber", 1);
      io.to(player1Socket).emit("playerInfo", { username: player1Username, email: player1Email });
      io.to(player1Socket).emit("matchFound", { opponent: player2Stats, opponentId: userId });
      
      io.to(player2Socket).emit("playerNumber", 2);
      io.to(player2Socket).emit("playerInfo", { username: username, email: email });
      io.to(player2Socket).emit("matchFound", { opponent: player1Stats, opponentId: player1UserId });
      
      io.to(player1Socket).emit("startGame");
      io.to(player2Socket).emit("startGame");
      
      console.log(`🚀 Game ${gameId} started: ${player1Username} vs ${username}`);
    });
    
  } else {
    waitingPlayer = socket.id;
    socket.emit("playerNumber", 1);
    socket.emit("playerInfo", { username, email });
    socket.emit("message", "Waiting for opponent...");
    console.log("🎮", username, "waiting");
  }

  socket.on("move", choice => {
    const gameId = playerToGame[socket.id];
    if (!gameId || !games[gameId]) return;
    
    const game = games[gameId];
    const isPlayer1 = game.player1.socketId === socket.id;
    const playerNum = isPlayer1 ? 1 : 2;
    
    game.moves[playerNum] = typeof choice === "object" ? choice.choice : choice;
    
    if (game.moves[1] && game.moves[2]) {
      const winner = getWinner(game.moves[1], game.moves[2]);
      
      io.to(game.player1.socketId).emit("result", {
        p1: game.moves[1],
        p2: game.moves[2],
        winner
      });
      
      io.to(game.player2.socketId).emit("result", {
        p1: game.moves[1],
        p2: game.moves[2],
        winner
      });
      
      updateScores(game, winner);
      game.moves = {};
    }
  });

  socket.on("chatMessage", async (data) => {
    console.log("\n💬 CHAT MESSAGE RECEIVED");
    console.log("From:", username);
    console.log("Data:", data);
    
    const gameId = playerToGame[socket.id];
    
    if (!gameId || !games[gameId]) {
      console.log("❌ No game found");
      socket.emit("error", "Game not found");
      return;
    }
    
    const game = games[gameId];
    const isPlayer1 = game.player1.socketId === socket.id;
    const sender = isPlayer1 ? game.player1 : game.player2;
    const recipient = isPlayer1 ? game.player2 : game.player1;
    
    const message = data.message.trim();
    
    if (!message || message.length === 0 || message.length > 500) {
      return;
    }
    
    try {
      const participants = [sender.userId, recipient.userId].sort();
      
      const chatMessage = new ChatMessage({
        participants,
        senderId: sender.userId,
        senderUsername: sender.username,
        message: message,
        timestamp: new Date()
      });
      
      await chatMessage.save();
      
      const messageData = {
        senderId: sender.userId,
        senderUsername: sender.username,
        message: message,
        timestamp: chatMessage.timestamp
      };
      
      io.to(game.player1.socketId).emit("chatMessage", messageData);
      io.to(game.player2.socketId).emit("chatMessage", messageData);
      
      console.log(`✅ Message sent: ${sender.username}: ${message}`);
    } catch (error) {
      console.error("Chat error:", error);
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", username);
    
    if (activeSessions[userId] === session.id) {
      delete activeSessions[userId];
    }
    
    const gameId = playerToGame[socket.id];
    
    if (waitingPlayer === socket.id) {
      waitingPlayer = null;
    }
    
    if (gameId && games[gameId]) {
      const game = games[gameId];
      const isPlayer1 = game.player1.socketId === socket.id;
      const opponentSocket = isPlayer1 ? game.player2.socketId : game.player1.socketId;
      
      io.to(opponentSocket).emit("message", "Opponent disconnected. Finding new match...");
      
      delete games[gameId];
      delete playerToGame[game.player1.socketId];
      delete playerToGame[game.player2.socketId];
      
      const opponentSocketObj = io.sockets.sockets.get(opponentSocket);
      if (opponentSocketObj) {
        waitingPlayer = opponentSocket;
        io.to(opponentSocket).emit("playerNumber", 1);
        io.to(opponentSocket).emit("message", "Waiting for new opponent...");
      }
    }
    
    delete playerToGame[socket.id];
  });
});

async function updateScores(game, winner) {
  try {
    if (winner === 0) {
      await User.findByIdAndUpdate(game.player1.userId, { $inc: { draws: 1 } });
      await User.findByIdAndUpdate(game.player2.userId, { $inc: { draws: 1 } });
    } else if (winner === 1) {
      await User.findByIdAndUpdate(game.player1.userId, { $inc: { wins: 1 } });
      await User.findByIdAndUpdate(game.player2.userId, { $inc: { losses: 1 } });
    } else {
      await User.findByIdAndUpdate(game.player2.userId, { $inc: { wins: 1 } });
      await User.findByIdAndUpdate(game.player1.userId, { $inc: { losses: 1 } });
    }
  } catch (error) {
    console.error("Score update error:", error);
  }
}

function getWinner(p1, p2) {
  if (p1 === p2) return 0;
  if (
    (p1 === "rock" && p2 === "scissors") ||
    (p1 === "paper" && p2 === "rock") ||
    (p1 === "scissors" && p2 === "paper")
  ) return 1;
  return 2;
}

server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});