// // const express = require("express");
// // const http = require("http");
// // const { Server } = require("socket.io");
// // const mongoose = require("mongoose");
// // const bcrypt = require("bcrypt");
// // const session = require("express-session");
// // const User = require("./user");

// // const app = express();
// // const server = http.createServer(app);
// // const io = new Server(server);

// // // MongoDB connection
// // mongoose.connect("mongodb://localhost:27017/rockpaperscissors")
// // .then(() => console.log("✅ MongoDB connected"))
// // .catch(err => console.error("❌ MongoDB error:", err));

// // // Middleware
// // app.use(express.json());

// // // Session configuration
// // const sessionMiddleware = session({
// //   secret: "your-secret-key-change-this-to-something-random",
// //   resave: false,
// //   saveUninitialized: false,
// //   cookie: { 
// //     secure: false,
// //     httpOnly: true,
// //     maxAge: 24 * 60 * 60 * 1000
// //   }
// // });

// // app.use(sessionMiddleware);
// // app.use(express.static("public"));

// // // Middleware to check authentication
// // function requireAuth(req, res, next) {
// //   if (req.session && req.session.userId) {
// //     next();
// //   } else {
// //     res.redirect("/login.html");
// //   }
// // }

// // // Routes

// // // Register
// // app.post("/register", async (req, res) => {
// //   try {
// //     const { username, password } = req.body;

// //     if (!username || !password) {
// //       return res.json({ success: false, message: "Username and password required" });
// //     }

// //     if (password.length < 6) {
// //       return res.json({ success: false, message: "Password must be at least 6 characters" });
// //     }

// //     const existingUser = await User.findOne({ username });
// //     if (existingUser) {
// //       return res.json({ success: false, message: "Username already exists" });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     const user = new User({
// //       username,
// //       password: hashedPassword,
// //       wins: 0,
// //       losses: 0,
// //       draws: 0
// //     });

// //     await user.save();
// //     console.log("✅ User registered:", username);

// //     res.json({ success: true });
// //   } catch (error) {
// //     console.error("Registration error:", error);
// //     res.json({ success: false, message: "Server error" });
// //   }
// // });

// // // Login
// // app.post("/login", async (req, res) => {
// //   try {
// //     const { username, password } = req.body;

// //     if (!username || !password) {
// //       return res.json({ success: false, message: "Username and password required" });
// //     }

// //     const user = await User.findOne({ username });
// //     if (!user) {
// //       return res.json({ success: false, message: "Invalid credentials" });
// //     }

// //     const validPassword = await bcrypt.compare(password, user.password);
// //     if (!validPassword) {
// //       return res.json({ success: false, message: "Invalid credentials" });
// //     }

// //     req.session.userId = user._id.toString();
// //     req.session.username = user.username;
    
// //     req.session.save((err) => {
// //       if (err) {
// //         console.error("Session save error:", err);
// //         return res.json({ success: false, message: "Session error" });
// //       }
      
// //       console.log("✅ User logged in:", username);
// //       res.json({ success: true });
// //     });
// //   } catch (error) {
// //     console.error("Login error:", error);
// //     res.json({ success: false, message: "Server error" });
// //   }
// // });

// // // Get user stats
// // app.get("/api/stats", requireAuth, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.session.userId).select('-password');
// //     if (!user) {
// //       return res.json({ success: false, message: "User not found" });
// //     }

// //     res.json({
// //       success: true,
// //       stats: {
// //         username: user.username,
// //         wins: user.wins,
// //         losses: user.losses,
// //         draws: user.draws,
// //         totalGames: user.wins + user.losses + user.draws
// //       }
// //     });
// //   } catch (error) {
// //     console.error("Stats error:", error);
// //     res.json({ success: false, message: "Server error" });
// //   }
// // });

// // // Get leaderboard
// // app.get("/api/leaderboard", requireAuth, async (req, res) => {
// //   try {
// //     const users = await User.find()
// //       .select('username wins losses draws')
// //       .sort({ wins: -1 })
// //       .limit(10);

// //     const leaderboard = users.map(user => ({
// //       username: user.username,
// //       wins: user.wins,
// //       losses: user.losses,
// //       draws: user.draws,
// //       totalGames: user.wins + user.losses + user.draws,
// //       winRate: user.wins + user.losses + user.draws > 0 
// //         ? ((user.wins / (user.wins + user.losses + user.draws)) * 100).toFixed(1) 
// //         : 0
// //     }));

// //     res.json({ success: true, leaderboard });
// //   } catch (error) {
// //     console.error("Leaderboard error:", error);
// //     res.json({ success: false, message: "Server error" });
// //   }
// // });

// // // Logout
// // app.get("/logout", (req, res) => {
// //   req.session.destroy();
// //   res.redirect("/login.html");
// // });

// // // Protected route
// // app.get("/game", requireAuth, (req, res) => {
// //   res.sendFile(__dirname + "/public/index.html");
// // });

// // // Redirect root
// // app.get("/", (req, res) => {
// //   if (req.session && req.session.userId) {
// //     res.redirect("/game");
// //   } else {
// //     res.redirect("/login.html");
// //   }
// // });

// // // Game logic
// // let players = {}; // socket.id -> {playerNumber, userId, username}
// // let moves = {};   // playerNumber -> choice

// // // Socket.IO with session sharing
// // io.engine.use(sessionMiddleware);

// // io.on("connection", socket => {
// //   const session = socket.request.session;
  
// //   if (!session || !session.userId) {
// //     console.log("❌ Unauthorized socket connection attempt");
// //     socket.emit("unauthorized");
// //     socket.disconnect();
// //     return;
// //   }

// //   const username = session.username;
// //   const userId = session.userId;
// //   console.log("🔥 Player connected:", username, socket.id);

// //   // Assign player number
// //   if (!Object.values(players).some(p => p.playerNumber === 1)) {
// //     players[socket.id] = { playerNumber: 1, userId, username };
// //     socket.emit("playerNumber", 1);
// //     socket.emit("playerInfo", { username });
// //     console.log("🎮 Assigned Player 1 to", username);
// //   } else if (!Object.values(players).some(p => p.playerNumber === 2)) {
// //     players[socket.id] = { playerNumber: 2, userId, username };
// //     socket.emit("playerNumber", 2);
// //     socket.emit("playerInfo", { username });
// //     console.log("🎮 Assigned Player 2 to", username);

// //     io.emit("startGame");
// //     console.log("🚀 Game Started");
// //   } else {
// //     socket.emit("message", "Game full");
// //     socket.disconnect();
// //     return;
// //   }

// //   socket.on("move", choice => {
// //     const player = players[socket.id];
// //     const playerNum = player.playerNumber;

// //     if (typeof choice === "object") {
// //       moves[playerNum] = choice.choice;
// //     } else {
// //       moves[playerNum] = choice;
// //     }

// //     console.log(`🪨 Player ${playerNum} (${player.username}) chose ${moves[playerNum]}`);

// //     if (moves[1] && moves[2]) {
// //       const winner = getWinner(moves[1], moves[2]);
// //       console.log("🏆 Result:", moves, "Winner:", winner);

// //       io.emit("result", {
// //         p1: moves[1],
// //         p2: moves[2],
// //         winner
// //       });

// //       // Update scores in database
// //       updateScores(players, winner);

// //       moves = {};
// //     }
// //   });

// //   socket.on("disconnect", () => {
// //     console.log("❌ Player disconnected:", username, socket.id);
// //     delete players[socket.id];
// //     moves = {};
// //     io.emit("message", "Player disconnected. Refresh to restart.");
// //   });
// // });

// // // Update player scores
// // async function updateScores(players, winner) {
// //   try {
// //     const player1 = Object.values(players).find(p => p.playerNumber === 1);
// //     const player2 = Object.values(players).find(p => p.playerNumber === 2);

// //     if (!player1 || !player2) return;

// //     if (winner === 0) {
// //       // Draw
// //       await User.findByIdAndUpdate(player1.userId, { $inc: { draws: 1 } });
// //       await User.findByIdAndUpdate(player2.userId, { $inc: { draws: 1 } });
// //       console.log("📊 Updated scores: Both players got a draw");
// //     } else if (winner === 1) {
// //       // Player 1 wins
// //       await User.findByIdAndUpdate(player1.userId, { $inc: { wins: 1 } });
// //       await User.findByIdAndUpdate(player2.userId, { $inc: { losses: 1 } });
// //       console.log(`📊 Updated scores: ${player1.username} wins, ${player2.username} loses`);
// //     } else {
// //       // Player 2 wins
// //       await User.findByIdAndUpdate(player2.userId, { $inc: { wins: 1 } });
// //       await User.findByIdAndUpdate(player1.userId, { $inc: { losses: 1 } });
// //       console.log(`📊 Updated scores: ${player2.username} wins, ${player1.username} loses`);
// //     }
// //   } catch (error) {
// //     console.error("Error updating scores:", error);
// //   }
// // }

