import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendOtp, verifyotp , Insert_User } from "../services/operations/auth";

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("initial"); // initial, verifying, verified
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(data?.formData.email || "ok");
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [wrongOtp, setWrongOtp] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(0); // Timer for OTP expiry
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // Countdown timer for OTP expiry
  useEffect(() => {
    let interval;
    if (otpExpiry > 0) {
      interval = setInterval(() => {
        setOtpExpiry((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (otpExpiry === 0 && stage === "verifying") {
      setOtp(""); // Clear OTP
      setStage("initial"); // Reset to initial stage
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpExpiry, stage]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleSendCode = async () => {
    try {
      setIsLoading(true);
      const sendotp = await sendOtp(email);
      setTimeout(() => {
        setIsLoading(false);
        setStage("verifying");
        setOtpExpiry(120);
      }, 0);
    } catch (error) {
      console.error("Error sending otp:", error);
      return false;
    }
  };

  const handleVerify = async () => {
    if (verificationCode.length < 6) return;

    setIsLoading(true);
    try {
      const response = await verifyotp(email, verificationCode);
      if (response) {
        setIsLoading(false);
        setStage("verified");
      } else {
        setIsLoading(false);
        setWrongOtp(true);
      }
    } catch (error) {
      console.log(
        "Error verifying otp, check your internet connection",
        error.response?.data || error.message
      );
      setIsLoading(false);
      setWrongOtp(true);
      return false;
    }
  };
 

  const validateUsername =  (value) => {
    // Only allow letters, numbers, underscores, and hyphens
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return "Username can only contain letters, numbers, underscores, and hyphens";
    }

    if (value.length < 3) {
      return "Username must be at least 3 characters long";
    }

    if (value.length > 20) {
      return "Username cannot exceed 20 characters";
    }
    // const response =  IsUsernameTaken(value);
    // if(response){
    //   return response;
    // } 
    return "";
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError(validateUsername(value));
  };

  const handleCreateAccount = async () => {
    const error = validateUsername(username);
    if (error) {
      setUsernameError(error);
      return;
    }

    setIsCreatingAccount(true);
    try {
      // Add the username to the form data
      const updatedFormData = {
        ...data.formData,
        Username: username,
      };
      console.log(updatedFormData);
      // Create the user account
      const getData = await Insert_User(updatedFormData);
      console.log(getData);
      if(!getData.data.success){
        
        setIsCreatingAccount(false);
        setUsernameError("Username already in use");
        return;
      }
      // Navigate to the dashboard or welcome page
      navigate("/" , {state : {data : getData.data.user}});
    } catch (error) {
      console.error("Error creating account:", error);
      setIsCreatingAccount(false);
    }
  };

  // Verification success screen
  if (stage === "verified") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-500 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-2">
            Email Verified Successfully!
          </h1>

          <p className="text-gray-300 text-center mb-6">
            Choose a username to complete your account setup
          </p>

          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full h-12 px-4 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Choose a username"
              value={username}
              onChange={handleUsernameChange}
            />
            {usernameError && (
              <p className="text-red-500 text-sm mt-1">{usernameError}</p>
            )}
            <p className="text-gray-400 text-sm mt-1">
              Your username will be visible to other users
            </p>
          </div>

          <button
            className={`w-full py-3 font-medium rounded-md transition-colors duration-200 ${
              isCreatingAccount || usernameError || !username
                ? "bg-indigo-500 cursor-not-allowed opacity-70"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            onClick={handleCreateAccount}
            disabled={isCreatingAccount || usernameError || !username}
          >
            {isCreatingAccount ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </div>
    );
  }

  // Initial screen to send verification code
  if (stage === "initial") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Click the button below to send a verification code to {email}
          </p>

          <button
            className={`w-full py-3 font-medium rounded-md transition-colors duration-200 ${
              isLoading
                ? "bg-indigo-500 cursor-not-allowed opacity-70"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            onClick={handleSendCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending Code...
              </span>
            ) : (
              "Send Verification Code"
            )}
          </button>
        </div>
      </div>
    );
  }

  // Verification code input screen (verifying state)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-white mb-2">
          Verify Your Email
        </h1>
        <p className="text-gray-300 text-center mb-6">
          Please enter the 6-digit code sent to {email}
        </p>

        {/* OTP Expiry Timer */}
        {otpExpiry > 0 && (
          <p className="text-center text-sm text-gray-400 mb-4">
            OTP expires in {otpExpiry} seconds
          </p>
        )}

        <div className="mb-6">
          <input
            type="text"
            maxLength={6}
            className="w-full h-12 text-center text-xl font-bold bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))
            }
          />
        </div>
        {wrongOtp && (
          <p className="text-red-500 text-center mb-4">
            Wrong OTP. Please try again.
          </p>
        )}
        <button
          className={`w-full py-3 font-medium rounded-md transition-colors duration-200 ${
            isLoading || verificationCode.length < 6
              ? "bg-indigo-500 cursor-not-allowed opacity-70"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
          onClick={handleVerify}
          disabled={isLoading || verificationCode.length < 6}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Verifying...
            </span>
          ) : (
            "Verify Email"
          )}
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
