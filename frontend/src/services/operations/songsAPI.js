import { apiConnector } from "../apiConnector";
import { musicEndpoints } from "../apis";

const { SEARCH, HOME_PLAYLISTS, HOME_ARTISTS, PLAYLIST_DETAIL, ARTIST_DETAIL } = musicEndpoints;

const buildFriendlyError = (error, fallbackMessage) => {
  let message = fallbackMessage;

  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message?.toLowerCase().includes("network")) {
    message = "Network or CORS issue. Please try again.";
  }

  const wrapped = new Error(message);
  wrapped.originalError = error;
  return wrapped;
};

export const searchCatalog = async (query) => {
  if (!query || !query.trim()) {
    return { tracks: [], artists: [], playlists: [] };
  }

  try {
    const response = await apiConnector("GET", SEARCH, null, null, {
      q: query.trim(),
    });
    console.log("response" , response?.data);
    return response?.data || { tracks: [], artists: [], playlists: [] };
  } catch (error) {
    throw buildFriendlyError(error, "Unable to fetch search results.");
  }
};

export const getHomePlaylists = async (count = 12) => {
  try {
    const response = await apiConnector(
      "GET",
      HOME_PLAYLISTS,
      null,
      null,
      { count }
    );

    return response?.data || { playlists: [] };
  } catch (error) {
    throw buildFriendlyError(error, "Unable to load playlists right now.");
  }
};

export const getHomeArtists = async (count = 10) => {
  try {
    const response = await apiConnector(
      "GET",
      HOME_ARTISTS,
      null,
      null,
      { count }
    );

    return response?.data || { artists: [] };
  } catch (error) {
    throw buildFriendlyError(error, "Unable to load artists right now.");
  }
};

export const getPlaylistDetail = async (playlistId) => {
  if (!playlistId) {
    throw new Error("Playlist id is required");
  }

  try {
    const response = await apiConnector(
      "GET",
      `${PLAYLIST_DETAIL}/${encodeURIComponent(playlistId)}`,
      null,
      null,
      null
    );

    return response?.data || null;
  } catch (error) {
    throw buildFriendlyError(error, "Unable to load this playlist.");
  }
};

export const getArtistDetail = async (artistId, limit = 10) => {
  if (!artistId) {
    throw new Error("Artist id is required");
  }

  try {
    const response = await apiConnector(
      "GET",
      `${ARTIST_DETAIL}/${encodeURIComponent(artistId)}`,
      null,
      null,
      { limit }
    );

    return response?.data || null;
  } catch (error) {
    throw buildFriendlyError(error, "Unable to load this artist right now.");
  }
};