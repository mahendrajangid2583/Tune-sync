const BASE_URL = process.env.REACT_APP_BASE_URL


export const endpoints ={
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login"
}

export const songEndpoints = {
    AUTOSUGGETION_API: BASE_URL + "songs/autosuggestion",
    GET_SONG: BASE_URL + "songs/song/:id",
    GET_PLAYLIST: BASE_URL + "songs/playlists/",
    GET_ARTIST: BASE_URL + "songs/artists/"
}


export const friendEndpoints = {
    SEARCH_FRIEND: BASE_URL + "friend/search-friend",
    GET_FRIEND_LIST : BASE_URL + "friend/get-friends",
    SEND_FRIEND_REQUEST : BASE_URL + "friend/send-friend-request",
    ACCEPT_FRIEND_REQUEST : BASE_URL + "friend/accept-friend-request",
    REJECT_FRIEND_REQUEST : BASE_URL + "friend/reject-friend-request",
    REMOVE_FRIEND : BASE_URL + "friend/remove_friend",
    GET_PEDDING_REQUEST : BASE_URL + "friend/get_pedding_request"
}

export const messageEndpoints = {
    SEND_MESSAGE : BASE_URL + "messages/addmsg",
    GET_MESSAGE : BASE_URL + "messages/getmsg",
    CHECK_LAST_ONLINE: BASE_URL + "messages/lastOnline",
}

export const groupEndpoints = {
    GET_USER_GROUP :BASE_URL + "group/get_user_group",
    GET_ALL_GROUP : BASE_URL + "group/get_all_group",
    CREATE_GROUP : BASE_URL + "group/create_group",
    EXIT_GROUP : BASE_URL +"group/exit-group",
    DELETE_GROUP: BASE_URL + "group/delete_group",

    ADD_MESSAGE: BASE_URL +"group/add_message",
    GET_MESSAGES: BASE_URL + "group/get_messages"
}