import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {resetPassword} from "../services/operations/auth";
import { useSearchParams } from "react-router-dom";


const ResetPasswordForm = (params) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 7) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    // Clear specific error when user starts typing
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { password, confirmPassword } = formData;

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      newErrors.password = 'Choose a strong password';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Simulated password reset logic
        const response = await resetPassword(formData.password, formData.confirmPassword , token); 
        if(!response){
           alert("Error in reset password , check your internet connection");
           return;
        }
        // Show success message or navigate
        console.log("Successful");
        setIsSuccess(true);
      } catch (error) {
        console.error('Password reset failed', error);
      }
    }
  };
  
  const SuccessModal = () => {
    const [countdown, setCountdown] = React.useState(5);

    React.useEffect(() => {
      const timer = countdown > 0 && setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      if (countdown === 0) {
        navigate('/login');
      }

      return () => clearTimeout(timer);
    }, [countdown, navigate]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-2xl text-center max-w-md w-full">
          <div className="mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto text-green-500" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Password Reset Successful
          </h2>
          <p className="text-gray-400 mb-6">
            Your password has been successfully reset. You will be redirected to the login page in {countdown} seconds.
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full bg-indigo-700 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-300"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  };
  const renderPasswordStrengthIndicator = () => {
    const strengthColors = [
      'bg-red-800',
      'bg-orange-800',
      'bg-yellow-800',
      'bg-green-800',
      'bg-emerald-800'
    ];

    return (
      <div className="flex space-x-1 mt-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div 
            key={index} 
            className={`h-1 w-full rounded-full ${
              index < passwordStrength 
                ? strengthColors[passwordStrength - 1]
                : 'bg-gray-700'
            } transition-colors duration-300`}
          />
        ))}
      </div>
    );
  };
 
  return (
    <>
    {isSuccess && <SuccessModal />}
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-indigo-500 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-400">
              Create a new secure password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-700 text-gray-200 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password 
                      ? 'border-red-600 focus:ring-red-600' 
                      : 'border-gray-600 focus:ring-indigo-500'
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.781-1.78zM10 5a5 5 0 014.778 3.787l-1.551-1.551a3 3 0 00-3.176-3.176L7.757 3.809a5 5 0 012.243-1.81zm-2.053 2.635L7.118 8.046a3 3 0 003.836 3.836l1.412 1.412a5 5 0 01-6.319-6.319z" clipRule="evenodd" />
                      <path d="M10 12a2 2 0 001.404-.586l-1.818-1.818A2 2 0 0010 12z" />
                    </svg>
                  )}
                </button>
              </div>
              {renderPasswordStrengthIndicator()}
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-700 text-gray-200 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.confirmPassword 
                    ? 'border-red-600 focus:ring-red-600' 
                    : 'border-gray-600 focus:ring-indigo-500'
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-700 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>

            <div className="text-center mt-4">
              <a 
                href="/login" 
                className="text-sm text-indigo-500 hover:underline hover:text-indigo-400"
              >
                Back to Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default ResetPasswordForm;