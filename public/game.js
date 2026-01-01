// // console.log("✅ game.js loaded");

// // const socket = io();
// // let playerNumber;

// // const message = document.getElementById("message");
// // const result = document.getElementById("result");
// // const buttons = document.querySelectorAll("button");

// // // Disable buttons initially
// // buttons.forEach(btn => btn.disabled = true);

// // socket.on("connect", () => {
// //   console.log("🟢 Connected:", socket.id);
// // });

// // // socket.on("playerNumber", num => {
// // //   playerNumber = num;
// // //   console.log("🎮 You are Player", num);
// // //   message.innerText = `You are Player ${num}. Waiting for opponent...`;
// // // });

// // socket.on("playerNumber", num => {
// //   playerNumber = num;
// //   message.innerText = `You are Player ${num}. Waiting for opponent...`;
// // });


// // socket.on("startGame", () => {
// //   console.log("🚀 Game Started");
// //   message.innerText = "Both players connected! Make your move!";
// //   buttons.forEach(btn => btn.disabled = false);
// // });


// // socket.on("result", data => {
// //   console.log("🏆 Result received:", data);

// //   // Use the correct keys sent from server
// //   const p1 = data.p1;   // Player 1 move
// //   const p2 = data.p2;   // Player 2 move
// //   const winner = data.winner; // 0 = draw, 1 = P1, 2 = P2

// //   let outcome = "test";
// //   if (winner === 0) outcome = "😐 Draw";
// //   else if (winner === playerNumber) outcome = "🎉 You Win!";
// //   else outcome = "❌ You Lose!";

// //   // Show moves for this player
// //   result.innerHTML = `
// //     Your Move: <b>${playerNumber === 1 ? p1 : p2}</b><br>
// //     Opponent Move: <b>${playerNumber === 1 ? p2 : p1}</b><br>
// //     <b>${outcome}</b>
// //   `;

// //   // Enable buttons for next round
// //   buttons.forEach(btn => btn.disabled = false);
// // });

// // function play(choice) {
// //   console.log("🪨 Sending:", choice);
// //   buttons.forEach(btn => btn.disabled = true);
// //   message.innerText = "Waiting for opponent...";
// //   socket.emit("move", choice); // ✅ STRING ONLY
// // }


// console.log("✅ game.js loaded");

// const socket = io();
// let playerNumber;

// const message = document.getElementById("message");
// const result = document.getElementById("result");
// const buttons = document.querySelectorAll(".buttons button");

// // Disable buttons initially
// buttons.forEach(btn => btn.disabled = true);

// // Connected to server
// socket.on("connect", () => {
//   console.log("🟢 Connected to server with id:", socket.id);
// });

// // Receive assigned player number
// socket.on("playerNumber", num => {
//   playerNumber = num;
//   console.log(`🎮 You are Player ${num}`);
//   message.innerText = `You are Player ${num}. Waiting for opponent...`;
// });

// // Start game when 2 players connected
// socket.on("startGame", () => {
//   console.log("🚀 Game Started");
//   message.innerText = "Both players connected! Make your move!";
//   buttons.forEach(btn => btn.disabled = false);
// });

// // Receive result from server
// socket.on("result", data => {
//   console.log("🏆 Result received in browser:", data);

//   // Use the correct keys sent from server
//   const p1 = data.p1;   // Player 1 move
//   const p2 = data.p2;   // Player 2 move
//   const winner = data.winner; // 0 = draw, 1 = P1, 2 = P2

//   // Determine outcome text
//   let outcome = "";
//   if (winner === 0) outcome = "😐 Draw!";
//   else if (winner === playerNumber) outcome = "🎉 You Win!";
//   else outcome = "❌ You Lose!";

//   // Show moves for this player
//   result.innerHTML = `
//     🧍 Your Move: <b>${playerNumber === 1 ? p1 : p2}</b><br>
//     🤝 Opponent Move: <b>${playerNumber === 1 ? p2 : p1}</b><br>
//     <b>${outcome}</b>
//   `;

//   // Enable buttons for next round
//   buttons.forEach(btn => btn.disabled = false);
//   message.innerText = "Make your move!";
// });

// // Send player's move to server
// function play(choice) {
//   console.log(`🪨 Player ${playerNumber} chose:`, choice);
//   buttons.forEach(btn => btn.disabled = true);
//   message.innerText = "Waiting for opponent...";
//   socket.emit("move", choice); // Send only string
// }


console.log("✅ game.js loaded");

const socket = io();
let playerNumber = null; // Initialize as null to track if assigned

const message = document.getElementById("message");
const result = document.getElementById("result");
const buttons = document.querySelectorAll(".buttons button");

// Disable buttons initially
buttons.forEach(btn => btn.disabled = true);

// Connected to server
socket.on("connect", () => {
  console.log("🟢 Connected to server with id:", socket.id);
});

// Receive assigned player number
socket.on("playerNumber", num => {
  playerNumber = num;
  console.log(`🎮 You are Player ${num} (playerNumber variable set to: ${playerNumber})`);
  message.innerText = `You are Player ${num}. Waiting for opponent...`;
});

// Start game when 2 players connected
socket.on("startGame", () => {
  console.log("🚀 Game Started");
  console.log("Your playerNumber at game start:", playerNumber);
  message.innerText = "Both players connected! Make your move!";
  buttons.forEach(btn => btn.disabled = false);
});

// Receive result from server
socket.on("result", data => {
  console.log("====== RESULT RECEIVED ======");
  console.log("Full data object:", data);
  console.log("data.p1:", data.p1);
  console.log("data.p2:", data.p2);
  console.log("data.winner:", data.winner);
  console.log("Current playerNumber:", playerNumber);
  console.log("Type of playerNumber:", typeof playerNumber);
  console.log("============================");

  // Safety check
  if (playerNumber === null || playerNumber === undefined) {
    console.error("❌ ERROR: playerNumber is not set!");
    result.innerHTML = "Error: Player number not assigned. Please refresh.";
    return;
  }

  // Extract the data (with fallback)
  const p1 = data.p1 || "unknown";
  const p2 = data.p2 || "unknown";
  const winner = data.winner;

  // Determine which move is yours and which is opponent's
  const yourMove = (playerNumber === 1) ? p1 : p2;
  const opponentMove = (playerNumber === 1) ? p2 : p1;

  console.log("Calculated yourMove:", yourMove);
  console.log("Calculated opponentMove:", opponentMove);

  // Determine outcome text
  let outcome = "";
  if (winner === 0) {
    outcome = "😐 Draw!";
  } else if (winner === playerNumber) {
    outcome = "🎉 You Win!";
  } else {
    outcome = "❌ You Lose!";
  }

  console.log("Outcome:", outcome);

  // Show moves for this player
  result.innerHTML = `
    🧍 Your Move: <b>${yourMove}</b><br>
    🤝 Opponent Move: <b>${opponentMove}</b><br>
    <b>${outcome}</b>
  `;

  // Enable buttons for next round
  buttons.forEach(btn => btn.disabled = false);
  message.innerText = "Make your move!";
});

// Handle any error messages from server
socket.on("message", msg => {
  console.log("📩 Server message:", msg);
  message.innerText = msg;
});

// Send player's move to server
function play(choice) {
  if (playerNumber === null || playerNumber === undefined) {
    console.error("❌ Cannot play: playerNumber not set!");
    alert("Error: Not connected properly. Please refresh.");
    return;
  }
  
  console.log(`🪨 Player ${playerNumber} chose: ${choice}`);
  buttons.forEach(btn => btn.disabled = true);
  message.innerText = "Waiting for opponent...";
  socket.emit("move", choice);
}