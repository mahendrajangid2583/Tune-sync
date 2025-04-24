const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  auth
} = require("../middlewares/auth");
const {
    autoSuggetion,
    getSong,
    getPlaylist,
    getArtistsSongs
  } = require("../controllers/SongControllers");

  // Route for auto suggestion 
router.get("/autosuggestion",autoSuggetion);
router.get("/song/:id",getSong);
router.get("/playlists/:id" , getPlaylist);
router.get("/artists/:id" , getArtistsSongs);

module.exports = router;