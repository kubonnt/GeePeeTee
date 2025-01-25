import os from "os";

export const name = "info";
export const description = "Replies with cluster shard and node information!";
export const execute = async (message, args) => {
  try {
    const shardId = message.guild.shardId;
    const nodeVersion = process.version;
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    const cpuCount = os.cpus().length;

    const infoMessage = `
      **Shard ID:** ${shardId}
      **Node Version:** ${nodeVersion}
      **Memory Usage:** ${memoryUsage.toFixed(2)} MB
      **CPU Count:** ${cpuCount}
    `;

    await message.reply(infoMessage);
  } catch (error) {
    console.error("Error executing info command:", error);
    message.reply("There was an error trying to execute that command!");
  }
};
