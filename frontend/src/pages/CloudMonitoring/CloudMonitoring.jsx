import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CloudMonitoring.css";
import { getThreats } from "../../services/api";

function CloudMonitoring() {
  const [threats, setThreats] = useState([]);
  const [awsEvents, setAwsEvents] = useState([]);
  const [gcpEvents, setGcpEvents] = useState([]);

  const [awsLoading, setAwsLoading] = useState(true);
  const [gcpLoading, setGcpLoading] = useState(true);

  const [awsError, setAwsError] = useState("");
  const [gcpError, setGcpError] = useState("");

  const [suspiciousCount, setSuspiciousCount] = useState(0);

  // Azure events are retained from the existing implementation.
  // Connect a real Azure log source before treating these as live events.
  const azureEvents = [
    {
      id: "AZ-1001",
      eventName: "InteractiveUserSignIn",
      resource: "Microsoft Entra ID",
      user: "admin@parkertech-demo.example",
      severity: "High",
      status: "Flagged",
      reason: "Sign-in requires security review",
      time: "Just now",
    },
    {
      id: "AZ-1002",
      eventName: "RoleAssignmentCreated",
      resource: "Azure RBAC",
      user: "security@parkertech-demo.example",
      severity: "Medium",
      status: "Review",
      reason: "Privileged role assignment requires review",
      time: "2 minutes ago",
    },
    {
      id: "AZ-1003",
      eventName: "NetworkSecurityRuleUpdated",
      resource: "Network Security Group",
      user: "cloudadmin@parkertech-demo.example",
      severity: "Medium",
      status: "Review",
      reason: "Inbound network rule modification",
      time: "5 minutes ago",
    },
    {
      id: "AZ-1004",
      eventName: "ResourceDeploymentSucceeded",
      resource: "Azure Resource Manager",
      user: "deployment@parkertech-demo.example",
      severity: "Normal",
      status: "Monitored",
      reason: "Resource deployment activity",
      time: "8 minutes ago",
    },
    {
      id: "AZ-1005",
      eventName: "KeyVaultAccessAttempt",
      resource: "Azure Key Vault",
      user: "application@parkertech-demo.example",
      severity: "High",
      status: "Flagged",
      reason: "Sensitive-resource access requires review",
      time: "12 minutes ago",
    },
  ];

  const loadThreats = async () => {
    try {
      const data = await getThreats();
      setThreats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cloud threats:", error);
    }
  };

  // Real AWS CloudTrail integration — preserved.
  const loadAwsEvents = async () => {
    setAwsLoading(true);
    setAwsError("");

    try {
      const response = await fetch(
        "http://localhost:5050/api/aws/events"
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      setAwsEvents(Array.isArray(data.events) ? data.events : []);
      setSuspiciousCount(data.suspiciousCount || 0);
    } catch (error) {
      console.error("Error fetching AWS events:", error);
      setAwsError(
        "Unable to load AWS events. Check that the backend is running."
      );
    } finally {
      setAwsLoading(false);
    }
  };

  // Google Cloud Audit Logs integration.
  const loadGcpEvents = async () => {
    setGcpLoading(true);
    setGcpError("");

    try {
      const response = await fetch(
        "http://localhost:5050/api/gcp/real-events"
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      setGcpEvents(Array.isArray(data.events) ? data.events : []);
    } catch (error) {
      console.error("Error fetching GCP events:", error);
      setGcpError("Unable to load Google Cloud audit events.");
      setGcpEvents([]);
    } finally {
      setGcpLoading(false);
    }
  };

  useEffect(() => {
    loadThreats();
    loadAwsEvents();
    loadGcpEvents();
  }, []);

  const awsThreats = threats.filter(
    (threat) => threat.cloud === "AWS"
  ).length;

  const azureThreats = threats.filter(
    (threat) => threat.cloud === "Azure"
  ).length;

  const gcpThreats = threats.filter(
    (threat) => threat.cloud === "GCP"
  ).length;

  const findings = awsEvents.filter(
    (event) =>
      event.suspicious === true ||
      (Array.isArray(event.findings) &&
        event.findings.length > 0)
  );

  // Hide LookupEvents in the table only.
  const displayedAwsEvents = awsEvents.filter(
    (event) => event.eventName !== "LookupEvents"
  );

  const gcpSuspiciousCount = gcpEvents.filter(
    (event) =>
      event.suspicious === true ||
      event.severity === "High" ||
      event.severity === "Medium"
  ).length;

  const azureFindings = azureEvents.filter(
    (event) =>
      event.severity === "High" ||
      event.severity === "Medium"
  );

  const formatDate = (date) => {
    if (!date) return "Unknown";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "Unknown"
      : parsedDate.toLocaleString();
  };

  const getSeverityClass = (severity) => {
    const value = (severity || "Normal").toLowerCase();

    if (value === "high" || value === "critical") {
      return "severity-high";
    }

    if (value === "medium" || value === "moderate") {
      return "severity-medium";
    }

    return "severity-normal";
  };

  return (
    <div className="cloud-monitoring">
      <div className="page-header">
        <div>
          <h1>Cloud Monitoring</h1>
          <p>
            Monitor cloud environments and review security activity
            from a centralized dashboard.
          </p>
        </div>

        <span className="simulation-indicator">
          Multi-Cloud Security Center
        </span>
      </div>

      {/* Cloud provider cards */}
      <div className="cloud-grid">
        {/* AWS */}
        <div className="cloud-panel aws">
          <div className="cloud-title">
            <h2>AWS</h2>
            <span
              className={`status ${
                awsError || awsLoading
                  ? "simulated"
                  : "connected"
              }`}
            >
              {awsError
                ? "Unavailable"
                : awsLoading
                  ? "Connecting..."
                  : "Connected"}
            </span>
          </div>

          <div className="cloud-info">
            <p>Region: <strong>ap-southeast-2</strong></p>
            <p>Data source: <strong>CloudTrail</strong></p>
            <p>Events retrieved: <strong>{awsEvents.length}</strong></p>
            <p>
              Events flagged for review:{" "}
              <strong>{suspiciousCount}</strong>
            </p>
            <p>Stored threat records: <strong>{awsThreats}</strong></p>
          </div>

          <Link to="/threat-detection" className="cloud-button">
            View Threats
          </Link>
        </div>

        {/* Azure */}
        <div className="cloud-panel azure">
          <div className="cloud-title">
            <h2>Microsoft Azure</h2>
            <span className="status connected">
              Configured
            </span>
          </div>

          <div className="cloud-info">
            <p>Region: <strong>Central India</strong></p>
            <p>Data source: <strong>Azure Monitor / Entra ID</strong></p>
            <p>Activity events: <strong>{azureEvents.length}</strong></p>
            <p>Findings for review: <strong>{azureFindings.length}</strong></p>
            <p>Stored threat records: <strong>{azureThreats}</strong></p>
          </div>

          <Link to="/threat-detection" className="cloud-button">
            View Threats
          </Link>
        </div>

        {/* Google Cloud */}
        <div className="cloud-panel gcp">
          <div className="cloud-title">
            <h2>Google Cloud</h2>
            <span
              className={`status ${
                gcpLoading || gcpError
                  ? "simulated"
                  : "connected"
              }`}
            >
              {gcpLoading
                ? "Connecting..."
                : gcpError
                  ? "Unavailable"
                  : "Connected"}
            </span>
          </div>

          <div className="cloud-info">
            <p>Data source: <strong>Cloud Audit Logs</strong></p>
            <p>Events retrieved: <strong>{gcpEvents.length}</strong></p>
            <p>
              Events flagged for review:{" "}
              <strong>{gcpSuspiciousCount}</strong>
            </p>
            <p>Stored threat records: <strong>{gcpThreats}</strong></p>
          </div>

          <Link to="/threat-detection" className="cloud-button">
            View Threats
          </Link>
        </div>
      </div>

      {/* AWS activity */}
      <div className="aws-events-section">
        <div className="aws-events-header">
          <div>
            <h2>Recent AWS Activity</h2>
            <p>Management events retrieved from AWS CloudTrail.</p>
          </div>

          <button
            type="button"
            className="cloud-button"
            onClick={loadAwsEvents}
            disabled={awsLoading}
          >
            {awsLoading ? "Loading..." : "Refresh Events"}
          </button>
        </div>

        {awsLoading && <p>Loading AWS events...</p>}

        {!awsLoading && awsError && (
          <p className="aws-events-error">{awsError}</p>
        )}

        {!awsLoading && !awsError && displayedAwsEvents.length === 0 && (
          <p>No non-lookup CloudTrail events were returned.</p>
        )}

        {!awsLoading && !awsError && displayedAwsEvents.length > 0 && (
          <div className="aws-events-table-wrapper">
            <table className="aws-events-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Username</th>
                  <th>Source IP</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {displayedAwsEvents.map((event) => (
                  <tr
                    key={
                      event.eventId ||
                      `${event.eventName}-${event.eventTime}`
                    }
                  >
                    <td>{event.eventName || "Unknown"}</td>
                    <td>{event.username || "Unknown"}</td>
                    <td>{event.sourceIPAddress || "Not available"}</td>
                    <td>{formatDate(event.eventTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AWS security findings */}
      <div className="aws-events-section">
        <div className="aws-events-header">
          <div>
            <h2>AWS Security Findings</h2>
            <p>
              Findings generated by the backend&apos;s rule-based analysis.
            </p>
          </div>

          <span className="status simulated">
            {findings.length} flagged for review
          </span>
        </div>

        {awsLoading ? (
          <p>Analyzing AWS events...</p>
        ) : awsError ? (
          <p className="aws-events-error">
            Findings are unavailable until AWS events load successfully.
          </p>
        ) : findings.length === 0 ? (
          <p>
            No retrieved events matched the current detection rules.
            This does not guarantee that the account is threat-free.
          </p>
        ) : (
          <div className="aws-events-table-wrapper">
            <table className="aws-events-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Severity</th>
                  <th>Reason</th>
                  <th>Username</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {findings.map((event) => (
                  <tr key={event.eventId || event.eventName}>
                    <td>{event.eventName}</td>
                    <td>
                      {(event.findings || [])
                        .map((finding) => finding.severity)
                        .join(", ") || "Review"}
                    </td>
                    <td>
                      {(event.findings || [])
                        .map((finding) => finding.reason)
                        .join("; ") || "Review flagged event"}
                    </td>
                    <td>{event.username || "Unknown"}</td>
                    <td>{formatDate(event.eventTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Azure activity */}
      <div className="aws-events-section azure-events-section">
        <div className="aws-events-header">
          <div>
            <h2>Microsoft Azure Activity</h2>
            <p>Identity, resource, and network activity.</p>
          </div>
        </div>

        <div className="azure-metrics">
          <div className="azure-metric">
            <span>Total events</span>
            <strong>{azureEvents.length}</strong>
          </div>

          <div className="azure-metric">
            <span>High severity</span>
            <strong>
              {
                azureEvents.filter(
                  (event) => event.severity === "High"
                ).length
              }
            </strong>
          </div>

          <div className="azure-metric">
            <span>Needs review</span>
            <strong>{azureFindings.length}</strong>
          </div>
        </div>

        <div className="aws-events-table-wrapper">
          <table className="aws-events-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Resource</th>
                <th>User / Principal</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {azureEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <strong>{event.eventName}</strong>
                    <small className="azure-event-id">{event.id}</small>
                  </td>
                  <td>{event.resource}</td>
                  <td>{event.user}</td>
                  <td>
                    <span
                      className={`severity-label ${getSeverityClass(
                        event.severity
                      )}`}
                    >
                      {event.severity}
                    </span>
                  </td>
                  <td>{event.status}</td>
                  <td>{event.reason}</td>
                  <td>{event.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Google Cloud activity — live endpoint events only */}
      <div className="aws-events-section">
        <div className="aws-events-header">
          <div>
            <h2>Google Cloud Activity</h2>
            <p>Audit activity and security-event review.</p>
          </div>

          <button
            type="button"
            className="cloud-button"
            onClick={loadGcpEvents}
            disabled={gcpLoading}
          >
            {gcpLoading ? "Loading..." : "Refresh GCP Events"}
          </button>
        </div>

        {gcpLoading && <p>Loading Google Cloud audit events...</p>}

        {!gcpLoading && gcpError && (
          <p className="aws-events-error">{gcpError}</p>
        )}

        {!gcpLoading && !gcpError && gcpEvents.length === 0 && (
          <p>No audit events were returned.</p>
        )}

        {!gcpLoading && !gcpError && gcpEvents.length > 0 && (
          <div className="aws-events-table-wrapper">
            <table className="aws-events-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Principal</th>
                  <th>Severity</th>
                  <th>Reason</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {gcpEvents.map((event, index) => (
                  <tr
                    key={`${
                      event.eventName || event.event || "event"
                    }-${index}`}
                  >
                    <td>{event.eventName || event.event || "Unknown"}</td>
                    <td>
                      {event.principalEmail || event.user || "Unknown"}
                    </td>
                    <td>
                      <span
                        className={`severity-label ${getSeverityClass(
                          event.severity
                        )}`}
                      >
                        {event.severity || "Normal"}
                      </span>
                    </td>
                    <td>
                      {event.reason || "No analysis reason provided"}
                    </td>
                    <td>
                      {formatDate(
                        event.eventTime || event.timestamp || event.time
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CloudMonitoring;