// // // Determine winner
// // function getWinner(p1, p2) {
// //   if (p1 === p2) return 0;
// //   if (
// //     (p1 === "rock" && p2 === "scissors") ||
// //     (p1 === "paper" && p2 === "rock") ||
// //     (p1 === "scissors" && p2 === "paper")
// //   ) return 1;
// //   return 2;
// // }

// // server.listen(3000, () => {
// //   console.log("🚀 Server running at http://localhost:3000");
// // });

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const session = require("express-session");
// const User = require("./user");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // MongoDB connection
// mongoose.connect("mongodb://localhost:27017/rockpaperscissors")
// .then(() => console.log("✅ MongoDB connected"))
// .catch(err => console.error("❌ MongoDB error:", err));

// // Middleware
// app.use(express.json());

// // Session configuration
// const sessionMiddleware = session({
//   secret: "your-secret-key-change-this-to-something-random",
//   resave: false,
//   saveUninitialized: false,
//   cookie: { 
//     secure: false,
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000
//   }
// });

// app.use(sessionMiddleware);
// app.use(express.static("public"));

// // Middleware to check authentication
// function requireAuth(req, res, next) {
//   if (req.session && req.session.userId) {
//     next();
//   } else {
//     res.redirect("/login.html");
//   }
// }

// // Routes

// // Register
// app.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.json({ success: false, message: "Username and password required" });
//     }

//     if (password.length < 6) {
//       return res.json({ success: false, message: "Password must be at least 6 characters" });
//     }

//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.json({ success: false, message: "Username already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       username,
//       password: hashedPassword,
//       wins: 0,
//       losses: 0,
//       draws: 0
//     });

//     await user.save();
//     console.log("✅ User registered:", username);

//     res.json({ success: true });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Login
// app.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.json({ success: false, message: "Username and password required" });
//     }

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     req.session.userId = user._id.toString();
//     req.session.username = user.username;
    
//     req.session.save((err) => {
//       if (err) {
//         console.error("Session save error:", err);
//         return res.json({ success: false, message: "Session error" });
//       }
      
