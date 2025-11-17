
const { fetchSongs, fetchPlaylist , fetchHomePlaylists, fetchArtist, fetchHomeArtists} = require('../services/apiService');



exports.getSong = async (req, res) => {
    const query = req.query.q;
    console.log(query)
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }
    try {
      const songs = await fetchSongs(query);
      res.status(200).json(songs);  // Send fetched songs as response
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ message: "Internal Server Error" });
    } 
     
}

exports.getPlaylist = async (req, res) => {
  const query = req.params.id;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }
  try {
    const songs = await fetchPlaylist(query);
    res.status(200).json(songs);  // Send fetched songs as response
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } 
}


exports.fetchHomePlaylists = async (req, res) => {
  const count = req.query.count;
  try {
    const playlists = await fetchHomePlaylists(count);
    return res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching home playlists:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  } 
}

exports.getArtist = async (req, res) => {
  const artistId = req.params.id;
  const topLimit = req.query.limit;

  if (!artistId) {
    return res.status(400).json({ message: "Artist id is required" });
  }

  try {
    const artist = await fetchArtist(artistId, topLimit);
    return res.status(200).json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.fetchHomeArtists = async (req, res) => {
  const count = req.query.count;
  try {
    const artists = await fetchHomeArtists(count);
    return res.status(200).json(artists);
  } catch (error) {
    console.error("Error fetching home artists:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}