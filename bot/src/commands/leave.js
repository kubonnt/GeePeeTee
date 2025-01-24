import { getVoiceConnection } from "@discordjs/voice";

export const name = "leave";
export const description = "Leaves the current voice channel. Usage: !leave";

export async function execute(message) {
  const connection = getVoiceConnection(message.guild.id);

  if (!connection) {
    return message.reply("I am not in any voice channel!");
  }

  connection.destroy();
  message.reply("I have left the voice channel.");
}
