import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../services/operations/auth";
import { useProfile } from "../pages/contexts/profileContext";
import { useGroup } from "../pages/contexts/GroupContext";
import toast from "react-hot-toast";
import ProfileDropdown from "./profile_component/ProfileDropdown";

const Header = ({ show }) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("Home");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileIconRef = useRef(null);
  const { updateGroupState } = useGroup();

  const { profileData, setProfileData } = useProfile();
  const [showId, setshowId] = useState(false);

  const firstInitial = profileData?.firstName
    ? profileData.firstName.charAt(0).toUpperCase()
    : "";

  const handleOpenProfile = () => {
    navigate("/profile", { state: { data: profileData } });
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    updateGroupState({
      isInGroup: false,
      groupId: null,
      isAdmin: false,
      groupName: null,
    });
    setProfileData(null);
    setshowId(true);
    setShowProfileDropdown(false);
    toast.success("Logged out");
  };

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setShowProfileDropdown(!showProfileDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileIconRef.current &&
        !profileIconRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <header className="sticky top-0 bg-gray-900/90 text-white backdrop-blur-md z-50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold cursor-pointer">
              TuneSync<span className="text-purple-500">.</span>
            </a>

            {/* Hamburger for mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white focus:outline-none"
                aria-label="Toggle Menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <div
                    className={`${
                      show === "Home" ? "text-white" : "text-gray-400"
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
                    className={`${
                      currentTab === "Artists"
                        ? "text-white"
                        : "text-gray-400"
                    } font-medium hover:text-white transition-colors cursor-pointer`}
                    onClick={() => setCurrentTab("Artists")}
                  >
                    Artists
                  </div>
                </li>
              </ul>
            </nav>

            {/* Auth/Profile buttons */}
            <div className="flex space-x-4 relative">
              {showId || !profileData ? (
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
                <button
                  ref={profileIconRef}
                  className="w-12 h-12 rounded-full relative bg-purple-600 flex items-center justify-center text-white text-xl font-bold cursor-pointer hover:bg-purple-700 transition-colors"
                  onClick={toggleProfileDropdown}
                  title={profileData.firstName}
                >
                  {firstInitial}
                </button>
              )}

              {profileData && showProfileDropdown && (
                <div ref={dropdownRef} className="absolute right-0 top-14">
                  <ProfileDropdown
                    onOpenProfile={handleOpenProfile}
                    onLogout={handleLogout}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Nav Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 border-t border-gray-700 pt-4">
              <ul className="flex flex-col space-y-3">
                <li>
                  <div
                    className={`${
                      show === "Home" ? "text-white" : "text-gray-400"
                    } font-medium hover:text-white transition-colors cursor-pointer`}
                    onClick={() => {
                      navigate("/");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Home
                  </div>
                </li>
                <li>
                  <div
                    className={`${
                      show === "Connect" ? "text-white" : "text-gray-400"
                    } font-medium hover:text-white transition-colors cursor-pointer`}
                    onClick={() => {
                      navigate("/connect-page");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Connect
                  </div>
                </li>
                <li>
                  <div
                    className={`${
                      show === "Library" ? "text-white" : "text-gray-400"
                    } font-medium hover:text-white transition-colors cursor-pointer`}
                    onClick={() => {
                      navigate("/library");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Library
                  </div>
                </li>
                <li>
                  <div
                    className={`${
                      currentTab === "Artists"
                        ? "text-white"
                        : "text-gray-400"
                    } font-medium hover:text-white transition-colors cursor-pointer`}
                    onClick={() => {
                      setCurrentTab("Artists");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Artists
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
