import "./Dashboard.css";

import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import CloudCard from "../../components/Cards/CloudCard";
import StatsCard from "../../components/StatsCard/StatsCard";
import ThreatChart from "../../components/ThreatChart/ThreatChart";

import { getThreats, getThreatStats } from "../../services/api";


function Dashboard() {

  const [threats, setThreats] = useState([]);

  const [stats, setStats] = useState({
    critical: 0,
    blocked: 0,
    monitoring: 0,
    secure: 0,
  });


  useEffect(() => {

    // Get all threats
    getThreats()
      .then((data) => {
        setThreats(data);
      })
      .catch((error) => {
        console.log("Error fetching threats:", error);
      });


    // Get threat statistics
    getThreatStats()
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.log("Error fetching threat statistics:", error);
      });

  }, []);


  // Calculate total number of threats
  const totalThreats =
    stats.critical +
    stats.blocked +
    stats.monitoring +
    stats.secure;


  return (

    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />


        {/* WELCOME SECTION */}

        <div className="welcome-section">

          <h1>
            Welcome, Administrator 👋
          </h1>

          <p>
            Monitor your multi-cloud infrastructure and detect cyber threats
            in real time.
          </p>

        </div>


        {/* STATISTICS */}

        <div className="stats-container">

          <StatsCard
            title="Total Threats"
            value={totalThreats}
            color="red"
          />


          <StatsCard
            title="Blocked IPs"
            value={stats.blocked}
            color="orange"
          />


          <StatsCard
            title="Under Monitoring"
            value={stats.monitoring}
            color="green"
          />


          <StatsCard
            title="Connected Clouds"
            value="3"
            color="blue"
          />

        </div>


        {/* THREAT CHART */}

        <ThreatChart />


        {/* CLOUD CARDS */}

        <div className="cards-grid">

          <CloudCard
            title="AWS"
            status="Simulated"
            color="#22C55E"
          />


          <CloudCard
            title="Azure"
            status="Simulated"
            color="#3B82F6"
          />


          <CloudCard
            title="Google Cloud"
            status="Simulated"
            color="#3B82F6"
          />


          <CloudCard
            title="Threats"
            status={`${threats.length} Active`}
            color="#EF4444"
          />

        </div>


      </div>

    </div>

  );

}


export default Dashboard;