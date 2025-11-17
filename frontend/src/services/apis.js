const withTrailingSlash = (value = "") =>
  value.endsWith("/") ? value : `${value}/`;

const BASE_URL =
  withTrailingSlash(
    process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1/"
  );

const MUSIC_API_BASE_URL = withTrailingSlash(
  process.env.REACT_APP_MUSIC_API_BASE_URL ||
    (BASE_URL.includes("/api/v1/")
      ? BASE_URL.replace("/api/v1/", "/api/")
      : BASE_URL)
);

export const endpoints = {
  SENDOTP_API: BASE_URL + "auth/sendotp",
  SIGNUP_API: BASE_URL + "auth/signup",
  LOGIN_API: BASE_URL + "auth/login",
};

export const musicEndpoints = {
  SEARCH: MUSIC_API_BASE_URL + "search",
  HOME_PLAYLISTS: MUSIC_API_BASE_URL + "home/playlists",
  HOME_ARTISTS: MUSIC_API_BASE_URL + "home/artists",
  PLAYLIST_DETAIL: MUSIC_API_BASE_URL + "playlist",
  ARTIST_DETAIL: MUSIC_API_BASE_URL + "artist",
};


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