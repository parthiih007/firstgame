// // // console.log("✅ game.js loaded");

// // // const socket = io();
// // // let playerNumber = null;
// // // let username = "";

// // // const message = document.getElementById("message");
// // // const result = document.getElementById("result");
// // // const buttons = document.querySelectorAll(".buttons button");
// // // const usernameDisplay = document.getElementById("username");
// // // const statsModal = document.getElementById("statsModal");

// // // // Disable buttons initially
// // // buttons.forEach(btn => btn.disabled = true);

// // // // Connected to server
// // // socket.on("connect", () => {
// // //   console.log("🟢 Connected to server with id:", socket.id);
// // // });

// // // // Receive player info (username)
// // // socket.on("playerInfo", data => {
// // //   username = data.username;
// // //   usernameDisplay.innerText = `👤 ${username}`;
// // //   console.log("👤 Logged in as:", username);
// // // });

// // // // Receive assigned player number
// // // socket.on("playerNumber", num => {
// // //   playerNumber = num;
// // //   console.log(`🎮 You are Player ${num}`);
// // //   message.innerText = `You are Player ${num}. Waiting for opponent...`;
// // // });

// // // // Start game when 2 players connected
// // // socket.on("startGame", () => {
// // //   console.log("🚀 Game Started");
// // //   message.innerText = "Both players connected! Make your move!";
// // //   buttons.forEach(btn => btn.disabled = false);
// // // });

// // // // Receive result from server
// // // socket.on("result", data => {
// // //   console.log("====== RESULT RECEIVED ======");
// // //   console.log("Full data object:", data);
// // //   console.log("Current playerNumber:", playerNumber);

// // //   if (playerNumber === null || playerNumber === undefined) {
// // //     console.error("❌ ERROR: playerNumber is not set!");
// // //     result.innerHTML = "Error: Player number not assigned. Please refresh.";
// // //     return;
// // //   }

// // //   const p1 = data.p1 || "unknown";
// // //   const p2 = data.p2 || "unknown";
// // //   const winner = data.winner;

// // //   const yourMove = (playerNumber === 1) ? p1 : p2;
// // //   const opponentMove = (playerNumber === 1) ? p2 : p1;

// // //   let outcome = "";
// // //   let outcomeEmoji = "";
  
// // //   if (winner === 0) {
// // //     outcome = "Draw!";
// // //     outcomeEmoji = "😐";
// // //   } else if (winner === playerNumber) {
// // //     outcome = "You Win!";
// // //     outcomeEmoji = "🎉";
// // //   } else {
// // //     outcome = "You Lose!";
// // //     outcomeEmoji = "❌";
// // //   }

// // //   result.innerHTML = `
// // //     <div style="font-size: 24px; margin-bottom: 10px;">${outcomeEmoji}</div>
// // //     🧍 Your Move: <b>${yourMove}</b><br>
// // //     🤝 Opponent Move: <b>${opponentMove}</b><br>
// // //     <div style="font-size: 20px; margin-top: 10px;"><b>${outcome}</b></div>
// // //   `;

// // //   // Enable buttons for next round
// // //   buttons.forEach(btn => btn.disabled = false);
// // //   message.innerText = "Make your move!";
  
// // //   // Refresh stats after each game
// // //   setTimeout(() => {
// // //     loadStats();
// // //   }, 1000);
// // // });

// // // // Handle messages from server
// // // socket.on("message", msg => {
// // //   console.log("📩 Server message:", msg);
// // //   message.innerText = msg;
// // // });

// // // // Handle disconnection
// // // socket.on("disconnect", () => {
// // //   console.log("❌ Disconnected from server");
// // //   message.innerText = "Connection lost. Redirecting to login...";
// // //   setTimeout(() => {
// // //     window.location.href = "/login.html";
// // //   }, 2000);
// // // });

// // // // Send player's move to server
// // // function play(choice) {
// // //   if (playerNumber === null || playerNumber === undefined) {
// // //     console.error("❌ Cannot play: playerNumber not set!");
// // //     alert("Error: Not connected properly. Please refresh.");
// // //     return;
// // //   }
  
// // //   console.log(`🪨 Player ${playerNumber} chose: ${choice}`);
// // //   buttons.forEach(btn => btn.disabled = true);
// // //   message.innerText = "Waiting for opponent...";
// // //   result.innerHTML = "<div style='opacity: 0.5;'>⏳ Waiting for opponent's move...</div>";
// // //   socket.emit("move", choice);
// // // }

// // // // Toggle stats modal
// // // function toggleStats() {
// // //   if (statsModal.style.display === "block") {
// // //     statsModal.style.display = "none";
// // //   } else {
// // //     statsModal.style.display = "block";
// // //     loadStats();
// // //     loadLeaderboard();
// // //   }
// // // }

// // // // Close modal when clicking outside
// // // window.onclick = function(event) {
// // //   if (event.target === statsModal) {
// // //     statsModal.style.display = "none";
// // //   }
// // // }

// // // // Load user stats
// // // async function loadStats() {
// // //   try {
// // //     const response = await fetch('/api/stats');
// // //     const data = await response.json();
    
// // //     if (data.success) {
// // //       document.getElementById('winsCount').innerText = data.stats.wins;
// // //       document.getElementById('lossesCount').innerText = data.stats.losses;
// // //       document.getElementById('drawsCount').innerText = data.stats.draws;
// // //       document.getElementById('totalGames').innerText = data.stats.totalGames;
// // //     }
// // //   } catch (error) {
// // //     console.error("Error loading stats:", error);
// // //   }
// // // }

// // // // Load leaderboard
// // // async function loadLeaderboard() {
// // //   try {
// // //     const response = await fetch('/api/leaderboard');
// // //     const data = await response.json();
    
// // //     if (data.success) {
// // //       const leaderboardDiv = document.getElementById('leaderboard');
      
// // //       if (data.leaderboard.length === 0) {
// // //         leaderboardDiv.innerHTML = '<p style="text-align: center; opacity: 0.7;">No games played yet</p>';
// // //         return;
// // //       }
      
// // //       leaderboardDiv.innerHTML = data.leaderboard.map((player, index) => {
// // //         let rankClass = '';
// // //         let medal = '';
        
// // //         if (index === 0) {
// // //           rankClass = 'gold';
// // //           medal = '🥇';
// // //         } else if (index === 1) {
// // //           rankClass = 'silver';
// // //           medal = '🥈';
// // //         } else if (index === 2) {
// // //           rankClass = 'bronze';
// // //           medal = '🥉';
// // //         } else {
// // //           medal = `${index + 1}.`;
// // //         }
        
// // //         return `
// // //           <div class="leaderboard-item">
// // //             <div class="leaderboard-rank ${rankClass}">${medal}</div>
// // //             <div class="leaderboard-name">${player.username}</div>
// // //             <div class="leaderboard-stats">
// // //               <div class="leaderboard-stat">W: ${player.wins}</div>
// // //               <div class="leaderboard-stat">L: ${player.losses}</div>
// // //               <div class="leaderboard-stat">D: ${player.draws}</div>
// // //               <div class="leaderboard-stat">${player.winRate}%</div>
// // //             </div>
// // //           </div>
// // //         `;
// // //       }).join('');
// // //     }
// // //   } catch (error) {
// // //     console.error("Error loading leaderboard:", error);
// // //     document.getElementById('leaderboard').innerHTML = '<p style="text-align: center; color: #ff6b6b;">Error loading leaderboard</p>';
// // //   }
// // // }

// // console.log("✅ game.js loaded");

// // const socket = io();
// // let playerNumber = null;
// // let username = "";
// // let opponentName = "";

// // const message = document.getElementById("message");
// // const result = document.getElementById("result");
// // const buttons = document.querySelectorAll(".buttons button");
// // const usernameDisplay = document.getElementById("username");
// // const statsModal = document.getElementById("statsModal");

// // // Disable buttons initially
// // buttons.forEach(btn => btn.disabled = true);

// // // Connected to server
// // socket.on("connect", () => {
// //   console.log("🟢 Connected to server with id:", socket.id);
// // });

// // // Receive player info (username)
// // socket.on("playerInfo", data => {
// //   username = data.username;
// //   usernameDisplay.innerText = `👤 ${username}`;
  
// //   if (data.opponent) {
// //     opponentName = data.opponent;
// //   }
  
// //   console.log("👤 Logged in as:", username);
// // });

