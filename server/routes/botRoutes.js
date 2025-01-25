import express from "express";
import fetch from "node-fetch";

const router = express.Router();
const BOT_API_URL = process.env.BOT_API_URL || "http://localhost:3005/api/bot";

// Function to check if the bot is running
async function isBotRunning() {
  try {
    const response = await fetch(`${BOT_API_URL}/ping`);
    if (!response.ok) throw new Error("Bot is not running");
    const data = await response.json();
    return data.message === "Bot is running";
  } catch (error) {
    console.error("Error checking bot status:", error.message);
    return false;
  }
}

// API endpoint to get bot status
router.get("/status", async (req, res) => {
  const botRunning = await isBotRunning();
  res.json({ status: botRunning ? "Bot is running" : "Bot is not running" });
});

// POST route to send a message to a Discord channel
router.post("/message", async (req, res) => {
  const { channelId, message } = req.body;

  if (!channelId || !message) {
    return res.status(400).json({ error: "Missing channelId or message" });
  }

  try {
    const response = await fetch(`${BOT_API_URL}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId, message }),
    });

    if (!response.ok) {
      throw new Error("Error sending message");
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ error: "Error sending message" });
  }
});

export default router;
