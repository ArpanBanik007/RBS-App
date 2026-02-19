import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8007/api/v1",
  withCredentials: true,
});

export default API;
