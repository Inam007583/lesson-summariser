// Local test UI — not part of the component. Run: npm run demo
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { summariseLesson } from "../src/index.js";

const PORT = Number(process.env.PORT) || 3100;
const MAX_BYTES = 25 * 1024 * 1024;
const pagePath = new URL("./index.html", import.meta.url);

const server = createServer(async (req, res) => {
  const send = (status: number, body: unknown) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  };

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(await readFile(pagePath));
    return;
  }

  if (req.method === "POST" && req.url === "/api/summarise") {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_BYTES) return send(413, { error: "PDF is larger than 25 MB" });
      chunks.push(chunk);
    }
    const pdf = Buffer.concat(chunks);
    if (pdf.subarray(0, 5).toString() !== "%PDF-") return send(400, { error: "That file isn't a PDF" });

    const started = Date.now();
    try {
      const summary = await summariseLesson(pdf);
      return send(200, { summary, seconds: (Date.now() - started) / 1000 });
    } catch (err) {
      console.error(err);
      return send(500, { error: err instanceof Error ? err.message : String(err) });
    }
  }

  send(404, { error: "Not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Lesson summariser demo → http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) console.warn("⚠  OPENAI_API_KEY is not set — add it to .env");
});
