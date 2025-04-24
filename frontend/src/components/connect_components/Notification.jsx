import React, { useEffect, useState } from "react";

const Notification = ({ message, onClose, friends, changeChatUser }) => {
  const [matchedFriend, setMatchedFriend] = useState(null);

  useEffect(() => {
    const findUser = friends.find((user) => user._id === message.from);
    setMatchedFriend(findUser);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5500);
    
    const timer2 = setTimeout(()=>{
      setIsVisible(false);
    },[5000]);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const closeBox =()=>{
    setIsVisible(false);
    setTimeout(()=>{
       onClose();
    },300);
}


  return (
    <div
      onClick={() => changeChatUser(matchedFriend)}
      className={`fixed bottom-4 right-4 bg-gray-800 shadow-lg rounded-lg border border-gray-700 w-72 max-w-sm z-50 overflow-hidden transform transition-all duration-500 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      {/* Progress bar that decreases over 5 seconds */}
      <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 w-full">
        <div
          className="h-full bg-gray-800 origin-right"
          style={{
            animation: "shrink 5s linear forwards",
          }}
        />
      </div>

      {/* Notification Content */}
      <div className="flex items-center p-4">
        {/* Avatar */}
        {matchedFriend && (
          <div className="relative mr-3">
            <img
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
              src={matchedFriend.image}
              alt={matchedFriend.firstName}
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></span>
          </div>
        )}

        {/* Message Content */}
        <div className="flex-1">
          {matchedFriend && (
            <h2 className="text-sm font-semibold text-gray-200">
              {matchedFriend.firstName}
            </h2>
          )}
          {message && <p className="text-xs text-gray-400">{message.msg}</p>}
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Stop the event from bubbling up
            closeBox();
          }}
          className="text-gray-400 hover:text-gray-200 text-2xl focus:outline-none transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
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
