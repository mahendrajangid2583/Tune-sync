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
import Navbar from "../components/Navbar";
import MusicPlayer from "./Music_player";
import SkeletonCard from "../components/connect_components/SkeletonCard";

const ConnectPage = () => {
  const [activeTab, setActiveTab] = useState("suggested");
  const [searchQuery, setSearchQuery] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriend] = useState([]);
  const [isLoadingSuggested, setIsLoadingSuggested] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const search = async () => {
      if (searchQuery != "") {
        setIsLoadingSuggested(true);
        const response = await search_friend(token, searchQuery);
        setSuggestedFriend(response.data);
        setIsLoadingSuggested(false);
      }
    };
    search();
  }, [searchQuery]);

  useEffect(() => {
    const fetchPending = async () => {
      setIsLoadingRequests(true);
      const response = await get_pedding_request(token);
      setFriendRequests(response);
      setIsLoadingRequests(false);
    };
    fetchPending();
  }, []);

  const Spinner = () => (
    <div className="flex justify-center py-10">
      <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );

  const handleTabChange = (tab) => setActiveTab(tab);

  const updateFriend = (id) => {
    setFriendRequests(friendRequests.filter((f) => f._id !== id));
  };

  const handleSendFriendReq = (userId) => {
    setSuggestedFriend((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, status: "pending" } : user
      )
    );
    send_request(token, userId);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black w-full text-white">
      <Navbar show="Connect" />

      <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Connect Friends
          </h2>
        </div>

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

        <div className="flex border-b border-gray-800">
          <button
            className={`flex-1 py-3 text-center font-medium text-sm sm:text-base ${
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
            className={`flex-1 py-3 text-center font-medium text-sm sm:text-base ${
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

        <div className="flex-1 w-full sm:max-w-[800px] mx-auto overflow-y-auto p-4">
          {activeTab === "suggested" ? (
            isLoadingSuggested ? (
              <div className="grid grid-cols-1 gap-2">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : suggestedFriends.length > 0 ? (
              <div className="grid grid-cols-1  gap-2">
                {suggestedFriends.map((friend) => (
                  <FriendCard
                    key={friend._id}
                    friend={friend}
                    handleSendFriendReq={handleSendFriendReq}
                    isPending={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-10">
                ...No suggested friends
              </div>
            )
          ) : isLoadingRequests ? (
            <div className="grid grid-cols-1 gap-2">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : friendRequests.length > 0 ? (
            <div className="grid grid-cols-1  gap-2">
              {friendRequests.map((friend) => (
                <FriendCard
                  key={friend._id}
                  id={friend._id}
                  friend={friend.sender}
                  updateFriend={updateFriend}
                  isPending={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">
              ...No pending requests
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ConnectPage;
