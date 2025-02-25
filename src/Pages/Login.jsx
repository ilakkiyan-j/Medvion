import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Ensure correct CSS import

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { email, password },
        { withCredentials: true } // Required for handling sessions/cookies
      );

      if (response.status === 200) {
        const domainMatch = email.match(/\.(\w+)(?=@)/);
        if (domainMatch) {
          const domain = domainMatch[1];
          console.log(domain);

          if (domain === "pt") {
            navigate("/home"); // Navigate to Home for .pt domain
          } else if (domain === "dr") {
            navigate("/drHome"); // Navigate to drHome for .dr domain
          } else {
            navigate("/home"); // Default navigation if no specific match
          }
        } else {
          console.error("Invalid email format");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="outer">
      <div className="loginContainer">
        <img className="logo" src="./Medvion.png" alt="" />
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            className="inputField"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <label>Password:</label>
          <input
            type="password"
            className="inputField"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit" className="loginButton">Login</button>
          <a href="#" className="forgotPassword">Forgot Password?</a>
        </form>
      </div>
    </div>
  );
}