// // // Match found
// // socket.on("matchFound", data => {
// //   opponentName = data.opponent;
// //   console.log("🎯 Matched with:", opponentName);
// //   message.innerText = `Matched with ${opponentName}! Get ready...`;
// // });

// // // Receive assigned player number
// // socket.on("playerNumber", num => {
// //   playerNumber = num;
// //   console.log(`🎮 You are Player ${num}`);
  
// //   if (num === 1) {
// //     message.innerText = "Waiting for opponent...";
// //   }
// // });

// // // Start game when 2 players connected
// // socket.on("startGame", () => {
// //   console.log("🚀 Game Started");
// //   message.innerText = `Playing against ${opponentName || "opponent"}! Make your move!`;
// //   buttons.forEach(btn => btn.disabled = false);
// //   result.innerHTML = "";
// // });

// // // Receive result from server
// // socket.on("result", data => {
// //   console.log("====== RESULT RECEIVED ======");
// //   console.log("Full data object:", data);
// //   console.log("Current playerNumber:", playerNumber);

// //   if (playerNumber === null || playerNumber === undefined) {
// //     console.error("❌ ERROR: playerNumber is not set!");
// //     result.innerHTML = "Error: Player number not assigned. Please refresh.";
// //     return;
// //   }

// //   const p1 = data.p1 || "unknown";
// //   const p2 = data.p2 || "unknown";
// //   const winner = data.winner;

// //   const yourMove = (playerNumber === 1) ? p1 : p2;
// //   const opponentMove = (playerNumber === 1) ? p2 : p1;

// //   let outcome = "";
// //   let outcomeEmoji = "";
  
// //   if (winner === 0) {
// //     outcome = "Draw!";
// //     outcomeEmoji = "😐";
// //   } else if (winner === playerNumber) {
// //     outcome = "You Win!";
// //     outcomeEmoji = "🎉";
// //   } else {
// //     outcome = "You Lose!";
// //     outcomeEmoji = "❌";
// //   }

// //   result.innerHTML = `
// //     <div style="font-size: 24px; margin-bottom: 10px;">${outcomeEmoji}</div>
// //     🧍 Your Move: <b>${yourMove}</b><br>
// //     🤝 ${opponentName || "Opponent"}'s Move: <b>${opponentMove}</b><br>
// //     <div style="font-size: 20px; margin-top: 10px;"><b>${outcome}</b></div>
// //   `;

// //   // Enable buttons for next round
// //   buttons.forEach(btn => btn.disabled = false);
// //   message.innerText = `Playing against ${opponentName || "opponent"}! Make your move!`;
  
// //   // Refresh stats after each game
// //   setTimeout(() => {
// //     loadStats();
// //   }, 1000);
// // });

// // // Handle messages from server
// // socket.on("message", msg => {
// //   console.log("📩 Server message:", msg);
// //   message.innerText = msg;
  
// //   // If opponent disconnected, disable buttons
// //   if (msg.includes("disconnected") || msg.includes("Waiting")) {
// //     buttons.forEach(btn => btn.disabled = true);
// //     result.innerHTML = "";
// //   }
// // });

// // // Handle errors
// // socket.on("error", err => {
// //   console.error("❌ Error:", err);
// //   message.innerText = "Error: " + err;
// // });

// // // Handle unauthorized
// // socket.on("unauthorized", () => {
// //   console.log("❌ Unauthorized");
// //   window.location.href = "/login.html";
// // });

// // // Handle disconnection
// // socket.on("disconnect", () => {
// //   console.log("❌ Disconnected from server");
// //   message.innerText = "Connection lost. Redirecting to login...";
// //   buttons.forEach(btn => btn.disabled = true);
// //   setTimeout(() => {
// //     window.location.href = "/login.html";
// //   }, 2000);
// // });

// // // Send player's move to server
// // function play(choice) {
// //   if (playerNumber === null || playerNumber === undefined) {
// //     console.error("❌ Cannot play: playerNumber not set!");
// //     alert("Error: Not connected properly. Please refresh.");
// //     return;
// //   }
  
// //   console.log(`🪨 Player ${playerNumber} chose: ${choice}`);
// //   buttons.forEach(btn => btn.disabled = true);
// //   message.innerText = "Waiting for opponent...";
// //   result.innerHTML = "<div style='opacity: 0.5;'>⏳ Waiting for opponent's move...</div>";
// //   socket.emit("move", choice);
// // }

// // // Toggle stats modal
// // function toggleStats() {
// //   if (statsModal.style.display === "block") {
// //     statsModal.style.display = "none";
// //   } else {
// //     statsModal.style.display = "block";
// //     loadStats();
// //     loadLeaderboard();
// //   }
// // }

// // // Close modal when clicking outside
// // window.onclick = function(event) {
// //   if (event.target === statsModal) {
// //     statsModal.style.display = "none";
// //   }
// // }

// // // Load user stats
// // async function loadStats() {
// //   try {
// //     const response = await fetch('/api/stats');
// //     const data = await response.json();
    
// //     if (data.success) {
// //       document.getElementById('winsCount').innerText = data.stats.wins;
// //       document.getElementById('lossesCount').innerText = data.stats.losses;
// //       document.getElementById('drawsCount').innerText = data.stats.draws;
// //       document.getElementById('totalGames').innerText = data.stats.totalGames;
// //     }
// //   } catch (error) {
// //     console.error("Error loading stats:", error);
// //   }
// // }

// // // Load leaderboard
// // async function loadLeaderboard() {
// //   try {
// //     const response = await fetch('/api/leaderboard');
// //     const data = await response.json();
    
// //     if (data.success) {
// //       const leaderboardDiv = document.getElementById('leaderboard');
      
// //       if (data.leaderboard.length === 0) {
// //         leaderboardDiv.innerHTML = '<p style="text-align: center; opacity: 0.7;">No games played yet</p>';
// //         return;
// //       }
      
// //       leaderboardDiv.innerHTML = data.leaderboard.map((player, index) => {
// //         let rankClass = '';
// //         let medal = '';
        
// //         if (index === 0) {
// //           rankClass = 'gold';
// //           medal = '🥇';
// //         } else if (index === 1) {
// //           rankClass = 'silver';
// //           medal = '🥈';
// //         } else if (index === 2) {
// //           rankClass = 'bronze';
// //           medal = '🥉';
// //         } else {
// //           medal = `${index + 1}.`;
// //         }
        
// //         return `
// //           <div class="leaderboard-item">
// //             <div class="leaderboard-rank ${rankClass}">${medal}</div>
// //             <div class="leaderboard-name">${player.username}</div>
// //             <div class="leaderboard-stats">
// //               <div class="leaderboard-stat">W: ${player.wins}</div>
// //               <div class="leaderboard-stat">L: ${player.losses}</div>
// //               <div class="leaderboard-stat">D: ${player.draws}</div>
// //               <div class="leaderboard-stat">${player.winRate}%</div>
// //             </div>
// //           </div>
// //         `;
// //       }).join('');
// //     }
// //   } catch (error) {
// //     console.error("Error loading leaderboard:", error);
// //     document.getElementById('leaderboard').innerHTML = '<p style="text-align: center; color: #ff6b6b;">Error loading leaderboard</p>';
// //   }
// // }

// console.log("✅ game.js loaded");

// const socket = io();
// let playerNumber = null;
// let username = "";
// let opponentData = null;

// const message = document.getElementById("message");
// const result = document.getElementById("result");
// const buttons = document.querySelectorAll(".buttons button");
// const usernameDisplay = document.getElementById("username");
// const statsModal = document.getElementById("statsModal");
// const profileModal = document.getElementById("profileModal");
// const opponentCard = document.getElementById("opponentCard");

// // Disable buttons initially
// buttons.forEach(btn => btn.disabled = true);

// // Connected to server
// socket.on("connect", () => {
//   console.log("🟢 Connected to server with id:", socket.id);
// });

// // Receive player info (username)
// socket.on("playerInfo", data => {
//   username = data.username;
//   usernameDisplay.innerText = `👤 ${username}`;
//   console.log("👤 Logged in as:", username);
// });

// // Match found - display opponent info
// socket.on("matchFound", data => {
//   console.log("🎯 Match found event received:", data);
  
//   if (!data || !data.opponent) {
//     console.error("❌ Invalid opponent data received");
//     return;
//   }
  
//   opponentData = data.opponent;
//   console.log("🎯 Matched with:", opponentData);
  
