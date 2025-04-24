import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../services/operations/auth";
import {useProfile} from "../pages/contexts/profileContext";

// Profile Dropdown Component
const ProfileDropdown = ({ onOpenProfile, onLogout}) => {
  return (
    <div className="absolute right-4 mt-12 w-48 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700">
      <div className="py-1">
        <button
          onClick={()=>{onOpenProfile()}}
          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
        >
          Open Profile
        </button>
        <button
          onClick={()=>{onLogout()}}
          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

const Header = ({show}) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("Home");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef(null);

  const {
    profileData,
    setProfileData
  } = useProfile();
  const [showId, setshowId] = useState(false);

  // Get first letter of firstName if profileData exists
  const firstInitial = profileData?.firstName
    ? profileData.firstName.charAt(0).toUpperCase()
    : "";

  // Profile dropdown handlers
  const handleOpenProfile = () => {
    navigate("/profile", { state: { data: profileData } });
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setProfileData(null);
    setshowId(true);
    setShowProfileDropdown(false);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both the dropdown and the profile icon
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileIconRef.current &&
        !profileIconRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    // Add event listener to the document
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []); 
  
  return (
    <div className="relative">
      <header className="sticky top-0 bg-gray-900/90 text-white backdrop-blur-md z-50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="text-2xl font-bold">
              TuneSync<span className="text-purple-500">.</span>
            </a>

            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <div
                    className={`${
                     ( show === "Home") ? "text-white" : "text-gray-400"
                    } font-medium hover:text-white transition-colors cursor-pointer`}
                    onClick={() => navigate("/")}
                  >
                    Home
                  </div>
                </li>
                <li>
                  <div
                    className={`${
                      show === "Connect" ? "text-white" : "text-gray-400"
                    } font-medium hover:text-white transition-colors cursor-pointer`}
                    onClick={() => navigate("/connect-page")}
                  >
                    Connect
                  </div>
                </li>
                <li>
                  <div
                    className={`${
                      show === "Library" ? "text-white" : "text-gray-400"
                    } font-medium hover:text-white transition-colors cursor-pointer`}
                    onClick={() => navigate("/library")}
                  >
                    Library
                  </div>
                </li>
                <li>
                  <div
                    href="#"
                    onClick={() => setCurrentTab("Artists")}
                    className={`${
                      currentTab === "Artists" ? "text-white" : "text-gray-400"
                    } font-medium hover:text-white transition-colors cursor-pointer`}
                  >
                    Artists
                  </div>
                </li>
              </ul>
            </nav>

            <div className="flex space-x-4 relative">
              {(showId || !profileData) ? (
                <>
                  <button
                    className="px-4 py-2 rounded-full border border-gray-600 text-white font-medium hover:border-white transition-colors"
                    onClick={() => navigate("/Login")}
                  >
                    Log In
                  </button>
                  <button
                    className="px-4 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
                    onClick={() => navigate("/Signup")}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <div
                  ref={profileIconRef}
                  className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold cursor-pointer hover:bg-purple-700 transition-colors"
                  onClick={toggleProfileDropdown}
                  title={profileData.firstName}
                >
                  {firstInitial}
                </div>
              )}

              {/* Profile Dropdown (conditionally rendered) */}
              {profileData && showProfileDropdown && (
                <div ref={dropdownRef}>
                  <ProfileDropdown
                    onOpenProfile={handleOpenProfile}
                    onLogout={handleLogout}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
