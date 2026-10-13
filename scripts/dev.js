const { spawn, execSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

function freePort(port) {
  try {
    if (process.platform === "win32") {
      const output = execSync(`netstat -ano | findstr :${port}`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      });
      const lines = output.trim().split("\n");
      for (const line of lines) {
        if (!line.includes("LISTENING")) continue;
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid) && parseInt(pid, 10) > 0 && parseInt(pid, 10) !== process.pid) {
          try {
            execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
            console.log(`\x1b[33m[dev]\x1b[0m Released busy port ${port} (PID ${pid})`);
          } catch (_) {}
        }
      }
    } else {
      execSync(`lsof -t -i:${port} | xargs kill -9`, { stdio: "ignore" });
    }
  } catch (_) {
    // Port was already free
  }
}

// Automatically ensure required ports are completely free before launching
[4000, 3000, 3001].forEach(freePort);

const services = [
  {
    name: "backend",
    color: "\x1b[35m", // Magenta
    cwd: path.join(root, "teamconnect-backend"),
    args: ["run", "dev"],
  },
  {
    name: "frontend",
    color: "\x1b[36m", // Cyan
    cwd: path.join(root, "teamconnect-frontend"),
    args: ["run", "dev"],
  },
  {
    name: "admin",
    color: "\x1b[33m", // Yellow
    cwd: path.join(root, "teamconnect-admin"),
    args: ["run", "dev"],
  },
];

const RESET = "\x1b[0m";
const children = [];

console.log("\x1b[1m\x1b[32m🚀 Starting TeamConnect Ecosystem Services...\x1b[0m\n");
console.log("  • Backend API:        http://localhost:4000");
console.log("  • Frontend Portal:    http://localhost:3000");
console.log("  • Admin Governance:   http://localhost:3001\n");
console.log("\x1b[90m(Services will stay running in the background. Press Ctrl+C anytime to stop.)\x1b[0m\n");

services.forEach((service) => {
  const child = spawn(npmCmd, service.args, {
    cwd: service.cwd,
    stdio: ["pipe", "pipe", "pipe"],
    shell: process.platform === "win32",
  });

  children.push(child);

  child.stdout.on("data", (data) => {
    const lines = data.toString().trimEnd().split("\n");
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${service.color}[${service.name}]${RESET} ${line}`);
      }
    }
  });

  child.stderr.on("data", (data) => {
    const lines = data.toString().trimEnd().split("\n");
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${service.color}[${service.name}]${RESET} \x1b[31m${line}${RESET}`);
      }
    }
  });

  child.on("close", (code) => {
    if (code !== 0 && code !== null) {
      console.log(`${service.color}[${service.name}]${RESET} exited with code ${code}`);
    }
  });
});

let isCleaningUp = false;
function cleanup() {
  if (isCleaningUp) return;
  isCleaningUp = true;
  console.log("\n\x1b[33mGracefully stopping all services...\x1b[0m");
  for (const child of children) {
    try {
      if (process.platform === "win32" && child.pid) {
        spawn("taskkill", ["/pid", child.pid.toString(), "/f", "/t"], { stdio: "ignore" });
      } else if (child.pid) {
        child.kill("SIGTERM");
      }
    } catch (_) {}
  }
  setTimeout(() => process.exit(0), 400);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
