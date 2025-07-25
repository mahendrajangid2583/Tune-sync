import React, { useEffect, useState } from "react";

const Already_registered = () => {
  const [isLoaded, setIsLoaded] = useState(false);
      useEffect(() => {
        setIsLoaded(true);
      }, []);
  return (
    <div 
    className={`mt-6 transition-all duration-500 delay-200 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
    >
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