//   // Show opponent card with fallback values
//   opponentCard.style.display = "block";
//   document.getElementById("opponentName").innerText = opponentData.username || "Unknown";
//   document.getElementById("opponentEmail").innerText = opponentData.email || "No email";
//   document.getElementById("opponentWins").innerText = opponentData.wins || 0;
//   document.getElementById("opponentLosses").innerText = opponentData.losses || 0;
//   document.getElementById("opponentDraws").innerText = opponentData.draws || 0;
  
//   message.innerText = `Matched with ${opponentData.username || "opponent"}! Get ready...`;
// });

// // Receive assigned player number
// socket.on("playerNumber", num => {
//   playerNumber = num;
//   console.log(`🎮 You are Player ${num}`);
  
//   if (num === 1) {
//     message.innerText = "Waiting for opponent...";
//     // Hide opponent card when waiting
//     opponentCard.style.display = "none";
//   }
// });

// // Start game when 2 players connected
// socket.on("startGame", () => {
//   console.log("🚀 Game Started");
//   const opponentName = opponentData ? opponentData.username : "opponent";
//   message.innerText = `Playing against ${opponentName}! Make your move!`;
//   buttons.forEach(btn => btn.disabled = false);
//   result.innerHTML = "";
// });

// // Receive result from server
// socket.on("result", data => {
//   console.log("====== RESULT RECEIVED ======");
//   console.log("Full data object:", data);
//   console.log("Current playerNumber:", playerNumber);

//   if (playerNumber === null || playerNumber === undefined) {
//     console.error("❌ ERROR: playerNumber is not set!");
//     result.innerHTML = "Error: Player number not assigned. Please refresh.";
//     return;
//   }

//   const p1 = data.p1 || "unknown";
//   const p2 = data.p2 || "unknown";
//   const winner = data.winner;

//   const yourMove = (playerNumber === 1) ? p1 : p2;
//   const opponentMove = (playerNumber === 1) ? p2 : p1;
//   const opponentName = opponentData ? opponentData.username : "Opponent";

//   let outcome = "";
//   let outcomeEmoji = "";
  
//   if (winner === 0) {
//     outcome = "Draw!";
//     outcomeEmoji = "😐";
//   } else if (winner === playerNumber) {
//     outcome = "You Win!";
//     outcomeEmoji = "🎉";
//   } else {
//     outcome = "You Lose!";
//     outcomeEmoji = "❌";
//   }

//   result.innerHTML = `
//     <div style="font-size: 24px; margin-bottom: 10px;">${outcomeEmoji}</div>
//     🧍 Your Move: <b>${yourMove}</b><br>
//     🤝 ${opponentName}'s Move: <b>${opponentMove}</b><br>
//     <div style="font-size: 20px; margin-top: 10px;"><b>${outcome}</b></div>
//   `;

//   // Enable buttons for next round
//   buttons.forEach(btn => btn.disabled = false);
//   message.innerText = `Playing against ${opponentName}! Make your move!`;
  
//   // Refresh stats after each game
//   setTimeout(() => {
//     loadStats();
//     loadProfile(); // Also refresh profile
//   }, 1000);
// });

// // Handle messages from server
// socket.on("message", msg => {
//   console.log("📩 Server message:", msg);
//   message.innerText = msg;
  
//   // If opponent disconnected, disable buttons and hide opponent card
//   if (msg.includes("disconnected") || msg.includes("Waiting")) {
//     buttons.forEach(btn => btn.disabled = true);
//     result.innerHTML = "";
//     opponentCard.style.display = "none";
//     opponentData = null;
//   }
// });

// // Handle errors
// socket.on("error", err => {
//   console.error("❌ Error:", err);
//   message.innerText = "Error: " + err;
// });

// // Handle unauthorized
// socket.on("unauthorized", () => {
//   console.log("❌ Unauthorized");
//   window.location.href = "/login.html";
// });

// // Handle disconnection
// socket.on("disconnect", () => {
//   console.log("❌ Disconnected from server");
//   message.innerText = "Connection lost. Redirecting to login...";
//   buttons.forEach(btn => btn.disabled = true);
//   opponentCard.style.display = "none";
//   setTimeout(() => {
//     window.location.href = "/login.html";
//   }, 2000);
// });

// // Send player's move to server
// function play(choice) {
//   if (playerNumber === null || playerNumber === undefined) {
//     console.error("❌ Cannot play: playerNumber not set!");
//     alert("Error: Not connected properly. Please refresh.");
//     return;
//   }
  
//   console.log(`🪨 Player ${playerNumber} chose: ${choice}`);
//   buttons.forEach(btn => btn.disabled = true);
//   message.innerText = "Waiting for opponent...";
//   result.innerHTML = "<div style='opacity: 0.5;'>⏳ Waiting for opponent's move...</div>";
//   socket.emit("move", choice);
// }

// // Toggle profile modal
// function toggleProfile() {
//   if (profileModal.style.display === "block") {
//     profileModal.style.display = "none";
//   } else {
//     profileModal.style.display = "block";
//     loadProfile();
//   }
// }

// // Toggle stats modal
// function toggleStats() {
//   if (statsModal.style.display === "block") {
//     statsModal.style.display = "none";
//   } else {
//     statsModal.style.display = "block";
//     loadStats();
//     loadLeaderboard();
//   }
// }

// // Close modal when clicking outside
// window.onclick = function(event) {
//   if (event.target === statsModal) {
//     statsModal.style.display = "none";
//   }
//   if (event.target === profileModal) {
//     profileModal.style.display = "none";
//   }
// }

// // Load user profile
// async function loadProfile() {
//   try {
//     const response = await fetch('/api/profile');
//     const data = await response.json();
    
//     console.log("📋 Profile data received:", data);
    
//     if (data.success && data.profile) {
//       const profile = data.profile;
      
//       document.getElementById('profileUsername').innerText = profile.username || '-';
//       document.getElementById('profileEmail').innerText = profile.email || '-';
//       document.getElementById('profileTotalGames').innerText = profile.totalGames || 0;
//       document.getElementById('profileWins').innerText = profile.wins || 0;
//       document.getElementById('profileLosses').innerText = profile.losses || 0;
//       document.getElementById('profileDraws').innerText = profile.draws || 0;
      
//       // Format member since date
//       if (profile.memberSince) {
//         const memberDate = new Date(profile.memberSince);
//         const formattedDate = memberDate.toLocaleDateString('en-US', { 
//           year: 'numeric', 
//           month: 'long', 
//           day: 'numeric' 
//         });
//         document.getElementById('profileMemberSince').innerText = formattedDate;
//       } else {
//         document.getElementById('profileMemberSince').innerText = '-';
//       }
//     } else {
//       console.error("❌ Failed to load profile:", data.message);
//     }
//   } catch (error) {
//     console.error("❌ Error loading profile:", error);
//   }
// }

// // Load user stats
// async function loadStats() {
//   try {
//     const response = await fetch('/api/stats');
//     const data = await response.json();
    
//     if (data.success) {
//       document.getElementById('winsCount').innerText = data.stats.wins;
//       document.getElementById('lossesCount').innerText = data.stats.losses;
//       document.getElementById('drawsCount').innerText = data.stats.draws;
//       document.getElementById('totalGames').innerText = data.stats.totalGames;
//     }
//   } catch (error) {
//     console.error("Error loading stats:", error);
//   }
// }

// // Load leaderboard
// async function loadLeaderboard() {
//   try {
//     const response = await fetch('/api/leaderboard');
//     const data = await response.json();
    
//     if (data.success) {
//       const leaderboardDiv = document.getElementById('leaderboard');
      
//       if (data.leaderboard.length === 0) {
//         leaderboardDiv.innerHTML = '<p style="text-align: center; opacity: 0.7;">No games played yet</p>';
//         return;
//       }
      
//       leaderboardDiv.innerHTML = data.leaderboard.map((player, index) => {
//         let rankClass = '';
//         let medal = '';
        
//         if (index === 0) {
//           rankClass = 'gold';
//           medal = '🥇';
//         } else if (index === 1) {
//           rankClass = 'silver';
//           medal = '🥈';
//         } else if (index === 2) {
//           rankClass = 'bronze';
//           medal = '🥉';
//         } else {
//           medal = `${index + 1}.`;
//         }
        
