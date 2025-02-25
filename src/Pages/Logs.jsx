import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaEye, FaFileDownload, FaTrash, FaFileMedical, FaFileSignature, FaSearch } from "react-icons/fa";
import "./Logs.css";

export default function Logs() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Function to get an icon based on action type
  const getActionIcon = (action) => {
    if (action.includes("Viewed Profile")) return <FaEye style={{ color: "#007bff" }} />;
    if (action.includes("Downloaded Report")) return <FaFileDownload style={{ color: "#28a745" }} />;
    if (action.includes("Deleted Record")) return <FaTrash style={{ color: "#dc3545" }} />;
    if (action.includes("Created Record")) return <FaFileMedical style={{ color: "#6f42c1" }} />;
    if (action.includes("Updated Record")) return <FaFileSignature style={{ color: "#fd7e14" }} />;
    return null;
  };
  
  // Filter logs based on search term
  const filteredLogs = data.filter((log) =>
    log.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="logs-container">
        <h2 className="logs-title">Your Data Logs</h2>

        {/* Search Bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Log Entries */}
        {filteredLogs.length > 0 ? (
          <div className="space-y-3">
            {filteredLogs.map((log, idx) => (
              <div key={idx} className="log-entry">
                <div className="log-content">
                  {getActionIcon(log)}
                  <p>{log}</p>
                </div>
                <button className="report-button">Report</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No logs available.</p>
        )}
      </div>
    </>
  );
}
