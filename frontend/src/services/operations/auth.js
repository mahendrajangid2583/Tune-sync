import axios from "axios";
import { useProfile } from "../../pages/contexts/profileContext";

// Load environment variables
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1/"; 
// Create an Axios instance with default settings
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const verify_email = async (email) => {
  try {
    const response = await api.post("auth/validEmail", { email });
    return response.data.success;
  } catch (error) {
    console.error("Error Verifying email , check your internet connection", error.response?.data || error.message);
    throw error;
  }
};


export const sendOtp = async (email) => {
  try {
    const response = await api.post("auth/sendotp", { email });
    console.log("HELLO from auth" , response);
    return response.data.success;
  } catch (error) {
    console.error("Error Sending otp , check your internet connection", error.response?.data || error.message);
    throw error;
  }
};
 
export const verifyotp = async (email , otp) => {
  try {
    const response = await api.post("auth/verifyotp", { email: email , otp: otp });
    console.log("HELLO from auth" , response);
    return response.data.success;
  } catch (error) {
    console.error("Error verifying otp , check your internet connection", error.response?.data || error.message);
    throw error;
  }
};
 
 
export const Insert_User = async (Data) => {
  try {
    const response = await api.post("auth/signup", {Data});
    console.log("HELLO from auth" , response);
    if(response.data.success){
      const token = response.data.token;
      console.log("token is:" ,token)
      localStorage.setItem("token" , token);
    }
    return response;
  } catch (error) {
    console.error("Error verifying otp , check your internet connection", error.response?.data || error.message);
    throw error;
  }
};

// Function to fetch user profile (protected route)
export const fetchProfile = async () => {
  try {
    // Get token from localStorage if not using cookies
    const token = localStorage.getItem('token');
    console.log(token);
    const response = await api.get('auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("checking token" , response);
    if (response.data.success) {
       return response.data.user;
    }else{
       if(response.data.message==="Session expired, please login again"){
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         alert("Session expired, please login again");
         window.location.reload();
       }
    }

    return undefined;
  } catch (error) {
    
    console.error('Error fetching profile:', error.response?.data?.message || error.message);
    return undefined;
  }
};
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpdHRoYWw3ODA0QGdtYWlsLmNvbSIsImlkIjoiNjdkOGZjZDNjMTc0ZGJjMDdkMDZjNjNmIiwiaWF0IjoxNzQyOTc4NTUwLCJleHAiOjE3NDMyMzc3NTB9.cRFGLRNfhnV4Ua3iTPZ0PNuKYioXf8kq8sDdRUNxDDU
export const login = async (email , password) => {
    try {
      const response = await api.post("auth/login", {email , password});
      console.log("HELLO from auth" , response);
      if(response.data.success){
        const token = response.data.token;
        console.log("token is:" ,token)
        console.log("From auth checking user" , response.data.user);
        localStorage.setItem("token" , token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      console.error("Error login , check your internet connection", error.response?.data || error.message);
      throw error;
    }
  
};

export const sendResetLink = async (email) => {
  try {
    const response = await api.post("auth/update-password", { email });
    console.log("HELLO from auth" , response);
    return response.data;
  } catch (error) {
    console.error("Error Sending otp , check your internet connection", error.response?.data || error.message);
    throw error;
  }
};

export const resetPassword = async (password , confirmPassword , token) => {
  try {
    const response = await api.post("auth/reset-password", { password , confirmPassword , token});
    console.log("HELLO from auth" , response);
    return response.data.success;
  } catch (error) {
    console.error("Error Sending otp , check your internet connection", error.response?.data || error.message);
    throw error;
  }
};


export default api;