//         return `
//           <div class="leaderboard-item">
//             <div class="leaderboard-rank ${rankClass}">${medal}</div>
//             <div class="leaderboard-name">${player.username}</div>
//             <div class="leaderboard-stats">
//               <div class="leaderboard-stat">W: ${player.wins}</div>
//               <div class="leaderboard-stat">L: ${player.losses}</div>
//               <div class="leaderboard-stat">D: ${player.draws}</div>
//               <div class="leaderboard-stat">${player.winRate}%</div>
//             </div>
//           </div>
//         `;
//       }).join('');
//     }
//   } catch (error) {
//     console.error("Error loading leaderboard:", error);
//     document.getElementById('leaderboard').innerHTML = '<p style="text-align: center; color: #ff6b6b;">Error loading leaderboard</p>';
//   }
// }

// // Load profile on page load
// window.addEventListener('load', () => {
//   loadProfile();
// });


// console.log("✅ game.js loaded");

// const socket = io();
// let playerNumber = null;
// let username = "";
// let opponentData = null;
// let opponentId = null;
// let currentUserId = null;

// const message = document.getElementById("message");
// const result = document.getElementById("result");
// const buttons = document.querySelectorAll(".buttons button");
// const usernameDisplay = document.getElementById("username");
// const statsModal = document.getElementById("statsModal");
// const profileModal = document.getElementById("profileModal");
// const opponentCard = document.getElementById("opponentCard");
// const chatBox = document.getElementById("chatBox");
// const chatMessages = document.getElementById("chatMessages");
// const chatInput = document.getElementById("chatInput");

// // Disable buttons initially
// buttons.forEach(btn => btn.disabled = true);

// // Connected to server
// socket.on("connect", () => {
//   console.log("🟢 Connected to server with id:", socket.id);
// });

// // Receive player info (username)
// socket.on("playerInfo", data => {
//   username = data.username;
//   usernameDisplay.innerText = `👤 ${username}`;
//   console.log("👤 Logged in as:", username);
// });

// // Match found - display opponent info
// socket.on("matchFound", data => {
//   console.log("🎯 Match found event received:", data);
  
//   if (!data || !data.opponent) {
//     console.error("❌ Invalid opponent data received");
//     return;
//   }
  
//   opponentData = data.opponent;
//   opponentId = data.opponentId;
  
//   console.log("🎯 Matched with:", opponentData);
//   console.log("🆔 Opponent ID:", opponentId);
  
//   // Show opponent card with fallback values
//   opponentCard.style.display = "block";
//   document.getElementById("opponentName").innerText = opponentData.username || "Unknown";
//   document.getElementById("opponentEmail").innerText = opponentData.email || "No email";
//   document.getElementById("opponentWins").innerText = opponentData.wins || 0;
//   document.getElementById("opponentLosses").innerText = opponentData.losses || 0;
//   document.getElementById("opponentDraws").innerText = opponentData.draws || 0;
  
//   message.innerText = `Matched with ${opponentData.username || "opponent"}! Get ready...`;
  
//   // Load chat history when matched
//   loadChatHistory();
// });

// // Receive assigned player number
// socket.on("playerNumber", num => {
//   playerNumber = num;
//   console.log(`🎮 You are Player ${num}`);
  
//   if (num === 1) {
//     message.innerText = "Waiting for opponent...";
//     // Hide opponent card when waiting
//     opponentCard.style.display = "none";
//   }
// });

// // Start game when 2 players connected
// socket.on("startGame", () => {
//   console.log("🚀 Game Started");
//   const opponentName = opponentData ? opponentData.username : "opponent";
//   message.innerText = `Playing against ${opponentName}! Make your move!`;
//   buttons.forEach(btn => btn.disabled = false);
//   result.innerHTML = "";
// });

// // Receive result from server
// socket.on("result", data => {
//   console.log("====== RESULT RECEIVED ======");
//   console.log("Full data object:", data);
//   console.log("Current playerNumber:", playerNumber);

//   if (playerNumber === null || playerNumber === undefined) {
//     console.error("❌ ERROR: playerNumber is not set!");
//     result.innerHTML = "Error: Player number not assigned. Please refresh.";
//     return;
//   }

//   const p1 = data.p1 || "unknown";
//   const p2 = data.p2 || "unknown";
//   const winner = data.winner;

//   const yourMove = (playerNumber === 1) ? p1 : p2;
//   const opponentMove = (playerNumber === 1) ? p2 : p1;
//   const opponentName = opponentData ? opponentData.username : "Opponent";

//   let outcome = "";
//   let outcomeEmoji = "";
  
//   if (winner === 0) {
//     outcome = "Draw!";
//     outcomeEmoji = "😐";
//   } else if (winner === playerNumber) {
//     outcome = "You Win!";
//     outcomeEmoji = "🎉";
//   } else {
//     outcome = "You Lose!";
//     outcomeEmoji = "❌";
//   }

//   result.innerHTML = `
//     <div style="font-size: 24px; margin-bottom: 10px;">${outcomeEmoji}</div>
//     🧍 Your Move: <b>${yourMove}</b><br>
//     🤝 ${opponentName}'s Move: <b>${opponentMove}</b><br>
//     <div style="font-size: 20px; margin-top: 10px;"><b>${outcome}</b></div>
//   `;

//   // Enable buttons for next round
//   buttons.forEach(btn => btn.disabled = false);
//   message.innerText = `Playing against ${opponentName}! Make your move!`;
  
//   // Refresh stats after each game
//   setTimeout(() => {
//     loadStats();
//     loadProfile(); // Also refresh profile
//   }, 1000);
// });

// // Handle messages from server
// socket.on("message", msg => {
//   console.log("📩 Server message:", msg);
//   message.innerText = msg;
  
//   // If opponent disconnected, disable buttons and hide opponent card
//   if (msg.includes("disconnected") || msg.includes("Waiting")) {
//     buttons.forEach(btn => btn.disabled = true);
//     result.innerHTML = "";
//     opponentCard.style.display = "none";
//     chatBox.style.display = "none";
//     opponentData = null;
//     opponentId = null;
//   }
// });

// // Handle chat messages
// socket.on("chatMessage", data => {
//   displayChatMessage(data);
// });

// // Handle errors
// socket.on("error", err => {
//   console.error("❌ Error:", err);
//   message.innerText = "Error: " + err;
// });

// // Handle unauthorized
// socket.on("unauthorized", () => {
//   console.log("❌ Unauthorized");
//   window.location.href = "/login.html";
// });

// // Handle disconnection
// socket.on("disconnect", () => {
//   console.log("❌ Disconnected from server");
//   message.innerText = "Connection lost. Redirecting to login...";
//   buttons.forEach(btn => btn.disabled = true);
//   opponentCard.style.display = "none";
//   setTimeout(() => {
//     window.location.href = "/login.html";
//   }, 2000);
// });

// // Send player's move to server
// function play(choice) {
//   if (playerNumber === null || playerNumber === undefined) {
//     console.error("❌ Cannot play: playerNumber not set!");
//     alert("Error: Not connected properly. Please refresh.");
//     return;
//   }
  
//   console.log(`🪨 Player ${playerNumber} chose: ${choice}`);
//   buttons.forEach(btn => btn.disabled = true);
//   message.innerText = "Waiting for opponent...";
//   result.innerHTML = "<div style='opacity: 0.5;'>⏳ Waiting for opponent's move...</div>";
//   socket.emit("move", choice);
// }

// // Toggle profile modal
// function toggleProfile() {
//   if (profileModal.style.display === "block") {
//     profileModal.style.display = "none";
//   } else {
//     profileModal.style.display = "block";
//     loadProfile();
//   }
// }

// // Toggle stats modal
// function toggleStats() {
//   if (statsModal.style.display === "block") {
//     statsModal.style.display = "none";
//   } else {
//     statsModal.style.display = "block";
//     loadStats();
//     loadLeaderboard();
//   }
// }

// // Close modal when clicking outside
// window.onclick = function(event) {
//   if (event.target === statsModal) {
//     statsModal.style.display = "none";
//   }
//   if (event.target === profileModal) {
//     profileModal.style.display = "none";
//   }
// }

// // Load user profile
// async function loadProfile() {
//   try {
//     const response = await fetch('/api/profile');
//     const data = await response.json();
    
//     console.log("📋 Profile data received:", data);
    
//     if (data.success && data.profile) {
//       const profile = data.profile;
      
//       document.getElementById('profileUsername').innerText = profile.username || '-';
//       document.getElementById('profileEmail').innerText = profile.email || '-';
//       document.getElementById('profileTotalGames').innerText = profile.totalGames || 0;
//       document.getElementById('profileWins').innerText = profile.wins || 0;
//       document.getElementById('profileLosses').innerText = profile.losses || 0;
//       document.getElementById('profileDraws').innerText = profile.draws || 0;
      
