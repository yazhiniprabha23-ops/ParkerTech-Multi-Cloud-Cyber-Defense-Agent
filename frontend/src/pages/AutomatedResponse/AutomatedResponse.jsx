import { useEffect, useState } from "react";

import {
  FaShieldAlt,
  FaBan,
  FaLock,
  FaKey,
  FaBell
} from "react-icons/fa";

import { getThreats } from "../../services/api";

import "./AutomatedResponse.css";


function AutomatedResponse() {

  const [threats, setThreats] = useState([]);

  const [responses, setResponses] = useState([]);

  const [message, setMessage] = useState("");


  useEffect(() => {

    getThreats()
      .then((data) => {
        setThreats(data);
      })
      .catch((error) => {
        console.log("Error fetching threats:", error);
      });


    fetch("http://localhost:5050/api/responses")
      .then((response) => response.json())
      .then((data) => {
        setResponses(data);
      })
      .catch((error) => {
        console.log("Error fetching responses:", error);
      });

  }, []);


  const activeThreats = threats.length;

  const blockedToday = threats.filter(
    (threat) => threat.status === "Blocked"
  ).length;


  const simulateResponse = async (action, target, cloud) => {

    try {

      const response = await fetch(
        "http://localhost:5050/api/responses",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            action,
            target,
            cloud,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.message || "Response failed");
      }


      setResponses((previousResponses) => [
        data.response,
        ...previousResponses,
      ]);


      setMessage(
        `${action} simulated successfully`
      );


      setTimeout(() => {
        setMessage("");
      }, 3000);


    } catch (error) {

      console.log("Error simulating response:", error);

      setMessage("Failed to simulate response");

    }

  };


  return (

    <div className="response-page">


      {/* Header */}

      <div className="response-header">

        <div>

          <h1>
            Automated Response
          </h1>

          <p>
            Manage and simulate defensive actions against detected cyber threats.
          </p>

        </div>


        <div className="response-status">

          <FaShieldAlt />

          <span>
            Response Engine Ready
          </span>

        </div>

      </div>



      {/* Success Message */}

      {message && (

        <div
          style={{
            background: "rgba(34, 197, 94, 0.12)",
            color: "#22c55e",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >

          {message}

        </div>

      )}



      {/* Overview */}

      <div className="response-overview">


        <div className="response-card">

          <FaShieldAlt />

          <div>

            <span>
              Active Threats
            </span>

            <strong>
              {activeThreats}
            </strong>

          </div>

        </div>



        <div className="response-card">

          <FaBan />

          <div>

            <span>
              Blocked Today
            </span>

            <strong>
              {blockedToday}
            </strong>

          </div>

        </div>



        <div className="response-card">

          <FaLock />

          <div>

            <span>
              Responses Executed
            </span>

            <strong>
              {responses.length}
            </strong>

          </div>

        </div>



        <div className="response-card">

          <FaBell />

          <div>

            <span>
              Pending Actions
            </span>

            <strong>
              0
            </strong>

          </div>

        </div>


      </div>



      {/* Response Actions */}

      <div className="response-section">


        <div className="section-heading">

          <div>

            <h2>
              Defensive Actions
            </h2>

            <p>
              Available response actions for detected security threats.
            </p>

          </div>


          <span className="simulation-badge">
            Simulation Mode
          </span>

        </div>



        <div className="action-grid">


          {/* Block Source IP */}

          <div className="action-card">

            <div className="action-icon">

              <FaBan />

            </div>


            <div className="action-content">

              <h3>
                Block Source IP
              </h3>

              <p>
                Simulate blocking a malicious source IP address.
              </p>

              <button
                onClick={() =>
                  simulateResponse(
                    "Block Source IP",
                    "192.168.1.45",
                    "AWS"
                  )
                }
              >
                Simulate Response
              </button>

            </div>

          </div>



          {/* Isolate Workload */}

          <div className="action-card">

            <div className="action-icon">

              <FaLock />

            </div>


            <div className="action-content">

              <h3>
                Isolate Workload
              </h3>

              <p>
                Simulate isolating a compromised cloud workload.
              </p>

              <button
                onClick={() =>
                  simulateResponse(
                    "Isolate Workload",
                    "workload-103",
                    "GCP"
                  )
                }
              >
                Simulate Response
              </button>

            </div>

          </div>



          {/* Disable Credential */}

          <div className="action-card">

            <div className="action-icon">

              <FaKey />

            </div>


            <div className="action-content">

              <h3>
                Disable Credential
              </h3>

              <p>
                Simulate disabling a potentially compromised credential.
              </p>

              <button
                onClick={() =>
                  simulateResponse(
                    "Disable Credential",
                    "credential-demo-01",
                    "Azure"
                  )
                }
              >
                Simulate Response
              </button>

            </div>

          </div>



          {/* Generate Alert */}

          <div className="action-card">

            <div className="action-icon">

              <FaBell />

            </div>


            <div className="action-content">

              <h3>
                Generate Alert
              </h3>

              <p>
                Simulate sending a security alert to the administrator.
              </p>

              <button
                onClick={() =>
                  simulateResponse(
                    "Generate Alert",
                    "Security Administrator",
                    "AWS"
                  )
                }
              >
                Simulate Response
              </button>

            </div>

          </div>


        </div>

      </div>



      {/* Recent Responses */}

      <div className="recent-responses">


        <div className="section-heading">

          <div>

            <h2>
              Recent Response Actions
            </h2>

            <p>
              Previously executed defensive actions.
            </p>

          </div>

        </div>



        <div className="response-table">

          <table>

            <thead>

              <tr>

                <th>
                  Action
                </th>

                <th>
                  Target
                </th>

                <th>
                  Cloud
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {responses.map((response) => (

                <tr key={response._id}>

                  <td>
                    {response.action}
                  </td>

                  <td className="response-ip">
                    {response.target}
                  </td>

                  <td>
                    {response.cloud}
                  </td>

                  <td>

                    <span className="response-success">
                      {response.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {responses.length === 0 && (

          <p
            style={{
              color: "#9aa7bd",
              fontSize: "14px",
              marginTop: "20px",
            }}
          >
            No response actions have been executed yet.
          </p>

        )}


      </div>


    </div>

  );

}


export default AutomatedResponse;