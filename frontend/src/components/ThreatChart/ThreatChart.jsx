import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getThreats } from "../../services/api";
import "./ThreatChart.css";

function ThreatChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadThreats = async () => {
      try {
        const threats = await getThreats();

        if (!Array.isArray(threats)) {
          throw new Error("Invalid threat data received");
        }

        // Keep only records with valid detection dates.
        const validThreats = threats.filter((threat) => {
          return (
            threat.detectedAt &&
            !Number.isNaN(new Date(threat.detectedAt).getTime())
          );
        });

        // Sort by detection date, newest first.
        validThreats.sort(
          (a, b) =>
            new Date(b.detectedAt).getTime() -
            new Date(a.detectedAt).getTime()
        );

        // Use the seven most recent calendar dates
        // represented in the database.
        const recentDates = [
          ...new Set(
            validThreats.map((threat) => {
              const date = new Date(threat.detectedAt);

              return [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0"),
              ].join("-");
            })
          ),
        ]
          .sort((a, b) => b.localeCompare(a))
          .slice(0, 7)
          .sort();

        const chartData = recentDates.map((dateKey) => {
          const [year, month, day] = dateKey.split("-").map(Number);

          const date = new Date(year, month - 1, day);

          const count = validThreats.filter((threat) => {
            const detected = new Date(threat.detectedAt);

            return (
              detected.getFullYear() === year &&
              detected.getMonth() === month - 1 &&
              detected.getDate() === day
            );
          }).length;

          return {
            day: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            threats: count,
          };
        });

        setData(chartData);
        setError("");
      } catch (err) {
        console.error("Error fetching threat analytics:", err);
        setError("Unable to load threat analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadThreats();
  }, []);

  return (
    <div className="threat-chart">
      <h2>Threat Analytics</h2>

      <p>Threat activity across the 7 most recent recorded dates</p>

      {loading ? (
        <p>Loading threat analytics...</p>
      ) : error ? (
        <p>{error}</p>
      ) : data.length === 0 ? (
        <p>No recorded threat data is available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="threats"
              name="Recorded threats"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ThreatChart;