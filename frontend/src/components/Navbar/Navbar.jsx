import "./Navbar.css";
import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <div className="navbar">

      <h2>Cyber Security Dashboard</h2>

      <div className="nav-right">

        <FaBell />

        <FaUserCircle />

      </div>

    </div>
  );
}

export default Navbar;