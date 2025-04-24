import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Edit, 
  Music, 
  Users, 
  UserPlus, 
  Activity, 
  Play, 
  Heart 
} from "lucide-react";
import Navbar from "../components/Navbar"
import MusicPlayer from "./Music_player";

const ProfilePage = ({ userData }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const location = useLocation();
  const data = location.state?.data;

  // Sample user data - replace with actual data from props
  const user = userData || {
    firstName: "Pakshu",
    lastName: "Namdev",
    userName: "vitthalnamdev",
    profileImage: null,
    bio: "Music enthusiast and aspiring producer. I love discovering new artists and sharing playlists.",
    favoriteGenres: ["Hip Hop", "Electronic", "Jazz", "Alternative"],
    recentlyPlayed: [
      { id: 1, title: "Midnight City", artist: "M83", albumArt: "/api/placeholder/60/60" },
      { id: 2, title: "Redbone", artist: "Childish Gambino", albumArt: "/api/placeholder/60/60" },
      { id: 3, title: "Flashing Lights", artist: "Kanye West", albumArt: "/api/placeholder/60/60" }
    ]
  };
  
  // First initial for the profile picture placeholder
  const firstInitial = data?.firstName ? data.firstName.charAt(0).toUpperCase() : 'V';
  const firstName = data?.firstName || user.firstName;
  const lastName = data?.lastName || user.lastName;
  const userName = data?.Username || user.userName;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen w-full text-white font-sans overflow-x-hidden">
      <Navbar show="Profile" />
      
      {/* Profile Header */}
      <div className="relative w-full">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-purple-900/50 to-transparent"></div>
        
        <div className="container mx-auto px-6 pt-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Picture */}
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
              {firstInitial}
            </div>
            
            {/* Profile Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold text-white">
                {firstName} {lastName}
              </h1>
              <p className="text-purple-300 text-lg mt-2">@{userName}</p>
              <p className="max-w-xl mt-4 text-gray-300">{user.bio}</p>
              
              <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                {user.favoriteGenres.map((genre, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm hover:bg-purple-800/50 transition-all"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 mt-8 border-b border-gray-800">
        <div className="flex overflow-x-auto space-x-2">
          {[
            { name: 'profile', icon: <Users size={18} />, label: 'Profile' },
            { name: 'playlists', icon: <Music size={18} />, label: 'Playlists' },
            { name: 'following', icon: <UserPlus size={18} />, label: 'Following' },
            { name: 'activity', icon: <Activity size={18} />, label: 'Activity' }
          ].map((tab) => (
            <button 
              key={tab.name}
              className={`px-4 py-3 rounded-t-lg flex items-center gap-2 ${
                activeTab === tab.name 
                  ? 'bg-purple-900/50 text-purple-300 border-b-2 border-purple-500' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Social Stats and Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 md:col-span-2 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">My Stats</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Followers", value: "27", icon: <Users size={24} className="text-purple-400" /> },
                  { label: "Following", value: "48", icon: <UserPlus size={24} className="text-purple-400" /> },
                  { label: "Playlists", value: "12", icon: <Music size={24} className="text-purple-400" /> },
                  { label: "Favorite Artists", value: "15", icon: <Heart size={24} className="text-purple-400" /> },
                  { label: "Total Tracks", value: "321", icon: <Play size={24} className="text-purple-400" /> },
                  { label: "Listening Hours", value: "248", icon: <Activity size={24} className="text-purple-400" /> }
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-700/50 p-5 rounded-lg hover:bg-purple-900/30 transition-colors flex items-center gap-4"
                  >
                    {stat.icon}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-purple-300">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recently Played */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
              
              <div className="space-y-4">
                {user.recentlyPlayed.map(track => (
                  <div 
                    key={track.id} 
                    className="flex items-center gap-4 bg-gray-700/50 p-3 rounded-md group hover:bg-purple-900/30 transition-colors"
                  >
                    <img 
                      src={track.albumArt} 
                      alt={`${track.title} album art`} 
                      className="w-16 h-16 rounded-md"
                    />
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-purple-300 transition-colors">{track.title}</p>
                      <p className="text-sm text-gray-400">{track.artist}</p>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <Play size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                ))}
                
                <button className="w-full mt-4 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-md text-sm transition-colors flex items-center justify-center gap-2">
                  <Heart size={16} /> View Full Music History
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Placeholder for other tabs */}
        {["playlists", "following", "activity"].map(tab => (
          activeTab === tab && (
            <div key={tab} className="text-center py-16 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400 text-xl">{tab.charAt(0).toUpperCase() + tab.slice(1)} content coming soon</p>
            </div>
          )
        ))}
      </div>
      
      <MusicPlayer/>
    </div>
  );
};

export default ProfilePage;