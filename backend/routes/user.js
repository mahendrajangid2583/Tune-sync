const express = require("express")
const User = require("../models/User")
const verifyToken = require("../middlewares/auth")
const router = express.Router()

// Import the required controllers and middleware functions
const {
    login,
    signUp,
    sendOTP,
    IsvalidOtp,
    IsValidEmail,
    IsValidUsername
} = require("../controllers/Auth");
const { resetPasswordToken  , resetPassword} = require("../controllers/ResetPassword");

  // Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signUp)

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)

router.post("/verifyotp", IsvalidOtp)

router.post("/validEmail" , IsValidEmail)

router.post("/validUsername" , IsValidUsername)

router.get("/profile", verifyToken , async (req, res) => {
  console.log("hello" , typeof verifyToken);
  console.log("Getting here");
  try {
    
      const user = await User.findById(req.user.id).select("-password"); // Exclude password
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, user });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

router.post("/update-password" , resetPasswordToken);
router.post("/reset-password" , resetPassword);

module.exports = router