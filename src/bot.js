// Load environment variables from the .env file
import dotenv from "dotenv";
dotenv.config();

// Import necessary classes and functions from discord.js
import { Client, GatewayIntentBits } from "discord.js";

// File system (fs) and path modules to work with files and directories
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Convert import.meta.url to a path to use it in Node.js ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new instance of a Discord client with appropriate intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize a collection to store bot commands
client.commands = new Map();

// Define the path to the 'commands' directory
const commandsPath = path.join(__dirname, "commands");
// Read all the files in the 'commands' directory
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

// Loop through the command files and add them to the commands collection
for (const file of commandFiles) {
  const commandPath = path.join(commandsPath, file);
  const command = await import(`file://${commandPath}`);
  // Each command file should export an object with a `name` property
  client.commands.set(command.name, command);
}

// Event listener for when the bot becomes ready and successfully logs in
client.once("ready", () => {
  console.log(`Bot is logged in as ${client.user.tag}!`);
});

// Event listener for message creation (when user sends a message)
client.on("messageCreate", (message) => {
  // Ignore messages from other bots to avoid loops
  if (message.author.bot) return;

  // Define a prefix for bot commands (in this case, '!')
  const prefix = "!";

  // Ignore messages that do not start with the prefix
  if (!message.content.startsWith(prefix)) return;

  // Split the message into command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Find the command in the commands collection
  const command = client.commands.get(commandName);

  // If the command does not exist, return
  if (!command) return;

  // Execute the command and handle any errors that might occur
  try {
    command.execute(message, args);
  } catch (error) {
    console.error("Error executing command:", error);
    message.reply("There was an error trying to execute that command!");
  }
});

// // Define the path to the 'events' directory
// const eventsPath = path.join(path.resolve(), "src", "events");
// // Read all the files in the 'events' directory
// const eventFiles = fs
//   .readdirSync(eventsPath)
//   .filter((file) => file.endsWith(".js"));

// // Loop through event files and register them with the client
// for (const file of eventFiles) {
//   const event = require(path.join(eventsPath, file));
//   // Check if the event is only supposed to be executed once
//   if (event.once) {
//     // If so, use `client.once()` to register it
//     client.once(event.name, (...args) => event.execute(...args, client));
//   } else {
//     // Otherwise, register it as a recurring event using `client.on()`
//     client.on(event.name, (...args) => event.execute(...args, client));
//   }
// }

// Log in to Discord using the bot token from the environment varianles
client.login(process.env.DISCORD_BOT_TOKEN);
