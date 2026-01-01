document.addEventListener("DOMContentLoaded", function () {
  var style = document.createElement("style");
  style.textContent = "\n.pw-chat-fab{position:fixed;right:1rem;bottom:1rem;width:56px;height:56px;border-radius:9999px;background:#FFA500;color:#111;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 25px rgba(0,0,0,0.3);cursor:pointer;z-index:60;border:none;outline:none;font-size:24px;transition:transform .15s ease,box-shadow .15s ease,background .15s ease}.pw-chat-fab:hover,.pw-chat-fab:focus-visible{transform:translateY(-1px);box-shadow:0 14px 30px rgba(0,0,0,0.35);background:#ffb733}.pw-chat-fab:active{transform:translateY(1px);box-shadow:0 8px 18px rgba(0,0,0,0.28);background:#ff9500}.pw-chat-fab:focus-visible{outline:2px solid #fff;outline-offset:2px}.pw-chat-fab-badge{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;border-radius:9999px;background:#FFA500;color:#111;font-size:11px;display:flex;align-items:center;justify-content:center;border:2px solid #111}\n.pw-chat-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4);display:none;z-index:50;align-items:flex-end;justify-content:center}\n.pw-chat-modal-backdrop.pw-open{display:flex}\n.pw-chat-modal{width:100%;max-width:380px;max-height:80vh;background:#0b1220;color:#f9fafb;border-radius:1rem 1rem 0 0;box-shadow:0 -10px 30px rgba(0,0,0,0.5);display:flex;flex-direction:column;transform:translateY(100%);opacity:0;transition:transform .2s ease-out,opacity .2s ease-out}\n.pw-chat-modal.pw-open{transform:translateY(0);opacity:1}\n@media (min-width:1024px){.pw-chat-modal-backdrop{align-items:center;justify-content:flex-end;padding-right:5rem;padding-bottom:5rem}.pw-chat-modal{border-radius:1rem;transform:scale(.95);opacity:0;max-height:520px}.pw-chat-modal.pw-open{transform:scale(1);opacity:1}}\n.pw-chat-header{display:flex;align-items:center;justify-content:space-between;padding:.75rem 1rem;border-bottom:1px solid rgba(148,163,184,0.4);background:#020617}\n.pw-chat-title{font-weight:700;font-size:.95rem}\n.pw-chat-controls{display:flex;gap:.5rem}\n.pw-chat-icon-button{width:28px;height:28px;border-radius:9999px;border:1px solid rgba(148,163,184,0.6);background:transparent;color:#e5e7eb;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;transition:background .15s ease,color .15s ease,border-color .15s ease}.pw-chat-icon-button:hover,.pw-chat-icon-button:focus-visible{background:#1e293b;color:#fff;border-color:#FFA500}.pw-chat-icon-button:focus-visible{outline:2px solid #fff;outline-offset:2px}\n.pw-chat-messages{flex:1;padding:.75rem 1rem;overflow-y:auto;background:#020617;font-size:.85rem;scrollbar-width:thin}\n.pw-chat-message-row{display:flex;margin-bottom:.5rem}\n.pw-chat-message-row.pw-sent{justify-content:flex-end}\n.pw-chat-message{max-width:80%;padding:.5rem .7rem;border-radius:.75rem;font-size:.85rem;line-height:1.2}\n.pw-chat-message.pw-sent{background:#FFA500;color:#111;border-bottom-right-radius:.2rem}\n.pw-chat-message.pw-received{background:#1e293b;color:#e5e7eb;border-bottom-left-radius:.2rem}\n.pw-chat-meta{margin-top:.15rem;font-size:.7rem;opacity:.75;display:flex;gap:.4rem;align-items:center}\n.pw-chat-status-failed{color:#fecaca}\n.pw-chat-status-sending{color:#fbbf24}\n.pw-chat-status-delivered{color:#bbf7d0}\n.pw-chat-input{border-top:1px solid rgba(148,163,184,0.4);padding:.5rem .75rem;background:#020617;display:flex;flex-direction:column;gap:.4rem}\n.pw-chat-input-row{display:flex;gap:.5rem;align-items:flex-end}\n.pw-chat-textarea{flex:1;min-height:42px;max-height:90px;resize:vertical;border-radius:.5rem;border:1px solid #1f2937;padding:.4rem .55rem;font-size:.85rem;background:#020617;color:#e5e7eb;outline:none}\n.pw-chat-textarea:focus-visible{border-color:#FFA500;box-shadow:0 0 0 1px #FFA500}\n.pw-chat-send-button{border:none;border-radius:.5rem;padding:.45rem .9rem;background:#FFA500;color:#111;font-weight:600;font-size:.85rem;cursor:pointer;display:flex;align-items:center;gap:.25rem;transition:background .15s ease,transform .15s ease,box-shadow .15s ease;box-shadow:0 8px 20px rgba(0,0,0,0.35)}\n.pw-chat-send-button:hover,.pw-chat-send-button:focus-visible{background:#ffb733;transform:translateY(-1px);box-shadow:0 12px 26px rgba(0,0,0,0.4)}\n.pw-chat-send-button:active{background:#ff9500;transform:translateY(1px);box-shadow:0 6px 14px rgba(0,0,0,0.32)}\n.pw-chat-send-button:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}\n.pw-chat-attachments{display:flex;gap:.4rem;align-items:center;justify-content:space-between;font-size:.7rem;color:#9ca3af}\n.pw-chat-pill-button{border-radius:9999px;border:1px solid #4b5563;background:transparent;color:#e5e7eb;font-size:.75rem;padding:.15rem .6rem;display:inline-flex;align-items:center;gap:.25rem;cursor:pointer;transition:background .15s ease,border-color .15s ease,color .15s ease}\n.pw-chat-pill-button:hover,.pw-chat-pill-button:focus-visible{background:#1f2937;border-color:#FFA500;color:#fff}\n.pw-chat-counter{margin-left:auto}\n.pw-chat-banner{font-size:.8rem;padding:.25rem .6rem;border-radius:.5rem;margin-bottom:.4rem;display:none}\n.pw-chat-banner.pw-error{display:flex;background:#7f1d1d;color:#fecaca}\n.pw-chat-banner.pw-info{display:flex;background:#0f172a;color:#bfdbfe}\n.pw-chat-hidden{display:none}\n";
  document.head.appendChild(style);

  style.textContent += "\n.pw-chat-admin-fab{right:4.5rem;bottom:1rem;background:#1f2937;color:#f9fafb;font-size:18px}\n";

  var fab = document.createElement("button");
  fab.className = "pw-chat-fab";
  fab.setAttribute("type", "button");
  fab.setAttribute("aria-label", "Open chat");
  fab.setAttribute("tabindex", "0");
  fab.innerHTML = "💬";

  var adminFab = document.createElement("button");
  adminFab.className = "pw-chat-fab pw-chat-admin-fab";
  adminFab.setAttribute("type", "button");
  adminFab.setAttribute("aria-label", "Open admin chat (staff only)");
  adminFab.setAttribute("tabindex", "0");
  adminFab.textContent = "🛠";

  var badge = document.createElement("span");
  badge.className = "pw-chat-fab-badge pw-chat-hidden";
  badge.textContent = "0";
  fab.appendChild(badge);

  var backdrop = document.createElement("div");
  backdrop.className = "pw-chat-modal-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-hidden", "true");

  var modal = document.createElement("div");
  modal.className = "pw-chat-modal";

  var header = document.createElement("div");
  header.className = "pw-chat-header";
  var title = document.createElement("div");
  title.className = "pw-chat-title";
  title.textContent = "Chat with PrintWell";
  var controls = document.createElement("div");
  controls.className = "pw-chat-controls";
  var minimizeBtn = document.createElement("button");
  minimizeBtn.className = "pw-chat-icon-button";
  minimizeBtn.type = "button";
  minimizeBtn.setAttribute("aria-label", "Minimize chat");
  minimizeBtn.textContent = "–";
  var closeBtn = document.createElement("button");
  closeBtn.className = "pw-chat-icon-button";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close chat");
  closeBtn.textContent = "×";
  controls.appendChild(minimizeBtn);
  controls.appendChild(closeBtn);
  header.appendChild(title);
  header.appendChild(controls);

  var banner = document.createElement("div");
  banner.className = "pw-chat-banner";

  var messages = document.createElement("div");
  messages.className = "pw-chat-messages";

  var inputWrapper = document.createElement("div");
  inputWrapper.className = "pw-chat-input";

  var inputRow = document.createElement("div");
  inputRow.className = "pw-chat-input-row";
  var textarea = document.createElement("textarea");
  textarea.className = "pw-chat-textarea";
  textarea.setAttribute("rows", "1");
  textarea.setAttribute("maxlength", "500");
  textarea.setAttribute("aria-label", "Type your message");
  var sendBtn = document.createElement("button");
  sendBtn.className = "pw-chat-send-button";
  sendBtn.type = "button";
  sendBtn.innerHTML = '<span>Send</span>';
  inputRow.appendChild(textarea);
  inputRow.appendChild(sendBtn);

  var attachRow = document.createElement("div");
  attachRow.className = "pw-chat-attachments";
  var leftAttach = document.createElement("div");
  var attachBtn = document.createElement("button");
  attachBtn.className = "pw-chat-pill-button";
  attachBtn.type = "button";
  attachBtn.innerHTML = "📎 Attach";
  var emojiBtn = document.createElement("button");
  emojiBtn.className = "pw-chat-pill-button";
  emojiBtn.type = "button";
  emojiBtn.innerHTML = "😊 Emoji";
  leftAttach.appendChild(attachBtn);
  leftAttach.appendChild(emojiBtn);
  var counter = document.createElement("div");
  counter.className = "pw-chat-counter";
  counter.textContent = "0 / 500";
  attachRow.appendChild(leftAttach);
  attachRow.appendChild(counter);

  inputWrapper.appendChild(banner);
  inputWrapper.appendChild(inputRow);
  inputWrapper.appendChild(attachRow);

  modal.appendChild(header);
  modal.appendChild(messages);
  modal.appendChild(inputWrapper);
  backdrop.appendChild(modal);

  document.body.appendChild(fab);
  document.body.appendChild(adminFab);
  document.body.appendChild(backdrop);

  var storagePrefix = "pw_chat_";
  var historyKey = storagePrefix + "history";
  var userKey = storagePrefix + "user_id";
  var unreadKey = storagePrefix + "unread";
  var lastReceivedKey = storagePrefix + "last_received";

  function getCookie(name) {
    var parts = document.cookie ? document.cookie.split(";") : [];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].trim();
      if (part.indexOf(name + "=") === 0) {
        return decodeURIComponent(part.slice(name.length + 1));
      }
    }
    return null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
  }

  var cookieUserId = getCookie("pw_user_id");
  var storedUserId = localStorage.getItem(userKey);
  var userId = cookieUserId || storedUserId;
  if (!userId) {
    userId = "user_" + Math.random().toString(36).slice(2, 10);
  }
  setCookie("pw_user_id", userId, 365);
  localStorage.setItem(userKey, userId);

  var lastReceived = localStorage.getItem(lastReceivedKey) || "";
  var apiBase = "";

  var messagesState = [];
  var unreadCount = 0;
  var rateWindowMs = 30000;
  var rateLimit = 10;
  var sentTimestamps = [];
  var pollIntervalMs = 5000;
  var pollTimer = null;

  function encryptPayload(obj) {
    return JSON.stringify(obj);
  }

  function decryptPayload(payload) {
    try {
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  }

  function formatTimestamp(isoString) {
    var d = new Date(isoString);
    if (isNaN(d.getTime())) d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes().toString().padStart(2, "0");
    var ampm = hours >= 12 ? "PM" : "AM";
    var h12 = hours % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ":" + minutes + " " + ampm;
  }

  function updateBadge() {
    if (unreadCount > 0) {
      badge.classList.remove("pw-chat-hidden");
      badge.textContent = unreadCount > 9 ? "9+" : String(unreadCount);
    } else {
      badge.classList.add("pw-chat-hidden");
    }
  }

  function persistState() {
    try {
      localStorage.setItem(historyKey, JSON.stringify(messagesState));
      localStorage.setItem(unreadKey, String(unreadCount));
      localStorage.setItem(lastReceivedKey, lastReceived || "");
    } catch (e) {}
  }

  function loadState() {
    try {
      var h = localStorage.getItem(historyKey);
      if (h) messagesState = JSON.parse(h);
    } catch (e) {
      messagesState = [];
    }
    try {
      var u = localStorage.getItem(unreadKey);
      if (u) unreadCount = parseInt(u, 10) || 0;
    } catch (e) {
      unreadCount = 0;
    }
    try {
      var lr = localStorage.getItem(lastReceivedKey);
      if (lr) lastReceived = lr;
    } catch (e) {}
    updateBadge();
  }

  function renderMessages() {
    messages.innerHTML = "";
    for (var i = 0; i < messagesState.length; i++) {
      var msg = messagesState[i];
      var row = document.createElement("div");
      row.className = "pw-chat-message-row " + (msg.direction === "sent" ? "pw-sent" : "");
      var bubble = document.createElement("div");
      bubble.className = "pw-chat-message " + (msg.direction === "sent" ? "pw-sent" : "pw-received");
      bubble.textContent = msg.content;
      var meta = document.createElement("div");
      meta.className = "pw-chat-meta";
      var ts = document.createElement("span");
      ts.textContent = formatTimestamp(msg.timestamp);
      meta.appendChild(ts);
      if (msg.direction === "sent") {
        var statusSpan = document.createElement("span");
        if (msg.status === "failed") {
          statusSpan.className = "pw-chat-status-failed";
          statusSpan.textContent = "Failed";
          var retryBtn = document.createElement("button");
          retryBtn.type = "button";
          retryBtn.className = "pw-chat-pill-button";
          retryBtn.textContent = "Retry";
          retryBtn.addEventListener("click", function (id) {
            return function () {
              resendMessage(id);
            };
          }(msg.id));
          meta.appendChild(retryBtn);
        } else if (msg.status === "sending") {
          statusSpan.className = "pw-chat-status-sending";
          statusSpan.textContent = "Sending";
        } else {
          statusSpan.className = "pw-chat-status-delivered";
          statusSpan.textContent = "Delivered";
        }
        meta.appendChild(statusSpan);
      }
      bubble.appendChild(meta);
      row.appendChild(bubble);
      messages.appendChild(row);
    }
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(msg) {
    messagesState.push(msg);
    if (msg.direction === "received" && backdrop.getAttribute("aria-hidden") === "true") {
      unreadCount += 1;
      updateBadge();
    }
    persistState();
    renderMessages();
  }

  function setBanner(type, text) {
    if (!text) {
      banner.className = "pw-chat-banner";
      banner.textContent = "";
      return;
    }
    if (type === "error") {
      banner.className = "pw-chat-banner pw-error";
    } else {
      banner.className = "pw-chat-banner pw-info";
    }
    banner.textContent = text;
  }

  function pruneRateWindow(now) {
    sentTimestamps = sentTimestamps.filter(function (t) {
      return now - t < rateWindowMs;
    });
  }

  function canSendNow() {
    var now = Date.now();
    pruneRateWindow(now);
    return sentTimestamps.length < rateLimit;
  }

  function recordSendTimestamp() {
    var now = Date.now();
    pruneRateWindow(now);
    sentTimestamps.push(now);
  }

  function markMessageStatus(id, status) {
    for (var i = 0; i < messagesState.length; i++) {
      if (messagesState[i].id === id) {
        messagesState[i].status = status;
        break;
      }
    }
    persistState();
    renderMessages();
  }

  function sendToApi(payload, originalId) {
    var targetId = originalId || payload.id;
    var endpoint = (apiBase || "") + "/api/chat";
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: payload.id,
        userId: userId,
        content: payload.content
      })
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Request failed");
        }
        return res.json();
      })
      .then(function () {
        markMessageStatus(targetId, "delivered");
      })
      .catch(function () {
        markMessageStatus(targetId, "failed");
        setBanner("error", "Message failed to send. Tap Retry to try again.");
      });
  }

  function handleIncoming(messagesArray) {
    if (!messagesArray || !messagesArray.length) return;
    for (var i = 0; i < messagesArray.length; i++) {
      var m = messagesArray[i];
      var ts = m.timestamp || new Date().toISOString();
      var msg = {
        id: m.id || "srv_" + Math.random().toString(36).slice(2),
        content: m.content,
        timestamp: ts,
        userId: m.userId || userId,
        status: "delivered",
        direction: "received"
      };
      if (!lastReceived || ts > lastReceived) {
        lastReceived = ts;
      }
      addMessage(msg);
    }
    persistState();
  }

  function pollReplies() {
    var url = (apiBase || "") + "/api/chat?userId=" + encodeURIComponent(userId);
    if (lastReceived) {
      url += "&since=" + encodeURIComponent(lastReceived);
    }
    fetch(url)
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Request failed");
        }
        return res.json();
      })
      .then(function (data) {
        if (data && data.messages) {
          handleIncoming(data.messages);
        }
      })
      .catch(function () {});
  }

  function sendChatMessage() {
    var raw = textarea.value;
    var trimmed = raw.replace(/\s+/g, " ").trim();
    if (!trimmed) {
      setBanner("error", "Please enter a message.");
      return;
    }
    if (!canSendNow()) {
      setBanner("error", "You are sending messages too quickly. Please wait a moment.");
      return;
    }
    setBanner("info", "");
    recordSendTimestamp();
    var msg = {
      id: "msg_" + Math.random().toString(36).slice(2, 10),
      content: trimmed,
      timestamp: new Date().toISOString(),
      userId: userId,
      status: "sending",
      direction: "sent"
    };
    addMessage(msg);
    textarea.value = "";
    counter.textContent = "0 / 500";
    var stored = {
      id: msg.id,
      content: msg.content,
      timestamp: msg.timestamp,
      userId: msg.userId,
      status: "sending",
      direction: "sent"
    };
    sendToApi(stored, msg.id);
  }

  function resendMessage(id) {
    var target = null;
    for (var i = 0; i < messagesState.length; i++) {
      if (messagesState[i].id === id) {
        target = messagesState[i];
        break;
      }
    }
    if (!target) return;
    if (!canSendNow()) {
      setBanner("error", "You are sending messages too quickly. Please wait a moment.");
      return;
    }
    recordSendTimestamp();
    target.status = "sending";
    persistState();
    renderMessages();
    var payload = {
      id: target.id,
      content: target.content,
      timestamp: new Date().toISOString(),
      userId: userId,
      status: "sending",
      direction: "sent"
    };
    sendToApi(payload, target.id);
  }

  function openChat() {
    backdrop.classList.add("pw-open");
    modal.classList.add("pw-open");
    backdrop.setAttribute("aria-hidden", "false");
    unreadCount = 0;
    updateBadge();
    persistState();
    setTimeout(function () {
      textarea.focus();
    }, 50);
    if (!pollTimer) {
      pollReplies();
      pollTimer = setInterval(pollReplies, pollIntervalMs);
    }
  }

  function closeChat() {
    backdrop.classList.remove("pw-open");
    modal.classList.remove("pw-open");
    backdrop.setAttribute("aria-hidden", "true");
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  function toggleChat() {
    if (backdrop.getAttribute("aria-hidden") === "true") {
      openChat();
    } else {
      closeChat();
    }
  }

  function openAdminChat() {
    window.open("admin.html", "_blank");
  }

  fab.addEventListener("click", function () {
    toggleChat();
  });
  fab.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleChat();
    }
  });
  closeBtn.addEventListener("click", function () {
    closeChat();
  });
  minimizeBtn.addEventListener("click", function () {
    closeChat();
  });
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) {
      closeChat();
    }
  });
  sendBtn.addEventListener("click", function () {
    sendChatMessage();
  });
  textarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
  textarea.addEventListener("input", function () {
    var length = textarea.value.length;
    counter.textContent = length + " / 500";
  });
  attachBtn.addEventListener("click", function () {
    setBanner("info", "Attachments are not configured yet.");
  });
  emojiBtn.addEventListener("click", function () {
    setBanner("info", "Emoji picker is not configured yet.");
  });

  adminFab.addEventListener("click", function () {
    toggleAdminChat();
  });
  adminFab.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleAdminChat();
    }
  });

  // --- ADMIN CHAT UI & LOGIC ---

  var adminBackdrop = document.createElement("div");
  adminBackdrop.className = "pw-chat-modal-backdrop"; // Reuse class
  adminBackdrop.setAttribute("role", "dialog");
  adminBackdrop.setAttribute("aria-modal", "true");
  adminBackdrop.setAttribute("aria-hidden", "true");
  adminBackdrop.style.zIndex = "61"; // Higher than user chat

  var adminModal = document.createElement("div");
  adminModal.className = "pw-chat-modal"; // Reuse class
  adminModal.style.maxWidth = "420px"; // Slightly wider for admin

  // Admin Header
  var adminHeader = document.createElement("div");
  adminHeader.className = "pw-chat-header";
  var adminTitle = document.createElement("div");
  adminTitle.className = "pw-chat-title";
  adminTitle.textContent = "Admin Dashboard";
  var adminControls = document.createElement("div");
  adminControls.className = "pw-chat-controls";
  var adminCloseBtn = document.createElement("button");
  adminCloseBtn.className = "pw-chat-icon-button";
  adminCloseBtn.textContent = "×";
  adminControls.appendChild(adminCloseBtn);
  adminHeader.appendChild(adminTitle);
  adminHeader.appendChild(adminControls);

  // Admin Body Container
  var adminBody = document.createElement("div");
  adminBody.style.flex = "1";
  adminBody.style.display = "flex";
  adminBody.style.flexDirection = "column";
  adminBody.style.overflow = "hidden";
  adminBody.style.padding = "1rem";

  // Login View
  var loginView = document.createElement("div");
  loginView.style.display = "flex";
  loginView.style.flexDirection = "column";
  loginView.style.gap = "0.75rem";
  
  var loginUser = document.createElement("input");
  loginUser.type = "text";
  loginUser.placeholder = "Username";
  loginUser.value = "admin@printwell";
  loginUser.className = "pw-chat-textarea"; // Reuse style
  loginUser.style.minHeight = "40px";
  
  var loginPass = document.createElement("input");
  loginPass.type = "password";
  loginPass.placeholder = "Password";
  loginPass.className = "pw-chat-textarea";
  loginPass.style.minHeight = "40px";

  var loginBtn = document.createElement("button");
  loginBtn.className = "pw-chat-send-button"; // Reuse style
  loginBtn.style.width = "100%";
  loginBtn.style.justifyContent = "center";
  loginBtn.textContent = "Sign In";

  var loginError = document.createElement("div");
  loginError.style.color = "#ef4444";
  loginError.style.fontSize = "0.8rem";
  loginError.style.minHeight = "1rem";

  loginView.appendChild(loginUser);
  loginView.appendChild(loginPass);
  loginView.appendChild(loginBtn);
  loginView.appendChild(loginError);

  // Dashboard View (hidden by default)
  var dashboardView = document.createElement("div");
  dashboardView.style.display = "none";
  dashboardView.style.flexDirection = "column";
  dashboardView.style.height = "100%";
  dashboardView.style.gap = "0.5rem";

  var dashTopBar = document.createElement("div");
  dashTopBar.style.display = "flex";
  dashTopBar.style.justifyContent = "space-between";
  dashTopBar.style.alignItems = "center";
  
  var dashRefresh = document.createElement("button");
  dashRefresh.className = "pw-chat-pill-button";
  dashRefresh.textContent = "Refresh";
  
  var dashLogout = document.createElement("button");
  dashLogout.className = "pw-chat-pill-button";
  dashLogout.textContent = "Log Out";
  
  dashTopBar.appendChild(dashRefresh);
  dashTopBar.appendChild(dashLogout);

  // User List (Conversations)
  var userList = document.createElement("div");
  userList.style.flex = "0 0 100px";
  userList.style.overflowY = "auto";
  userList.style.border = "1px solid rgba(148,163,184,0.2)";
  userList.style.borderRadius = "0.5rem";
  userList.style.padding = "0.25rem";
  userList.style.background = "rgba(0,0,0,0.2)";

  // Messages Area
  var adminMessages = document.createElement("div");
  adminMessages.className = "pw-chat-messages"; // Reuse class
  adminMessages.style.flex = "1";
  adminMessages.style.border = "1px solid rgba(148,163,184,0.2)";
  adminMessages.style.borderRadius = "0.5rem";
  adminMessages.style.marginBottom = "0.5rem";

  // Reply Input
  var adminInputRow = document.createElement("div");
  adminInputRow.className = "pw-chat-input-row"; // Reuse class
  
  var adminTextarea = document.createElement("textarea");
  adminTextarea.className = "pw-chat-textarea";
  adminTextarea.placeholder = "Reply...";
  adminTextarea.rows = 1;
  
  var adminSendBtn = document.createElement("button");
  adminSendBtn.className = "pw-chat-send-button";
  adminSendBtn.textContent = "Send";

  adminInputRow.appendChild(adminTextarea);
  adminInputRow.appendChild(adminSendBtn);

  dashboardView.appendChild(dashTopBar);
  dashboardView.appendChild(userList);
  dashboardView.appendChild(adminMessages);
  dashboardView.appendChild(adminInputRow);

  adminBody.appendChild(loginView);
  adminBody.appendChild(dashboardView);

  adminModal.appendChild(adminHeader);
  adminModal.appendChild(adminBody);
  adminBackdrop.appendChild(adminModal);
  document.body.appendChild(adminBackdrop);

  // Admin Logic
  var adminAuthKey = "pw_admin_session";
  var adminConversations = [];
  var adminActiveUserId = null;
  var adminPollTimer = null;

  function toggleAdminChat() {
    if (adminBackdrop.getAttribute("aria-hidden") === "true") {
      adminBackdrop.classList.add("pw-open");
      adminModal.classList.add("pw-open");
      adminBackdrop.setAttribute("aria-hidden", "false");
      checkAdminAuth();
    } else {
      adminBackdrop.classList.remove("pw-open");
      adminModal.classList.remove("pw-open");
      adminBackdrop.setAttribute("aria-hidden", "true");
      if (adminPollTimer) {
        clearInterval(adminPollTimer);
        adminPollTimer = null;
      }
    }
  }

  adminCloseBtn.addEventListener("click", toggleAdminChat);
  adminBackdrop.addEventListener("click", function(e) {
    if(e.target === adminBackdrop) toggleAdminChat();
  });

  function getAdminSession() {
    try {
      var s = JSON.parse(localStorage.getItem(adminAuthKey));
      if (s && s.expiresAt > Date.now()) return s;
      localStorage.removeItem(adminAuthKey); // Expired
      return null;
    } catch(e) { return null; }
  }

  function checkAdminAuth() {
    var session = getAdminSession();
    if (session) {
      loginView.style.display = "none";
      dashboardView.style.display = "flex";
      fetchAdminConversations();
      if (!adminPollTimer) {
        adminPollTimer = setInterval(fetchAdminConversations, 5000);
      }
    } else {
      loginView.style.display = "flex";
      dashboardView.style.display = "none";
      if (adminPollTimer) {
        clearInterval(adminPollTimer);
        adminPollTimer = null;
      }
    }
  }

  loginBtn.addEventListener("click", function() {
    var u = loginUser.value.trim();
    var p = loginPass.value;
    if (!u || !p) {
      loginError.textContent = "Enter username and password";
      return;
    }
    
    loginBtn.textContent = "Signing in...";
    loginBtn.disabled = true;
    loginError.textContent = "";

    fetch((apiBase || "") + "/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, password: p })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      loginBtn.textContent = "Sign In";
      loginBtn.disabled = false;
      
      if (data.ok) {
        localStorage.setItem(adminAuthKey, JSON.stringify({
          token: data.token,
          expiresAt: Date.now() + (data.expiresIn || 1800000)
        }));
        loginPass.value = "";
        checkAdminAuth();
      } else {
        loginError.textContent = data.error || "Login failed";
      }
    })
    .catch(function(e) {
      console.error(e);
      loginBtn.textContent = "Sign In";
      loginBtn.disabled = false;
      loginError.textContent = "Connection failed";
    });
  });

  dashLogout.addEventListener("click", function() {
    localStorage.removeItem(adminAuthKey);
    loginUser.value = "admin@printwell";
    loginPass.value = "";
    checkAdminAuth();
  });

  dashRefresh.addEventListener("click", fetchAdminConversations);

  function getAuthHeader() {
    var session = getAdminSession();
    return session ? "Bearer " + session.token : null;
  }

  function fetchAdminConversations() {
    var header = getAuthHeader();
    if (!header) {
      checkAdminAuth(); // Will switch to login view if expired
      return;
    }
    
    fetch((apiBase || "") + "/api/admin", {
      headers: { "Authorization": header }
    })
    .then(function(res) {
      if (res.status === 401) {
        localStorage.removeItem(adminAuthKey);
        checkAdminAuth();
        throw new Error("Unauthorized");
      }
      return res.json();
    })
    .then(function(data) {
      adminConversations = data.conversations || [];
      renderAdminUsers();
      if (adminActiveUserId) {
        renderAdminMessages();
      }
    })
    .catch(function(e) {
      // console.error(e);
    });
  }

  function renderAdminUsers() {
    userList.innerHTML = "";
    adminConversations.forEach(function(conv) {
      var d = document.createElement("div");
      d.style.padding = "4px 8px";
      d.style.cursor = "pointer";
      d.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
      d.style.fontSize = "12px";
      if (conv.userId === adminActiveUserId) {
        d.style.background = "#FB8C00";
        d.style.color = "#000";
      } else {
        d.style.background = "transparent";
        d.style.color = "#fff";
      }
      d.textContent = conv.userId + " (" + conv.messages.length + ")";
      d.addEventListener("click", function() {
        adminActiveUserId = conv.userId;
        renderAdminUsers();
        renderAdminMessages();
      });
      userList.appendChild(d);
    });
  }

  function renderAdminMessages() {
    adminMessages.innerHTML = "";
    var conv = adminConversations.find(function(c) { return c.userId === adminActiveUserId; });
    if (!conv) return;

    var msgs = conv.messages.slice().sort(function(a, b) {
      return a.timestamp.localeCompare(b.timestamp);
    });

    msgs.forEach(function(m) {
      var row = document.createElement("div");
      row.className = "pw-chat-message-row " + (m.from === "admin" ? "pw-sent" : "");
      
      var bubble = document.createElement("div");
      bubble.className = "pw-chat-message " + (m.from === "admin" ? "pw-sent" : "pw-received");
      bubble.textContent = m.content;
      
      var meta = document.createElement("div");
      meta.className = "pw-chat-meta";
      var ts = document.createElement("span");
      ts.textContent = formatTimestamp(m.timestamp);
      meta.appendChild(ts);
      
      bubble.appendChild(meta);
      row.appendChild(bubble);
      adminMessages.appendChild(row);
    });
    adminMessages.scrollTop = adminMessages.scrollHeight;
  }

  adminSendBtn.addEventListener("click", function() {
    var txt = adminTextarea.value.trim();
    if (!txt || !adminActiveUserId) return;
    
    var header = getAuthHeader();
    if (!header) return;

    fetch((apiBase || "") + "/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": header
      },
      body: JSON.stringify({
        userId: adminActiveUserId,
        content: txt
      })
    })
    .then(function(res) {
      if (res.ok) {
        adminTextarea.value = "";
        fetchAdminConversations();
      }
    });
  });



  loadState();
  renderMessages();
});
