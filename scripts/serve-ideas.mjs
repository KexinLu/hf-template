import { createServer } from "node:http";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd());
const publicDir = join(root, "public");
const ideasDir = join(root, "ideas");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);

    if (request.method === "GET" && url.pathname === "/api/ideas") {
      return sendJson(response, await readIdeas());
    }

    const removeMatch = url.pathname.match(/^\/api\/ideas\/([^/]+)\/([^/]+)$/);
    if (request.method === "DELETE" && removeMatch) {
      const fileName = decodeURIComponent(removeMatch[1]);
      const ideaId = decodeURIComponent(removeMatch[2]);
      return sendJson(response, await markRemoved(fileName, ideaId));
    }

    if (request.method === "GET") {
      return serveStatic(url.pathname, response);
    }

    response.writeHead(405, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Method not allowed" }));
  } catch (error) {
    response.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(port, host, () => {
  console.log(`Idea viewer: http://${host}:${port}`);
});

async function serveStatic(pathname, response) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const filePath = resolve(publicDir, `.${normalize(requested)}`);

  if (!filePath.startsWith(publicDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, { "content-type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

async function readIdeas() {
  let files = [];
  try {
    files = await readdir(ideasDir);
  } catch {
    return { files: [] };
  }

  const jsonFiles = files.filter((file) => file.endsWith(".json")).sort();
  const result = [];

  for (const file of jsonFiles) {
    const path = join(ideasDir, file);
    const raw = await readFile(path, "utf8");
    result.push({ name: file, data: JSON.parse(raw) });
  }

  return { files: result };
}

async function markRemoved(fileName, ideaId) {
  if (!/^[a-zA-Z0-9._-]+\.json$/.test(fileName)) {
    throw new Error("Invalid idea file name");
  }

  const path = resolve(ideasDir, fileName);
  if (!path.startsWith(ideasDir)) {
    throw new Error("Invalid idea path");
  }

  const data = JSON.parse(await readFile(path, "utf8"));
  const video = (data.videos || []).find((item) => item.id === ideaId);
  if (!video) {
    throw new Error(`No idea found for id ${ideaId}`);
  }

  video.status = "removed";
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
  return { ok: true, file: fileName, id: ideaId, status: "removed" };
}

function sendJson(response, payload) {
  response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}
