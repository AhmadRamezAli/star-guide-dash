import { axios } from "axios";


export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Replace with your API base URL
  headers: {   
    contentType: "application/json",
  },
   });


   apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }   
    return config;
});