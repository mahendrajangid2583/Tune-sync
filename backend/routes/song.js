const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  auth
} = require("../middlewares/auth");
const {
    getSong,
    getPlaylist,
    fetchHomePlaylists,
    getArtist,
    fetchHomeArtists
  } = require("../controllers/SongControllers");

  // Route for auto suggestion 

router.get("/search", getSong);
router.get("/playlist/:id" , getPlaylist);
router.get("/home/playlists" , fetchHomePlaylists);
router.get("/home/artists" , fetchHomeArtists);
router.get("/artist/:id" , getArtist);

module.exports = router;