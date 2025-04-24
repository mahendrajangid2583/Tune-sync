const Song = require("../models/Song");
const { fetchSongs, fetchPlaylist , fetchArtist} = require('../services/apiService');

exports.autoSuggetion =  async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Search query required" });
  
    try {
      const suggestions = await Song.find(
        { title: { $regex: query, $options: "i" } }, // Case-insensitive match
        { title: 1, artist: 1, _id: 1, coverImageUrl:1 , cloudinaryUrl:1} // Return only necessary fields
      ).limit(5); // Limit results
  
      res.json({
        success: true,
        data: {
          songs: suggestions
        }
      })
    } catch (error) {
      res.status(500).json({success:false, message:"error while autosuggestion",error: error.message });
    }
}


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


exports.getArtistsSongs = async (req, res) => {
  const query = req.params.id;
  
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }
  try {
    const songs = await fetchArtist(query);
    res.status(200).json(songs);  // Send fetched songs as response
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } 
}