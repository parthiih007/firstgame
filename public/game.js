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

buttons.forEach(btn => btn.disabled = true);

socket.on("connect", () => {
  console.log("🟢 Connected:", socket.id);
});

socket.on("playerInfo", data => {
  username = data.username;
  usernameDisplay.innerText = `👤 ${username}`;
  loadProfile();
});

socket.on("matchFound", data => {
  console.log("🎯 Match found:", data);
  
  opponentData = data.opponent;
  opponentId = data.opponentId;
  
  opponentCard.style.display = "block";
  document.getElementById("opponentName").innerText = opponentData.username || "Unknown";
  document.getElementById("opponentEmail").innerText = opponentData.email || "";
  document.getElementById("opponentWins").innerText = opponentData.wins || 0;
  document.getElementById("opponentLosses").innerText = opponentData.losses || 0;
  document.getElementById("opponentDraws").innerText = opponentData.draws || 0;
  
  message.innerText = `Matched with ${opponentData.username}!`;
  
  loadChatHistory();
});

socket.on("playerNumber", num => {
  playerNumber = num;
  if (num === 1) {
    message.innerText = "Waiting for opponent...";
    opponentCard.style.display = "none";
  }
});

socket.on("startGame", () => {
  message.innerText = `Playing against ${opponentData?.username || "opponent"}!`;
  buttons.forEach(btn => btn.disabled = false);
  result.innerHTML = "";
});

socket.on("result", data => {
  if (!playerNumber) return;

  const yourMove = (playerNumber === 1) ? data.p1 : data.p2;
  const opponentMove = (playerNumber === 1) ? data.p2 : data.p1;
  const opponentName = opponentData?.username || "Opponent";

  let outcome = "";
  let emoji = "";
  
  if (data.winner === 0) {
    outcome = "Draw!";
    emoji = "😐";
  } else if (data.winner === playerNumber) {
    outcome = "You Win!";
    emoji = "🎉";
  } else {
    outcome = "You Lose!";
    emoji = "❌";
  }

  result.innerHTML = `
    <div style="font-size: 24px; margin-bottom: 10px;">${emoji}</div>
    🧍 Your Move: <b>${yourMove}</b><br>
    🤝 ${opponentName}'s Move: <b>${opponentMove}</b><br>
    <div style="font-size: 20px; margin-top: 10px;"><b>${outcome}</b></div>
  `;

  buttons.forEach(btn => btn.disabled = false);
  message.innerText = `Playing against ${opponentName}!`;
  
  setTimeout(() => {
    loadStats();
    loadProfile();
  }, 1000);
});

socket.on("message", msg => {
  message.innerText = msg;
  
  if (msg.includes("disconnected") || msg.includes("Waiting")) {
    buttons.forEach(btn => btn.disabled = true);
    result.innerHTML = "";
    opponentCard.style.display = "none";
    chatBox.style.display = "none";
    opponentData = null;
    opponentId = null;
  }
});

socket.on("chatMessage", data => {
  console.log("💬 Received:", data);
  displayChatMessage(data);
});

socket.on("error", err => {
  console.error("❌ Error:", err);
  alert("Error: " + err);
});

socket.on("unauthorized", () => {
  window.location.href = "/login.html";
});

socket.on("disconnect", () => {
  message.innerText = "Connection lost...";
  buttons.forEach(btn => btn.disabled = true);
  opponentCard.style.display = "none";
});

function play(choice) {
  if (!playerNumber) {
    alert("Error: Not connected properly. Please refresh.");
    return;
  }
  
  buttons.forEach(btn => btn.disabled = true);
  message.innerText = "Waiting for opponent...";
  result.innerHTML = "<div style='opacity: 0.5;'>⏳ Waiting...</div>";
  socket.emit("move", choice);
}

function toggleProfile() {
  profileModal.style.display = profileModal.style.display === "block" ? "none" : "block";
  if (profileModal.style.display === "block") loadProfile();
}

