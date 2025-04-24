import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { friendEndpoints } from "../apis";

const {
  SEARCH_FRIEND,
  GET_FRIEND_LIST,
  REJECT_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  SEND_FRIEND_REQUEST,
  GET_PEDDING_REQUEST,
  REMOVE_FRIEND
} = friendEndpoints;

export const search_friend = async (token,data) => {
  let result = [];
  try {
    const response = apiConnector(
      "GET",
      SEARCH_FRIEND,
      null,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      { q: data }
    );

    result = response;
  } catch (error) {
    console.log(error);
  }
  return result;
};

export const get_friends_list = async (token) => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_FRIEND_LIST, null, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    result = response.data;
  } catch (error) {
    console.log("error",error);
  }
  return result;
};

export const send_request = async(token,data)=>{
    try {
        const response = await apiConnector("POST",SEND_FRIEND_REQUEST,{recipientId:data},
            {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            }
        );
        toast.success(response.data.message);
    } catch (error) {
        toast.error(error.response.data.message);
        console.log("error",error);
    }
}

export const get_pedding_request = async(token) => {
    let result = [];
    try {
        const response = await apiConnector("GET",GET_PEDDING_REQUEST,null,
            {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            }
        )
        console.log("pedding req data",response.data);
        result = response.data;
    } catch (error) {
        console.log(error);
    }
    return result;
}

export const accept_friend_request = async(token,data)=>{
    try {
        const response = await apiConnector("POST",ACCEPT_FRIEND_REQUEST,{requestId:data},
            {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            }
        )
        toast.success(response.data.message);
        return response;
    } catch (error) {
        console.log(error);
    }
}


export const remove_friend = async(token,data)=>{
  console.log("data",data);
  try {
    const response = await apiConnector("POST",REMOVE_FRIEND,{userId1:data},
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );

    toast.success(response.data.message);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const reject_friend_request = async(token,data)=>{
  console.log("data",data);
  try {
    const response = await apiConnector("POST",REJECT_FRIEND_REQUEST,{requestId:data},
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );

    toast.success(response.data.message);
    return response;
  } catch (error) {
    console.log(error);
  }
}
