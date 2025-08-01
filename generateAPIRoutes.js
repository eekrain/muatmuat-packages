const fs = require("fs/promises");
const readline = require("readline");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function parseEndpoint(input) {
  const [method, rawPath] = input.trim().split(/\s+/);
  const normalizedPath = rawPath.replace(/{/g, "[").replace(/}/g, "]"); // {id} -> [id]
  const parts = normalizedPath.split("/").filter(Boolean);
  return { method: method.toUpperCase(), pathParts: parts, original: rawPath };
}

function createRouteFile(method) {
  const verb = method.toLowerCase();
  return `
export async function ${verb}(req) {
  const response = await import('./mockResponse.js');
  return new Response(JSON.stringify(response.default), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
`.trim();
}

function createMockResponse(method, endpoint) {
  return `export default {
  message: 'Mock ${method} response for ${endpoint}'
};
`;
}

async function createMockFiles({ method, pathParts, original }) {
  const apiRoot = path.join("src", "app", "api");
  const fullPath = path.join(apiRoot, ...pathParts);
  const routePath = path.join(fullPath, "route.js");
  const mockPath = path.join(fullPath, "mockResponse.js");

  await fs.mkdir(fullPath, { recursive: true });
  await Promise.all([
    fs.writeFile(routePath, createRouteFile(method), "utf8"),
    fs.writeFile(mockPath, createMockResponse(method, original), "utf8"),
  ]);

  console.log(
    `✔ Created mock for ${method} ${original} → /${path.join(...pathParts)}`
  );
}

(async () => {
  console.log("🛠  API Mock Generator for Next.js");
  console.log('👉 Format each endpoint like: "GET /v1/users/{id}"');
  console.log('👉 Enter one per line. Type "done" to finish.\n');

  const endpoints = [];

  while (true) {
    const input = await ask("Enter endpoint: ");
    if (input.toLowerCase() === "done") break;
    try {
      const parsed = parseEndpoint(input);
      endpoints.push(parsed);
    } catch {
      console.log("❌ Invalid format. Try again.");
    }
  }

  for (const endpoint of endpoints) {
    await createMockFiles(endpoint);
  }

  console.log("\n🎉 All mock endpoints generated!");
  rl.close();
})();
