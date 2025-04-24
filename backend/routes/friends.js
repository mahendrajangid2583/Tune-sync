const express = require("express");

const auth = require("../middlewares/auth");

const router = express.Router();

const {
  getFriends,
  sendFriendReq,
  acceptFriendReq,
  rejectFriendReq,
  searchFriends,
  getPendingFriendRequests,
  removeFriend
} = require("../controllers/FriendControllers");
// Send a friend request
router.post("/send-friend-request", auth, sendFriendReq );

router.get("/get_pedding_request",auth, getPendingFriendRequests);
router.post("/remove_friend",auth, removeFriend);

// Accept a friend request
router.post("/accept-friend-request", auth, acceptFriendReq);

// Reject a friend request
router.post("/reject-friend-request", auth, rejectFriendReq);

// Get friends list
router.get("/get-friends", auth, getFriends);

//search friends
router.get("/search-friend",auth, searchFriends);

module.exports = router;