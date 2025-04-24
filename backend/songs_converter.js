const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const jsmediatags = require('jsmediatags'); // Import jsmediatags
require('dotenv').config();

const Song = require("./models/Song");

// Cloudinary configuration
cloudinary.config({
  cloud_name : process.env.CLOUD_NAME,
  api_key : process.env.API_KEY,
  api_secret : process.env.API_SECRET,
});

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


const folderPath = './songs'; // Modify this to your folder path



// Function to process songs
async function processSongs() {
  const songsDir = path.join(__dirname, 'songs');

  try {
    const files = fs.readdirSync(songsDir);

    for (const file of files) {
      const filePath = path.join(songsDir, file);

      // Extract metadata using jsmediatags
      const metadata = await new Promise((resolve, reject) => {
        jsmediatags.read(filePath, {
          onSuccess: resolve,
          onError: reject,
        });
      });

      // Parse metadata
      const tag = metadata.tags;
      const title = tag.title || path.basename(file, path.extname(file));
      const artist = tag.artist || 'Unknown Artist';
      const album = tag.album || 'Unknown Album';
      const genre = tag.genre || 'Unknown';


      // Check if the song has embedded cover art
      let coverImageResult = null;
      if (tag.picture) {
        const picture = tag.picture;
        const tempImagePath = path.join(__dirname, 'temp', `${path.basename(file, path.extname(file))}.jpg`);

        // Ensure the temp directory exists
        if (!fs.existsSync(path.join(__dirname, 'temp'))) {
          fs.mkdirSync(path.join(__dirname, 'temp'));
        }

        // Write the cover art to a temporary file
        fs.writeFileSync(tempImagePath, Buffer.from(picture.data));

        // Upload the cover image to Cloudinary
        coverImageResult = await cloudinary.uploader.upload(tempImagePath, {
          resource_type: 'image',
          public_id: path.basename(file, path.extname(file)) + '_cover',
        });

        // Delete the temporary image file
        fs.unlinkSync(tempImagePath);
      }

      // Upload the song to Cloudinary
      const songUploadResult = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        public_id: path.basename(file, path.extname(file)),
      });

      console.log("cloudnary data",songUploadResult);
      const duration = songUploadResult.duration;
      // Create song document
      const song = new Song({
        title: title,
        artist: artist,
        album: album,
        genre: genre,
        duration: duration,
        cloudinaryUrl: songUploadResult.secure_url,
        coverImageUrl: coverImageResult ? coverImageResult.secure_url : null,
        publicId: songUploadResult.public_id,
      });

      await song.save();
      console.log(`Uploaded: ${file}`);
    }
  } catch (error) {
    console.error('Error processing songs:', error);
  } finally {
    mongoose.connection.close();
  }
}

processSongs();