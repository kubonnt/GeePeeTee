import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import botRoutes from "./routes/botRoutes.js";

dotenv.config(); // Load environment variables from a .env file
const app = express(); // Create an Express app
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Define a route for the bot
app.use("/api/bot", botRoutes);

const PORT = process.env.PORT || 3001; // Use the PORT environment variable or default to 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
