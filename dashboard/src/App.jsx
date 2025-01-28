import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Checking...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBotStatus();
  }, []);

  const fetchBotStatus = () => {
    fetch("http://localhost:3001/api/bot/status")
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("Error retrieving status"));
  };

  const handleStartBot = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3002/api/bot/start", {
        method: "POST",
      });
      const result = await response.json();
      setStatus(result.message);
      fetchBotStatus();
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
      setStatus(result.message);
      fetchBotStatus();
    } catch (error) {
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
