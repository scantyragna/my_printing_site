const store = require("./store");

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function isValidEmail(value) {
  if (!value || typeof value !== "string") return false;
  var trimmed = value.trim();
  if (!trimmed) return false;
  var at = trimmed.indexOf("@");
  var dot = trimmed.lastIndexOf(".");
  return at > 0 && dot > at + 1 && dot < trimmed.length - 1;
}

module.exports = (req, res) => {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST,OPTIONS");
    res.end();
    return;
  }

  const chunks = [];
  req.on("data", (c) => {
    chunks.push(Buffer.from(c));
  });

  req.on("end", () => {
    try {
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
      const email = String(body.email || "").trim();
      if (!isValidEmail(email)) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ ok: false, error: "Invalid email address" }));
        return;
      }
      const now = new Date().toISOString();
      if (!store.newsletter) {
        store.newsletter = [];
      }
      store.newsletter.push({ email, timestamp: now });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: false, error: "Failed to subscribe" }));
    }
  });
};

