import React, { useState, useEffect } from "react";
import FriendsList from "./FriendsList";
import { X, Users } from "lucide-react";
import { useSocket } from "../../pages/contexts/SocketContext";
import {
  get_friends_list,
  remove_friend,
} from "../../services/operations/friends";
import ChatContainer from "./ChatContainer";
import Notification from "./Notification";
import notificationAudio from "./audio/notification.wav"

const MyFriendButton = () => {
  // Function to remove a friend
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [isChatOpen,setIsChatOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  // Fetch friends
  const token = localStorage.getItem("token");

  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : [];
    console.log("current user", currentUser);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await get_friends_list(token);
        console.log("list", response);
        setFriends(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [isOpen, onlineUsers]);

  //get online users ids
  const socket = useSocket();
  console.log(socket);
  useEffect(() => {
    socket.emit("getAll-user");
    socket.on("recieve-user", (data) => {
      setOnlineUsers(data);
    });

    return () => {
      if (socket) {
        socket.off("recieve-user");
      }
    };
  }, []);

 
  const removeFriend = (friendId) => {
    const friend = friends.find((f) => f._id === friendId);
    if (!friend) return;

    // Remove from friends list
    setFriends(friends.filter((f) => f._id !== friendId));
    remove_friend(token, friendId);
  };

  const dismissNotification = () => {
    setNotificationMessage(null);
  };

  const changeChatUser = (data) => {
    console.log("currentchat user", data);
    setCurrentChat(data);
    setIsChatOpen(true);
    setIsOpen(true);
    dismissNotification()
  };

  const closeChatBox = (data)=>{
    setIsChatOpen(false);
  }

  const openChatBox = (data)=>{
    setIsChatOpen(true);
  }

  

  useEffect(() => {
    if (notificationMessage) {
      const audio = new Audio(notificationAudio);
      audio.play();
    }
  }, [notificationMessage]);
    

  return (
    <div className=" relative z-30">
      {/* //notification */}
      { notificationMessage &&
        <Notification
          message={notificationMessage}
          onClose={dismissNotification}
          friends = {friends}
          changeChatUser= {changeChatUser}
        />
      }
      <button
        onClick={toggleSidebar}
        className={`fixed ${
          isOpen ? "hidden" : "block"
        } group z-10 right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full shadow-lg hover:scale-110 transition-transform`}
      >
        {!isOpen && <Users size={24} />}
        <div
          className={`absolute text-white text-sm pointer-events-none border-[1px] border-white px-2 bg-black bg-opacity-50  opacity-0 ${
            !isOpen ? "group-hover:opacity-80" : ""
          }  transition-opacity duration-700 right-16 top-0`}
        >
          Connect Friend
        </div>
      </button>

      {/* Friend Connect Sidebar */}
      <div
        className={`fixed top-20 border border-gray-600 rounded-md right-2  h-[620px] w-[360px] bg-gradient-to-b from-gray-900 via-gray-800 to-black shadow-2xl transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-3 relative w-full mx-auto">
          <div className=" flex border-b border-gray-700 mb-4 justify-between items-start">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              My Friends
            </h2>
            <button
              onClick={closeSidebar}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className=" relative scrollbar-thin z-10">
            <FriendsList
              friends={friends}
              onlineUsers={onlineUsers}
              onRemove={removeFriend}
              openChatBox= {openChatBox}
              changeChatUser={changeChatUser}
            />
          </div>
          
            <div
              className={`fixed z-30 top-0 left-0 border border-gray-600 rounded-md   h-[620px] w-[360px] bg-gradient-to-b from-gray-900 via-gray-800 to-black shadow-2xl transform transition-transform duration-500 ease-in-out scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-900 ${
                isChatOpen ? "translate-x-0" : "translate-x-full"
              }`}
            > 
              <ChatContainer
                currentChat={currentChat}
                currentUser={currentUser}
                closeChatBox= {closeChatBox}
                isChatOpen = {isChatOpen}
                setNotificationMessage={setNotificationMessage}
              />
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default MyFriendButton;
