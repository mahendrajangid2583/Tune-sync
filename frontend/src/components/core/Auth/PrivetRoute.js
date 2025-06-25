import React from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const PrivetRoute = ({children}) => {
  const token = localStorage.getItem("token");

  if(token!==null){
    return children;
  }
  else{
    toast("You are not logged in");
    return <Navigate to={"/login"}/>
  }
  
}

export default PrivetRoute