//       // Format member since date
//       if (profile.memberSince) {
//         const memberDate = new Date(profile.memberSince);
//         const formattedDate = memberDate.toLocaleDateString('en-US', { 
//           year: 'numeric', 
//           month: 'long', 
//           day: 'numeric' 
//         });
//         document.getElementById('profileMemberSince').innerText = formattedDate;
//       } else {
//         document.getElementById('profileMemberSince').innerText = '-';
//       }
//     } else {
//       console.error("❌ Failed to load profile:", data.message);
//     }
//   } catch (error) {
//     console.error("❌ Error loading profile:", error);
//   }
// }

// // Load user stats
// async function loadStats() {
//   try {
//     const response = await fetch('/api/stats');
//     const data = await response.json();
    
//     if (data.success) {
//       document.getElementById('winsCount').innerText = data.stats.wins;
//       document.getElementById('lossesCount').innerText = data.stats.losses;
//       document.getElementById('drawsCount').innerText = data.stats.draws;
//       document.getElementById('totalGames').innerText = data.stats.totalGames;
//     }
//   } catch (error) {
//     console.error("Error loading stats:", error);
//   }
// }

// // Load leaderboard
// async function loadLeaderboard() {
//   try {
//     const response = await fetch('/api/leaderboard');
//     const data = await response.json();
    
//     if (data.success) {
//       const leaderboardDiv = document.getElementById('leaderboard');
      
//       if (data.leaderboard.length === 0) {
//         leaderboardDiv.innerHTML = '<p style="text-align: center; opacity: 0.7;">No games played yet</p>';
//         return;
//       }
      
//       leaderboardDiv.innerHTML = data.leaderboard.map((player, index) => {
//         let rankClass = '';
//         let medal = '';
        
//         if (index === 0) {
//           rankClass = 'gold';
//           medal = '🥇';
//         } else if (index === 1) {
//           rankClass = 'silver';
//           medal = '🥈';
//         } else if (index === 2) {
//           rankClass = 'bronze';
//           medal = '🥉';
//         } else {
//           medal = `${index + 1}.`;
//         }
        
//         return `
//           <div class="leaderboard-item">
//             <div class="leaderboard-rank ${rankClass}">${medal}</div>
//             <div class="leaderboard-name">${player.username}</div>
//             <div class="leaderboard-stats">
//               <div class="leaderboard-stat">W: ${player.wins}</div>
//               <div class="leaderboard-stat">L: ${player.losses}</div>
//               <div class="leaderboard-stat">D: ${player.draws}</div>
//               <div class="leaderboard-stat">${player.winRate}%</div>
//             </div>
//           </div>
//         `;
//       }).join('');
//     }
//   } catch (error) {
//     console.error("Error loading leaderboard:", error);
//     document.getElementById('leaderboard').innerHTML = '<p style="text-align: center; color: #ff6b6b;">Error loading leaderboard</p>';
//   }
// }

// // Load profile on page load
// window.addEventListener('load', () => {
//   loadProfile();
// });

// // ============ CHAT FUNCTIONS ============

// // Toggle chat box
// function toggleChat() {
//   if (chatBox.style.display === "none" || chatBox.style.display === "") {
//     chatBox.style.display = "flex";
//     scrollChatToBottom();
//   } else {
//     chatBox.style.display = "none";
//   }
// }

// // Load chat history
// async function loadChatHistory() {
//   if (!opponentId) {
//     console.error("❌ No opponent ID available");
//     return;
//   }
  
//   try {
//     const response = await fetch(`/api/chat-history/${opponentId}`);
//     const data = await response.json();
    
//     if (data.success) {
//       chatMessages.innerHTML = "";
      
//       if (data.messages.length === 0) {
//         chatMessages.innerHTML = '<div class="chat-loading">No messages yet. Say hi! 👋</div>';
//       } else {
//         data.messages.forEach(msg => {
//           displayChatMessage(msg, false); // false = don't scroll on load
//         });
//         scrollChatToBottom();
//       }
//     }
//   } catch (error) {
//     console.error("Error loading chat history:", error);
//     chatMessages.innerHTML = '<div class="chat-loading">Failed to load chat history</div>';
//   }
// }

// // Display a chat message
// function displayChatMessage(data, shouldScroll = true) {
//   // Get current user ID from profile
//   fetch('/api/profile')
//     .then(res => res.json())
//     .then(profileData => {
//       if (profileData.success) {
//         currentUserId = profileData.profile._id || profileData.profile.userId;
        
//         const isOwnMessage = data.senderId === currentUserId;
//         const messageDiv = document.createElement('div');
//         messageDiv.className = `chat-message ${isOwnMessage ? 'own' : 'other'}`;
        
//         const time = new Date(data.timestamp).toLocaleTimeString('en-US', {
//           hour: '2-digit',
//           minute: '2-digit'
//         });
        
//         messageDiv.innerHTML = `
//           ${!isOwnMessage ? `<div class="chat-message-header">${data.senderUsername}</div>` : ''}
//           <div class="chat-message-text">${escapeHtml(data.message)}</div>
//           <div class="chat-message-time">${time}</div>
//         `;
        
//         // Remove loading message if present
//         const loadingMsg = chatMessages.querySelector('.chat-loading');
//         if (loadingMsg) {
//           loadingMsg.remove();
//         }
        
//         chatMessages.appendChild(messageDiv);
        
//         if (shouldScroll) {
//           scrollChatToBottom();
//         }
//       }
//     });
// }

// // Send chat message
// function sendChatMessage() {
//   const message = chatInput.value.trim();
  
//   if (!message) {
//     return;
//   }
  
//   if (message.length > 500) {
//     alert("Message is too long (max 500 characters)");
//     return;
//   }
  
//   socket.emit("chatMessage", { message });
//   chatInput.value = "";
// }

// // Handle Enter key in chat input
// function handleChatKeyPress(event) {
//   if (event.key === 'Enter') {
//     sendChatMessage();
//   }
// }

// // Scroll chat to bottom
// function scrollChatToBottom() {
//   setTimeout(() => {
//     chatMessages.scrollTop = chatMessages.scrollHeight;
//   }, 100);
// }

// // Escape HTML to prevent XSS
// function escapeHtml(text) {
//   const div = document.createElement('div');
//   div.textContent = text;
//   return div.innerHTML;
// }


// console.log("✅ game.js loaded");

// const socket = io();
// let playerNumber = null;
// let username = "";
// let opponentData = null;
// let opponentId = null;
// let currentUserId = null;

// const message = document.getElementById("message");
// const result = document.getElementById("result");
// const buttons = document.querySelectorAll(".buttons button");
// const usernameDisplay = document.getElementById("username");
// const statsModal = document.getElementById("statsModal");
// const profileModal = document.getElementById("profileModal");
// const opponentCard = document.getElementById("opponentCard");
// const chatBox = document.getElementById("chatBox");
// const chatMessages = document.getElementById("chatMessages");
// const chatInput = document.getElementById("chatInput");

// // Disable buttons initially
// buttons.forEach(btn => btn.disabled = true);

// // Connected to server
// socket.on("connect", () => {
//   console.log("🟢 Connected to server with id:", socket.id);
// });

// // Receive player info (username)
// socket.on("playerInfo", data => {
//   username = data.username;
//   usernameDisplay.innerText = `👤 ${username}`;
//   console.log("👤 Logged in as:", username);
  
//   // Get current user ID when player info is received
//   loadProfile().then(() => {
//     console.log("✅ Current user ID loaded:", currentUserId);
//   });
// });

// // Match found - display opponent info
// socket.on("matchFound", data => {
//   console.log("🎯 Match found event received:", data);
  
//   if (!data || !data.opponent) {
//     console.error("❌ Invalid opponent data received");
//     return;
//   }
  
//   opponentData = data.opponent;
//   opponentId = data.opponentId;
  
//   console.log("🎯 Matched with:", opponentData);
//   console.log("🆔 Opponent ID:", opponentId);
  
//   // Show opponent card with fallback values
//   opponentCard.style.display = "block";
//   document.getElementById("opponentName").innerText = opponentData.username || "Unknown";
//   document.getElementById("opponentEmail").innerText = opponentData.email || "No email";
//   document.getElementById("opponentWins").innerText = opponentData.wins || 0;
//   document.getElementById("opponentLosses").innerText = opponentData.losses || 0;
//   document.getElementById("opponentDraws").innerText = opponentData.draws || 0;
  
