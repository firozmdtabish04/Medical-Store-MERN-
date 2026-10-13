const { spawn } = require("child_process");
const path = require("path");

console.log("\x1b[36m%s\x1b[0m", "=================================================");
console.log("\x1b[32m%s\x1b[0m", "  Starting MediFind (Backend + Client Frontend)  ");
console.log("\x1b[36m%s\x1b[0m", "=================================================");

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";

// 1. Start Backend Server
const backend = spawn(npmCmd, ["run", "dev"], {
  cwd: path.join(__dirname, "backend"),
  shell: true,
});

backend.stdout.on("data", (data) => {
  process.stdout.write(`\x1b[34m[BACKEND]\x1b[0m ${data}`);
});

backend.stderr.on("data", (data) => {
  process.stderr.write(`\x1b[31m[BACKEND ERR]\x1b[0m ${data}`);
});

backend.on("close", (code) => {
  console.log(`Backend process exited with code ${code}`);
});

// 2. Start Frontend Client
const client = spawn(npmCmd, ["run", "dev"], {
  cwd: path.join(__dirname, "client"),
  shell: true,
});

client.stdout.on("data", (data) => {
  process.stdout.write(`\x1b[32m[CLIENT]\x1b[0m ${data}`);
});

client.stderr.on("data", (data) => {
  process.stderr.write(`\x1b[31m[CLIENT ERR]\x1b[0m ${data}`);
});

client.on("close", (code) => {
  console.log(`Client process exited with code ${code}`);
});

process.on("SIGINT", () => {
  backend.kill();
  client.kill();
  process.exit();
});
