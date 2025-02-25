import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="outer-div">
      <nav className="nav-bar">
        <ul>
          {/* Logo Section */}
          <li className="logo">
            <Link to="/home">
              <img className="med" src="/Medvion.png" alt="Logo" />
            </Link>
          </li>

          {/* Navigation Links */}
          <li><Link to="/home">HOME</Link></li>
          <li><Link to="/records">RECORDS</Link></li>
          <li><Link to="/logs">LOGS</Link></li>

          {/* Profile Picture */}
          <li className="dp">
            <Link to="/profile">
              <img className="profile" src="/t2.png" alt="Profile" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
