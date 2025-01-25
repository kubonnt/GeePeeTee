import { joinVoiceChannel } from "@discordjs/voice";

export const name = "join";
export const description = "Joins your voice channel. Usage: !join";

export async function execute(message) {
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply("You need to be in a voice channel for me to join!");
  }

  try {
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });

    message.reply(`Joined the voice channel: ${voiceChannel.name}`);
  } catch (error) {
    console.error("Error joining voice channel:", error);
    message.reply(
      "Sorry, I encountered an issue while trying to join the voice channel."
    );
  }
}
