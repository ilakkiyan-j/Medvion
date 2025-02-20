import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Logs() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await axios.get("http://localhost:5000/getlogs", {
          withCredentials: true,
        });

        setData(response.data.logs || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
        if (error.response?.status === 400) navigate("/");
      }
    }

    fetchLogs();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div>
        {data.length > 0 ? (
          data.map((log, idx) => <p key={idx}>{log}</p>)
        ) : (
          <p>No logs available.</p>
        )}
      </div>
    </>
  );
}
