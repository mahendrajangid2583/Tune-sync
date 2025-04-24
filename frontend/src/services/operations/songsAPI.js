import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { songEndpoints } from "../apis";

const {
   GET_SONG,
   AUTOSUGGETION_API,
   GET_PLAYLIST,
   GET_ARTIST
} = songEndpoints;

export const fetchSuggetions = async(data)=> {
    let result = [];
    
    try {
        const response = await apiConnector("GET",GET_SONG,null,null,{q:data});
        console.log("suggestion data", response);
        if(!response.data.success){
            throw new Error(response);
        }
        
        result = response.data.data;
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
    return result;
}

export const fetchPlaylist = async(data)=> {
    let result = [];
    
    try {
        const response = await apiConnector("GET",GET_PLAYLIST + `${data}`,null,null, null);
        console.log("suggestion data", response);
        if(!response.data.success){
            throw new Error(response);
        }
        
        result = response.data.data;
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
    return result;
}

export const fetchArtist = async(data)=> {
    let result = [];
    
    try {
        const response = await apiConnector("GET",GET_ARTIST + `${data}`,null,null, null);
        console.log("suggestion Artist Data", response);
        if(!response.data.success){
            throw new Error(response);
        }
        
        result = response.data.data;
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
    return result;
}