import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
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

client.login(process.env.DISCORD_BOT_TOKEN);
