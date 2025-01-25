import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

async function listModels() {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use API key from .env
      },
    });

    const data = await response.json();

    // Log the list of models available to your account
    console.log("Available Models:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

// Call the function to list models
listModels();
