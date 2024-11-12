import axios from "axios";

export const name = "_compile";
export const description =
  "Compiles and runs code in various programming languages. Usage: !compile <language> <code>";

export async function execute(message, args) {
  // Check if the user provided the required arguments
  if (args.length < 2) {
    return message.reply(
      "Please provide a programming language and code to compile. Usage: !compile <language> <code>"
    );
  }

  const language = args[0].toLowerCase(); // Get the language argument
  const code = args.slice(1).join(" "); // Join the rest of the args as the code to compile

  // Define a mapping between user-friendly language names and Judge0 language IDs
  const languages = {
    python: 71,
    javascript: 63,
    java: 62,
    c: 50,
    cpp: 54,
    ruby: 72,
    csharp: 51,
    rust: 73,
    // Add more language IDs from Judge0 documentation if needed
  };

  // Check if the provided language is supported
  if (!languages[language]) {
    return message.reply(
      "Unsupported language. Supported languages are: python, javascript, java, c, cpp, ruby, csharp, rust."
    );
  }

  // Prepare the request payload for Judge0
  const submission = {
    source_code: code,
    language_id: languages[language],
    stdin: "",
  };

  console.log("Language:", languages[language]);
  console.log("Code:", code);
  console.log("Submission Payload:", submission);

  try {
    // Send the code to Judge0 API for compilation
    const response = await axios.post(
      "https://ce.judge0.com/submissions/?base64_encoded=false&wait=false",
      submission,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Get the token to check the result later
    const token = response.data.token;

    // Wait for a short while before checking the result (because it may take a few moments to process)
    setTimeout(async () => {
      try {
        // Fetch the result using the token
        const resultResponse = await axios.get(
          `https://api.judge0.com/submissions/${token}?base64_encoded=false`
        );
        const result = resultResponse.data;

        // Check if there was an error
        if (result.status && result.status.description !== "Accepted") {
          message.reply(
            `Error: ${result.status.description}\nMessage: ${
              result.stderr || "No additional error details."
            }`
          );
        } else {
          // Send the output of the compiled code
          message.reply(`Output:\n${result.stdout || "No output generated."}`);
        }
      } catch (error) {
        console.error("Error fetching compilation result:", error);
        message.reply(
          "Sorry, there was an error fetching the compilation result."
        );
      }
    }, 3000); // Wait for 3 seconds to let the compilation process complete
  } catch (error) {
    console.error("Error sending code to Judge0:", error);
    message.reply(
      "Sorry, there was an error sending the code for compilation."
    );
  }
}
