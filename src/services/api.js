import axios from "axios";

// Pick correct API URL based on environment
const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_PROD
    : process.env.REACT_APP_API_LOCAL;

const API = axios.create({
  baseURL,
});

// Add token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;