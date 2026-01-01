const http = require("http");
const chatHandler = require("../api/chat");
const adminHandler = require("../api/admin");

function makeReqRes(method, url, body, headers) {
  const req = new http.IncomingMessage();
  req.method = method;
  req.url = url;
  req.headers = headers || {};
  const res = new http.ServerResponse(req);
  let chunks = [];
  res.write = (chunk) => {
    chunks.push(Buffer.from(chunk));
    return true;
  };
  res.end = (chunk) => {
    if (chunk) chunks.push(Buffer.from(chunk));
    res.finished = true;
  };
  return { req, res, getBody: () => Buffer.concat(chunks).toString("utf8") };
}

function callHandler(handler, method, url, body, headers) {
  return new Promise((resolve) => {
    const { req, res, getBody } = makeReqRes(method, url, body, headers);
    const chunks = [];
    if (body) {
      chunks.push(Buffer.from(JSON.stringify(body)));
    }
    req.on = (event, cb) => {
      if (event === "data" && chunks.length) {
        cb(chunks[0]);
      }
      if (event === "end") {
        cb();
      }
    };
    handler(req, res);
    setTimeout(() => {
      resolve({ statusCode: res.statusCode, body: getBody() });
    }, 10);
  });
}

async function run() {
  const userId = "test_user";
  const postRes = await callHandler(
    chatHandler,
    "POST",
    "/api/chat",
    { userId, content: "Hello" },
    { "content-type": "application/json" }
  );
  console.log("POST /api/chat", postRes.statusCode, postRes.body.slice(0, 80));

  const getRes = await callHandler(
    chatHandler,
    "GET",
    "/api/chat?userId=" + encodeURIComponent(userId),
    null,
    {}
  );
  console.log("GET /api/chat", getRes.statusCode, getRes.body.slice(0, 80));

  const adminHeaders = {
    authorization: "Basic " + Buffer.from("admin:password").toString("base64")
  };
  const adminGet = await callHandler(
    adminHandler,
    "GET",
    "/api/admin",
    null,
    adminHeaders
  );
  console.log("GET /api/admin", adminGet.statusCode, adminGet.body.slice(0, 80));
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

