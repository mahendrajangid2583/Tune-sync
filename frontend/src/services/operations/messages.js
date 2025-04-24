import { messageEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";

const {SEND_MESSAGE,GET_MESSAGE,CHECK_LAST_ONLINE} = messageEndpoints;

export const sendMessage = async(data)=>{
    try {
        const response = await apiConnector("POST",SEND_MESSAGE,data);
        console.log(response)
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const getMessages = async(data)=>{
    console.log(data);
    try {
        const response = await apiConnector("POST",GET_MESSAGE,{from:data.from,to:data.to});
        return response;
    } catch (error) {
        console.log(error);
    }
}

export const checkLastOnline = async(data)=>{
    try {
        
        if(data){
            const response = await apiConnector("POST",CHECK_LAST_ONLINE,{userId:data});
            console.log("last online",response);
            return response.data;
        }
        
    } catch (error) {
        console.log(error);
    }
}