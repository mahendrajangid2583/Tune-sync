import React from 'react'
import { useNavigate } from 'react-router'

const Back_to_home = () => {
    const navigate = useNavigate();

  return (
    <div >
       <button
       type="button"
      onClick={() => navigate('/')}
      className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-2xl shadow-sm transition duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Home
    </button>
    </div>
    
  );
}

export default Back_to_home