//   message.innerText = `Matched with ${opponentData.username || "opponent"}! Get ready...`;
  
//   // Load chat history when matched
//   loadChatHistory();
// });

// // Receive assigned player number
// socket.on("playerNumber", num => {
//   playerNumber = num;
//   console.log(`🎮 You are Player ${num}`);
  
//   if (num === 1) {
//     message.innerText = "Waiting for opponent...";
//     // Hide opponent card when waiting
//     opponentCard.style.display = "none";
//   }
// });

// // Start game when 2 players connected
// socket.on("startGame", () => {
//   console.log("🚀 Game Started");
//   const opponentName = opponentData ? opponentData.username : "opponent";
//   message.innerText = `Playing against ${opponentName}! Make your move!`;
//   buttons.forEach(btn => btn.disabled = false);
//   result.innerHTML = "";
// });

// // Receive result from server
// socket.on("result", data => {
//   console.log("====== RESULT RECEIVED ======");
//   console.log("Full data object:", data);
//   console.log("Current playerNumber:", playerNumber);

//   if (playerNumber === null || playerNumber === undefined) {
//     console.error("❌ ERROR: playerNumber is not set!");
//     result.innerHTML = "Error: Player number not assigned. Please refresh.";
//     return;
//   }

//   const p1 = data.p1 || "unknown";
//   const p2 = data.p2 || "unknown";
//   const winner = data.winner;

//   const yourMove = (playerNumber === 1) ? p1 : p2;
//   const opponentMove = (playerNumber === 1) ? p2 : p1;
//   const opponentName = opponentData ? opponentData.username : "Opponent";

//   let outcome = "";
//   let outcomeEmoji = "";
  
//   if (winner === 0) {
//     outcome = "Draw!";
//     outcomeEmoji = "😐";
//   } else if (winner === playerNumber) {
//     outcome = "You Win!";
//     outcomeEmoji = "🎉";
//   } else {
//     outcome = "You Lose!";
//     outcomeEmoji = "❌";
//   }

//   result.innerHTML = `
//     <div style="font-size: 24px; margin-bottom: 10px;">${outcomeEmoji}</div>
//     🧍 Your Move: <b>${yourMove}</b><br>
//     🤝 ${opponentName}'s Move: <b>${opponentMove}</b><br>
//     <div style="font-size: 20px; margin-top: 10px;"><b>${outcome}</b></div>
//   `;

//   // Enable buttons for next round
//   buttons.forEach(btn => btn.disabled = false);
//   message.innerText = `Playing against ${opponentName}! Make your move!`;
  
//   // Refresh stats after each game
//   setTimeout(() => {
//     loadStats();
//     loadProfile(); // Also refresh profile
//   }, 1000);
// });

// // Handle messages from server
// socket.on("message", msg => {
//   console.log("📩 Server message:", msg);
//   message.innerText = msg;
  
//   // If opponent disconnected, disable buttons and hide opponent card
//   if (msg.includes("disconnected") || msg.includes("Waiting")) {
//     buttons.forEach(btn => btn.disabled = true);
//     result.innerHTML = "";
//     opponentCard.style.display = "none";
//     chatBox.style.display = "none";
//     opponentData = null;
//     opponentId = null;
//   }
// });

// // Handle chat messages
// socket.on("chatMessage", data => {
//   displayChatMessage(data);
// });

// // Handle errors
// socket.on("error", err => {
//   console.error("❌ Error:", err);
//   message.innerText = "Error: " + err;
// });

// // Handle unauthorized
// socket.on("unauthorized", () => {
//   console.log("❌ Unauthorized");
//   window.location.href = "/login.html";
// });

// // Handle disconnection
// socket.on("disconnect", () => {
//   console.log("❌ Disconnected from server");
//   message.innerText = "Connection lost. Redirecting to login...";
//   buttons.forEach(btn => btn.disabled = true);
//   opponentCard.style.display = "none";
//   setTimeout(() => {
//     window.location.href = "/login.html";
//   }, 2000);
// });

// // Send player's move to server
// function play(choice) {
//   if (playerNumber === null || playerNumber === undefined) {
//     console.error("❌ Cannot play: playerNumber not set!");
//     alert("Error: Not connected properly. Please refresh.");
//     return;
//   }
  
//   console.log(`🪨 Player ${playerNumber} chose: ${choice}`);
//   buttons.forEach(btn => btn.disabled = true);
//   message.innerText = "Waiting for opponent...";
//   result.innerHTML = "<div style='opacity: 0.5;'>⏳ Waiting for opponent's move...</div>";
//   socket.emit("move", choice);
// }

// // Toggle profile modal
// function toggleProfile() {
//   if (profileModal.style.display === "block") {
//     profileModal.style.display = "none";
//   } else {
//     profileModal.style.display = "block";
//     loadProfile();
//   }
// }

// // Toggle stats modal
// function toggleStats() {
//   if (statsModal.style.display === "block") {
//     statsModal.style.display = "none";
//   } else {
//     statsModal.style.display = "block";
//     loadStats();
//     loadLeaderboard();
//   }
// }

// // Close modal when clicking outside
// window.onclick = function(event) {
//   if (event.target === statsModal) {
//     statsModal.style.display = "none";
//   }
//   if (event.target === profileModal) {
//     profileModal.style.display = "none";
//   }
// }

// // Load user profile
// async function loadProfile() {
//   try {
//     const response = await fetch('/api/profile');
//     const data = await response.json();
    
//     console.log("📋 Profile data received:", data);
    
//     if (data.success && data.profile) {
//       const profile = data.profile;
      
//       // Store current user ID globally
//       currentUserId = profile._id || data.profile.userId;
//       console.log("🆔 Current user ID set to:", currentUserId);
      
//       document.getElementById('profileUsername').innerText = profile.username || '-';
//       document.getElementById('profileEmail').innerText = profile.email || '-';
//       document.getElementById('profileTotalGames').innerText = profile.totalGames || 0;
//       document.getElementById('profileWins').innerText = profile.wins || 0;
//       document.getElementById('profileLosses').innerText = profile.losses || 0;
//       document.getElementById('profileDraws').innerText = profile.draws || 0;
      
//       // Format member since date
//       if (profile.memberSince) {
//         const memberDate = new Date(profile.memberSince);
//         const formattedDate = memberDate.toLocaleDateString('en-US', { 
//           year: 'numeric', 
//           month: 'long', 
//           day: 'numeric' 
//         });
//         document.getElementById('profileMemberSince').innerText = formattedDate;
//       } else {
//         document.getElementById('profileMemberSince').innerText = '-';
//       }
      
//       return profile;
//     } else {
//       console.error("❌ Failed to load profile:", data.message);
//     }
//   } catch (error) {
//     console.error("❌ Error loading profile:", error);
//   }
// }

// // Load user stats
// async function loadStats() {
//   try {
//     const response = await fetch('/api/stats');
//     const data = await response.json();
    
//     if (data.success) {
//       document.getElementById('winsCount').innerText = data.stats.wins;
//       document.getElementById('lossesCount').innerText = data.stats.losses;
//       document.getElementById('drawsCount').innerText = data.stats.draws;
//       document.getElementById('totalGames').innerText = data.stats.totalGames;
//     }
//   } catch (error) {
//     console.error("Error loading stats:", error);
//   }
// }

// // Load leaderboard
// async function loadLeaderboard() {
//   try {
//     const response = await fetch('/api/leaderboard');
//     const data = await response.json();
    
//     if (data.success) {
//       const leaderboardDiv = document.getElementById('leaderboard');
      
//       if (data.leaderboard.length === 0) {
//         leaderboardDiv.innerHTML = '<p style="text-align: center; opacity: 0.7;">No games played yet</p>';
//         return;
//       }
      
//       leaderboardDiv.innerHTML = data.leaderboard.map((player, index) => {
//         let rankClass = '';
//         let medal = '';
        
//         if (index === 0) {
//           rankClass = 'gold';
//           medal = '🥇';
//         } else if (index === 1) {
//           rankClass = 'silver';
//           medal = '🥈';
//         } else if (index === 2) {
//           rankClass = 'bronze';
//           medal = '🥉';
//         } else {
//           medal = `${index + 1}.`;
//         }
        
