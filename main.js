import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const isDev = process.env.NODE_ENV === "development";

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pyProc = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173"); // Vite dev server
  } else {
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }

  // Set up IPC handlers
  setupIpcHandlers(win);
}

app.whenReady().then(() => {
  // Start Python backend
  const backendPath = path.join(__dirname, "backend", "server.py");
  pyProc = spawn("python", [backendPath], {
    cwd: path.join(__dirname, "backend"),
  });

  pyProc.stdout.on("data", (data) => {
    console.log(`PYTHON STDOUT: ${data.toString()}`);
  });

  pyProc.stderr.on("data", (data) => {
    console.error(`PYTHON STDERR: ${data.toString()}`);
  });

  pyProc.on("error", (err) => {
    console.error("PYTHON PROCESS ERROR:", err);
  });

  pyProc.on("close", (code, signal) => {
    console.error(`PYTHON PROCESS CLOSED: code=${code}, signal=${signal}`);
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform === "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("will-quit", () => {
  if (pyProc) pyProc.kill();
});
