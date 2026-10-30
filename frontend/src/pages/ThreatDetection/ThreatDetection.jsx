import "./ThreatDetection.css";

import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaBan,
  FaCheckCircle
} from "react-icons/fa";

import { useEffect, useState } from "react";

import {
  getThreats,
  getThreatStats
} from "../../services/api";


function ThreatDetection() {

  const [threats, setThreats] = useState([]);

  const [stats, setStats] = useState({
    critical: 0,
    blocked: 0,
    monitoring: 0,
    secure: 0,
  });


  useEffect(() => {

    // Fetch recent threats
    getThreats()
      .then((data) => {
        setThreats(data);
      })
      .catch((error) => {
        console.log("Error fetching threats:", error);
      });


    // Fetch threat statistics
    getThreatStats()
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.log("Error fetching threat stats:", error);
      });

  }, []);


  return (

    <div className="threat-page">

      {/* PAGE HEADER */}

      <div className="threat-header">

        <div>

          <h1>Threat Detection</h1>

          <p>
            Real-time cloud activity monitoring and rule-based threat detection 
          </p>

        </div>


        <div className="security-status">

          <FaShieldAlt />

          <span>
            System Protected
          </span>

        </div>

      </div>


      {/* THREAT STATISTICS */}

      <div className="threat-stats">


        {/* CRITICAL */}

        <div className="threat-stat critical">

          <FaExclamationTriangle />

          <div>

            <span>
              Critical Threats
            </span>

            <strong>
              {stats.critical}
            </strong>

          </div>

        </div>


        {/* BLOCKED */}

        <div className="threat-stat blocked">

          <FaBan />

          <div>

            <span>
              Blocked Attacks
            </span>

            <strong>
              {stats.blocked}
            </strong>

          </div>

        </div>


        {/* MONITORING */}

        <div className="threat-stat monitoring">

          <FaShieldAlt />

          <div>

            <span>
              Under Monitoring
            </span>

            <strong>
              {stats.monitoring}
            </strong>

          </div>

        </div>


        {/* SECURE */}

        <div className="threat-stat safe">

          <FaCheckCircle />

          <div>

            <span>
              Systems Secure
            </span>

            <strong>
              {stats.secure}
            </strong>

          </div>

        </div>


      </div>


      {/* RECENT THREATS TABLE */}

      <div className="threat-table-container">


        <div className="table-header">

          <h2>
            Recent Threats
          </h2>

          <span>
            Live Monitoring
          </span>

        </div>


        <table>

          <thead>

            <tr>

              <th>
                Threat
              </th>

              <th>
                Source IP
              </th>

              <th>
                Cloud
              </th>

              <th>
                Severity
              </th>

              <th>
                Status
              </th>

            </tr>

          </thead>


          <tbody>

            {threats.map((threat) => (

              <tr key={threat._id || threat.id}>

                <td>
                  {threat.type}
                </td>


                <td className="ip">
                  {threat.ip}
                </td>


                <td>
                  {threat.cloud}
                </td>


                <td>

                  <span
                    className={`severity ${threat.severity.toLowerCase()}`}
                  >

                    {threat.severity}

                  </span>

                </td>


                <td>

                  <span className="threat-status">

                    {threat.status}

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>


      </div>


    </div>

  );

}


export default ThreatDetection;