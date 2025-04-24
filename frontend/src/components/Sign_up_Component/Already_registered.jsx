import React from "react";

const Already_registered = () => {
  return (
    <div className="mt-6">
      <p className="text-center text-sm text-gray-400">
        Already registered?{" "}
        <a
          href="/login"
          className="font-medium text-purple-500 hover:text-cyan-300 transition-colors duration-150"
        >
          Sign in to your account
        </a>
      </p>
    </div>
  );
};

export default Already_registered;
