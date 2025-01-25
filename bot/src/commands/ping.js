export const name = "ping";
export const description = "Replies with Pong!";
export const execute = (message, args) => {
  message.reply("Pong!");
};
