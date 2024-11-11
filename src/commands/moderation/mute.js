import { PermissionsBitField } from "discord.js";

export const name = "_mute";
export const description = "Mutes a member for a specified time (e.g., 10m).";

export async function execute(message, args) {
  // Check if the user has permission to mute
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    return message.reply("You don't have permission to mute members.");
  }

  // Get the member to be muted
  const member = message.mentions.members.first();
  if (!member) {
    return message.reply(
      "Please mention a valid member of this server to mute."
    );
  }

  // Check if the bot has permission to manage roles
  if (
    !message.guild.members.me.permissions.has(
      PermissionsBitField.Flags.ManageRoles
    )
  ) {
    return message.reply(
      "I don't have permission to manage roles and mute members."
    );
  }

  const muteDuration = args[1];
  if (!muteDuration) {
    return message.reply(
      "Please specify a duration to mute the member, e.g., `10m`."
    );
  }

  // Create or use a "Muted" role
  let muteRole = message.guild.roles.cache.find(
    (role) => role.name === "Muted"
  );
  if (!muteRole) {
    try {
      muteRole = await message.guild.roles.create({
        name: "Muted",
        color: "#808080",
        permissions: [],
      });
      // Prevent "Muted" role from sending messages in all channels
      message.guild.channels.cache.forEach(async (channel) => {
        await channel.permissionOverwrites.edit(muteRole, {
          SEND_MESSAGES: false,
          SPEAK: false,
        });
      });
    } catch (error) {
      console.error("Error creating mute role:", error);
      return message.reply("There was an error setting up the mute role.");
    }
  }

  // Add "Muted" role to the member
  try {
    await member.roles.add(muteRole);
    message.channel.send(
      `${member.user.tag} has been muted for ${muteDuration}.`
    );

    // Automatically remove the "Muted" role after the specified time
    setTimeout(async () => {
      await member.roles.remove(muteRole);
      message.channel.send(`${member.user.tag} has been unmuted.`);
    }, parseDuration(muteDuration));
  } catch (error) {
    console.error("Error muting member:", error);
    message.reply("Sorry, I was unable to mute the member.");
  }
}

function parseDuration(duration) {
  const match = duration.match(/(\d+)([smhd])/);
  if (!match) return null;

  const amount = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return amount * 1000; // seconds
    case "m":
      return amount * 60 * 1000; // minutes
    case "h":
      return amount * 60 * 60 * 1000; // hours
    case "d":
      return amount * 24 * 60 * 60 * 1000; // days
    default:
      return null;
  }
}
