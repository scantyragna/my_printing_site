document.addEventListener("DOMContentLoaded", function () {
  var loginBox = document.getElementById("admin-login");
  var panel = document.getElementById("admin-panel");
  var userInput = document.getElementById("admin-user");
  var passInput = document.getElementById("admin-pass");
  var loginBtn = document.getElementById("admin-login-btn");
  var loginError = document.getElementById("admin-login-error");
  var usersList = document.getElementById("admin-users");
  var activeUserEl = document.getElementById("admin-active-user");
  var messagesEl = document.getElementById("admin-messages");
  var replyInput = document.getElementById("admin-reply");
  var sendBtn = document.getElementById("admin-send");
  var refreshBtn = document.getElementById("admin-refresh");
  var logoutBtn = document.getElementById("admin-logout");
  var statusEl = document.getElementById("admin-status");

  var authKey = "pw_admin_auth";
  var activeUserId = null;
  var conversations = [];

  function getAuthHeader() {
    var stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(authKey) || "null");
    } catch (e) {
      stored = null;
    }
    if (!stored || !stored.user || !stored.pass) return null;
    var token = btoa(stored.user + ":" + stored.pass);
    return "Basic " + token;
  }

  function saveAuth(user, pass) {
    try {
      localStorage.setItem(authKey, JSON.stringify({ user: user, pass: pass }));
    } catch (e) {}
  }

  function clearAuth() {
    try {
      localStorage.removeItem(authKey);
    } catch (e) {}
  }

  function setStatus(text) {
    statusEl.textContent = text || "";
  }

  function renderUsers() {
    usersList.innerHTML = "";
    for (var i = 0; i < conversations.length; i++) {
      var conv = conversations[i];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "w-full text-left px-3 py-2 rounded-lg border text-xs mb-2 " +
        (conv.userId === activeUserId
          ? "bg-orange-500 border-orange-400 text-slate-950"
          : "bg-slate-900 border-slate-800 hover:border-slate-600");
      btn.textContent = conv.userId + " (" + conv.messages.length + ")";
      btn.addEventListener("click", function (id) {
        return function () {
          activeUserId = id;
          renderUsers();
          renderMessages();
        };
      }(conv.userId));
      usersList.appendChild(btn);
    }
  }

  function renderMessages() {
    messagesEl.innerHTML = "";
    if (!activeUserId) {
      activeUserEl.textContent = "";
      return;
    }
    activeUserEl.textContent = activeUserId;
    var selected = null;
    for (var i = 0; i < conversations.length; i++) {
      if (conversations[i].userId === activeUserId) {
        selected = conversations[i];
        break;
      }
    }
    if (!selected) return;
    var msgs = selected.messages.slice().sort(function (a, b) {
      return a.timestamp.localeCompare(b.timestamp);
    });
    for (var j = 0; j < msgs.length; j++) {
      var m = msgs[j];
      var row = document.createElement("div");
      row.className =
        "mb-2 flex " + (m.from === "admin" ? "justify-end" : "justify-start");
      var bubble = document.createElement("div");
      bubble.className =
        "max-w-[70%] px-3 py-2 rounded-lg text-xs " +
        (m.from === "admin" ? "bg-orange-500 text-slate-950" : "bg-slate-800");
      var who = document.createElement("div");
      who.className = "font-semibold mb-1";
      who.textContent = m.from === "admin" ? "Admin" : m.userId;
      var body = document.createElement("div");
      body.textContent = m.content;
      var ts = document.createElement("div");
      ts.className = "mt-1 text-[10px] text-slate-300";
      ts.textContent = m.timestamp;
      bubble.appendChild(who);
      bubble.appendChild(body);
      bubble.appendChild(ts);
      row.appendChild(bubble);
      messagesEl.appendChild(row);
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function fetchConversations() {
    var auth = getAuthHeader();
    if (!auth) {
      return;
    }
    setStatus("Loading conversations...");
    fetch("/api/admin", {
      method: "GET",
      headers: {
        Authorization: auth
      }
    })
      .then(function (res) {
        if (res.status === 401) {
          throw new Error("unauthorized");
        }
        if (!res.ok) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then(function (data) {
        conversations = data.conversations || [];
        if (!activeUserId && conversations.length) {
          activeUserId = conversations[0].userId;
        }
        renderUsers();
        renderMessages();
        setStatus("");
      })
      .catch(function (err) {
        if (err.message === "unauthorized") {
          clearAuth();
          panel.classList.add("hidden");
          loginBox.classList.remove("hidden");
          loginError.textContent = "Session expired. Please sign in again.";
        } else {
          setStatus("Failed to load conversations.");
        }
      });
  }

  function sendReply() {
    if (!activeUserId) {
      setStatus("Select a conversation first.");
      return;
    }
    var text = replyInput.value.replace(/\s+/g, " ").trim();
    if (!text) {
      setStatus("Enter a message to send.");
      return;
    }
    var auth = getAuthHeader();
    if (!auth) {
      setStatus("Not authenticated.");
      return;
    }
    setStatus("Sending...");
    fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth
      },
      body: JSON.stringify({
        userId: activeUserId,
        content: text
      })
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then(function () {
        replyInput.value = "";
        setStatus("Reply sent.");
        fetchConversations();
      })
      .catch(function () {
        setStatus("Failed to send reply.");
      });
  }

  loginBtn.addEventListener("click", function () {
    var user = userInput.value.trim();
    var pass = passInput.value;
    if (!user || !pass) {
      loginError.textContent = "Enter username and password.";
      return;
    }
    loginError.textContent = "";
    saveAuth(user, pass);
    panel.classList.remove("hidden");
    loginBox.classList.add("hidden");
    fetchConversations();
  });

  refreshBtn.addEventListener("click", function () {
    fetchConversations();
  });

  sendBtn.addEventListener("click", function () {
    sendReply();
  });

  replyInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      sendReply();
    }
  });

  logoutBtn.addEventListener("click", function () {
    clearAuth();
    panel.classList.add("hidden");
    loginBox.classList.remove("hidden");
    conversations = [];
    activeUserId = null;
    usersList.innerHTML = "";
    messagesEl.innerHTML = "";
    activeUserEl.textContent = "";
    statusEl.textContent = "";
  });

  var existingAuth = getAuthHeader();
  if (existingAuth) {
    loginBox.classList.add("hidden");
    panel.classList.remove("hidden");
    fetchConversations();
  }
});

