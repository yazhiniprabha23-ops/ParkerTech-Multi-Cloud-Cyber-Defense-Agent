import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import CloudMonitoring from "./pages/CloudMonitoring/CloudMonitoring";
import ThreatDetection from "./pages/ThreatDetection/ThreatDetection";
import SecurityLogs from "./pages/SecurityLogs/SecurityLogs";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import AutomatedResponse from "./pages/AutomatedResponse/AutomatedResponse";

function App() {

  return (

    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cloud-monitoring" element={<CloudMonitoring />} />
      <Route path="/threat-detection" element={<ThreatDetection />} />
      <Route path="/security-logs" element={<SecurityLogs />} />
      <Route path="/automated-response" element={<AutomatedResponse />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />


    </Routes>

  );

}

export default App;