import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logToFile } from "./utils/logger.js";
import { error } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Load commands dynamically
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  import(`./commands/${file}`)
    .then((command) => {
      client.commands.set(command.name, command);
      console.log(`Loaded command: ${file}`);
      logToFile(`Loaded command: ${file}`);
    })
    .catch((error) => {
      console.error(`Error loading command ${file}:`, error);
      logToFile(`Error loading command ${file}: ${error.message}`);
    });
}

// Load events dynamically
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  import(`./events/${file}`)
    .then((event) => {
      client.on(event.name, (...args) => event.execute(...args, client));
      console.log(`Loaded event: ${file}`);
      logToFile(`Loaded event: ${file}`);
    })
    .catch((error) => {
      console.error(`Error loading event ${file}:`, error);
      logToFile(`Error loading event ${file}: ${error.message}`);
    });
}

// Bot startup
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  logToFile(`Logged in as ${client.user.tag}`);
});

client.on("messageCreated", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(process.env.PREFIX)) return;

  const args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/);

  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    await client.commands.get(command).execute(message, args);
  } catch (error) {
    message.reply("There was an error trying to execute that command!");
    console.error(error);
    logToFile(error.message);
  }
});

// Express server
const app = express();

app.use(express.json());

app.get("/api/bot/ping", (req, res) => {
  res.status(200).json({ message: "Bot is running" });
  console.log("Bot is running");
  logToFile("Bot is running");
});

// Health check endpoint
const PORT = process.env.BOT_API_PORT || 3005;
const server = app.listen(PORT, () => {
  console.log(`Bot health check running on port ${PORT}`);
  logToFile(`Bot health check running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("Error starting server:", error);
  logToFile(`Error starting server: ${error.message}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
