import "./Settings.css";
import {
  FaUserShield,
  FaLock,
  FaBell,
  FaCloud,
  FaRobot,
  FaSave
} from "react-icons/fa";

function Settings() {
  return (
    <div className="settings-page">

      <div className="settings-header">
        <div>
          <h1>System Settings</h1>
          <p>Manage your security and defense agent configuration</p>
        </div>

        <button className="save-btn">
          <FaSave /> Save Changes
        </button>
      </div>

      {/* Administrator Profile */}
      <div className="settings-section">
        <div className="section-title">
          <FaUserShield />
          <div>
            <h2>Administrator Profile</h2>
            <p>Manage administrator account information</p>
          </div>
        </div>

        <div className="settings-grid">
          <div className="setting-item">
            <label>Administrator Name</label>
            <input type="text" value="Administrator" readOnly />
          </div>

          <div className="setting-item">
            <label>Email Address</label>
            <input
              type="email"
              value="Administrator Account"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="settings-section">
        <div className="section-title">
          <FaLock />
          <div>
            <h2>Security Settings</h2>
            <p>Configure system security controls</p>
          </div>
        </div>

        <div className="toggle-row">
          <div>
            <h3>Multi-Factor Authentication</h3>
            <p>Require additional authentication for administrator access</p>
          </div>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-row">
          <div>
            <h3>Automatic Threat Blocking</h3>
            <p>Automatically block detected malicious activity</p>
          </div>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <div className="section-title">
          <FaBell />
          <div>
            <h2>Alert & Notifications</h2>
            <p>Configure security alert preferences</p>
          </div>
        </div>

        <div className="toggle-row">
          <div>
            <h3>Critical Threat Alerts</h3>
            <p>Receive alerts when critical threats are detected</p>
          </div>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-row">
          <div>
            <h3>Cloud Infrastructure Alerts</h3>
            <p>Receive notifications about cloud infrastructure issues</p>
          </div>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* Cloud Connections */}
      <div className="settings-section">
        <div className="section-title">
          <FaCloud />
          <div>
            <h2>Cloud Connections</h2>
            <p>Manage connected cloud environments</p>
          </div>
        </div>

        <div className="cloud-status">
          <div>
            <h3>AWS</h3>
            <span className="connected">● Connected</span>
          </div>

          <div>
            <h3>Microsoft Azure</h3>
            <span className="simulated">● Simulated</span>
          </div>

          <div>
            <h3>Google Cloud</h3>
            <span className="simulated">● Simulated</span>
          </div>
        </div>
      </div>

      {/* AI Defense Agent */}
      <div className="settings-section">
        <div className="section-title">
          <FaRobot />
          <div>
            <h2>AI Defense Agent</h2>
            <p>Configure autonomous cyber defense capabilities</p>
          </div>
        </div>

        <div className="toggle-row">
          <div>
            <h3>Autonomous Threat Analysis</h3>
            <p>Allow the AI agent to analyze security events automatically</p>
          </div>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-row">
          <div>
            <h3>Automated Response</h3>
            <p>Enable automated responses to detected threats</p>
          </div>

          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
      </div>

    </div>
  );
}

export default Settings;