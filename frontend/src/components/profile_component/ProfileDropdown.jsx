import React from 'react'

const ProfileDropdown = ({ onOpenProfile, onLogout }) => {
  return (
    <div className="absolute -right-3 mt-12 w-48 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700">
      <div className="py-1">
        <button
          onClick={() => {
            onOpenProfile();
          }}
          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
        >
          Open Profile
        </button>
        <button
          onClick={() => {
            onLogout();
          }}
          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};



export default ProfileDropdown
