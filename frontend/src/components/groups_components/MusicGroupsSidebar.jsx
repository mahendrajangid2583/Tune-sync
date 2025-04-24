import React, { useEffect, useState } from "react";
import {
  Headphones,
  Users,
  Music,
  ChevronDown,
  ChevronRight,
  User,
  Plus,
  Play,
  Pause,
} from "lucide-react";
import { useGroup } from "../../pages/contexts/GroupContext";
import { createGroup, deleteGroup, exitGroup } from "../../services/operations/groups";
import { useSocket } from "../../pages/contexts/SocketContext";
import toast from "react-hot-toast";

const MusicGroupsSidebar = ({ groups, toggleGroup }) => {
  const { groupState, updateGroupState } = useGroup();
  const [joinReq, setJoinReq] = useState(false);
  const socket = useSocket();
  const [onlineUsers,setOnlineUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  const createNewGroup = async()=>{
    if (groupState.isInGroup === false) {
      console.log("no group");
      //create group
      const result = await createGroup({
        name: `${user.firstName}'s Group`,
        adminId: user._id,
      });
      if (result.success) {
        toast.success("Group Created Successfully");
        updateGroupState({
          isInGroup: true,
          groupId: result.data._id,
          isAdmin: true,
          groupName: result.data.name
        });
      }
    }
    else{
      toast.error("You already in a group, to create new group first leave the group");
    }
  }
  
 useEffect(() => {

     socket.on("recieve-user", (data) => {
       setOnlineUsers(data);
     });
 
     return () => {
       if (socket) {
         socket.off("recieve-user");
       }
     };
   }, []);
  

  // Join a group
  const joinGroup = (group) => {
    setJoinReq(true);

    socket.emit("send-invitaion", {
      to: group.admin._id,
      groupId: group._id,
      groupName: group.name,
      senderName: user.firstName,
      senderId: user._id,
      message: "to_join_group",
    });

    setTimeout(() => {
      setJoinReq(false);
    }, 5000);
  };

  const token = localStorage.getItem("token");
  const leaveGroup = async (data) => {
    try {
      if (groupState.isAdmin) {
        const response = await deleteGroup(data, token);
      } else {
        const response = await exitGroup(data, token);
      }

      await updateGroupState({
        isInGroup: false,
        groupId: null,
        isAdmin: false,
        groupName: null,
      });
    } catch (error) {
      console.log("error while leaving group");
    }
  };

  return (
    <div className=" w-full h-[560px] bg-gray-900 border-r border-gray-700 flex flex-col text-gray-200">
      {/* Header */}
      <div className="p-4 bg-gray-800 text-white font-semibold flex items-center justify-between">
        <div className="flex items-center">
          <Headphones className="mr-2" size={20} />
          <span>Listening Groups</span>
        </div>
        <button className="text-gray-300 hover:text-white bg-gray-700 p-1 rounded-full">
          <Plus size={18} />
        </button>
      </div>

      {/* Create Group Button */}
      <div className="px-4 py-3">
        <button onClick={()=> createNewGroup()}
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center">
          <Users className="mr-2" size={16} />
          <span>{groupState.isInGroup ? "Already in a Group":"Create New Group"}</span>
        </button>
      </div>

      {/* Groups */}
      <div className="flex-grow overflow-y-auto scrollbar-thin">
        {groups.map((group) => (
          <div key={group._id} className="border-b border-gray-700">
            <div
              className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-800"
              onClick={() => toggleGroup(group._id)}
            >
              <div className="flex items-center">
                {group.expanded ? (
                  <ChevronDown size={16} className="mr-2 text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="mr-2 text-gray-400" />
                )}
                <div className=" flex flex-col">
                <span className="font-medium">{group.name}</span>
                {group._id == groupState.groupId && (
                  <span
                    className=" text-green-600 text-[10px]"
                  >
                    Current Group
                  </span>
                )}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                

                {onlineUsers.includes(group.admin._id) && (
                  <div className=" text-green-500 rounded-full mr-2 animate-pulse">Active</div>
                )}
                <span className="text-xs text-gray-400">
                  {group.members.length}
                </span>
              </div>
            </div>

            {/* Group details when expanded */}
            {group.expanded && (
              <div className="bg-gray-800 pb-2">
                {/* Currently playing song */}
                {/* {group.currentlyPlaying && (
                  <div className="px-6 py-2 flex items-center">
                    {group.isPlaying ? 
                      <Pause size={14} className="text-green-400 mr-2" /> : 
                      <Play size={14} className="text-gray-400 mr-2" />
                    }
                    <div className="text-xs">
                      <div className="text-green-400">Now Playing:</div>
                      <div className="text-gray-300">{group.currentlyPlaying}</div>
                    </div>
                  </div>
                )}  */}

                {/* Members in group */}
                <div className="mt-1">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="px-6 py-2 flex items-center hover:bg-gray-700"
                    >
                      <div className="relative mr-3">
                        <User size={16} className="text-gray-400" />
                        <div
                          className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
                            onlineUsers.includes(member._id) ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm">{member.firstName}</span>
                        {member._id == group.admin._id && (
                          <span className="ml-2 text-xs text-purple-400">
                            (Host)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Join button */}
                <div className="px-6 pt-2">
                  {groupState.groupId === group._id ? (
                    <button
                      className="w-full py-1 text-xs bg-purple-700 hover:bg-purple-600 rounded text-white"
                      onClick={() => leaveGroup(group._id)}
                    >
                     Leave Group
                    </button>
                  ) : (
                    <button
                      className="w-full py-1 text-xs bg-purple-700 hover:bg-purple-600 rounded text-white"
                      onClick={() => joinGroup(group)}
                    >
                      {joinReq ? "Request send" : "Request to join"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status footer */}
      <div className="px-4 py-3 bg-gray-800 text-xs text-gray-400 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>6 friends listening</span>
        </div>
        <div className="flex items-center">
          <Music size={14} className="mr-1" />
          <span>3 active groups</span>
        </div>
      </div>
    </div>
  );
};

export default MusicGroupsSidebar;
