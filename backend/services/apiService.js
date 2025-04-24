const axios = require('axios');
const url = `https://saavn.dev/api`;
// Function to fetch songs from Saavn API
const fetchSongs = async (query) => {
  try {
    const response = await axios.get(`${url}/search/songs?query=${encodeURIComponent(query)}`);
    console.log(response.data);
    return response.data;  // Return data from Saavn API
  } catch (error) {
    console.error("Error fetching from Saavn API:", error);
    throw error;  // Propagate error to be handled in the controller
  }
};

const fetchPlaylist = async (query) => {
  try {
    console.log("query" , query);
    const response = await axios.get(`${url}/playlists?id=${encodeURIComponent(query)}`);
    console.log(response.data);
    return response.data;  // Return data from Saavn API
  } catch (error) {
    console.error("Error fetching from Saavn API:", error);
    throw error;  // Propagate error to be handled in the controller
  }
};


const fetchArtist = async (query) => {
  try {
    console.log("query" , query);
    const response = await axios.get(`${url}/artists/${encodeURIComponent(query)}`);
    console.log(response.data);
    return response.data;  // Return data from Saavn API
  } catch (error) {
    console.error("Error fetching from Saavn API:", error);
    throw error;  // Propagate error to be handled in the controller
  }
};

module.exports = { fetchSongs , fetchPlaylist , fetchArtist};
