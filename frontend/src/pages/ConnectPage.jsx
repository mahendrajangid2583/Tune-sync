import React, { useEffect, useState } from "react";

import { X, UserPlus, Users, Bell, Search, Music } from "lucide-react";
import FriendCard from "../components/connect_components/FriendCard";
import {
  accept_friend_request,
  get_friends_list,
  get_pedding_request,
  remove_friend,
  search_friend,
  send_request,
} from "../services/operations/friends";
import Navbar from '../components/Navbar';
import MusicPlayer from "./Music_player";

const ConnectPage = () => {
  const [activeTab, setActiveTab] = useState("suggested");
  const [searchQuery, setSearchQuery] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriend] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const search = async () => {
      const response = await search_friend(token, searchQuery);
      console.log("response-friend", response);
      setSuggestedFriend(response.data);
    };
    search();
  }, [searchQuery]);

  useEffect(() => {
    const search = async () => {
      const response = await get_pedding_request(token);
      console.log("pending req", response);
      setFriendRequests(response);
    };
    search();
  }, []);

  const handleTabChange = (tab) => setActiveTab(tab);

  const updateFriend = (id) => {
    setFriendRequests(friendRequests.filter((f) => f._id !== id));
  };

  const handleSendFriendReq = (userId) => {
    setSuggestedFriend((prev) =>
      prev.map((user) =>
        user._id == userId ? { ...user, status: "pending" } : user
      )
    );
    send_request(token, userId);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black w-full text-white">
      {/* Main Content */}
      <Navbar show = {"Connect"}/>
      <div className="flex flex-col max-w-[1400px] m-auto  h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Connect Friends
          </h2>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search friends..."
              className="w-full bg-gray-800 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b max-w-[500px] border-gray-800">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "suggested"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => handleTabChange("suggested")}
          >
            <div className="flex items-center justify-center space-x-2">
              <UserPlus size={18} />
              <span>Suggested</span>
            </div>
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "requests"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => handleTabChange("requests")}
          >
            <div className="flex items-center justify-center space-x-2">
              <Bell size={18} />
              <span>Requests</span>
              <span className="bg-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {friendRequests.length}
              </span>
            </div>
          </button>
        </div>

        {/* Friend List */}
        <div className="flex-1 w-[800px] overflow-y-auto p-4">
          {activeTab === "suggested" ? (
            suggestedFriends.length > 0 ? (
              suggestedFriends.map((friend) => (
                <FriendCard
                  key={friend._id}
                  friend={friend}
                  handleSendFriendReq={handleSendFriendReq}
                  isPending={false}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 mt-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 0110 0M14 5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="mt-4">
                  {searchQuery
                    ? "No matches found"
                    : "No suggested friends yet"}
                </p>
              </div>
            )
          ) : friendRequests.length > 0 ? (
            friendRequests.map((friend) => (
              <FriendCard
                key={friend._id}
                id={friend._id}
                friend={friend.sender}
                updateFriend={updateFriend}
                isPending={true}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 mt-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 0110 0M14 5a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="mt-4">No pending requests</p>
            </div>
          )}
        </div>
      </div>
      <MusicPlayer/>
      {/* Toggle Button */}
    </div>
  );
};

export default ConnectPage;
