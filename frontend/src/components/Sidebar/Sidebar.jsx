import "./Sidebar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Link } from "react-router-dom";

import {
  FaHome,
  FaCloud,
  FaBug,
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt
} from "react-icons/fa";


function Sidebar() {

  return (

    <div className="sidebar">


      <div className="logo-section">

        <FaShieldAlt className="logo-icon" />

        <h2>
          ParkerTech
        </h2>

      </div>


      <ul>


        {/* Dashboard */}

        <li>

          <Link to="/dashboard">

            <FaHome />

            Dashboard

          </Link>

        </li>


        {/* Cloud Monitoring */}

        <li>

          <Link to="/cloud-monitoring">

            <FaCloud />

            Cloud Monitoring

          </Link>

        </li>


        {/* Threat Detection */}

        <li>

          <Link to="/threat-detection">

            <FaBug />

            Threat Detection

          </Link>

        </li>


        {/* Security Logs */}

        <li>

          <Link to="/security-logs">

            <FaFileAlt />

            Security Logs

          </Link>

        </li>


        {/* Automated Response */}

        <li>

          <Link to="/automated-response">

            <FaShieldAlt />

            Automated Response

          </Link>

        </li>


        {/* Reports */}

        <li>

          <Link to="/reports">

            <FaChartBar />

            Reports

          </Link>

        </li>


        {/* Settings */}

        <li>

          <Link to="/settings">

            <FaCog />

            Settings

          </Link>

        </li>


        {/* Logout */}

        <li>

          <button
            className="logout-btn"
            onClick={async () => {

              try {

                await signOut(auth);

                alert("Logged out successfully");

                window.location.href = "/";

              } catch (error) {

                console.log(error);

              }

            }}
          >

            <FaSignOutAlt />

            Logout

          </button>

        </li>


      </ul>


    </div>

  );

}


export default Sidebar;