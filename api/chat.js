const store = require("./store");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

module.exports = (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  const chunks = [];
  req.on("data", (c) => {
    chunks.push(Buffer.from(c));
  });

  req.on("end", () => {
    if (req.method === "POST") {
      try {
        const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
        const userId = String(body.userId || "").trim();
        const content = String(body.content || "").trim();
        if (!userId || !content) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "userId and content are required" }));
          return;
        }
        const now = new Date().toISOString();
        const message = {
          id: body.id || "msg_" + Math.random().toString(36).slice(2, 10),
          userId,
          from: "user",
          content,
          timestamp: now
        };
        if (!store.messagesByUser[userId]) {
          store.messagesByUser[userId] = [];
        }
        store.messagesByUser[userId].push(message);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ ok: true, message }));
      } catch (e) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Failed to process message" }));
      }
      return;
    }

    if (req.method === "GET") {
      const url = new URL(req.url, "http://localhost");
      const userId = String(url.searchParams.get("userId") || "").trim();
      const since = url.searchParams.get("since");
      if (!userId) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "userId is required" }));
        return;
      }
      const allMessages = store.messagesByUser[userId] || [];
      let filtered = allMessages;
      if (since) {
        filtered = allMessages.filter((m) => m.timestamp > since);
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true, messages: filtered }));
      return;
    }

    res.statusCode = 405;
    res.setHeader("Allow", "GET,POST,OPTIONS");
    res.end();
  });
};
