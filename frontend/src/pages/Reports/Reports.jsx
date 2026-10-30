import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  FaFileAlt,
  FaDownload,
  FaShieldAlt
} from "react-icons/fa";

import {
  getThreats,
  getResponses
} from "../../services/api";

import "./Reports.css";


function Reports() {

  const [threats, setThreats] = useState([]);
  const [responses, setResponses] = useState([]);
  const [message, setMessage] = useState("");


  useEffect(() => {

    // Fetch threats from MongoDB

    getThreats()
      .then((data) => {
        setThreats(data);
      })
      .catch((error) => {
        console.log("Error fetching threats:", error);
      });


    // Fetch response actions from MongoDB

    getResponses()
      .then((data) => {
        setResponses(data);
      })
      .catch((error) => {
        console.log("Error fetching responses:", error);
      });

  }, []);


  /*
    ============================
    REPORT STATISTICS
    ============================
  */

  const totalSecurityEvents = threats.length;

  const threatsDetected = threats.length;

  const threatsBlocked = threats.filter(
    (threat) => threat.status === "Blocked"
  ).length;

  const reportsGenerated = 0;


  /*
    ============================
    THREATS BY CLOUD
    ============================
  */

  const cloudThreats = [
    {
      cloud: "AWS",
      threats: threats.filter(
        (threat) => threat.cloud === "AWS"
      ).length
    },

    {
      cloud: "Azure",
      threats: threats.filter(
        (threat) => threat.cloud === "Azure"
      ).length
    },

    {
      cloud: "GCP",
      threats: threats.filter(
        (threat) => threat.cloud === "GCP"
      ).length
    }
  ];


  /*
    ============================
    THREAT TREND
    ============================
  */

  const getDayName = (date) => {

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        weekday: "short"
      }
    );

  };


  const dayNames = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ];


  const threatTrend = dayNames.map((day) => {

    const count = threats.filter((threat) => {

      return getDayName(threat.detectedAt) === day;

    }).length;


    return {
      day,
      threats: count
    };

  });


  /*
    ============================
    REPORT GENERATION
    ============================
  */

  const handleGenerateReport = () => {

    setMessage(
      "Security report generated successfully!"
    );


    setTimeout(() => {
      setMessage("");
    }, 3000);

  };


  /*
    ============================
    DOWNLOAD REPORT
    ============================
  */

  const handleDownload = (reportName) => {

    const reportData = `
ParkerTech Solutions
Security Report
----------------------------

Report: ${reportName}

Total Security Events: ${totalSecurityEvents}
Threats Detected: ${threatsDetected}
Threats Blocked: ${threatsBlocked}
Response Actions: ${responses.length}

Generated: ${new Date().toLocaleString()}
`;


    const blob = new Blob(
      [reportData],
      { type: "text/plain" }
    );


    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      `${reportName.replace(/\s+/g, "_")}.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };


  return (

    <div className="reports-page">


      {/* HEADER */}

      <div className="reports-header">

        <div>

          <h1>
            Security Reports
          </h1>

          <p>
            Analyze security events and threat activity across
            your multi-cloud infrastructure.
          </p>

        </div>


        <button
          className="generate-button"
          onClick={handleGenerateReport}
        >

          <FaFileAlt />

          Generate Report

        </button>

      </div>



      {/* SUCCESS MESSAGE */}

      {message && (

        <div
          style={{
            background: "rgba(34, 197, 94, 0.12)",
            color: "#22c55e",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px"
          }}
        >

          {message}

        </div>

      )}



      {/* OVERVIEW */}

      <div className="report-overview">


        <div className="overview-card">

          <FaShieldAlt />

          <div>

            <span>
              Total Security Events
            </span>

            <strong>
              {totalSecurityEvents}
            </strong>

          </div>

        </div>



        <div className="overview-card">

          <FaFileAlt />

          <div>

            <span>
              Reports Generated
            </span>

            <strong>
              {reportsGenerated}
            </strong>

          </div>

        </div>



        <div className="overview-card">

          <FaShieldAlt />

          <div>

            <span>
              Threats Detected
            </span>

            <strong>
              {threatsDetected}
            </strong>

          </div>

        </div>



        <div className="overview-card">

          <FaShieldAlt />

          <div>

            <span>
              Threats Blocked
            </span>

            <strong>
              {threatsBlocked}
            </strong>

          </div>

        </div>


      </div>



      {/* CHARTS */}

      <div className="reports-grid">


        {/* THREAT TREND */}

        <div className="report-card">

          <div className="report-card-header">

            <div>

              <h2>
                Threat Trend
              </h2>

              <p>
                Threat activity based on detected events
              </p>

            </div>

          </div>


          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart
              data={threatTrend}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="day"
              />

              <YAxis
                allowDecimals={false}
              />

              <Tooltip />


              <Line
                type="monotone"
                dataKey="threats"
                stroke="#38BDF8"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>



        {/* CLOUD THREATS */}

        <div className="report-card">

          <div className="report-card-header">

            <div>

              <h2>
                Threats by Cloud
              </h2>

              <p>
                Distribution of detected threats
              </p>

            </div>

          </div>


          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={cloudThreats}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="cloud"
              />

              <YAxis
                allowDecimals={false}
              />

              <Tooltip />


              <Bar
                dataKey="threats"
                fill="#38BDF8"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


      </div>



      {/* REPORT HISTORY */}

      <div className="report-history">


        <div className="history-header">

          <h2>
            Report History
          </h2>

          <span>
            Recent Reports
          </span>

        </div>



        <div className="history-row">

          <div>

            <FaFileAlt />

            <div>

              <strong>
                Current Security Report
              </strong>

              <p>
                Generated from live database data
              </p>

            </div>

          </div>


          <button
            onClick={() =>
              handleDownload(
                "Current_Security_Report"
              )
            }
          >

            <FaDownload />

            Download

          </button>

        </div>



        <div className="history-row">

          <div>

            <FaFileAlt />

            <div>

              <strong>
                Threat Detection Report
              </strong>

              <p>
                {threatsDetected} threats detected
              </p>

            </div>

          </div>


          <button
            onClick={() =>
              handleDownload(
                "Threat_Detection_Report"
              )
            }
          >

            <FaDownload />

            Download

          </button>

        </div>



        <div className="history-row">

          <div>

            <FaFileAlt />

            <div>

              <strong>
                Response Activity Report
              </strong>

              <p>
                {responses.length} response actions recorded
              </p>

            </div>

          </div>


          <button
            onClick={() =>
              handleDownload(
                "Response_Activity_Report"
              )
            }
          >

            <FaDownload />

            Download

          </button>

        </div>


      </div>


    </div>

  );

}


export default Reports;