import { PermissionsBitField } from "discord.js";

export const name = "_kick";
export const description = "Kicks a member from the server";

export async function execute(message, args) {
  // Ensure the command is being run in a server (not in a DM)
  if (!message.guild) {
    return message.reply("This command can only be used in a server.");
  }

  // Check if the user has permission to kick
  if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
    return message.reply("You don't have permission to kick members.");
  }

  // Get the member to be kicked
  const member = message.mentions.members.first();
  if (!member) {
    return message.reply(
      "Please mention a valid member of this server to kick."
    );
  }

  // Check if the bot has permission to kick
  if (
    !message.guild.members.me.permissions.has(
      PermissionsBitField.Flags.KickMembers
    )
  ) {
    return message.reply("I don't have permission to kick members.");
  }

  try {
    // Kick the member
    await member.kick();
    message.channel.send(`${member.user.tag} has been kicked from the server.`);
  } catch (error) {
    console.error("Error kicking member:", error);
    message.reply("Sorry, I was unable to kick the member.");
  }
}
