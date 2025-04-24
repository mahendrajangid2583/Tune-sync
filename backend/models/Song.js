const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, default: "Unknown" },
  album: { type: String, default: "Unknown" },
  genre: {type: String},
  duration: { type: Number, default: 0 }, // Duration in seconds
  cloudinaryUrl: { type: String, required: true }, // GCS Song URL
  coverImageUrl: { type: String, default: null }, // GCS Cover Image URL
  publicId: {type: String}, 
}, { timestamps: true });

SongSchema.index({ title: "text", artist: "text", album: "text",genre:"text" }); // Enable text search

const Song = mongoose.model("Song", SongSchema);
module.exports = Song;
