import React, { useState } from "react";
import { UserPlus, MessageCircle, Check, X } from "lucide-react";
import {
  accept_friend_request,
  reject_friend_request,
  send_request,
} from "../../services/operations/friends";

const FriendCard = ({ id, friend, handleSendFriendReq, updateFriend, isPending }) => {
  const token = localStorage.getItem("token");
  const [accepted, setAccepted] = useState([]);

  const handleAcceptReq = async () => {
    try {
      await accept_friend_request(token, id);
      setAccepted((prev) => [...prev, id]);
      updateFriend(id, friend);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      await reject_friend_request(token, id);
      updateFriend(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-md rounded-xl px-6 py-4  flex items-center justify-between hover:shadow-lg transition-all duration-300 w-full">
      {/* Profile Section */}
      <div className="flex items-center space-x-4">
        <img
          src={friend.image}
          alt={friend.firstName}
          className="w-14 h-14 rounded-full object-cover border border-white/30 shadow-inner"
        />
        <div>
          <h3 className="font-semibold text-white text-lg">
            {friend.firstName} {friend.lastName}
          </h3>
          <p className="text-sm text-white/70">@{friend.Username}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {isPending ? (
          accepted.includes(id) ? (
            <div className="flex items-center gap-2 text-green-300 font-medium">
              <Check size={18} />
              <span>Connected</span>
            </div>
          ) : (
            <>
              <button
                onClick={handleAcceptReq}
                className="bg-green-500/80 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm shadow-sm"
              >
                <Check size={16} />
                Accept
              </button>
              <button
                onClick={handleReject}
                className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm shadow-sm"
              >
                <X size={16} />
                Decline
              </button>
            </>
          )
        ) : friend.status === "pending" ? (
          <span className="bg-yellow-400/30 text-yellow-100 px-3 py-1.5 rounded-lg text-sm font-medium">
            Requested
          </span>
        ) : friend.status === "accepted" ? (
          <span className="bg-blue-400/30 text-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium">
            Connected
          </span>
        ) : (
          <>
            <button
              onClick={() => handleSendFriendReq(friend._id)}
              className="bg-blue-500/80 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm shadow-sm"
            >
              <UserPlus size={16} />
              Connect
            </button>
            
          </>
        )}
      </div>
    </div>
  );
};

export default FriendCard;
