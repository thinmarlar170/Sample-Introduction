const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT) || 3000;
const pagePath = path.join(__dirname, "index.html");
const boardPath = path.join(__dirname, "board.html");
const messages = [
  { name: "Mar Lar", message: "Hello! I'm Mar Lar.", submittedAt: new Date().toISOString() },
  { name: "Mar Lar", message: "I am a student at KIC.", submittedAt: new Date().toISOString() },
  { name: "Mar Lar", message: "I enjoy reading and learning new things.", submittedAt: new Date().toISOString() }
];
const maxBodyBytes = 10 * 1024;

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname.replace(/\/+$/, "") || "/";

  if (request.method === "GET" && (pathname === "/" || pathname.endsWith("/index.html"))) {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream(pagePath).pipe(response);
    return;
  }

  if (request.method === "GET" && (pathname.endsWith("/board") || pathname.endsWith("/board.html"))) {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream(boardPath).pipe(response);
    return;
  }

  if (request.method === "GET" && pathname.endsWith("/messages")) {
    response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(messages));
    return;
  }

  if (request.method === "POST" && pathname.endsWith("/messages")) {
    let body = "";
    let bodyBytes = 0;

    request.on("data", (chunk) => {
      bodyBytes += chunk.length;
      if (bodyBytes > maxBodyBytes) {
        response.writeHead(413, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "The request is too large." }));
        request.destroy();
        return;
      }
      body += chunk;
    });

    request.on("end", () => {
      if (response.writableEnded) return;

      let payload;
      try {
        payload = JSON.parse(body);
      } catch {
        response.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Send a valid JSON request." }));
        return;
      }

      const name = typeof payload.name === "string" ? payload.name.trim() : "";
      const message = typeof payload.message === "string" ? payload.message.trim() : "";
      if (!name || !message || name.length > 100 || message.length > 5000) {
        response.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Enter a name and a message within the length limits." }));
        return;
      }

      const newMessage = { name, message, submittedAt: new Date().toISOString() };
      messages.push(newMessage);
      response.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ success: true, message: newMessage }));
    });
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ error: "Not found." }));
});

server.listen(port, () => {
  console.log(`Message server listening at http://localhost:${port}`);
});