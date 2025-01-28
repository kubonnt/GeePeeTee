import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import { exec, spawn } from "child_process";
import { logToFile } from "./utils/logger.js";
import { error } from "console";

dotenv.config();

// Express app
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.API_PORT || 3001;

// Bot process
let botProcess = null;

// Function to check if the bot is running
async function isBotRunning() {
  try {
    const response = await fetch(
      `http://localhost:${process.env.BOT_API_PORT || 3005}/api/bot/ping`
    );

    if (!response.ok) {
      throw new Error("Bot is not running");
    }

    return response.ok;
  } catch (error) {
    console.error(error);
    logToFile(error.message);
    return false;
  }
}

// API endpoint to get bot status
app.get("/api/bot/status", async (req, res) => {
  const botRunning = await isBotRunning();
  res.json({ status: botRunning ? "Bot is running" : "Bot is not running" });
});

// API endpoint to send a message to a Discord channel
app.post("/api/bot/message", async (req, res) => {
  const { channelId, message } = req.body;
  if (!channelId || !message) {
    logToFile("Missing channelId or message");
    return res.status(400).json({ error: "Missing channelId or message" });
  }

  try {
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      logToFile("Channel not found");
      return res.status(404).json({ error: "Channel not found" });
    }

    await channel.send(message);
    res.json({ success: true, message: "Message sent" });
  } catch (error) {
    console.error(error);
    logToFile(error.message);
    res.status(500).json({ error: "Error sending message" });
  }
});

// Endpoint to start the bot
app.post("/api/bot/start", async (req, res) => {
  if (botProcess) {
    return res.status(400).json({ error: "Bot is already running" });
  }

  botProcess = exec(
    "npm run start:bot",
    { cwd: "../bot" },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting bot: ${error.message}`);
        logToFile(`Error starting bot: ${error.message}`);
        botProcess = null;
        return res.status(500).json({ error: "Error starting bot" });
      }

      console.log("Bot started, with PID:", botProcess.pid);
      logToFile(`Bot started with PID: ${botProcess.pid}`);
      res.json({ success: true, message: "Bot started" });
    }
  );
});

// Endpoint to stop the bot
app.post("/api/bot/stop", async (req, res) => {
  console.log("Stopping bot...");

  if (!botProcess) {
    return res.status(400).json({ error: "Bot is not running" });
  }

  try {
    console.log("Attempting to kill bot process...");

    if (process.platform === "win32") {
      exec(`taskkill /pid ${botProcess.pid} /T /F`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error stopping bot: ${error.message}`);
          logToFile(`Error stopping bot: ${error.message}`);
          return res.status(500).json({ error: "Error stopping bot" });
        }

        console.log("Bot stopped.");
        logToFile("Bot stopped.");
        botProcess = null;
        res.json({ success: true, message: "Bot stopped" });
      });
    } else {
      exec(`pkill -f "node.*src/bot.js"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error stopping bot: ${error.message}`);
          logToFile(`Error stopping bot: ${error.message}`);
          return res.status(500).json({ error: "Error stopping bot" });
        }

        console.log("Bot stopped.");
        logToFile("Bot stopped.");
        botProcess = null;
        res.json({ success: true, message: "Bot stopped" });
      });
    }
  } catch {
    console.error("Error stopping bot:", error.message);
    logToFile(`Error stopping bot: ${error.message}`);
    res.status(500).json({ error: "Error stopping bot" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  logToFile(`Server running on port ${PORT}`);
});