//       console.log("✅ User logged in:", username);
//       res.json({ success: true });
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get user stats
// app.get("/api/stats", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.session.userId).select('-password');
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     res.json({
//       success: true,
//       stats: {
//         username: user.username,
//         wins: user.wins,
//         losses: user.losses,
//         draws: user.draws,
//         totalGames: user.wins + user.losses + user.draws
//       }
//     });
//   } catch (error) {
//     console.error("Stats error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get leaderboard
// app.get("/api/leaderboard", requireAuth, async (req, res) => {
//   try {
//     const users = await User.find()
//       .select('username wins losses draws')
//       .sort({ wins: -1 })
//       .limit(10);

//     const leaderboard = users.map(user => ({
//       username: user.username,
//       wins: user.wins,
//       losses: user.losses,
//       draws: user.draws,
//       totalGames: user.wins + user.losses + user.draws,
//       winRate: user.wins + user.losses + user.draws > 0 
//         ? ((user.wins / (user.wins + user.losses + user.draws)) * 100).toFixed(1) 
//         : 0
//     }));

//     res.json({ success: true, leaderboard });
//   } catch (error) {
//     console.error("Leaderboard error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get active games count
// app.get("/api/active-games", requireAuth, (req, res) => {
//   const activeGames = Object.keys(games).length;
//   const waitingPlayers = waitingPlayer ? 1 : 0;
//   const totalPlayers = activeGames * 2 + waitingPlayers;
  
//   res.json({
//     success: true,
//     activeGames,
//     totalPlayers,
//     waitingPlayers
//   });
// });

// // Logout
// app.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.redirect("/login.html");
// });

// // Protected route
// app.get("/game", requireAuth, (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

// // Redirect root
// app.get("/", (req, res) => {
//   if (req.session && req.session.userId) {
//     res.redirect("/game");
//   } else {
//     res.redirect("/login.html");
//   }
// });

// // ==================== GAME LOGIC ====================

// // Data structures for multi-game support
// let games = {}; // gameId -> { player1, player2, moves }
// let waitingPlayer = null; // socketId of player waiting for match
// let playerToGame = {}; // socketId -> gameId mapping

// // Generate unique game ID
// function generateGameId() {
//   return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
// }

// // Socket.IO with session sharing
// io.engine.use(sessionMiddleware);

// io.on("connection", socket => {
//   const session = socket.request.session;
  
//   if (!session || !session.userId) {
//     console.log("❌ Unauthorized socket connection attempt");
//     socket.emit("unauthorized");
//     socket.disconnect();
//     return;
//   }

//   const username = session.username;
//   const userId = session.userId;
//   console.log("🔥 Player connected:", username, socket.id);

//   // Check if there's a waiting player
//   if (waitingPlayer && waitingPlayer !== socket.id) {
//     // Match with waiting player
//     const gameId = generateGameId();
//     const player1Socket = waitingPlayer;
//     const player2Socket = socket.id;
    
//     // Get player 1 info from io.sockets
//     const player1SocketObj = io.sockets.sockets.get(player1Socket);
//     if (!player1SocketObj) {
//       // Player 1 disconnected, make this player wait
//       waitingPlayer = socket.id;
//       socket.emit("playerNumber", 1);
//       socket.emit("playerInfo", { username });
//       socket.emit("message", "Waiting for opponent...");
//       console.log("🎮 Player", username, "is waiting (Player 1 disconnected)");
//       return;
//     }
    
//     const player1Session = player1SocketObj.request.session;
//     const player1Username = player1Session.username;
//     const player1UserId = player1Session.userId;
    
//     // Create game
//     games[gameId] = {
//       player1: {
//         socketId: player1Socket,
//         userId: player1UserId,
//         username: player1Username
//       },
//       player2: {
//         socketId: player2Socket,
//         userId: userId,
//         username: username
//       },
//       moves: {}
//     };
    
//     // Map players to game
//     playerToGame[player1Socket] = gameId;
//     playerToGame[player2Socket] = gameId;
    
//     // Clear waiting player
//     waitingPlayer = null;
    
//     // Notify both players
//     io.to(player1Socket).emit("playerNumber", 1);
//     io.to(player1Socket).emit("playerInfo", { username: player1Username, opponent: username });
//     io.to(player1Socket).emit("matchFound", { opponent: username });
    
//     io.to(player2Socket).emit("playerNumber", 2);
//     io.to(player2Socket).emit("playerInfo", { username: username, opponent: player1Username });
//     io.to(player2Socket).emit("matchFound", { opponent: player1Username });
    
//     // Start game for both players
//     io.to(player1Socket).emit("startGame");
//     io.to(player2Socket).emit("startGame");
    
//     console.log(`🚀 Game ${gameId} started: ${player1Username} vs ${username}`);
//     console.log(`📊 Active games: ${Object.keys(games).length}`);
    
//   } else {
//     // No waiting player or it's the same socket, make this player wait
//     waitingPlayer = socket.id;
//     socket.emit("playerNumber", 1);
//     socket.emit("playerInfo", { username });
//     socket.emit("message", "Waiting for opponent...");
//     console.log("🎮 Player", username, "is waiting for opponent");
//   }

//   // Handle player move
//   socket.on("move", choice => {
//     const gameId = playerToGame[socket.id];
    
//     if (!gameId || !games[gameId]) {
//       socket.emit("error", "Game not found");
//       return;
//     }
    
//     const game = games[gameId];
//     const isPlayer1 = game.player1.socketId === socket.id;
//     const playerNum = isPlayer1 ? 1 : 2;
//     const playerUsername = isPlayer1 ? game.player1.username : game.player2.username;
    
//     // Store move
//     if (typeof choice === "object") {
//       game.moves[playerNum] = choice.choice;
//     } else {
//       game.moves[playerNum] = choice;
//     }
    
//     console.log(`🪨 [${gameId}] Player ${playerNum} (${playerUsername}) chose ${game.moves[playerNum]}`);
    
//     // Check if both players have moved
//     if (game.moves[1] && game.moves[2]) {
//       const winner = getWinner(game.moves[1], game.moves[2]);
//       console.log(`🏆 [${gameId}] Result: ${game.moves[1]} vs ${game.moves[2]} - Winner: ${winner}`);
      
//       // Send result to both players
//       io.to(game.player1.socketId).emit("result", {
//         p1: game.moves[1],
//         p2: game.moves[2],
//         winner
//       });
      
//       io.to(game.player2.socketId).emit("result", {
//         p1: game.moves[1],
//         p2: game.moves[2],
//         winner
//       });
      
//       // Update scores in database
//       updateScores(game, winner);
      
//       // Clear moves for next round
//       game.moves = {};
//     }
//   });

//   // Handle disconnect
//   socket.on("disconnect", () => {
//     console.log("❌ Player disconnected:", username, socket.id);
    
//     const gameId = playerToGame[socket.id];
    
//     // If player was waiting, remove from waiting
//     if (waitingPlayer === socket.id) {
//       waitingPlayer = null;
//       console.log("🔄 Waiting player removed");
//     }
    
//     // If player was in a game, notify opponent
//     if (gameId && games[gameId]) {
//       const game = games[gameId];
//       const isPlayer1 = game.player1.socketId === socket.id;
//       const opponentSocket = isPlayer1 ? game.player2.socketId : game.player1.socketId;
      
//       // Notify opponent
//       io.to(opponentSocket).emit("message", "Opponent disconnected. Finding new match...");
      
//       // Remove game
//       delete games[gameId];
//       delete playerToGame[game.player1.socketId];
//       delete playerToGame[game.player2.socketId];
      
//       // Put opponent in waiting queue
//       const opponentSocketObj = io.sockets.sockets.get(opponentSocket);
//       if (opponentSocketObj) {
//         waitingPlayer = opponentSocket;
//         io.to(opponentSocket).emit("playerNumber", 1);
//         io.to(opponentSocket).emit("message", "Waiting for new opponent...");
//       }
      
//       console.log(`🗑️ Game ${gameId} removed. Active games: ${Object.keys(games).length}`);
//     }
    
//     // Clean up player mapping
//     delete playerToGame[socket.id];
//   });
// });

// // Update player scores
// async function updateScores(game, winner) {
//   try {
//     const player1Id = game.player1.userId;
//     const player2Id = game.player2.userId;

//     if (winner === 0) {
//       // Draw
//       await User.findByIdAndUpdate(player1Id, { $inc: { draws: 1 } });
//       await User.findByIdAndUpdate(player2Id, { $inc: { draws: 1 } });
//       console.log(`📊 Draw: ${game.player1.username} vs ${game.player2.username}`);
//     } else if (winner === 1) {
//       // Player 1 wins
//       await User.findByIdAndUpdate(player1Id, { $inc: { wins: 1 } });
//       await User.findByIdAndUpdate(player2Id, { $inc: { losses: 1 } });
//       console.log(`📊 ${game.player1.username} wins against ${game.player2.username}`);
//     } else {
//       // Player 2 wins
//       await User.findByIdAndUpdate(player2Id, { $inc: { wins: 1 } });
//       await User.findByIdAndUpdate(player1Id, { $inc: { losses: 1 } });
//       console.log(`📊 ${game.player2.username} wins against ${game.player1.username}`);
//     }
//   } catch (error) {
//     console.error("Error updating scores:", error);
//   }
// }

// // Determine winner
// function getWinner(p1, p2) {
//   if (p1 === p2) return 0;
//   if (
//     (p1 === "rock" && p2 === "scissors") ||
//     (p1 === "paper" && p2 === "rock") ||
//     (p1 === "scissors" && p2 === "paper")
//   ) return 1;
//   return 2;
// }

// server.listen(3000, () => {
//   console.log("🚀 Server running at http://localhost:3000");
//   console.log("🎮 Multi-player matchmaking enabled");
// });


// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const session = require("express-session");
// const User = require("./user");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // MongoDB connection
// mongoose.connect("mongodb://localhost:27017/rockpaperscissors")
// .then(() => console.log("✅ MongoDB connected"))
// .catch(err => console.error("❌ MongoDB error:", err));

// // Middleware
// app.use(express.json());

// // Session configuration
// const sessionMiddleware = session({
//   secret: "your-secret-key-change-this-to-something-random",
//   resave: false,
//   saveUninitialized: false,
//   cookie: { 
//     secure: false,
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000
//   }
// });

// app.use(sessionMiddleware);
// app.use(express.static("public"));

// // Track active sessions per user to prevent duplicate logins
// let activeSessions = {}; // userId -> sessionId

// // Middleware to check authentication
// function requireAuth(req, res, next) {
//   if (req.session && req.session.userId) {
//     next();
//   } else {
//     res.redirect("/login.html");
//   }
// }

// // Email validation function
// function isValidEmail(email) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// // Routes

// // Register
// app.post("/register", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.json({ success: false, message: "All fields are required" });
//     }

//     if (!isValidEmail(email)) {
//       return res.json({ success: false, message: "Invalid email format" });
//     }

//     if (password.length < 6) {
//       return res.json({ success: false, message: "Password must be at least 6 characters" });
//     }

//     // Check if username exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.json({ success: false, message: "Username already exists" });
//     }

//     // Check if email exists
//     const existingEmail = await User.findOne({ email });
//     if (existingEmail) {
//       return res.json({ success: false, message: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       username,
//       email,
//       password: hashedPassword,
//       wins: 0,
//       losses: 0,
//       draws: 0
//     });

//     await user.save();
//     console.log("✅ User registered:", username, email);

//     res.json({ success: true });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Login
// app.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.json({ success: false, message: "Username and password required" });
//     }

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     const userId = user._id.toString();

//     // Check if user is already logged in from another session
//     if (activeSessions[userId]) {
//       return res.json({ 
//         success: false, 
//         message: "Account is already logged in from another device/browser" 
//       });
//     }

//     // Update last active time
//     await User.findByIdAndUpdate(userId, { lastActive: new Date() });

//     req.session.userId = userId;
//     req.session.username = user.username;
//     req.session.email = user.email;
    
//     req.session.save((err) => {
//       if (err) {
//         console.error("Session save error:", err);
//         return res.json({ success: false, message: "Session error" });
//       }
      
//       // Mark session as active
//       activeSessions[userId] = req.session.id;
      
//       console.log("✅ User logged in:", username);
//       res.json({ success: true });
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get user profile
// app.get("/api/profile", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.session.userId).select('-password');
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     res.json({
//       success: true,
//       profile: {
//         username: user.username,
//         email: user.email,
//         wins: user.wins,
//         losses: user.losses,
//         draws: user.draws,
//         totalGames: user.wins + user.losses + user.draws,
//         memberSince: user.createdAt,
//         lastActive: user.lastActive
//       }
//     });
//   } catch (error) {
//     console.error("Profile error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get user stats
// app.get("/api/stats", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.session.userId).select('-password');
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     res.json({
//       success: true,
//       stats: {
//         username: user.username,
//         wins: user.wins,
//         losses: user.losses,
//         draws: user.draws,
//         totalGames: user.wins + user.losses + user.draws
//       }
//     });
//   } catch (error) {
//     console.error("Stats error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get leaderboard
// app.get("/api/leaderboard", requireAuth, async (req, res) => {
//   try {
//     const users = await User.find()
//       .select('username wins losses draws')
//       .sort({ wins: -1 })
//       .limit(10);

//     const leaderboard = users.map(user => ({
//       username: user.username,
//       wins: user.wins,
//       losses: user.losses,
//       draws: user.draws,
//       totalGames: user.wins + user.losses + user.draws,
//       winRate: user.wins + user.losses + user.draws > 0 
//         ? ((user.wins / (user.wins + user.losses + user.draws)) * 100).toFixed(1) 
//         : 0
//     }));

//     res.json({ success: true, leaderboard });
//   } catch (error) {
//     console.error("Leaderboard error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get active games count
// app.get("/api/active-games", requireAuth, (req, res) => {
//   const activeGames = Object.keys(games).length;
//   const waitingPlayers = waitingPlayer ? 1 : 0;
//   const totalPlayers = activeGames * 2 + waitingPlayers;
  
//   res.json({
//     success: true,
//     activeGames,
//     totalPlayers,
//     waitingPlayers
//   });
// });

// // Logout
// app.get("/logout", (req, res) => {
//   const userId = req.session.userId;
  
//   // Remove from active sessions
//   if (userId && activeSessions[userId]) {
//     delete activeSessions[userId];
//     console.log("👋 User logged out and session cleared:", req.session.username);
//   }
  
//   req.session.destroy((err) => {
//     if (err) {
//       console.error("Logout error:", err);
//     }
//     res.redirect("/login.html");
//   });
// });

// // Protected route
// app.get("/game", requireAuth, (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

// // Redirect root
// app.get("/", (req, res) => {
//   if (req.session && req.session.userId) {
//     res.redirect("/game");
//   } else {
//     res.redirect("/login.html");
//   }
// });

// // ==================== GAME LOGIC ====================

// let games = {}; // gameId -> { player1, player2, moves }
// let waitingPlayer = null; // socketId of player waiting for match
// let playerToGame = {}; // socketId -> gameId mapping

// // Generate unique game ID
// function generateGameId() {
//   return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
// }

// // Socket.IO with session sharing
// io.engine.use(sessionMiddleware);

// io.on("connection", socket => {
//   const session = socket.request.session;
  
//   if (!session || !session.userId) {
//     console.log("❌ Unauthorized socket connection attempt");
//     socket.emit("unauthorized");
//     socket.disconnect();
//     return;
//   }

//   const username = session.username;
//   const userId = session.userId;
//   const email = session.email;
  
//   console.log("🔥 Player connected:", username, socket.id);

//   // Check if there's a waiting player
//   if (waitingPlayer && waitingPlayer !== socket.id) {
//     const gameId = generateGameId();
//     const player1Socket = waitingPlayer;
//     const player2Socket = socket.id;
    
//     const player1SocketObj = io.sockets.sockets.get(player1Socket);
//     if (!player1SocketObj) {
//       waitingPlayer = socket.id;
//       socket.emit("playerNumber", 1);
//       socket.emit("playerInfo", { username, email });
//       socket.emit("message", "Waiting for opponent...");
//       console.log("🎮 Player", username, "is waiting (Player 1 disconnected)");
//       return;
//     }
    
//     const player1Session = player1SocketObj.request.session;
//     const player1Username = player1Session.username;
//     const player1UserId = player1Session.userId;
//     const player1Email = player1Session.email;
    
//     // Create game
//     games[gameId] = {
//       player1: {
//         socketId: player1Socket,
//         userId: player1UserId,
//         username: player1Username,
//         email: player1Email
//       },
//       player2: {
//         socketId: player2Socket,
//         userId: userId,
//         username: username,
//         email: email
//       },
//       moves: {}
//     };
    
//     playerToGame[player1Socket] = gameId;
//     playerToGame[player2Socket] = gameId;
    
//     waitingPlayer = null;
    
//     // Get player stats for display
//     Promise.all([
//       User.findById(player1UserId),
//       User.findById(userId)
//     ]).then(([p1User, p2User]) => {
//       if (!p1User || !p2User) {
//         console.error("❌ User not found in database");
//         return;
//       }
      
//       const player1Stats = {
//         username: player1Username,
//         email: player1Email,
//         wins: p1User.wins || 0,
//         losses: p1User.losses || 0,
//         draws: p1User.draws || 0
//       };
      
//       const player2Stats = {
//         username: username,
//         email: email,
//         wins: p2User.wins || 0,
//         losses: p2User.losses || 0,
//         draws: p2User.draws || 0
//       };
      
//       // Send opponent info to both players
//       io.to(player1Socket).emit("playerNumber", 1);
//       io.to(player1Socket).emit("playerInfo", { 
//         username: player1Username, 
//         email: player1Email
//       });
//       io.to(player1Socket).emit("matchFound", { opponent: player2Stats });
      
//       io.to(player2Socket).emit("playerNumber", 2);
//       io.to(player2Socket).emit("playerInfo", { 
//         username: username,
//         email: email
//       });
//       io.to(player2Socket).emit("matchFound", { opponent: player1Stats });
      
//       io.to(player1Socket).emit("startGame");
//       io.to(player2Socket).emit("startGame");
      
//       console.log(`🚀 Game ${gameId} started: ${player1Username} vs ${username}`);
//       console.log(`📊 Active games: ${Object.keys(games).length}`);
//     }).catch(err => {
//       console.error("❌ Error fetching user stats:", err);
//     });
    
//   } else {
//     waitingPlayer = socket.id;
//     socket.emit("playerNumber", 1);
//     socket.emit("playerInfo", { username, email });
//     socket.emit("message", "Waiting for opponent...");
//     console.log("🎮 Player", username, "is waiting for opponent");
//   }

//   socket.on("move", choice => {
//     const gameId = playerToGame[socket.id];
    
//     if (!gameId || !games[gameId]) {
//       socket.emit("error", "Game not found");
//       return;
//     }
    
//     const game = games[gameId];
//     const isPlayer1 = game.player1.socketId === socket.id;
//     const playerNum = isPlayer1 ? 1 : 2;
//     const playerUsername = isPlayer1 ? game.player1.username : game.player2.username;
    
//     if (typeof choice === "object") {
//       game.moves[playerNum] = choice.choice;
//     } else {
//       game.moves[playerNum] = choice;
//     }
    
//     console.log(`🪨 [${gameId}] Player ${playerNum} (${playerUsername}) chose ${game.moves[playerNum]}`);
    
//     if (game.moves[1] && game.moves[2]) {
//       const winner = getWinner(game.moves[1], game.moves[2]);
//       console.log(`🏆 [${gameId}] Result: ${game.moves[1]} vs ${game.moves[2]} - Winner: ${winner}`);
      
//       io.to(game.player1.socketId).emit("result", {
//         p1: game.moves[1],
//         p2: game.moves[2],
//         winner
//       });
      
//       io.to(game.player2.socketId).emit("result", {
//         p1: game.moves[1],
//         p2: game.moves[2],
//         winner
//       });
      
//       updateScores(game, winner);
//       game.moves = {};
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Player disconnected:", username, socket.id);
    
//     // Remove from active sessions on disconnect
//     if (activeSessions[userId] === session.id) {
//       delete activeSessions[userId];
//       console.log("🔓 Session cleared for:", username);
//     }
    
//     const gameId = playerToGame[socket.id];
    
//     if (waitingPlayer === socket.id) {
//       waitingPlayer = null;
//       console.log("🔄 Waiting player removed");
//     }
    
//     if (gameId && games[gameId]) {
//       const game = games[gameId];
//       const isPlayer1 = game.player1.socketId === socket.id;
//       const opponentSocket = isPlayer1 ? game.player2.socketId : game.player1.socketId;
      
//       io.to(opponentSocket).emit("message", "Opponent disconnected. Finding new match...");
      
//       delete games[gameId];
//       delete playerToGame[game.player1.socketId];
//       delete playerToGame[game.player2.socketId];
      
//       const opponentSocketObj = io.sockets.sockets.get(opponentSocket);
//       if (opponentSocketObj) {
//         waitingPlayer = opponentSocket;
//         io.to(opponentSocket).emit("playerNumber", 1);
//         io.to(opponentSocket).emit("message", "Waiting for new opponent...");
//       }
      
//       console.log(`🗑️ Game ${gameId} removed. Active games: ${Object.keys(games).length}`);
//     }
    
//     delete playerToGame[socket.id];
//   });
// });

// async function updateScores(game, winner) {
//   try {
//     const player1Id = game.player1.userId;
//     const player2Id = game.player2.userId;

//     if (winner === 0) {
//       await User.findByIdAndUpdate(player1Id, { $inc: { draws: 1 } });
//       await User.findByIdAndUpdate(player2Id, { $inc: { draws: 1 } });
//       console.log(`📊 Draw: ${game.player1.username} vs ${game.player2.username}`);
//     } else if (winner === 1) {
//       await User.findByIdAndUpdate(player1Id, { $inc: { wins: 1 } });
//       await User.findByIdAndUpdate(player2Id, { $inc: { losses: 1 } });
//       console.log(`📊 ${game.player1.username} wins against ${game.player2.username}`);
//     } else {
//       await User.findByIdAndUpdate(player2Id, { $inc: { wins: 1 } });
//       await User.findByIdAndUpdate(player1Id, { $inc: { losses: 1 } });
//       console.log(`📊 ${game.player2.username} wins against ${game.player1.username}`);
//     }
//   } catch (error) {
//     console.error("Error updating scores:", error);
//   }
// }

// function getWinner(p1, p2) {
//   if (p1 === p2) return 0;
//   if (
//     (p1 === "rock" && p2 === "scissors") ||
//     (p1 === "paper" && p2 === "rock") ||
//     (p1 === "scissors" && p2 === "paper")
//   ) return 1;
//   return 2;
// }

// server.listen(3000, () => {
//   console.log("🚀 Server running at http://localhost:3000");
//   console.log("🎮 Multi-player matchmaking enabled");
// });


// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const session = require("express-session");
// const User = require("./user");
// const ChatMessage = require("./chat");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // MongoDB connection
// mongoose.connect("mongodb://localhost:27017/rockpaperscissors")
// .then(() => console.log("✅ MongoDB connected"))
// .catch(err => console.error("❌ MongoDB error:", err));

// // Middleware
// app.use(express.json());

// // Session configuration
// const sessionMiddleware = session({
//   secret: "your-secret-key-change-this-to-something-random",
//   resave: false,
//   saveUninitialized: false,
//   cookie: { 
//     secure: false,
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000
//   }
// });

// app.use(sessionMiddleware);
// app.use(express.static("public"));

// // Track active sessions per user to prevent duplicate logins
// let activeSessions = {}; // userId -> sessionId

// // Middleware to check authentication
// function requireAuth(req, res, next) {
//   if (req.session && req.session.userId) {
//     next();
//   } else {
//     res.redirect("/login.html");
//   }
// }

// // Email validation function
// function isValidEmail(email) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// // Routes

// // Register
// app.post("/register", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.json({ success: false, message: "All fields are required" });
//     }

//     if (!isValidEmail(email)) {
//       return res.json({ success: false, message: "Invalid email format" });
//     }

//     if (password.length < 6) {
//       return res.json({ success: false, message: "Password must be at least 6 characters" });
//     }

//     // Check if username exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.json({ success: false, message: "Username already exists" });
//     }

//     // Check if email exists
//     const existingEmail = await User.findOne({ email });
//     if (existingEmail) {
//       return res.json({ success: false, message: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       username,
//       email,
//       password: hashedPassword,
//       wins: 0,
//       losses: 0,
//       draws: 0
//     });

//     await user.save();
//     console.log("✅ User registered:", username, email);

//     res.json({ success: true });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Login
// app.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.json({ success: false, message: "Username and password required" });
//     }

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     const userId = user._id.toString();

//     // Check if user is already logged in from another session
//     if (activeSessions[userId]) {
//       return res.json({ 
//         success: false, 
//         message: "Account is already logged in from another device/browser" 
//       });
//     }

//     // Update last active time
//     await User.findByIdAndUpdate(userId, { lastActive: new Date() });

//     req.session.userId = userId;
//     req.session.username = user.username;
//     req.session.email = user.email;
    
//     req.session.save((err) => {
//       if (err) {
//         console.error("Session save error:", err);
//         return res.json({ success: false, message: "Session error" });
//       }
      
//       // Mark session as active
//       activeSessions[userId] = req.session.id;
      
//       console.log("✅ User logged in:", username);
//       res.json({ success: true });
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get user profile
// app.get("/api/profile", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.session.userId).select('-password');
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     res.json({
//       success: true,
//       profile: {
//         username: user.username,
//         email: user.email,
//         wins: user.wins,
//         losses: user.losses,
//         draws: user.draws,
//         totalGames: user.wins + user.losses + user.draws,
//         memberSince: user.createdAt,
//         lastActive: user.lastActive
//       }
//     });
//   } catch (error) {
//     console.error("Profile error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get user stats
// app.get("/api/stats", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.session.userId).select('-password');
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     res.json({
//       success: true,
//       stats: {
//         username: user.username,
//         wins: user.wins,
//         losses: user.losses,
//         draws: user.draws,
//         totalGames: user.wins + user.losses + user.draws
//       }
//     });
//   } catch (error) {
//     console.error("Stats error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get leaderboard
// app.get("/api/leaderboard", requireAuth, async (req, res) => {
//   try {
//     const users = await User.find()
//       .select('username wins losses draws')
//       .sort({ wins: -1 })
//       .limit(10);

//     const leaderboard = users.map(user => ({
//       username: user.username,
//       wins: user.wins,
//       losses: user.losses,
//       draws: user.draws,
//       totalGames: user.wins + user.losses + user.draws,
//       winRate: user.wins + user.losses + user.draws > 0 
//         ? ((user.wins / (user.wins + user.losses + user.draws)) * 100).toFixed(1) 
//         : 0
//     }));

//     res.json({ success: true, leaderboard });
//   } catch (error) {
//     console.error("Leaderboard error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get active games count
// app.get("/api/active-games", requireAuth, (req, res) => {
//   const activeGames = Object.keys(games).length;
//   const waitingPlayers = waitingPlayer ? 1 : 0;
//   const totalPlayers = activeGames * 2 + waitingPlayers;
  
//   res.json({
//     success: true,
//     activeGames,
//     totalPlayers,
//     waitingPlayers
//   });
// });

// // Get chat history between two users
// app.get("/api/chat-history/:opponentId", requireAuth, async (req, res) => {
//   try {
//     const userId = req.session.userId;
//     const opponentId = req.params.opponentId;
    
//     // Create sorted participant array for consistent lookup
//     const participants = [userId, opponentId].sort();
    
//     // Get chat messages between these two users
//     const messages = await ChatMessage.find({ participants })
//       .sort({ timestamp: 1 })
//       .limit(100); // Last 100 messages
    
//     res.json({ success: true, messages });
//   } catch (error) {
//     console.error("Chat history error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Logout
// app.get("/logout", (req, res) => {
//   const userId = req.session.userId;
  
//   // Remove from active sessions
//   if (userId && activeSessions[userId]) {
//     delete activeSessions[userId];
//     console.log("👋 User logged out and session cleared:", req.session.username);
//   }
  
//   req.session.destroy((err) => {
//     if (err) {
//       console.error("Logout error:", err);
//     }
//     res.redirect("/login.html");
//   });
// });

// // Protected route
// app.get("/game", requireAuth, (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

// // Redirect root
// app.get("/", (req, res) => {
//   if (req.session && req.session.userId) {
//     res.redirect("/game");
//   } else {
//     res.redirect("/login.html");
//   }
// });

// // ==================== GAME LOGIC ====================

// let games = {}; // gameId -> { player1, player2, moves }
// let waitingPlayer = null; // socketId of player waiting for match
// let playerToGame = {}; // socketId -> gameId mapping

// // Generate unique game ID
// function generateGameId() {
//   return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
// }

// // Socket.IO with session sharing
// io.engine.use(sessionMiddleware);

// io.on("connection", socket => {
//   const session = socket.request.session;
  
//   if (!session || !session.userId) {
//     console.log("❌ Unauthorized socket connection attempt");
//     socket.emit("unauthorized");
//     socket.disconnect();
//     return;
//   }

//   const username = session.username;
//   const userId = session.userId;
//   const email = session.email;
  
//   console.log("🔥 Player connected:", username, socket.id);

//   // Check if there's a waiting player
//   if (waitingPlayer && waitingPlayer !== socket.id) {
//     const gameId = generateGameId();
//     const player1Socket = waitingPlayer;
//     const player2Socket = socket.id;
    
//     const player1SocketObj = io.sockets.sockets.get(player1Socket);
//     if (!player1SocketObj) {
//       waitingPlayer = socket.id;
//       socket.emit("playerNumber", 1);
//       socket.emit("playerInfo", { username, email });
//       socket.emit("message", "Waiting for opponent...");
//       console.log("🎮 Player", username, "is waiting (Player 1 disconnected)");
//       return;
//     }
    
//     const player1Session = player1SocketObj.request.session;
//     const player1Username = player1Session.username;
//     const player1UserId = player1Session.userId;
//     const player1Email = player1Session.email;
    
//     // Create game
//     games[gameId] = {
//       player1: {
//         socketId: player1Socket,
//         userId: player1UserId,
//         username: player1Username,
//         email: player1Email
//       },
//       player2: {
//         socketId: player2Socket,
//         userId: userId,
//         username: username,
//         email: email
//       },
//       moves: {}
//     };
    
//     playerToGame[player1Socket] = gameId;
//     playerToGame[player2Socket] = gameId;
    
//     waitingPlayer = null;
    
//     // Get player stats for display
//     Promise.all([
//       User.findById(player1UserId),
//       User.findById(userId)
//     ]).then(([p1User, p2User]) => {
//       if (!p1User || !p2User) {
//         console.error("❌ User not found in database");
//         return;
//       }
      
//       const player1Stats = {
//         username: player1Username,
//         email: player1Email,
//         wins: p1User.wins || 0,
//         losses: p1User.losses || 0,
//         draws: p1User.draws || 0
//       };
      
//       const player2Stats = {
//         username: username,
//         email: email,
//         wins: p2User.wins || 0,
//         losses: p2User.losses || 0,
//         draws: p2User.draws || 0
//       };
      
//       // Send opponent info to both players
//       io.to(player1Socket).emit("playerNumber", 1);
//       io.to(player1Socket).emit("playerInfo", { 
//         username: player1Username, 
//         email: player1Email
//       });
//       io.to(player1Socket).emit("matchFound", { 
//         opponent: player2Stats,
//         opponentId: userId 
//       });
      
//       io.to(player2Socket).emit("playerNumber", 2);
//       io.to(player2Socket).emit("playerInfo", { 
//         username: username,
//         email: email
//       });
//       io.to(player2Socket).emit("matchFound", { 
//         opponent: player1Stats,
//         opponentId: player1UserId 
//       });
      
//       io.to(player1Socket).emit("startGame");
//       io.to(player2Socket).emit("startGame");
      
//       console.log(`🚀 Game ${gameId} started: ${player1Username} vs ${username}`);
//       console.log(`📊 Active games: ${Object.keys(games).length}`);
//     }).catch(err => {
//       console.error("❌ Error fetching user stats:", err);
//     });
    
//   } else {
//     waitingPlayer = socket.id;
//     socket.emit("playerNumber", 1);
//     socket.emit("playerInfo", { username, email });
//     socket.emit("message", "Waiting for opponent...");
//     console.log("🎮 Player", username, "is waiting for opponent");
//   }

//   socket.on("move", choice => {
//     const gameId = playerToGame[socket.id];
    
//     if (!gameId || !games[gameId]) {
//       socket.emit("error", "Game not found");
//       return;
//     }
    
//     const game = games[gameId];
//     const isPlayer1 = game.player1.socketId === socket.id;
//     const playerNum = isPlayer1 ? 1 : 2;
//     const playerUsername = isPlayer1 ? game.player1.username : game.player2.username;
    
//     if (typeof choice === "object") {
//       game.moves[playerNum] = choice.choice;
//     } else {
//       game.moves[playerNum] = choice;
//     }
    
//     console.log(`🪨 [${gameId}] Player ${playerNum} (${playerUsername}) chose ${game.moves[playerNum]}`);
    
//     if (game.moves[1] && game.moves[2]) {
//       const winner = getWinner(game.moves[1], game.moves[2]);
//       console.log(`🏆 [${gameId}] Result: ${game.moves[1]} vs ${game.moves[2]} - Winner: ${winner}`);
      
//       io.to(game.player1.socketId).emit("result", {
//         p1: game.moves[1],
//         p2: game.moves[2],
//         winner
//       });
      
//       io.to(game.player2.socketId).emit("result", {
//         p1: game.moves[1],
//         p2: game.moves[2],
//         winner
//       });
      
//       updateScores(game, winner);
//       game.moves = {};
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Player disconnected:", username, socket.id);
    
//     // Remove from active sessions on disconnect
//     if (activeSessions[userId] === session.id) {
//       delete activeSessions[userId];
//       console.log("🔓 Session cleared for:", username);
//     }
    
//     const gameId = playerToGame[socket.id];
    
//     if (waitingPlayer === socket.id) {
//       waitingPlayer = null;
//       console.log("🔄 Waiting player removed");
//     }
    
//     if (gameId && games[gameId]) {
//       const game = games[gameId];
//       const isPlayer1 = game.player1.socketId === socket.id;
//       const opponentSocket = isPlayer1 ? game.player2.socketId : game.player1.socketId;
      
//       io.to(opponentSocket).emit("message", "Opponent disconnected. Finding new match...");
      
//       delete games[gameId];
//       delete playerToGame[game.player1.socketId];
//       delete playerToGame[game.player2.socketId];
      
//       const opponentSocketObj = io.sockets.sockets.get(opponentSocket);
//       if (opponentSocketObj) {
//         waitingPlayer = opponentSocket;
//         io.to(opponentSocket).emit("playerNumber", 1);
//         io.to(opponentSocket).emit("message", "Waiting for new opponent...");
//       }
      
//       console.log(`🗑️ Game ${gameId} removed. Active games: ${Object.keys(games).length}`);
//     }
    
//     delete playerToGame[socket.id];
//   });
// });

// async function updateScores(game, winner) {
//   try {
//     const player1Id = game.player1.userId;
//     const player2Id = game.player2.userId;

//     if (winner === 0) {
//       await User.findByIdAndUpdate(player1Id, { $inc: { draws: 1 } });
//       await User.findByIdAndUpdate(player2Id, { $inc: { draws: 1 } });
//       console.log(`📊 Draw: ${game.player1.username} vs ${game.player2.username}`);
//     } else if (winner === 1) {
//       await User.findByIdAndUpdate(player1Id, { $inc: { wins: 1 } });
//       await User.findByIdAndUpdate(player2Id, { $inc: { losses: 1 } });
//       console.log(`📊 ${game.player1.username} wins against ${game.player2.username}`);
//     } else {
//       await User.findByIdAndUpdate(player2Id, { $inc: { wins: 1 } });
//       await User.findByIdAndUpdate(player1Id, { $inc: { losses: 1 } });
//       console.log(`📊 ${game.player2.username} wins against ${game.player1.username}`);
//     }
//   } catch (error) {
//     console.error("Error updating scores:", error);
//   }
// }

// function getWinner(p1, p2) {
//   if (p1 === p2) return 0;
//   if (
//     (p1 === "rock" && p2 === "scissors") ||
//     (p1 === "paper" && p2 === "rock") ||
//     (p1 === "scissors" && p2 === "paper")
//   ) return 1;
//   return 2;
// }

// server.listen(3000, () => {
//   console.log("🚀 Server running at http://localhost:3000");
//   console.log("🎮 Multi-player matchmaking enabled");
// });

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const session = require("express-session");
// const User = require("./user");
// const ChatMessage = require("./chat");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // MongoDB connection
// mongoose.connect("mongodb://localhost:27017/rockpaperscissors")
// .then(() => console.log("✅ MongoDB connected"))
// .catch(err => console.error("❌ MongoDB error:", err));

// // Middleware
// app.use(express.json());

// // Session configuration
// const sessionMiddleware = session({
//   secret: "your-secret-key-change-this-to-something-random",
//   resave: false,
//   saveUninitialized: false,
//   cookie: { 
//     secure: false,
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000
//   }
// });

// app.use(sessionMiddleware);
// app.use(express.static("public"));

// // Track active sessions per user to prevent duplicate logins
// let activeSessions = {}; // userId -> sessionId

// // Middleware to check authentication
// function requireAuth(req, res, next) {
//   if (req.session && req.session.userId) {
//     next();
//   } else {
//     res.redirect("/login.html");
//   }
// }

// // Email validation function
// function isValidEmail(email) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// // Routes

// // Register
// app.post("/register", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     if (!username || !email || !password) {
//       return res.json({ success: false, message: "All fields are required" });
//     }

//     if (!isValidEmail(email)) {
//       return res.json({ success: false, message: "Invalid email format" });
//     }

//     if (password.length < 6) {
//       return res.json({ success: false, message: "Password must be at least 6 characters" });
//     }

//     // Check if username exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.json({ success: false, message: "Username already exists" });
//     }

//     // Check if email exists
//     const existingEmail = await User.findOne({ email });
//     if (existingEmail) {
//       return res.json({ success: false, message: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       username,
//       email,
//       password: hashedPassword,
//       wins: 0,
//       losses: 0,
//       draws: 0
//     });

//     await user.save();
//     console.log("✅ User registered:", username, email);

//     res.json({ success: true });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Login
// app.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.json({ success: false, message: "Username and password required" });
//     }

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     const userId = user._id.toString();

//     // Check if user is already logged in from another session
//     if (activeSessions[userId]) {
//       return res.json({ 
//         success: false, 
//         message: "Account is already logged in from another device/browser" 
//       });
//     }

//     // Update last active time
//     await User.findByIdAndUpdate(userId, { lastActive: new Date() });

//     req.session.userId = userId;
//     req.session.username = user.username;
//     req.session.email = user.email;
    
//     req.session.save((err) => {
//       if (err) {
//         console.error("Session save error:", err);
//         return res.json({ success: false, message: "Session error" });
//       }
      
//       // Mark session as active
//       activeSessions[userId] = req.session.id;
      
//       console.log("✅ User logged in:", username);
//       res.json({ success: true });
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get user profile
// app.get("/api/profile", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.session.userId).select('-password');
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     res.json({
//       success: true,
//       profile: {
//         _id: user._id.toString(), // Make sure to send _id
//         userId: user._id.toString(), // Also send as userId for compatibility
//         username: user.username,
//         email: user.email,
//         wins: user.wins,
//         losses: user.losses,
//         draws: user.draws,
//         totalGames: user.wins + user.losses + user.draws,
//         memberSince: user.createdAt,
//         lastActive: user.lastActive
//       }
//     });
//   } catch (error) {
//     console.error("Profile error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get user stats
// app.get("/api/stats", requireAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.session.userId).select('-password');
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     res.json({
//       success: true,
//       stats: {
//         username: user.username,
//         wins: user.wins,
//         losses: user.losses,
//         draws: user.draws,
//         totalGames: user.wins + user.losses + user.draws
//       }
//     });
//   } catch (error) {
//     console.error("Stats error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get leaderboard
// app.get("/api/leaderboard", requireAuth, async (req, res) => {
//   try {
//     const users = await User.find()
//       .select('username wins losses draws')
//       .sort({ wins: -1 })
//       .limit(10);

//     const leaderboard = users.map(user => ({
//       username: user.username,
//       wins: user.wins,
//       losses: user.losses,
//       draws: user.draws,
//       totalGames: user.wins + user.losses + user.draws,
//       winRate: user.wins + user.losses + user.draws > 0 
//         ? ((user.wins / (user.wins + user.losses + user.draws)) * 100).toFixed(1) 
//         : 0
//     }));

//     res.json({ success: true, leaderboard });
//   } catch (error) {
//     console.error("Leaderboard error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Get active games count
// app.get("/api/active-games", requireAuth, (req, res) => {
//   const activeGames = Object.keys(games).length;
//   const waitingPlayers = waitingPlayer ? 1 : 0;
//   const totalPlayers = activeGames * 2 + waitingPlayers;
  
//   res.json({
//     success: true,
//     activeGames,
//     totalPlayers,
//     waitingPlayers
//   });
// });

// // Get chat history between two users
// app.get("/api/chat-history/:opponentId", requireAuth, async (req, res) => {
//   try {
//     const userId = req.session.userId;
//     const opponentId = req.params.opponentId;
    
//     // Create sorted participant array for consistent lookup
//     const participants = [userId, opponentId].sort();
    
//     // Get chat messages between these two users
//     const messages = await ChatMessage.find({ participants })
//       .sort({ timestamp: 1 })
//       .limit(100); // Last 100 messages
    
//     res.json({ success: true, messages });
//   } catch (error) {
//     console.error("Chat history error:", error);
//     res.json({ success: false, message: "Server error" });
//   }
// });

// // Logout
// app.get("/logout", (req, res) => {
//   const userId = req.session.userId;
  
//   // Remove from active sessions
//   if (userId && activeSessions[userId]) {
//     delete activeSessions[userId];
//     console.log("👋 User logged out and session cleared:", req.session.username);
//   }
  
//   req.session.destroy((err) => {
//     if (err) {
//       console.error("Logout error:", err);
//     }
//     res.redirect("/login.html");
//   });
// });

// // Protected route
// app.get("/game", requireAuth, (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

// // Redirect root
// app.get("/", (req, res) => {
//   if (req.session && req.session.userId) {
//     res.redirect("/game");
//   } else {
//     res.redirect("/login.html");
//   }
// });

// // ==================== GAME LOGIC ====================

// let games = {}; // gameId -> { player1, player2, moves }
// let waitingPlayer = null; // socketId of player waiting for match
// let playerToGame = {}; // socketId -> gameId mapping

// // Generate unique game ID
// function generateGameId() {
//   return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
// }

// // Socket.IO with session sharing
// io.engine.use(sessionMiddleware);

// io.on("connection", socket => {
//   const session = socket.request.session;
  
//   if (!session || !session.userId) {
//     console.log("❌ Unauthorized socket connection attempt");
//     socket.emit("unauthorized");
//     socket.disconnect();
//     return;
//   }

//   const username = session.username;
//   const userId = session.userId;
//   const email = session.email;
  
//   console.log("🔥 Player connected:", username, socket.id);

//   // Check if there's a waiting player
//   if (waitingPlayer && waitingPlayer !== socket.id) {
//     const gameId = generateGameId();
//     const player1Socket = waitingPlayer;
//     const player2Socket = socket.id;
    
//     const player1SocketObj = io.sockets.sockets.get(player1Socket);
//     if (!player1SocketObj) {
//       waitingPlayer = socket.id;
//       socket.emit("playerNumber", 1);
//       socket.emit("playerInfo", { username, email });
//       socket.emit("message", "Waiting for opponent...");
//       console.log("🎮 Player", username, "is waiting (Player 1 disconnected)");
//       return;
//     }
    
//     const player1Session = player1SocketObj.request.session;
//     const player1Username = player1Session.username;
//     const player1UserId = player1Session.userId;
//     const player1Email = player1Session.email;
    
//     // Create game
//     games[gameId] = {
//       player1: {
//         socketId: player1Socket,
//         userId: player1UserId,
//         username: player1Username,
//         email: player1Email
//       },
//       player2: {
//         socketId: player2Socket,
//         userId: userId,
//         username: username,
//         email: email
//       },
//       moves: {}
//     };
    
//     playerToGame[player1Socket] = gameId;
//     playerToGame[player2Socket] = gameId;
    
//     waitingPlayer = null;
    
//     // Get player stats for display
//     Promise.all([
//       User.findById(player1UserId),
//       User.findById(userId)
//     ]).then(([p1User, p2User]) => {
//       if (!p1User || !p2User) {
//         console.error("❌ User not found in database");
//         return;
//       }
      
//       const player1Stats = {
//         username: player1Username,
//         email: player1Email,
//         wins: p1User.wins || 0,
//         losses: p1User.losses || 0,
//         draws: p1User.draws || 0
//       };
      
//       const player2Stats = {
//         username: username,
//         email: email,
//         wins: p2User.wins || 0,
//         losses: p2User.losses || 0,
//         draws: p2User.draws || 0
//       };
      
//       // Send opponent info to both players
//       io.to(player1Socket).emit("playerNumber", 1);
//       io.to(player1Socket).emit("playerInfo", { 
//         username: player1Username, 
//         email: player1Email
//       });
//       io.to(player1Socket).emit("matchFound", { 
//         opponent: player2Stats,
//         opponentId: userId 
//       });
      
//       io.to(player2Socket).emit("playerNumber", 2);
//       io.to(player2Socket).emit("playerInfo", { 
//         username: username,
//         email: email
//       });
//       io.to(player2Socket).emit("matchFound", { 
//         opponent: player1Stats,
//         opponentId: player1UserId 
//       });
      
//       io.to(player1Socket).emit("startGame");
//       io.to(player2Socket).emit("startGame");
      
//       console.log(`🚀 Game ${gameId} started: ${player1Username} vs ${username}`);
//       console.log(`📊 Active games: ${Object.keys(games).length}`);
//     }).catch(err => {
//       console.error("❌ Error fetching user stats:", err);
//     });
    
//   } else {
//     waitingPlayer = socket.id;
//     socket.emit("playerNumber", 1);
//     socket.emit("playerInfo", { username, email });
//     socket.emit("message", "Waiting for opponent...");
//     console.log("🎮 Player", username, "is waiting for opponent");
//   }

//   socket.on("move", choice => {
//     const gameId = playerToGame[socket.id];
    
//     if (!gameId || !games[gameId]) {
//       socket.emit("error", "Game not found");
//       return;
//     }
    
//     const game = games[gameId];
//     const isPlayer1 = game.player1.socketId === socket.id;
//     const playerNum = isPlayer1 ? 1 : 2;
//     const playerUsername = isPlayer1 ? game.player1.username : game.player2.username;
    
//     if (typeof choice === "object") {
//       game.moves[playerNum] = choice.choice;
//     } else {
//       game.moves[playerNum] = choice;
//     }
    
//     console.log(`🪨 [${gameId}] Player ${playerNum} (${playerUsername}) chose ${game.moves[playerNum]}`);
    
//     if (game.moves[1] && game.moves[2]) {
//       const winner = getWinner(game.moves[1], game.moves[2]);
//       console.log(`🏆 [${gameId}] Result: ${game.moves[1]} vs ${game.moves[2]} - Winner: ${winner}`);
      
//       io.to(game.player1.socketId).emit("result", {
//         p1: game.moves[1],
//         p2: game.moves[2],
//         winner
//       });
      
//       io.to(game.player2.socketId).emit("result", {
//         p1: game.moves[1],
//         p2: game.moves[2],
//         winner
//       });
      
//       updateScores(game, winner);
//       game.moves = {};
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Player disconnected:", username, socket.id);
    
//     // Remove from active sessions on disconnect
//     if (activeSessions[userId] === session.id) {
//       delete activeSessions[userId];
//       console.log("🔓 Session cleared for:", username);
//     }
    
//     const gameId = playerToGame[socket.id];
    
//     if (waitingPlayer === socket.id) {
//       waitingPlayer = null;
//       console.log("🔄 Waiting player removed");
//     }
    
//     if (gameId && games[gameId]) {
//       const game = games[gameId];
//       const isPlayer1 = game.player1.socketId === socket.id;
//       const opponentSocket = isPlayer1 ? game.player2.socketId : game.player1.socketId;
      
//       io.to(opponentSocket).emit("message", "Opponent disconnected. Finding new match...");
      
//       delete games[gameId];
//       delete playerToGame[game.player1.socketId];
//       delete playerToGame[game.player2.socketId];
      
//       const opponentSocketObj = io.sockets.sockets.get(opponentSocket);
//       if (opponentSocketObj) {
//         waitingPlayer = opponentSocket;
//         io.to(opponentSocket).emit("playerNumber", 1);
//         io.to(opponentSocket).emit("message", "Waiting for new opponent...");
//       }
      
//       console.log(`🗑️ Game ${gameId} removed. Active games: ${Object.keys(games).length}`);
//     }
    
//     delete playerToGame[socket.id];
//   });
// });

// async function updateScores(game, winner) {
//   try {
//     const player1Id = game.player1.userId;
//     const player2Id = game.player2.userId;

//     if (winner === 0) {
//       await User.findByIdAndUpdate(player1Id, { $inc: { draws: 1 } });
//       await User.findByIdAndUpdate(player2Id, { $inc: { draws: 1 } });
//       console.log(`📊 Draw: ${game.player1.username} vs ${game.player2.username}`);
//     } else if (winner === 1) {
//       await User.findByIdAndUpdate(player1Id, { $inc: { wins: 1 } });
//       await User.findByIdAndUpdate(player2Id, { $inc: { losses: 1 } });
//       console.log(`📊 ${game.player1.username} wins against ${game.player2.username}`);
//     } else {
//       await User.findByIdAndUpdate(player2Id, { $inc: { wins: 1 } });
//       await User.findByIdAndUpdate(player1Id, { $inc: { losses: 1 } });
//       console.log(`📊 ${game.player2.username} wins against ${game.player1.username}`);
//     }
//   } catch (error) {
//     console.error("Error updating scores:", error);
//   }
// }

// function getWinner(p1, p2) {
//   if (p1 === p2) return 0;
//   if (
//     (p1 === "rock" && p2 === "scissors") ||
//     (p1 === "paper" && p2 === "rock") ||
//     (p1 === "scissors" && p2 === "paper")
//   ) return 1;
//   return 2;
// }

// server.listen(3000, () => {
//   console.log("🚀 Server running at http://localhost:3000");
//   console.log("🎮 Multi-player matchmaking enabled");
// });

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

// Track active sessions per user to prevent duplicate logins
let activeSessions = {}; // userId -> sessionId

// Middleware to check authentication
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Routes

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

    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: "Username already exists" });
    }

    // Check if email exists
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

    // Check if user is already logged in from another session
    if (activeSessions[userId]) {
      return res.json({ 
        success: false, 
        message: "Account is already logged in from another device/browser" 
      });
    }

    // Update last active time
    await User.findByIdAndUpdate(userId, { lastActive: new Date() });

    req.session.userId = userId;
    req.session.username = user.username;
    req.session.email = user.email;
    
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.json({ success: false, message: "Session error" });
      }
      
      // Mark session as active
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
        _id: user._id.toString(), // Make sure to send _id
        userId: user._id.toString(), // Also send as userId for compatibility
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

// Get active games count
app.get("/api/active-games", requireAuth, (req, res) => {
  const activeGames = Object.keys(games).length;
  const waitingPlayers = waitingPlayer ? 1 : 0;
  const totalPlayers = activeGames * 2 + waitingPlayers;
  
  res.json({
    success: true,
    activeGames,
    totalPlayers,
    waitingPlayers
  });
});

// Get chat history between two users
app.get("/api/chat-history/:opponentId", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const opponentId = req.params.opponentId;
    
    // Create sorted participant array for consistent lookup
    const participants = [userId, opponentId].sort();
    
    // Get chat messages between these two users
    const messages = await ChatMessage.find({ participants })
      .sort({ timestamp: 1 })
      .limit(100); // Last 100 messages
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error("Chat history error:", error);
    res.json({ success: false, message: "Server error" });
  }
});

// Logout
app.get("/logout", (req, res) => {
  const userId = req.session.userId;
  
  // Remove from active sessions
  if (userId && activeSessions[userId]) {
    delete activeSessions[userId];
    console.log("👋 User logged out and session cleared:", req.session.username);
  }
  
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/login.html");
  });
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

// ==================== GAME LOGIC ====================

let games = {}; // gameId -> { player1, player2, moves }
let waitingPlayer = null; // socketId of player waiting for match
let playerToGame = {}; // socketId -> gameId mapping

// Generate unique game ID
function generateGameId() {
  return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Socket.IO with session sharing
io.engine.use(sessionMiddleware);

io.on("connection", socket => {
  const session = socket.request.session;
  
  console.log("🔌 New socket connection attempt - Socket ID:", socket.id);
  
  if (!session || !session.userId) {
    console.log("❌ Unauthorized socket connection attempt - No session");
    socket.emit("unauthorized");
    socket.disconnect();
    return;
  }

  const username = session.username;
  const userId = session.userId;
  const email = session.email;
  
  console.log("🔥 Player connected:", username, socket.id);
  console.log("🔑 User ID:", userId);
  
  // Register event listeners
  console.log("📝 Registering socket event listeners for:", username);

  // Check if there's a waiting player
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
      console.log("🎮 Player", username, "is waiting (Player 1 disconnected)");
      return;
    }
    
    const player1Session = player1SocketObj.request.session;
    const player1Username = player1Session.username;
    const player1UserId = player1Session.userId;
    const player1Email = player1Session.email;
    
    // Create game
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
    
    // Get player stats for display
    Promise.all([
      User.findById(player1UserId),
      User.findById(userId)
    ]).then(([p1User, p2User]) => {
      if (!p1User || !p2User) {
        console.error("❌ User not found in database");
        return;
      }
      
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
      
      // Send opponent info to both players
      io.to(player1Socket).emit("playerNumber", 1);
      io.to(player1Socket).emit("playerInfo", { 
        username: player1Username, 
        email: player1Email
      });
      io.to(player1Socket).emit("matchFound", { 
        opponent: player2Stats,
        opponentId: userId 
      });
      
      io.to(player2Socket).emit("playerNumber", 2);
      io.to(player2Socket).emit("playerInfo", { 
        username: username,
        email: email
      });
      io.to(player2Socket).emit("matchFound", { 
        opponent: player1Stats,
        opponentId: player1UserId 
      });
      
      io.to(player1Socket).emit("startGame");
      io.to(player2Socket).emit("startGame");
      
      console.log(`🚀 Game ${gameId} started: ${player1Username} vs ${username}`);
      console.log(`📊 Active games: ${Object.keys(games).length}`);
    }).catch(err => {
      console.error("❌ Error fetching user stats:", err);
    });
    
  } else {
    waitingPlayer = socket.id;
    socket.emit("playerNumber", 1);
    socket.emit("playerInfo", { username, email });
    socket.emit("message", "Waiting for opponent...");
    console.log("🎮 Player", username, "is waiting for opponent");
  }

  socket.on("move", choice => {
    const gameId = playerToGame[socket.id];
    
    if (!gameId || !games[gameId]) {
      socket.emit("error", "Game not found");
      return;
    }
    
    const game = games[gameId];
    const isPlayer1 = game.player1.socketId === socket.id;
    const playerNum = isPlayer1 ? 1 : 2;
    const playerUsername = isPlayer1 ? game.player1.username : game.player2.username;
    
    if (typeof choice === "object") {
      game.moves[playerNum] = choice.choice;
    } else {
      game.moves[playerNum] = choice;
    }
    
    console.log(`🪨 [${gameId}] Player ${playerNum} (${playerUsername}) chose ${game.moves[playerNum]}`);
    
    if (game.moves[1] && game.moves[2]) {
      const winner = getWinner(game.moves[1], game.moves[2]);
      console.log(`🏆 [${gameId}] Result: ${game.moves[1]} vs ${game.moves[2]} - Winner: ${winner}`);
      
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

  socket.on("disconnect", () => {
    console.log("❌ Player disconnected:", username, socket.id);
    
    // Remove from active sessions on disconnect
    if (activeSessions[userId] === session.id) {
      delete activeSessions[userId];
      console.log("🔓 Session cleared for:", username);
    }
    
    const gameId = playerToGame[socket.id];
    
    if (waitingPlayer === socket.id) {
      waitingPlayer = null;
      console.log("🔄 Waiting player removed");
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
      
      console.log(`🗑️ Game ${gameId} removed. Active games: ${Object.keys(games).length}`);
    }
    
    delete playerToGame[socket.id];
  });
});

async function updateScores(game, winner) {
  try {
    const player1Id = game.player1.userId;
    const player2Id = game.player2.userId;

    if (winner === 0) {
      await User.findByIdAndUpdate(player1Id, { $inc: { draws: 1 } });
      await User.findByIdAndUpdate(player2Id, { $inc: { draws: 1 } });
      console.log(`📊 Draw: ${game.player1.username} vs ${game.player2.username}`);
    } else if (winner === 1) {
      await User.findByIdAndUpdate(player1Id, { $inc: { wins: 1 } });
      await User.findByIdAndUpdate(player2Id, { $inc: { losses: 1 } });
      console.log(`📊 ${game.player1.username} wins against ${game.player2.username}`);
    } else {
      await User.findByIdAndUpdate(player2Id, { $inc: { wins: 1 } });
      await User.findByIdAndUpdate(player1Id, { $inc: { losses: 1 } });
      console.log(`📊 ${game.player2.username} wins against ${game.player1.username}`);
    }
  } catch (error) {
    console.error("Error updating scores:", error);
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
  console.log("🎮 Multi-player matchmaking enabled");
});