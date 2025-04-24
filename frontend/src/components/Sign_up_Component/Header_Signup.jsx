import React from "react";

const Header_Signup = (params) => {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-10 -left-24 w-64 h-64 bg-blue-900 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1/3 bg-gradient-to-t from-indigo-900 to-transparent opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-900 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br bg-purple-400 p-3 shadow-lg shadow-indigo-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-full w-full text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
        <h1 className="mt-2 text-center text-2xl font-bold text-purple-500">
          Create Account
        </h1>
      </div>
    </>
  );
};

export default Header_Signup;
