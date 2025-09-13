import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const isDev = process.env.NODE_ENV === "development";

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 100 words phrase for streaming
const wordPhrase =
  "The quick brown fox jumps over the lazy dog. This is a sample text that contains exactly one hundred words to demonstrate the word streaming functionality. Each word will be sent individually to create a realistic streaming effect. The application showcases how real-time data can be processed and displayed in an Electron application using IPC communication. This implementation provides a foundation for more complex streaming scenarios such as live transcription, real-time chat, or dynamic content updates. The words flow smoothly from the main process to the renderer process, creating an engaging user experience. This demonstrates the power of Electron's inter-process communication capabilities for building responsive desktop applications.";

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
    // win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }

  // Set up IPC handlers
  setupIpcHandlers(win);
}

let currentStreamInterval = null;

function setupIpcHandlers(win) {
  // Handle word streaming request
  ipcMain.handle("start-word-stream", async () => {
    console.log("Main: Starting new word stream");

    // Clear any existing stream first
    if (currentStreamInterval) {
      console.log("Main: Clearing existing interval");
      clearInterval(currentStreamInterval);
      currentStreamInterval = null;
    }

    const words = wordPhrase.split(" ");
    let currentIndex = 0;

    console.log(`Main: Starting stream with ${words.length} words`);

    currentStreamInterval = setInterval(() => {
      if (currentIndex < words.length) {
        console.log(
          `Main: Sending word ${currentIndex + 1}: "${words[currentIndex]}"`
        );
        win.webContents.send("word-stream", words[currentIndex]);
        currentIndex++;
      } else {
        console.log("Main: Stream complete, clearing interval");
        clearInterval(currentStreamInterval);
        currentStreamInterval = null;
        win.webContents.send("word-stream-complete");
      }
    }, 150);

    return { success: true };
  });

  // Handle stop streaming request
  ipcMain.handle("stop-word-stream", async () => {
    console.log("Main: Stop stream requested");
    if (currentStreamInterval) {
      clearInterval(currentStreamInterval);
      currentStreamInterval = null;
      console.log("Main: Stream stopped");
    }
    return { success: true };
  });
}

// Clean up intervals when app is closing
app.on("before-quit", () => {
  if (currentStreamInterval) {
    clearInterval(currentStreamInterval);
    currentStreamInterval = null;
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform === "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
