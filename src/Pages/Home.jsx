import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Home() {
  const [user, setUser] = useState(null);
  const [recent, setRecent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await axios.get("http://localhost:5000/session", {
          withCredentials: true,
        });

        setUser(response.data.user);
        fetchRecent(response.data.user.email);
      } catch (error) {
        console.error("Error fetching session:", error);
        navigate("/");
      }
    }

    async function fetchRecent() {
      try {
        const response = await axios.get("http://localhost:5000/recent", {
          withCredentials: true,
        });

        setRecent(response.data.recent);
      } catch (error) {
        console.error("Error fetching recent records:", error);
      }
    }

    fetchSession();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <h2>Good Morning {user?.name}!</h2>
        <p>Here&apos;s a quick update on your health and upcoming events</p>
      </div>
      <div>
        <p>Place you recently visited:</p>
        {recent ? (
          <>
            <p>Hospital Name: {recent.hospital}</p>
            <p>
              Visited On:{" "}
              {new Date(recent?.appointment_date).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
          </>
        ) : (
          <p>No recent records found.</p>
        )}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
