import axios from "axios";
import fs from "fs";

async function fetchPistonRuntimes() {
  try {
    // Fetch available runtimes from Piston API
    const response = await axios.get("https://emkc.org/api/v2/piston/runtimes");

    // Extract the runtime data
    const runtimes = response.data;

    // Convert runtime data to a string for writing
    const runtimesString = JSON.stringify(runtimes, null, 2);

    // Write the fetched runtimes to a text file named 'piston_runtimes.txt'
    fs.writeFile("piston_runtimes.txt", runtimesString, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("Runtimes saved successfully to piston_runtimes.txt");
      }
    });
  } catch (error) {
    console.error("Error fetching runtimes:", error.message);
  }
}

// Execute the function
fetchPistonRuntimes();
