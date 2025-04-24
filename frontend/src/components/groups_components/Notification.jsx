import React, { useEffect, useState } from "react";

import { User, Check, X, MessageSquare } from "lucide-react";
import { useSocket } from "../../pages/contexts/SocketContext";
import { useGroup } from "../../pages/contexts/GroupContext";

const Notification = ({ message, onClose }) => {
  // State to manage visibility
  const [isVisible, setIsVisible] = useState(false);
  const [buttonState, setButtonState] = useState("pending");
  
  const socket = useSocket();
  const { groupState, updateGroupState } = useGroup();

  // Automatically close the notification after 5 seconds
  useEffect(() => {
    
    const timer = setTimeout(() => {
      onClose();
    }, 5500);

    const timer2 = setTimeout(()=>{
      setIsVisible(false);
    },[5000]);

    return () => clearTimeout(timer);
  }, []);

  // Trigger visibility animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const handleAccept = () => {
    setButtonState("accepted");
    if(message.message){
      //if another user request you to join you group
      socket.emit("send-accepted", { from: message.senderId, groupId: message.groupId, to: message.senderId,message:`You joined ${message.groupName}`,groupName: message.groupName,set:"setuser" });
    }
    else{
      //if anyone accept your invitation request
      socket.emit("send-accepted", { from: user._id, groupId: message.groupId, to: message.senderId ,message:`Group join request accepted`});
      updateGroupState({
        isInGroup: true,
        groupId: message.groupId,
        isAdmin: false,
        groupName: message.groupName
      });
    }

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleDecline = () => {
    
    setButtonState("declined");
    setTimeout(() => {
      onClose();
    }, 400);
    setIsVisible(false);
  };

  return (
    <div
      className={`fixed bottom-4 right-4 bg-gray-800 shadow-lg rounded-lg border border-gray-700 w-72 max-w-sm z-50 overflow-hidden transform transition-all duration-500 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      {/* Progress bar that decreases over 5 seconds */}
      <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 w-full">
        <div
          className="h-full bg-gray-800 origin-left"
          style={{
            animation: "shrink 5s linear forwards",
          }}
        />
      </div>

      {/* Notification Content */}
      <div className="p-4 ">
        {/* Heading */}
        <h3 className="text-base font-bold text-purple-400 ">
          {message.message ? "Group join Request":"Invitation Request"}
        </h3>

        {/* Message Content */}
        <div className="">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-200">
              From: {message.senderName || "Unknown User"}
            </h2>
          </div>

          {/* Action Buttons */}
          {buttonState === "pending" && (
            <div className="mt-4 flex justify-between space-x-2">
              <button
                onClick={handleAccept}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded flex items-center justify-center transition-colors"
              >
                <Check size={16} className="mr-1" />
                ACCEPT
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded flex items-center justify-center transition-colors"
              >
                <X size={16} className="mr-1" />
                DECLINE
              </button>
            </div>
          )}

          {buttonState === "accepted" && (
            <div className="mt-4">
              <div className="bg-green-600 text-white font-bold py-2 rounded text-center">
                INVITATION ACCEPTED
              </div>
            </div>
          )}

          {buttonState === "declined" && (
            <div className="mt-4">
              <div className="bg-red-600 text-white font-bold py-2 rounded text-center">
                INVITATION DECLINED
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes shrink {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;
