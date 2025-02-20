import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="outer-div">
      <nav className="nav-bar">
        <ul>
          <li className="logo">
            <img className="med" src="/Medvion.png" alt="Logo" />
          </li>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/records">Records</Link></li>
          <li><Link to="/logs">Logs</Link></li>
          <li className="dp">
          <Link to="/profile">
            <img className="profile" src="/u1.png" alt="Profile" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}


