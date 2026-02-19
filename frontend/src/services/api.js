import axios from "axios";

const API = axios.create({
  baseURL: "https://rbs-app.onrender.com/api/v1",
  withCredentials: true,
});

export default API;
