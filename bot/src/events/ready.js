export const name = "ready";

export async function execute(client) {
  console.log(`Logged in as ${client.user.tag} and ready to serve!`);
}
