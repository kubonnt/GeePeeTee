export const name = "_warn";
export const description = "Warns a member.";

const warnings = {}; // This is a simple in-memory store, can be replaced with a database

export async function execute(message, args) {
  // Check if the user has permission to warn
  if (!message.member.permissions.has("KICK_MEMBERS")) {
    return message.reply("You don't have permission to warn members.");
  }

  // Get the member to be warned
  const member = message.mentions.members.first();
  if (!member) {
    return message.reply(
      "Please mention a valid member of this server to warn."
    );
  }

  // Warn the member
  if (!warnings[member.id]) {
    warnings[member.id] = [];
  }

  const warningMessage = args.slice(1).join(" ") || "No reason provided";
  warnings[member.id].push({ message: warningMessage, date: new Date() });

  message.channel.send(
    `${member.user.tag} has been warned. Reason: ${warningMessage}`
  );
}
