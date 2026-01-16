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

mongoose.connect("mongodb://localhost:27017/rockpaperscissors")
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

app.use(express.json());

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

let activeSessions = {};

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ROUTES

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
    console.log("✅ User registered:", username);
    res.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    res.json({ success: false, message: "Server error" });
  }
});

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

// Get online users (for friend mode)
app.get("/api/online-users", requireAuth, async (req, res) => {
  try {
    const currentUserId = req.session.userId;
    const onlineUserIds = Object.keys(onlineUsers).filter(id => id !== currentUserId);
    
    const users = [];
    for (const userId of onlineUserIds) {
      const user = await User.findById(userId).select('username email wins losses draws');
      if (user) {
        users.push({
          userId: user._id.toString(),
          username: user.username,
          email: user.email,
          wins: user.wins,
          losses: user.losses,
          draws: user.draws,
          status: onlineUsers[userId].gameMode || 'available'
        });
      }
    }
    
    res.json({ success: true, users });
  } catch (error) {
    console.error("Online users error:", error);
    res.json({ success: false, message: "Server error" });
  }
});

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

app.get("/logout", (req, res) => {
  const userId = req.session.userId;
  
  if (userId && activeSessions[userId]) {
    delete activeSessions[userId];
  }
  
  req.session.destroy();
  res.redirect("/login.html");
});

app.get("/game", requireAuth, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/", (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect("/game");
  } else {
    res.redirect("/login.html");
  }
});

// GAME LOGIC WITH 3 MODES

let games = {}; // gameId -> game data
let waitingPlayer = null; // For random mode
let playerToGame = {}; // socketId -> gameId
let onlineUsers = {}; // userId -> { socketId, username, gameMode }
let friendInvites = {}; // inviteId -> { from, to, fromSocketId }

