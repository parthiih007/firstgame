const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {}; // socket.id -> playerNumber
let moves = {};   // playerNumber -> choice

io.on("connection", socket => {
  console.log("🔥 Player connected:", socket.id);

  // Assign player number
  if (!Object.values(players).includes(1)) {
    players[socket.id] = 1;
    socket.emit("playerNumber", 1);
    console.log("🎮 Assigned Player 1");
  } else if (!Object.values(players).includes(2)) {
    players[socket.id] = 2;
    socket.emit("playerNumber", 2);
    console.log("🎮 Assigned Player 2");

    // Start game when 2 players connected
    io.emit("startGame");
    console.log("🚀 Game Started");
  } else {
    socket.emit("message", "Game full");
    return;
  }

  socket.on("move", choice => {
  const playerNum = players[socket.id];

  // Make sure we only store the string
  if (typeof choice === "object") {
    // If you accidentally sent an object, just take the choice
    moves[playerNum] = choice.choice;
  } else {
    moves[playerNum] = choice;
  }

  console.log(`🪨 Player ${playerNum} chose ${moves[playerNum]}`);

  if (moves[1] && moves[2]) {
    const winner = getWinner(moves[1], moves[2]);
    console.log("🏆 Result:", moves, "Winner:", winner);

    io.emit("result", {
      p1: moves[1],
      p2: moves[2],
      winner
    });

    moves = {};
  }
});

  socket.on("disconnect", () => {
    console.log("❌ Player disconnected:", socket.id);
    delete players[socket.id];
    moves = {};
    io.emit("message", "Player disconnected. Refresh to restart.");
  });
});

// Determine winner
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
