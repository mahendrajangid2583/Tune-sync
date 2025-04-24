import React, { useState } from "react";
import { UserPlus, MessageCircle, Check } from "lucide-react";
import {
  accept_friend_request,
  reject_friend_request,
  send_request,
} from "../../services/operations/friends";

const FriendCard = ({ id, friend,handleSendFriendReq, updateFriend, isPending }) => {
  const token = localStorage.getItem("token");
  const [accepted, setAccepted] = useState([]);

  

  const handleAcceptReq = async () => {
    try {
      const response = await accept_friend_request(token, id);
      setAccepted((prevAccepted) => [...prevAccepted, id]);
      updateFriend(id, friend);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await reject_friend_request(token, id);
      updateFriend(id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#1E1E1E] border border-[#2C2C2C] rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <div className="relative bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] p-4">
        {/* Profile Image */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 border-4 border-[#2C2C2C] rounded-full">
          <img
            src={friend.image}
            alt={friend.firstName}
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="ml-28 text-white">
          <h3 className="text-lg font-bold text-[#E0E0E0]">{`${friend.firstName} ${friend.lastName}`}</h3>
          <p className="text-sm text-[#888888] truncate">{friend.Username}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-[#121212] space-y-3">
        {isPending ? (
          accepted.includes(id) ? (
            <div className="flex items-center justify-center text-green-400 font-medium space-x-2">
              <Check className="w-5 h-5" />
              <span>Connected</span>
            </div>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleAcceptReq}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>Accept</span>
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Decline
              </button>
            </div>
          )
        ) : (
          <div className="flex space-x-3">
            {friend.status == "pending" ? (
              <div className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center space-x-2">
                Requested
              </div>
            ) : friend.status == "accepted" ? (
              <div className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center space-x-2">
                Accepted
              </div>
            ) : (
              <button
                onClick={() => handleSendFriendReq(friend._id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Connect</span>
              </button>
            )}

            <button className="flex-1 bg-[#2C2C2C] hover:bg-[#3C3C3C] text-[#E0E0E0] px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Message</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendCard;