function generateGameId() {
  return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateInviteId() {
  return 'invite_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// AI opponent for computer mode
function getComputerMove() {
  const moves = ['rock', 'paper', 'scissors'];
  return moves[Math.floor(Math.random() * 3)];
}

io.engine.use(sessionMiddleware);

io.on("connection", socket => {
  const session = socket.request.session;
  
  if (!session || !session.userId) {
    socket.emit("unauthorized");
    socket.disconnect();
    return;
  }

  const username = session.username;
  const userId = session.userId;
  const email = session.email;
  
  // Add to online users
  onlineUsers[userId] = {
    socketId: socket.id,
    username: username,
    email: email,
    gameMode: null
  };
  
  console.log("🔥 Player connected:", username);
  
  // Broadcast online users update
  io.emit("onlineUsersUpdate", Object.keys(onlineUsers).length);
  
  socket.emit("playerInfo", { username, email });

  // MODE 1: RANDOM MATCH
  socket.on("joinRandomMatch", () => {
    console.log("🎲", username, "joining random match");
    
    onlineUsers[userId].gameMode = 'searching';
    
    if (waitingPlayer && waitingPlayer !== socket.id) {
      const gameId = generateGameId();
      const player1Socket = waitingPlayer;
      const player2Socket = socket.id;
      
      const player1SocketObj = io.sockets.sockets.get(player1Socket);
      if (!player1SocketObj) {
        waitingPlayer = socket.id;
        socket.emit("playerNumber", 1);
        socket.emit("message", "Waiting for opponent...");
        return;
      }
      
      const player1Session = player1SocketObj.request.session;
      const player1Username = player1Session.username;
      const player1UserId = player1Session.userId;
      const player1Email = player1Session.email;
      
      createGame(gameId, {
        socketId: player1Socket,
        userId: player1UserId,
        username: player1Username,
        email: player1Email
      }, {
        socketId: player2Socket,
        userId: userId,
        username: username,
        email: email
      }, 'random');
      
      waitingPlayer = null;
    } else {
      waitingPlayer = socket.id;
      socket.emit("playerNumber", 1);
      socket.emit("message", "Waiting for opponent...");
    }
  });

  // MODE 2: PLAY WITH FRIEND
  socket.on("inviteFriend", (friendUserId) => {
    console.log("💌", username, "inviting", friendUserId);
    
    const friend = onlineUsers[friendUserId];
    if (!friend) {
      socket.emit("error", "User not online");
      return;
    }
    
    if (friend.gameMode === 'playing') {
      socket.emit("error", "User is already in a game");
      return;
    }
    
    const inviteId = generateInviteId();
    friendInvites[inviteId] = {
      from: userId,
      to: friendUserId,
      fromSocketId: socket.id,
      fromUsername: username
    };
    
    io.to(friend.socketId).emit("friendInvite", {
      inviteId: inviteId,
      from: username,
      fromUserId: userId
    });
    
    socket.emit("message", `Invitation sent to ${friend.username}`);
  });

  socket.on("acceptInvite", (inviteId) => {
    const invite = friendInvites[inviteId];
    if (!invite) {
      socket.emit("error", "Invite not found or expired");
      return;
    }
    
    const gameId = generateGameId();
    
    const player1 = onlineUsers[invite.from];
    const player2 = onlineUsers[userId];
    
    if (!player1 || !player2) {
      socket.emit("error", "Player not available");
      delete friendInvites[inviteId];
      return;
    }
    
    createGame(gameId, {
      socketId: player1.socketId,
      userId: invite.from,
      username: player1.username,
      email: player1.email
    }, {
      socketId: socket.id,
      userId: userId,
      username: username,
      email: email
    }, 'friend');
    
    delete friendInvites[inviteId];
  });

  socket.on("declineInvite", (inviteId) => {
    const invite = friendInvites[inviteId];
    if (invite) {
      const sender = onlineUsers[invite.from];
      if (sender) {
        io.to(sender.socketId).emit("message", `${username} declined your invitation`);
      }
      delete friendInvites[inviteId];
    }
  });

  // MODE 3: PLAY WITH COMPUTER
  socket.on("playWithComputer", () => {
    console.log("🤖", username, "playing with computer");
    
    const gameId = generateGameId();
    
    games[gameId] = {
      gameMode: 'computer',
      player1: {
        socketId: socket.id,
        userId: userId,
        username: username,
        email: email
      },
      player2: {
        socketId: 'COMPUTER',
        userId: 'COMPUTER',
        username: 'Computer',
        email: 'ai@computer.bot'
      },
      moves: {}
    };
    
    playerToGame[socket.id] = gameId;
    onlineUsers[userId].gameMode = 'playing';
    
    socket.emit("playerNumber", 1);
    socket.emit("matchFound", {
      opponent: {
        username: 'Computer',
        email: '🤖 AI Opponent',
        wins: 999,
        losses: 0,
        draws: 0
      },
      opponentId: 'COMPUTER'
    });
    socket.emit("startGame");
    
    console.log("🤖 Computer game started for", username);
  });

  // Handle moves
  socket.on("move", choice => {
    const gameId = playerToGame[socket.id];
    if (!gameId || !games[gameId]) return;
    
    const game = games[gameId];
    const isPlayer1 = game.player1.socketId === socket.id;
    const playerNum = isPlayer1 ? 1 : 2;
    
    game.moves[playerNum] = typeof choice === "object" ? choice.choice : choice;
    
    // If computer mode, instantly generate computer move
    if (game.gameMode === 'computer') {
      game.moves[2] = getComputerMove();
    }
    
    if (game.moves[1] && game.moves[2]) {
      const winner = getWinner(game.moves[1], game.moves[2]);
      
      io.to(game.player1.socketId).emit("result", {
        p1: game.moves[1],
        p2: game.moves[2],
        winner
      });
      
      if (game.player2.socketId !== 'COMPUTER') {
        io.to(game.player2.socketId).emit("result", {
          p1: game.moves[1],
          p2: game.moves[2],
          winner
        });
      }
      
      // Only update scores for real players
      if (game.gameMode !== 'computer') {
        updateScores(game, winner);
      } else {
        // Update only player's score in computer mode
        updateComputerGameScore(game.player1.userId, winner);
      }
      
      game.moves = {};
    }
  });

  // Chat
  socket.on("chatMessage", async (data) => {
    const gameId = playerToGame[socket.id];
    
    if (!gameId || !games[gameId]) {
      return;
    }
    
    const game = games[gameId];
    
    // No chat with computer
    if (game.gameMode === 'computer') {
      socket.emit("chatMessage", {
        senderId: 'COMPUTER',
        senderUsername: 'Computer',
        message: "🤖 Beep boop! I'm a computer, I don't chat!",
        timestamp: new Date()
      });
      return;
    }
    
    const isPlayer1 = game.player1.socketId === socket.id;
    const sender = isPlayer1 ? game.player1 : game.player2;
    const recipient = isPlayer1 ? game.player2 : game.player1;
    
    const message = data.message.trim();
    
    if (!message || message.length === 0 || message.length > 500) return;
    
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
    } catch (error) {
      console.error("Chat error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", username);
    
    delete onlineUsers[userId];
    io.emit("onlineUsersUpdate", Object.keys(onlineUsers).length);
    
    if (activeSessions[userId] === session.id) {
      delete activeSessions[userId];
    }
    
    const gameId = playerToGame[socket.id];
    
    if (waitingPlayer === socket.id) {
      waitingPlayer = null;
    }
    
    // Cancel any pending invites
    Object.keys(friendInvites).forEach(inviteId => {
      const invite = friendInvites[inviteId];
      if (invite.from === userId || invite.to === userId) {
        delete friendInvites[inviteId];
      }
    });
    
    if (gameId && games[gameId]) {
      const game = games[gameId];
      
      if (game.gameMode === 'computer') {
        delete games[gameId];
        delete playerToGame[socket.id];
      } else {
        const isPlayer1 = game.player1.socketId === socket.id;
        const opponentSocket = isPlayer1 ? game.player2.socketId : game.player1.socketId;
        
        io.to(opponentSocket).emit("message", "Opponent disconnected.");
        
        delete games[gameId];
        delete playerToGame[game.player1.socketId];
        delete playerToGame[game.player2.socketId];
      }
    }
    
    delete playerToGame[socket.id];
  });
});

function createGame(gameId, player1, player2, mode) {
  games[gameId] = {
    gameMode: mode,
    player1: player1,
    player2: player2,
    moves: {}
  };
  
  playerToGame[player1.socketId] = gameId;
  playerToGame[player2.socketId] = gameId;
  
  onlineUsers[player1.userId].gameMode = 'playing';
  onlineUsers[player2.userId].gameMode = 'playing';
  
  Promise.all([
    User.findById(player1.userId),
    User.findById(player2.userId)
  ]).then(([p1User, p2User]) => {
    const player1Stats = {
      username: player1.username,
      email: player1.email,
      wins: p1User?.wins || 0,
      losses: p1User?.losses || 0,
      draws: p1User?.draws || 0
    };
    
    const player2Stats = {
      username: player2.username,
      email: player2.email,
      wins: p2User?.wins || 0,
      losses: p2User?.losses || 0,
      draws: p2User?.draws || 0
    };
    
    io.to(player1.socketId).emit("playerNumber", 1);
    io.to(player1.socketId).emit("matchFound", { 
      opponent: player2Stats, 
      opponentId: player2.userId 
    });
    io.to(player1.socketId).emit("startGame");
    
    io.to(player2.socketId).emit("playerNumber", 2);
    io.to(player2.socketId).emit("matchFound", { 
      opponent: player1Stats, 
      opponentId: player1.userId 
    });
    io.to(player2.socketId).emit("startGame");
    
    console.log(`🚀 ${mode} game: ${player1.username} vs ${player2.username}`);
  });
}

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

async function updateComputerGameScore(userId, winner) {
  try {
    if (winner === 0) {
      await User.findByIdAndUpdate(userId, { $inc: { draws: 1 } });
    } else if (winner === 1) {
      await User.findByIdAndUpdate(userId, { $inc: { wins: 1 } });
    } else {
      await User.findByIdAndUpdate(userId, { $inc: { losses: 1 } });
    }
  } catch (error) {
    console.error("Computer game score error:", error);
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
  console.log("🎮 3 Game Modes: Random | Friend | Computer");
});