//         return `
//           <div class="leaderboard-item">
//             <div class="leaderboard-rank ${rankClass}">${medal}</div>
//             <div class="leaderboard-name">${player.username}</div>
//             <div class="leaderboard-stats">
//               <div class="leaderboard-stat">W: ${player.wins}</div>
//               <div class="leaderboard-stat">L: ${player.losses}</div>
//               <div class="leaderboard-stat">D: ${player.draws}</div>
//               <div class="leaderboard-stat">${player.winRate}%</div>
//             </div>
//           </div>
//         `;
//       }).join('');
//     }
//   } catch (error) {
//     console.error("Error loading leaderboard:", error);
//     document.getElementById('leaderboard').innerHTML = '<p style="text-align: center; color: #ff6b6b;">Error loading leaderboard</p>';
//   }
// }

// // Load profile on page load
// window.addEventListener('load', () => {
//   loadProfile();
// });

// // ============ CHAT FUNCTIONS ============

// // Toggle chat box
// function toggleChat() {
//   if (chatBox.style.display === "none" || chatBox.style.display === "") {
//     chatBox.style.display = "flex";
//     scrollChatToBottom();
//   } else {
//     chatBox.style.display = "none";
//   }
// }

// // Load chat history
// async function loadChatHistory() {
//   if (!opponentId) {
//     console.error("❌ No opponent ID available");
//     return;
//   }
  
//   try {
//     const response = await fetch(`/api/chat-history/${opponentId}`);
//     const data = await response.json();
    
//     if (data.success) {
//       chatMessages.innerHTML = "";
      
//       if (data.messages.length === 0) {
//         chatMessages.innerHTML = '<div class="chat-loading">No messages yet. Say hi! 👋</div>';
//       } else {
//         data.messages.forEach(msg => {
//           displayChatMessage(msg, false); // false = don't scroll on load
//         });
//         scrollChatToBottom();
//       }
//     }
//   } catch (error) {
//     console.error("Error loading chat history:", error);
//     chatMessages.innerHTML = '<div class="chat-loading">Failed to load chat history</div>';
//   }
// }

// // Display a chat message
// function displayChatMessage(data, shouldScroll = true) {
//   console.log("💬 Displaying chat message:", data);
//   console.log("Current user ID:", currentUserId);
//   console.log("Message sender ID:", data.senderId);
  
//   const isOwnMessage = data.senderId === currentUserId;
//   console.log("Is own message:", isOwnMessage);
  
//   const messageDiv = document.createElement('div');
//   messageDiv.className = `chat-message ${isOwnMessage ? 'own' : 'other'}`;
  
//   const time = new Date(data.timestamp).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit'
//   });
  
//   messageDiv.innerHTML = `
//     ${!isOwnMessage ? `<div class="chat-message-header">${data.senderUsername}</div>` : ''}
//     <div class="chat-message-text">${escapeHtml(data.message)}</div>
//     <div class="chat-message-time">${time}</div>
//   `;
  
//   // Remove loading message if present
//   const loadingMsg = chatMessages.querySelector('.chat-loading');
//   if (loadingMsg) {
//     loadingMsg.remove();
//   }
  
//   chatMessages.appendChild(messageDiv);
  
//   if (shouldScroll) {
//     scrollChatToBottom();
//   }
// }

// // Send chat message
// function sendChatMessage() {
//   const message = chatInput.value.trim();
  
//   console.log("📤 Attempting to send message:", message);
  
//   if (!message) {
//     console.log("❌ Empty message, not sending");
//     return;
//   }
  
//   if (message.length > 500) {
//     alert("Message is too long (max 500 characters)");
//     return;
//   }
  
//   console.log("✅ Emitting chat message to server");
//   socket.emit("chatMessage", { message });
//   chatInput.value = "";
// }

// // Handle Enter key in chat input
// function handleChatKeyPress(event) {
//   if (event.key === 'Enter') {
//     sendChatMessage();
//   }
// }

// // Scroll chat to bottom
// function scrollChatToBottom() {
//   setTimeout(() => {
//     chatMessages.scrollTop = chatMessages.scrollHeight;
//   }, 100);
// }

// // Escape HTML to prevent XSS
// function escapeHtml(text) {
//   const div = document.createElement('div');
//   div.textContent = text;
//   return div.innerHTML;
// }

console.log("✅ game.js loaded");

const socket = io();
let playerNumber = null;
let username = "";
let opponentData = null;
let opponentId = null;
let currentUserId = null;

const message = document.getElementById("message");
const result = document.getElementById("result");
const buttons = document.querySelectorAll(".buttons button");
const usernameDisplay = document.getElementById("username");
const statsModal = document.getElementById("statsModal");
const profileModal = document.getElementById("profileModal");
const opponentCard = document.getElementById("opponentCard");
const chatBox = document.getElementById("chatBox");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");

// Disable buttons initially
buttons.forEach(btn => btn.disabled = true);

// Connected to server
socket.on("connect", () => {
  console.log("🟢 Connected to server with id:", socket.id);
});

// Receive player info (username)
socket.on("playerInfo", data => {
  username = data.username;
  usernameDisplay.innerText = `👤 ${username}`;
  console.log("👤 Logged in as:", username);
  
  // Get current user ID when player info is received
  loadProfile().then(() => {
    console.log("✅ Current user ID loaded:", currentUserId);
  });
});

// Match found - display opponent info
socket.on("matchFound", data => {
  console.log("🎯 Match found event received:", data);
  
  if (!data || !data.opponent) {
    console.error("❌ Invalid opponent data received");
    return;
  }
  
  opponentData = data.opponent;
  opponentId = data.opponentId;
  
  console.log("🎯 Matched with:", opponentData);
  console.log("🆔 Opponent ID:", opponentId);
  
  // Show opponent card with fallback values
  opponentCard.style.display = "block";
  document.getElementById("opponentName").innerText = opponentData.username || "Unknown";
  document.getElementById("opponentEmail").innerText = opponentData.email || "No email";
  document.getElementById("opponentWins").innerText = opponentData.wins || 0;
  document.getElementById("opponentLosses").innerText = opponentData.losses || 0;
  document.getElementById("opponentDraws").innerText = opponentData.draws || 0;
  
  message.innerText = `Matched with ${opponentData.username || "opponent"}! Get ready...`;
  
  // Load chat history when matched
  loadChatHistory();
});

// Receive assigned player number
socket.on("playerNumber", num => {
  playerNumber = num;
  console.log(`🎮 You are Player ${num}`);
  
  if (num === 1) {
    message.innerText = "Waiting for opponent...";
    // Hide opponent card when waiting
    opponentCard.style.display = "none";
  }
});

// Start game when 2 players connected
socket.on("startGame", () => {
  console.log("🚀 Game Started");
  const opponentName = opponentData ? opponentData.username : "opponent";
  message.innerText = `Playing against ${opponentName}! Make your move!`;
  buttons.forEach(btn => btn.disabled = false);
  result.innerHTML = "";
});

// Receive result from server
socket.on("result", data => {
  console.log("====== RESULT RECEIVED ======");
  console.log("Full data object:", data);
  console.log("Current playerNumber:", playerNumber);

  if (playerNumber === null || playerNumber === undefined) {
    console.error("❌ ERROR: playerNumber is not set!");
    result.innerHTML = "Error: Player number not assigned. Please refresh.";
    return;
  }

  const p1 = data.p1 || "unknown";
  const p2 = data.p2 || "unknown";
  const winner = data.winner;

  const yourMove = (playerNumber === 1) ? p1 : p2;
  const opponentMove = (playerNumber === 1) ? p2 : p1;
  const opponentName = opponentData ? opponentData.username : "Opponent";

  let outcome = "";
  let outcomeEmoji = "";
  
  if (winner === 0) {
    outcome = "Draw!";
    outcomeEmoji = "😐";
  } else if (winner === playerNumber) {
    outcome = "You Win!";
    outcomeEmoji = "🎉";
  } else {
    outcome = "You Lose!";
    outcomeEmoji = "❌";
  }

  result.innerHTML = `
    <div style="font-size: 24px; margin-bottom: 10px;">${outcomeEmoji}</div>
    🧍 Your Move: <b>${yourMove}</b><br>
    🤝 ${opponentName}'s Move: <b>${opponentMove}</b><br>
    <div style="font-size: 20px; margin-top: 10px;"><b>${outcome}</b></div>
  `;

  // Enable buttons for next round
  buttons.forEach(btn => btn.disabled = false);
  message.innerText = `Playing against ${opponentName}! Make your move!`;
  
  // Refresh stats after each game
  setTimeout(() => {
    loadStats();
    loadProfile(); // Also refresh profile
  }, 1000);
});

