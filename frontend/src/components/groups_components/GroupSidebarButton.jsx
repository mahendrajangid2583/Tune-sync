import React, { useState, useEffect } from "react";
import { GrGroup } from "react-icons/gr";
import { X, Users } from "lucide-react";
import { useSocket } from "../../pages/contexts/SocketContext";
import MusicGroupsSidebar from "./MusicGroupsSidebar";
import Notification from "./Notification";
import notificationAudio from "../connect_components/audio/notification.wav"
import { getAllGroup } from '../../services/operations/groups';
import GroupIndicator from "./GroupIndicator";
import { useGroup } from "../../pages/contexts/GroupContext";

const GroupSidebarButton = () => {
  // Function to remove a friend
  const [isOpen, setIsOpen] = useState(false);
  const [groups,setGroups] = useState([]);

  const [isChatOpen,setIsChatOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);

  const socket = useSocket();
  const {groupState} = useGroup();
  // Fetch friends
  const token = localStorage.getItem("token");

  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : [];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  

  useEffect(()=>{
    const fetch = async()=>{
      const response = await getAllGroup();
      console.log("all groups",response);
      setGroups(response.data.map(group => 
        ({ 
          ...group, 
          expanded: false 
        })
      ));
      
    }
    fetch();
  },[isOpen]);

  const toggleGroup = (groupId) => {
    console.log(groupId);
    setGroups(groups.map(group => 
      group._id === groupId ? { ...group, expanded: !group.expanded } : group
    ));
  };

  useEffect(() => {
      if (notificationMessage) {
        const audio = new Audio(notificationAudio);
        audio.play();
      }
  }, [notificationMessage]);

  useEffect(()=>{
    socket.on("recieved-invitation",(data)=>{
        console.log("invite recived",data);
        setNotificationMessage(data);
    })
  },[]);

 const dismissNotification = ()=>{
    setNotificationMessage(null);
 }
  

  return (
    <div className=" relative z-40">
      {/* //notification */}
      { notificationMessage &&
        <Notification
          message={notificationMessage}
          onClose={dismissNotification}
        />
      }
      {
        groupState.isInGroup && <GroupIndicator />
      }
      
      <button
        onClick={toggleSidebar}
        className={`fixed ${
          isOpen ? "hidden" : "block"
        }  group z-10 left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full shadow-lg hover:scale-110 transition-transform`}
      >
        {!isOpen && <GrGroup size={24}/>}
        <div
          className={`absolute text-white text-sm pointer-events-none border-[1px] border-white px-2 bg-black bg-opacity-50  opacity-0 ${
            !isOpen ? "group-hover:opacity-80" : ""
          }  transition-opacity duration-700 left-16 top-0`}
        >
          Groups
        </div>
      </button>

      {/* Friend group Sidebar */}
      <div
        className={`fixed overflow-hidden top-20 border border-gray-600 rounded-md left-2  h-[620px] w-[360px] bg-gradient-to-b from-gray-900 via-gray-800 to-black shadow-2xl transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative w-full mx-auto">
          <div className=" flex border-b p-3 border-gray-700  justify-between items-start">
            <h2 className="text-xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Groups
            </h2>
            <button
              onClick={closeSidebar}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className=" relative overflow-hidden scrollbar-thin ">
            <MusicGroupsSidebar
              groups = {groups}
              toggleGroup = {toggleGroup}
            />
          </div>
          
            <div
              className={`fixed z-30 top-0 left-0 border border-gray-600 rounded-md   h-[620px] w-[360px] bg-gradient-to-b from-gray-900 via-gray-800 to-black shadow-2xl transform transition-transform duration-500 ease-in-out scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-900 ${
                isChatOpen ?  "translate-x-0" : "-translate-x-full"
              }`}
            > 
              {/* <ChatContainer
                currentChat={currentChat}
                currentUser={currentUser}
                closeChatBox= {closeChatBox}
                isChatOpen = {isChatOpen}
                setNotificationMessage={setNotificationMessage}
              /> */}
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default GroupSidebarButton;
