import axios from "axios";

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: "http://localhost:4000/api/v1", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to send OTP request
export const sendOTP = async (email) => {
  try {
    const response = await api.post("/auth/sendOTP", { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw error;
  }
};

export default api;
