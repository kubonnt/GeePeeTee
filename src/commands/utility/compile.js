import axios from "axios";

export const name = "compile";
export const description =
  "Compiles and runs code in various programming languages using Piston API. Usage: !compile <language> <code>";

export async function execute(message, args) {
  if (args.length < 2) {
    return message.reply(
      "Please provide a programming language and code to compile. Usage: !compile <language> <code>"
    );
  }

  // Extract language and join the remaining arguments as the code
  const language = args[0].toLowerCase();
  let code = args.slice(1).join(" ");

  // Make sure to handle line breaks correctly (if passed as "\n" in Discord)
  code = code.replace(/\\n/g, "\n");

  // Define a mapping between languages and versions
  const languageVersions = {
    python: "3.10.0",
    javascript: "18.15.0",
    java: "15.0.2",
    c: "10.2.0",
    cpp: "10.2.0",
    rust: "1.68.2",
    csharp: "5.0.201", // Example version
  };

  if (!languageVersions[language]) {
    return message.reply(
      "Unsupported language. Supported languages are: python, javascript, java, c, cpp, rust, csharp."
    );
  }

  // Prepare the request payload for Piston
  const submission = {
    language: language,
    version: languageVersions[language],
    files: [
      {
        name: "main.rs", // Ensure proper file extension for Rust
        content: code,
      },
    ],
    stdin: "", // Optional standard input, leave empty for now
  };

  console.log("Final submission payload:", JSON.stringify(submission, null, 2));

  try {
    // Send the code to Piston API for compilation and execution
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      submission,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // Get the result from the response
    const result = response.data;

    if (result && result.run && result.run.output) {
      message.reply(`Output:\n${result.run.output}`);
    } else if (result && result.run && result.run.stderr) {
      message.reply(`Error Output:\n${result.run.stderr}`);
    } else {
      message.reply("No output generated or an error occurred.");
    }
  } catch (error) {
    console.error(
      "Error sending code to Piston:",
      error.response ? error.response.data : error.message
    );
    message.reply(
      "Sorry, there was an error sending the code for compilation."
    );
  }
}
