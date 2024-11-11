// Import node-fetch to make HTTP requests to the OpenAI API
import fetch from "node-fetch";

// Set up command name and description
export const name = "chat";
export const description = "Ask ChatGPT a question!";
// This function will execute when the command is triggered
export async function execute(message, args) {
  // Join all arguments to form the question
  const question = args.join(" ");
  // If no question is provided, ask the user to include one
  if (!question) {
    return message.reply("Please ask a question for ChatGPT!");
  }
  try {
    // Make an HTTP POST request to OpenAI's API
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Specify the GPT model to use
        messages: [{ role: "user", content: question }], // Provide the user's question prompt
        max_tokens: 150, // Limit the response length to avoid excessive content
        temperature: 0.7, // Control creativity (0.0 = more predictable, 1.0 = more creative)
      }),
    });

    // Parse the response from OpenAI
    const data = await response.json();
    console.log("OpenAI API Response:", JSON.stringify(data, null, 2));

    // Check if the response contains choices and that choices[0] exists
    if (data.choices && data.choices.length > 0) {
      const reply = data.choices[0].text.trim(); // Extract the response text
      message.channel.send(reply);
    } else {
      // If choices is missing or empty, send an error message to the user
      message.channel.send(
        "Sorry, I could not understand the response from ChatGPT. Please try again."
      );
    }
  } catch (error) {
    // Log the error and send an error to the user
    console.error("Error fetching response from OpenAI:", error);
    message.reply("Sorry, something went wrong when connecting to ChatGPT.");
  }
}
