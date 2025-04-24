import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendResetLink } from "../services/operations/auth";

const ForgotPasswordForm = (params) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setmessage] = useState("");
  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    // Clear error when user starts typing
    if (errors.email) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Simulating password reset request
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);

        // Optional: Show success message or navigate
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.error("Error during password reset:", error);
        setIsSubmitting(false);
      }
    }
  };

  const handleResetSubmit = async () => {
    try {
      const response = await sendResetLink(email);
      if (!response.success) {
        console.log("Problem in backend , Can't able to send reset Link");
        setmessage(
          "Problem in sending link , check your internet connection or provide a valid email"
        );
      }
      console.log("token in forgot password" , response.token);
      setmessage("Reset link send , on your email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen box-content bg-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-slate-${
              Math.floor(Math.random() * 3) + 6
            }00 opacity-${Math.floor(Math.random() * 3) + 1}0`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              filter: "blur(1px)",
              animation: `pulse ${Math.random() * 4 + 2}s infinite alternate ${
                Math.random() * 2
              }s`,
            }}
          />
        ))}
      </div>

      {/* Animated gradient orbs */}
      <div
        className={`absolute -top-60 -right-60 w-96 h-96 bg-gradient-to-br from-slate-800 to-gray-900 rounded-full filter blur-3xl opacity-20 transition-all duration-1000 ${
          isLoaded ? "translate-y-10" : ""
        }`}
      ></div>
      <div
        className={`absolute top-20 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-900 to-gray-800 rounded-full filter blur-3xl opacity-20 transition-all duration-1000 delay-300 ${
          isLoaded ? "translate-x-16" : ""
        }`}
      ></div>
      <div
        className={`absolute bottom-10 right-20 w-72 h-72 bg-gradient-to-tl from-gray-900 to-slate-800 rounded-full filter blur-3xl opacity-20 transition-all duration-1000 delay-700 ${
          isLoaded ? "translate-y-0" : "translate-y-20"
        }`}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-40 z-0"></div>

      <div
        className={`sm:mx-auto sm:w-full sm:max-w-md z-10 transition-all duration-700 transform ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="flex justify-center">
          <div className="relative h-20 w-20 rounded-full bg-gradient-to-br bg-purple-500 p-4 shadow-lg shadow-slate-500/30 hover:shadow-slate-500/40 transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-full w-full text-white relative z-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-5 mb-10 text-center text-5xl font-bold text-purple-500 drop-shadow-sm ">
          Forgot Password
        </h2>

        <p className="mt-2 text-center text-slate-400 text-opacity-90">
          Enter your email to reset your password
        </p>
      </div>

      <div
        className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 transition-all duration-700 delay-200 transform ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="bg-gray-900 bg-opacity-80 backdrop-blur-lg py-8 px-4 shadow-2xl shadow-slate-500/10 sm:rounded-2xl sm:px-10 border border-gray-800 relative overflow-hidden">
          {/* Animated border effect */}
          <div className="absolute inset-px rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute -top-[500px] -left-[500px] w-[1000px] h-[1000px] opacity-30 animate-[spin_10s_linear_infinite]">
              <div className="absolute top-1/2 left-1/2 w-full h-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-slate-500 to-transparent"></div>
            </div>
          </div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div
              className={`transition-all duration-500 delay-100 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-purple-500"
              >
                Email address
              </label>
              <div className="mt-1 relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-4 py-3 bg-gray-800 bg-opacity-50 border-0 border-b-2 border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-200 shadow-sm transition-all duration-150 text-base"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`pt-2 transition-all duration-500 delay-400 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border-0 rounded-xl shadow-lg shadow-slate-700/30 text-base font-medium text-white bg-gradient-to-r bg-purple-500 hover:from-slate-700 hover:to-gray-800 focus:outline-none disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  handleResetSubmit();
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Sending Reset Link...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>

            {isSuccess && (
              <div className="text-center text-green-400 mt-4">{message}</div>
            )}

            <div
              className={`mt-6 transition-all duration-500 delay-500 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <p className="text-center text-sm text-gray-400">
                Remember your password?{" "}
                <a
                  href="/login"
                  className="font-medium bg-gradient-to-r bg-purple-500 bg-clip-text text-transparent hover:from-slate-300 hover:to-gray-400 transition-colors duration-150"
                >
                  Back to Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Animated lines */}
      <div className="absolute bottom-0 left-0 w-full h-px overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-500 to-transparent animate-pulse"></div>
      </div>
      <div className="absolute top-0 left-0 h-full w-px overflow-hidden">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-slate-500 to-transparent animate-pulse"></div>
      </div>
      <div className="absolute top-0 right-0 h-full w-px overflow-hidden">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-gray-500 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