// Handle messages from server
socket.on("message", msg => {
  console.log("📩 Server message:", msg);
  message.innerText = msg;
  
  // If opponent disconnected, disable buttons and hide opponent card
  if (msg.includes("disconnected") || msg.includes("Waiting")) {
    buttons.forEach(btn => btn.disabled = true);
    result.innerHTML = "";
    opponentCard.style.display = "none";
    chatBox.style.display = "none";
    opponentData = null;
    opponentId = null;
  }
});

// Handle chat messages
socket.on("chatMessage", data => {
  console.log("💬 Received chat message from server:", data);
  displayChatMessage(data);
});

// Handle errors
socket.on("error", err => {
  console.error("❌ Socket Error:", err);
  alert("Error: " + err);
  message.innerText = "Error: " + err;
});

// Handle unauthorized
socket.on("unauthorized", () => {
  console.log("❌ Unauthorized");
  window.location.href = "/login.html";
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
  message.innerText = "Connection lost. Redirecting to login...";
  buttons.forEach(btn => btn.disabled = true);
  opponentCard.style.display = "none";
  setTimeout(() => {
    window.location.href = "/login.html";
  }, 2000);
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
  result.innerHTML = "<div style='opacity: 0.5;'>⏳ Waiting for opponent's move...</div>";
  socket.emit("move", choice);
}

// Toggle profile modal
function toggleProfile() {
  if (profileModal.style.display === "block") {
    profileModal.style.display = "none";
  } else {
    profileModal.style.display = "block";
    loadProfile();
  }
}

// Toggle stats modal
function toggleStats() {
  if (statsModal.style.display === "block") {
    statsModal.style.display = "none";
  } else {
    statsModal.style.display = "block";
    loadStats();
    loadLeaderboard();
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target === statsModal) {
    statsModal.style.display = "none";
  }
  if (event.target === profileModal) {
    profileModal.style.display = "none";
  }
}

// Load user profile
async function loadProfile() {
  try {
    const response = await fetch('/api/profile');
    const data = await response.json();
    
    console.log("📋 Profile data received:", data);
    
    if (data.success && data.profile) {
      const profile = data.profile;
      
      // Store current user ID globally
      currentUserId = profile._id || data.profile.userId;
      console.log("🆔 Current user ID set to:", currentUserId);
      
      document.getElementById('profileUsername').innerText = profile.username || '-';
      document.getElementById('profileEmail').innerText = profile.email || '-';
      document.getElementById('profileTotalGames').innerText = profile.totalGames || 0;
      document.getElementById('profileWins').innerText = profile.wins || 0;
      document.getElementById('profileLosses').innerText = profile.losses || 0;
      document.getElementById('profileDraws').innerText = profile.draws || 0;
      
      // Format member since date
      if (profile.memberSince) {
        const memberDate = new Date(profile.memberSince);
        const formattedDate = memberDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        document.getElementById('profileMemberSince').innerText = formattedDate;
      } else {
        document.getElementById('profileMemberSince').innerText = '-';
      }
      
      return profile;
    } else {
      console.error("❌ Failed to load profile:", data.message);
    }
  } catch (error) {
    console.error("❌ Error loading profile:", error);
  }
}

// Load user stats
async function loadStats() {
  try {
    const response = await fetch('/api/stats');
    const data = await response.json();
    
    if (data.success) {
      document.getElementById('winsCount').innerText = data.stats.wins;
      document.getElementById('lossesCount').innerText = data.stats.losses;
      document.getElementById('drawsCount').innerText = data.stats.draws;
      document.getElementById('totalGames').innerText = data.stats.totalGames;
    }
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

// Load leaderboard
async function loadLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard');
    const data = await response.json();
    
    if (data.success) {
      const leaderboardDiv = document.getElementById('leaderboard');
      
      if (data.leaderboard.length === 0) {
        leaderboardDiv.innerHTML = '<p style="text-align: center; opacity: 0.7;">No games played yet</p>';
        return;
      }
      
      leaderboardDiv.innerHTML = data.leaderboard.map((player, index) => {
        let rankClass = '';
        let medal = '';
        
        if (index === 0) {
          rankClass = 'gold';
          medal = '🥇';
        } else if (index === 1) {
          rankClass = 'silver';
          medal = '🥈';
        } else if (index === 2) {
          rankClass = 'bronze';
          medal = '🥉';
        } else {
          medal = `${index + 1}.`;
        }
        
        return `
          <div class="leaderboard-item">
            <div class="leaderboard-rank ${rankClass}">${medal}</div>
            <div class="leaderboard-name">${player.username}</div>
            <div class="leaderboard-stats">
              <div class="leaderboard-stat">W: ${player.wins}</div>
              <div class="leaderboard-stat">L: ${player.losses}</div>
              <div class="leaderboard-stat">D: ${player.draws}</div>
              <div class="leaderboard-stat">${player.winRate}%</div>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (error) {
    console.error("Error loading leaderboard:", error);
    document.getElementById('leaderboard').innerHTML = '<p style="text-align: center; color: #ff6b6b;">Error loading leaderboard</p>';
  }
}

// Load profile on page load
window.addEventListener('load', () => {
  loadProfile();
});

// ============ CHAT FUNCTIONS ============

// Toggle chat box
function toggleChat() {
  if (chatBox.style.display === "none" || chatBox.style.display === "") {
    chatBox.style.display = "flex";
    scrollChatToBottom();
  } else {
    chatBox.style.display = "none";
  }
}

// Load chat history
async function loadChatHistory() {
  if (!opponentId) {
    console.error("❌ No opponent ID available");
    return;
  }
  
  try {
    const response = await fetch(`/api/chat-history/${opponentId}`);
    const data = await response.json();
    
    if (data.success) {
      chatMessages.innerHTML = "";
      
      if (data.messages.length === 0) {
        chatMessages.innerHTML = '<div class="chat-loading">No messages yet. Say hi! 👋</div>';
      } else {
        data.messages.forEach(msg => {
          displayChatMessage(msg, false); // false = don't scroll on load
        });
        scrollChatToBottom();
      }
    }
  } catch (error) {
    console.error("Error loading chat history:", error);
    chatMessages.innerHTML = '<div class="chat-loading">Failed to load chat history</div>';
  }
}

// Display a chat message
function displayChatMessage(data, shouldScroll = true) {
  console.log("💬 Displaying chat message:", data);
  console.log("Current user ID:", currentUserId);
  console.log("Message sender ID:", data.senderId);
  
  const isOwnMessage = data.senderId === currentUserId;
  console.log("Is own message:", isOwnMessage);
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${isOwnMessage ? 'own' : 'other'}`;
  
  const time = new Date(data.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  messageDiv.innerHTML = `
    ${!isOwnMessage ? `<div class="chat-message-header">${data.senderUsername}</div>` : ''}
    <div class="chat-message-text">${escapeHtml(data.message)}</div>
    <div class="chat-message-time">${time}</div>
  `;
  
  // Remove loading message if present
  const loadingMsg = chatMessages.querySelector('.chat-loading');
  if (loadingMsg) {
    loadingMsg.remove();
  }
  
  chatMessages.appendChild(messageDiv);
  
  if (shouldScroll) {
    scrollChatToBottom();
  }
}

// Send chat message
function sendChatMessage() {
  console.log("=== SEND CHAT MESSAGE CLICKED ===");
  
  const message = chatInput.value.trim();
  
  console.log("📤 Message value:", message);
  console.log("📤 Message length:", message.length);
  console.log("📤 Socket connected:", socket.connected);
  console.log("📤 Socket ID:", socket.id);
  console.log("📤 Current user ID:", currentUserId);
  console.log("📤 Opponent ID:", opponentId);
  
  if (!message) {
    console.log("❌ Empty message, not sending");
    return;
  }
  
  if (message.length > 500) {
    alert("Message is too long (max 500 characters)");
    return;
  }
  
  if (!socket.connected) {
    console.error("❌ Socket not connected!");
    alert("Not connected to server. Please refresh the page.");
    return;
  }
  
  console.log("✅ All checks passed. Emitting 'chatMessage' event");
  console.log("✅ Payload:", { message: message });
  
  socket.emit("chatMessage", { message: message });
  
  console.log("✅ Event emitted successfully");
  chatInput.value = "";
}

// Handle Enter key in chat input
function handleChatKeyPress(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

// Scroll chat to bottom
function scrollChatToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}