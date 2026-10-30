import { useEffect, useState } from "react";

import {
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";

import "./SecurityLogs.css";

import { getThreats } from "../../services/api";


function SecurityLogs() {

  const [logs, setLogs] = useState([]);

  const [search, setSearch] = useState("");

  const [cloudFilter, setCloudFilter] = useState("All");

  const [severityFilter, setSeverityFilter] = useState("All");


  useEffect(() => {

    getThreats()
      .then((data) => {

        const formattedLogs = data.map((threat) => ({

          id: threat._id,

          time: new Date(threat.detectedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }),

          cloud: threat.cloud,

          event: threat.type,

          ip: threat.ip,

          severity: threat.severity,

          status: threat.status

        }));

        setLogs(formattedLogs);

      })

      .catch((error) => {

        console.log("Error fetching security logs:", error);

      });

  }, []);


  const filteredLogs = logs.filter((log) => {

    const matchesSearch =
      log.event.toLowerCase().includes(search.toLowerCase()) ||
      log.ip.includes(search);


    const matchesCloud =
      cloudFilter === "All" ||
      log.cloud === cloudFilter;


    const matchesSeverity =
      severityFilter === "All" ||
      log.severity === severityFilter;


    return (
      matchesSearch &&
      matchesCloud &&
      matchesSeverity
    );

  });


  const totalEvents = logs.length;


  const threatEvents = logs.length;


  const blockedEvents = logs.filter(
    (log) => log.status === "Blocked"
  ).length;


  const lastEvent =
    logs.length > 0
      ? logs[0].time.slice(0, 5)
      : "--:--";


  return (

    <div className="logs-page">


      {/* Header */}

      <div className="logs-header">

        <div>

          <h1>
            Security Logs
          </h1>

          <p>
            Monitor and analyze security events across all cloud environments.
          </p>

        </div>


        <div className="live-indicator">

          <span></span>

          Live Monitoring

        </div>

      </div>



      {/* Summary Cards */}

      <div className="log-summary">


        <div className="summary-card">

          <FaExclamationTriangle />

          <div>

            <span>
              Total Events
            </span>

            <strong>
              {totalEvents}
            </strong>

          </div>

        </div>



        <div className="summary-card">

          <FaExclamationTriangle />

          <div>

            <span>
              Threat Events
            </span>

            <strong>
              {threatEvents}
            </strong>

          </div>

        </div>



        <div className="summary-card">

          <FaCheckCircle />

          <div>

            <span>
              Blocked
            </span>

            <strong>
              {blockedEvents}
            </strong>

          </div>

        </div>



        <div className="summary-card">

          <FaClock />

          <div>

            <span>
              Last Event
            </span>

            <strong>
              {lastEvent}
            </strong>

          </div>

        </div>


      </div>



      {/* Filters */}

      <div className="log-controls">


        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search events or IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>



        <div className="filter-box">

          <FaFilter />

          <select
            value={cloudFilter}
            onChange={(e) => setCloudFilter(e.target.value)}
          >

            <option value="All">
              All Clouds
            </option>

            <option value="AWS">
              AWS
            </option>

            <option value="Azure">
              Azure
            </option>

            <option value="GCP">
              GCP
            </option>

          </select>

        </div>



        <div className="filter-box">

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >

            <option value="All">
              All Severity
            </option>

            <option value="Critical">
              Critical
            </option>

            <option value="High">
              High
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Low">
              Low
            </option>

          </select>

        </div>


      </div>



      {/* Logs Table */}

      <div className="logs-container">


        <div className="logs-title">

          <h2>
            Recent Security Events
          </h2>

          <span>
            {filteredLogs.length} events
          </span>

        </div>



        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>
                  Time
                </th>

                <th>
                  Cloud
                </th>

                <th>
                  Event
                </th>

                <th>
                  Source IP
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

              {filteredLogs.map((log) => (

                <tr key={log.id}>


                  <td className="log-time">
                    {log.time}
                  </td>


                  <td>

                    <span className="cloud-badge">
                      {log.cloud}
                    </span>

                  </td>


                  <td>
                    {log.event}
                  </td>


                  <td className="ip-address">
                    {log.ip}
                  </td>


                  <td>

                    <span
                      className={`severity-badge ${log.severity.toLowerCase()}`}
                    >

                      {log.severity}

                    </span>

                  </td>


                  <td>

                    <span
                      className={`status-badge ${log.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >

                      {log.status}

                    </span>

                  </td>


                </tr>

              ))}

            </tbody>

          </table>

        </div>



        {filteredLogs.length === 0 && (

          <div className="no-logs">

            No matching security logs found.

          </div>

        )}


      </div>


    </div>

  );

}


export default SecurityLogs;