function toggleStats() {
  statsModal.style.display = statsModal.style.display === "block" ? "none" : "block";
  if (statsModal.style.display === "block") {
    loadStats();
    loadLeaderboard();
  }
}

function toggleChat() {
  if (chatBox.style.display === "none" || chatBox.style.display === "") {
    chatBox.style.display = "flex";
    scrollChatToBottom();
  } else {
    chatBox.style.display = "none";
  }
}

window.onclick = function(event) {
  if (event.target === statsModal) statsModal.style.display = "none";
  if (event.target === profileModal) profileModal.style.display = "none";
}

async function loadProfile() {
  try {
    const response = await fetch('/api/profile');
    const data = await response.json();
    
    if (data.success && data.profile) {
      const profile = data.profile;
      currentUserId = profile._id || profile.userId;
      
      document.getElementById('profileUsername').innerText = profile.username || '-';
      document.getElementById('profileEmail').innerText = profile.email || '-';
      document.getElementById('profileTotalGames').innerText = profile.totalGames || 0;
      document.getElementById('profileWins').innerText = profile.wins || 0;
      document.getElementById('profileLosses').innerText = profile.losses || 0;
      document.getElementById('profileDraws').innerText = profile.draws || 0;
      
      if (profile.memberSince) {
        const date = new Date(profile.memberSince);
        document.getElementById('profileMemberSince').innerText = date.toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        });
      }
      
      return profile;
    }
  } catch (error) {
    console.error("Profile error:", error);
  }
}

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
    console.error("Stats error:", error);
  }
}

async function loadLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard');
    const data = await response.json();
    
    if (data.success) {
      const div = document.getElementById('leaderboard');
      
      if (data.leaderboard.length === 0) {
        div.innerHTML = '<p style="text-align: center; opacity: 0.7;">No games yet</p>';
        return;
      }
      
      div.innerHTML = data.leaderboard.map((player, index) => {
        let medal = '';
        let rankClass = '';
        
        if (index === 0) { medal = '🥇'; rankClass = 'gold'; }
        else if (index === 1) { medal = '🥈'; rankClass = 'silver'; }
        else if (index === 2) { medal = '🥉'; rankClass = 'bronze'; }
        else medal = `${index + 1}.`;
        
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
    console.error("Leaderboard error:", error);
  }
}

async function loadChatHistory() {
  if (!opponentId) return;
  
  try {
    const response = await fetch(`/api/chat-history/${opponentId}`);
    const data = await response.json();
    
    if (data.success) {
      chatMessages.innerHTML = "";
      
      if (data.messages.length === 0) {
        chatMessages.innerHTML = '<div class="chat-loading">No messages yet. Say hi! 👋</div>';
      } else {
        data.messages.forEach(msg => displayChatMessage(msg, false));
        scrollChatToBottom();
      }
    }
  } catch (error) {
    console.error("Chat history error:", error);
  }
}

function displayChatMessage(data, shouldScroll = true) {
  const isOwn = data.senderId === currentUserId;
  const div = document.createElement('div');
  div.className = `chat-message ${isOwn ? 'own' : 'other'}`;
  
  const time = new Date(data.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });
  
  div.innerHTML = `
    ${!isOwn ? `<div class="chat-message-header">${data.senderUsername}</div>` : ''}
    <div class="chat-message-text">${escapeHtml(data.message)}</div>
    <div class="chat-message-time">${time}</div>
  `;
  
  const loading = chatMessages.querySelector('.chat-loading');
  if (loading) loading.remove();
  
  chatMessages.appendChild(div);
  
  if (shouldScroll) scrollChatToBottom();
}

function sendChatMessage() {
  const msg = chatInput.value.trim();
  
  console.log("📤 Sending:", msg);
  
  if (!msg) return;
  if (msg.length > 500) {
    alert("Message too long (max 500 chars)");
    return;
  }
  
  socket.emit("chatMessage", { message: msg });
  chatInput.value = "";
}

function handleChatKeyPress(event) {
  if (event.key === 'Enter') sendChatMessage();
}

function scrollChatToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.addEventListener('load', () => {
  loadProfile();
});