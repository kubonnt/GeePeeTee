import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { logToFile } from "./utils/logger.js";

dotenv.config();

// Express app
const app = express();
const PORT = process.env.API_PORT || 3001;

// Function to check if the bot is running
async function isBotRunning() {
  try {
    const response = await fetch(
      `http://localhost:${process.env.BOT_API_PORT || 3005}/api/bot/ping`
    );
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
    return res.status(400).json({ error: "Missing channelId or message" });
    logToFile("Missing channelId or message");
  }

  try {
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
      logToFile("Channel not found");
    }

    await channel.send(message);
    res.json({ success: true, message: "Message sent" });
  } catch (error) {
    console.error(error);
    logToFile(error.message);
    res.status(500).json({ error: "Error sending message" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  logToFile(`Server running on port ${PORT}`);
});
