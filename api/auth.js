const crypto = require('crypto');

// Configuration
const ADMIN_USER = "admin@printwell";
// SHA-256 hash of "printwell@123admin"
const ADMIN_PASS_HASH = "3f287e10cf17e278ffdcc66a895e8e6905406f2374f082e6b79ae0d7a691f236"; 

// In-memory session store
const sessions = {}; 
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

function handleLogin(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const chunks = [];
  req.on("data", chunk => chunks.push(chunk));
  req.on("end", () => {
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const { username, password } = body;

      const inputHash = crypto.createHash('sha256').update(password || "").digest('hex');

      if (username === ADMIN_USER && inputHash === ADMIN_PASS_HASH) {
        // Generate token
        const token = crypto.randomBytes(16).toString('hex');
        const expiresAt = Date.now() + SESSION_DURATION;
        
        sessions[token] = { expires: expiresAt };
        
        // Clean up old sessions
        const now = Date.now();
        Object.keys(sessions).forEach(k => {
          if (sessions[k].expires < now) delete sessions[k];
        });

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ 
          ok: true, 
          token, 
          expiresIn: SESSION_DURATION 
        }));
      } else {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Invalid credentials" }));
      }
    } catch (e) {
      res.statusCode = 400;
      res.end("Bad Request");
    }
  });
}

function checkAuth(req) {
  const header = req.headers["authorization"] || "";
  if (!header.startsWith("Bearer ")) return false;
  
  const token = header.slice(7);
  const session = sessions[token];
  
  if (!session) return false;
  
  if (Date.now() > session.expires) {
    delete sessions[token];
    return false;
  }
  
  // Slide expiration (optional, but good for active sessions)
  session.expires = Date.now() + SESSION_DURATION;
  return true;
}

module.exports = {
  handleLogin,
  checkAuth
};
