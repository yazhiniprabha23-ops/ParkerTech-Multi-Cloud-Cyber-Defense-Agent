import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getThreats = async () => {
  const response = await api.get("/threats");
  return response.data;
};

export const getThreatStats = async () => {
  const response = await api.get("/threats/stats");
  return response.data;
};

export const getResponses = async () => {
  const response = await api.get("/responses");
  return response.data;
};

export default api;