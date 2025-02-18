import axios from "axios";

export const ApiAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    Connection: "Keep-Alive",
  },
});
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
