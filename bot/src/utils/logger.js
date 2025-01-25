import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log file path
const logDir = path.join(__dirname, "../logs");
const logPath = path.join(__dirname, "bot.log");

// Function to check if log file exists
function checkLogFile() {
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  if (!fs.existsSync(logPath)) {
    try {
      fs.writeFileSync(logPath, "", { flag: "wx" }, "utf8", (err) => {
        if (err && err.code !== "EEXIST") {
          console.error("Error creating log file:", err);
        }
      });
    } catch (error) {
      console.error("Error creating log file:", error);
    }
  }
}

// Ensure log file exists
checkLogFile();

// Function to log messages to a file
export function logToFile(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  // Append message to log file
  fs.appendFileSync(logPath, logMessage, "utf8", (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
}
