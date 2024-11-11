import { PermissionsBitField } from "discord.js";

export const name = "_ban";
export const description = "Bans a member from the server.";

export async function execute(message, args) {
  // Check if the user has permission to ban
  if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    return message.reply("You don't have permission to ban members.");
  }

  // Get the member to be banned
  const member = message.mentions.members.first();
  if (!member) {
    return message.reply(
      "Please mention a valid member of this server to ban."
    );
  }

  // Check if the bot has permission to ban
  if (
    !message.guild.members.me.permissions.has(
      PermissionsBitField.Flags.BanMembers
    )
  ) {
    return message.reply("I don't have permission to ban members.");
  }

  try {
    // Ban the member
    await member.ban();
    message.channel.send(`${member.user.tag} has been banned from the server.`);
  } catch (error) {
    console.error("Error banning member:", error);
    message.reply("Sorry, I was unable to ban the member.");
  }
}
