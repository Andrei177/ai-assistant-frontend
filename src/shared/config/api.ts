import { create } from "axios";

const API_URL = "http://localhost:8080/api";

export const api = create({
  baseURL: API_URL,
  withCredentials: true,
});
