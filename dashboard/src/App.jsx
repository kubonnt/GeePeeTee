import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Checking...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBotStatus();
  }, []);

  const fetchBotStatus = async () => {
    try {
      const res = await fetch("http://localhost:3002/api/bot/status");
      if (!res.ok) {
        throw new Error("Error fetching bot status");
      }
      const data = await res.json();
      console.log("Fetched bot status:", data.status);
      setStatus(data.status);
    } catch (error) {
      console.error("Error fetching bot status:", error);
      setStatus("Error fetching bot status");
    }
  };

  const handleStartBot = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3002/api/bot/start", {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error starting bot");
      }

      setStatus(result.message);
      await fetchBotStatus();
    } catch (error) {
      console.error("Error starting bot:", error);
      setStatus("Error starting bot");
    } finally {
      setLoading(false);
    }
  };

  const handleStopBot = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3002/api/bot/stop", {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error stopping bot");
      }

      setStatus(result.message);
      await fetchBotStatus();
    } catch (error) {
      console.error("Error stopping bot:", error);
      setStatus("Error stopping bot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>GeePeeTee Dashboard</h1>
      <p>Bot Status: {status}</p>

      <div className="controls">
        <button onClick={handleStartBot} disabled={loading}>
          {loading ? "Starting..." : "Start Bot"}
        </button>
        <button onClick={handleStopBot} disabled={loading}>
          {loading ? "Stopping..." : "Stop Bot"}
        </button>
      </div>

      {loading && <p>Processing...</p>}
    </>
  );
}

export default App;
