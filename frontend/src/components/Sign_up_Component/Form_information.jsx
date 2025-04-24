import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Info = (params) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-purple-500">
            First name
          </label>
          <div className="mt-1 relative">
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={params.formData.firstName}
              onChange={params.handleChange}
              className="appearance-none block w-full px-4 py-3 bg-gray-800 bg-opacity-50 border-0 border-b-2 border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-200 shadow-sm transition-all duration-150 text-base"
              placeholder="Your first name"
            />
            {params.errors.firstName && (
              <p className="mt-2 text-sm text-red-400">{params.errors.firstName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-purple-500">
            Last name
          </label>
          <div className="mt-1">
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={params.formData.lastName}
              onChange={params.handleChange}
              className="appearance-none block w-full px-4 py-3 bg-gray-800 bg-opacity-50 border-0 border-b-2 border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-200 shadow-sm transition-all duration-150 text-base"
              placeholder="Your last name"
            />
            {params.errors.lastName && (
              <p className="mt-2 text-sm text-red-400">{params.errors.lastName}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-purple-500">
          Email address
        </label>
        <div className="mt-1 relative">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={params.formData.email}
            onChange={params.handleChange}
            className="appearance-none block w-full px-4 py-3 bg-gray-800 bg-opacity-50 border-0 border-b-2 border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-200 shadow-sm transition-all duration-150 text-base"
            placeholder="Your email address"
          />
          {params.errors.email && (
            <p className="mt-2 text-sm text-red-400">{params.errors.email}</p>
          )}
        </div>
      </div>

      {/* Password Field with Eye Icon */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-purple-500">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={params.showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={params.formData.password}
            onChange={params.handleChange}
            className="appearance-none block w-full px-4 py-3 bg-gray-800 bg-opacity-50 border-0 border-b-2 border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-200 shadow-sm transition-all duration-150 text-base"
            placeholder="Create a secure password"
          />
          <button
            type="button"
            onClick={() => params.setShowPassword(!params.showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            {params.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {params.errors.password && (
          <p className="mt-2 text-sm text-red-400">{params.errors.password}</p>
        )}
      </div>

      {/* Confirm Password Field with Eye Icon */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-500">
          Confirm password
        </label>
        <div className="mt-1 relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={params.showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={params.formData.confirmPassword}
            onChange={params.handleChange}
            className="appearance-none block w-full px-4 py-3 pr-10 bg-gray-800 bg-opacity-50 border-0 border-b-2 border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-200 shadow-sm transition-all duration-150 text-base"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => params.setShowConfirmPassword(!params.showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            {params.showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {params.errors.confirmPassword && (
          <p className="mt-2 text-sm text-red-400">{params.errors.confirmPassword}</p>
        )}
      </div>
    </>
  );
};

export default Info;
