import React, { useEffect, useState } from "react";

function Submit_button(params) {
    const [isLoaded, setIsLoaded] = useState(false);
        useEffect(() => {
          setIsLoaded(true);
        }, []);
  return (
    <div 
    className={`submit-container transition-all duration-500 delay-200 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
    >
      <button
        type="submit"
        disabled={params.isSubmitting}
        className="w-full flex justify-center py-3 px-4 border-0 rounded-xl shadow-lg shadow-blue-700/30 text-base font-medium text-white bg-gradient-to-r bg-purple-700 hover:bg-purple-900 focus:outline-none disabled:opacity-50 transition-all duration-300"
        onClick={params.handleSubmit}
      >
        {params.isRedirecting ? ( // Use isRedirecting from state instead of params
          <div>Redirecting...</div>
        ) : (
          "Join Network"
        )}
      </button>
    </div>
  );
}

export default Submit_button;
