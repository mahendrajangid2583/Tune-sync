import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/operations/auth";
import { useProfile } from "./contexts/profileContext";
const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);
  const [wrongCrediantials, setwrongCrediantials] = useState(false);
  const [user, setuser] = useState({});
  const {
    setProfileData
  } = useProfile();
  useEffect(() => {
    setIsLoaded(true);
    // Check for saved email in localStorage if remember me was checked
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setUser = async (email, password, cb) => {
    try {
      const response =  await (login(email, password));
      if (response.data.success) {
        console.log("Printing user" , response.data.user);
        cb(true , response.data.user);
      }
      cb(false , null);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
// 12@Aa#ok
  const handleSubmit = async (e) => {
    e.preventDefault();
      setIsSubmitting(true);
      // Handle remember me
      // API call
      const { email, password } = formData;
      try {
        await setUser(email, password, (istrue , data) => {
          if(!istrue){
            setErrors({
              ...errors,
              password:"Wrong Email or password"
            })
            setIsSubmitting(false);
            return;
          }
          setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setProfileData(data);
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/");
          });
        });  
        // For demo purposes, show success after 1.5s
      } catch (error) {
        console.error("Error during user authentication:", error);
      }
    };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

      {/* Animated gradient orbs - updated to more muted colors */}
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
            <div className="absolute inset-0 bg-gradient-to-br bg-purple-500   opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
        <h2 className="mt-6 text-center text-5xl font-bold bg-gradient-to-r bg-purple-700 via-slate-500 bg-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-slate-400 text-opacity-90">
          Enter your credentials to access your account
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
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-4 py-3 bg-gray-800 bg-opacity-50 border-0 border-b-2 border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-200 shadow-sm transition-all duration-150 text-base"
                  placeholder="Your email address"
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
              className={`transition-all duration-500 delay-200 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-purple-500"
                >
                  Password
                </label>
                <a
                  className="text-sm font-medium text-purple-500 hover:text-slate-300 cursor-pointer transition-colors duration-150 hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </a>
              </div>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 py-3 bg-gray-800 bg-opacity-50 border-0 border-b-2 border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-200 shadow-sm transition-all duration-150 text-base"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                {errors.password && (
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
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`flex items-center transition-all duration-500 delay-300 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            ></div>

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
                    Authenticating...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <div
              className={`mt-6 transition-all duration-500 delay-500 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <p className="text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-medium bg-gradient-to-r bg-purple-500 bg-clip-text text-transparent hover:from-slate-300 hover:to-gray-400 transition-colors duration-150"
                >
                  Create one now
                </a>
              </p>
            </div>

            <div
              className={`flex items-center justify-center space-x-4 mt-6 pt-6 border-t border-gray-800 transition-all duration-500 delay-600 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <button
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
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

export default LoginForm;
