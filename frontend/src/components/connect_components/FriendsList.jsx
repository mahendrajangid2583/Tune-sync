import React, { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { AiTwotoneMessage } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { useGroup } from "../../pages/contexts/GroupContext";
import { useSocket } from "../../pages/contexts/SocketContext";
import { createGroup } from "../../services/operations/groups";
import toast from "react-hot-toast";

function FriendsList({
  friends,
  onlineUsers,
  onRemove,
  openChatBox,
  changeChatUser,
}) {
  const { groupState, updateGroupState } = useGroup();
  const socket = useSocket();

  if (friends.length === 0) {
    return (
      <div className="bg-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-400 italic">No friends yet</p>
      </div>
    );
  }

  const changeUserChat = (friend) => {
    changeChatUser(friend);
    openChatBox(true);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const handleInviteFriend = async (userId) => {
    console.log("invite called");
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

        //send friend a invitaion using socket
        socket.emit("send-invitaion", {
          to: userId,
          groupId: result.data._id,
          groupName: user.firstName+"'s Group",
          senderName: user.firstName,
          senderId: user._id,
        });
      }
    } else {
      console.log("already have group");
      socket.emit("send-invitaion", {
        to: userId,
        groupId: groupState.groupId,
        groupName: user.firstName+"'s Group",
        senderName: user.firstName,
        senderId: user._id,
      });
    }
  };

  return (
    <div className=" ">
      <ul className="divide-y divide-gray-600">
        {friends.map((friend) => (
          <li
            key={friend._id}
            className="p-4 mb-2 cursor-pointer bg-gray-800 rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center">
              <div className=" relative flex items-center justify-center mr-3">
                <img className="w-12 h-12 rounded-full" src={friend.image} />
                <span
                  className={`${
                    onlineUsers.includes(friend._id)
                      ? "bg-green-500"
                      : "bg-red-500"
                  } w-[15px] h-[15px] border-2 border-[#3a364f] rounded-full absolute bottom-[3px] right-[-3px] `}
                ></span>
              </div>
              <div className="">
                <h3 className="text-white font-medium">{`${friend.firstName} ${friend.lastName}`}</h3>
                <p className="text-gray-400 text-xs"> {friend.Username}</p>
              </div>
            </div>
            {/* <button
              onClick={() => onRemove(friend._id)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Remove
            </button> */}
            <div className=" flex gap-3">
              <button onClick={() => changeUserChat(friend)}>
                <BsChatDots
                  className="text-white hover:scale-105 hover:text-gray-300 transition-scale duration-200"
                  size={24}
                />
              </button>
              <button onClick={() => handleInviteFriend(friend._id)}>
                <PlusIcon
                  className="text-white hover:scale-105 hover:text-gray-300 transition-scale duration-200"
                  size={24}
                />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendsList;
