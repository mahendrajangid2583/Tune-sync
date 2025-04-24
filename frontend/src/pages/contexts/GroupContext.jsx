import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserGroup } from '../../services/operations/groups';
import { getAllGroup } from '../../services/operations/groups';

// Create a Context
const GroupContext = createContext();

// Create a Provider Component
export const GroupProvider = ({ children }) => {
  const [groupState, setGroupState] = useState({
    isInGroup: false,
    groupId: null,
    isAdmin: false,
  });


  // Function to update group state
  const updateGroupState = (newState) => {
    setGroupState((prevState) => ({ ...prevState, ...newState }));
  };

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(()=>{
    const fetch = async()=>{
        const result = await getUserGroup(user._id);
        console.log("group of user",result);
        if(result.data !== null){
            const groupId = result.data._id;
            const groupName = result.data.name;
            const adminId = result.data.admin;
            const isAdmin = adminId == user._id ? true : false;
            setGroupState({
                isInGroup : true,
                groupId : groupId,
                isAdmin : isAdmin,
                groupName : groupName
            })
        }
    }

    fetch();
  },[]);
  console.log("group state",groupState);

  return (
    <GroupContext.Provider value={{ groupState, updateGroupState }}>
      {children}
    </GroupContext.Provider>
  );
};

// Custom Hook to use the Group Context
export const useGroup = () => {
  return useContext(GroupContext);
};