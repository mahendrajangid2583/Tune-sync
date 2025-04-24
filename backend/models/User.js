const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    Username: {
      type: String,
      unique: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    lastOnline: Date,
    group: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: null // Set default value to null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
