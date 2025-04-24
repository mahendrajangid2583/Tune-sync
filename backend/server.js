const express = require("express");
const path = require("path");
const fs = require("fs");
const songs = require("./songs_converter")

const app = express();
const PORT = 2000;

// Serve songs from the "songs" directory
const SONG_DIR = path.join(__dirname, "songs");

// CORS middleware (if you want to allow frontend access)
const cors = require("cors");
app.use(cors());

// Streaming route
app.get("/song/:filename", (req, res) => {
    const songPath = path.join(SONG_DIR, req.params.filename);

    if (!fs.existsSync(songPath)) {
        return res.status(404).json({ error: "Song not found" });
    }

    const stat = fs.statSync(songPath);
    const fileSize = stat.size;
    const range = req.headers.range;
   
    if (range) {
        // Streaming with range requests (for buffering)
        console.log("//");
        const parts = range.replace(/bytes=/, "").split("-");
        
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
         
        const chunkSize = end - start + 1;
        const file = fs.createReadStream(songPath, { start, end });
     
        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "audio/mpeg",
        });

        file.pipe(res);
    } else {
        // Serve full file if no range request
        console.log("HELLO");
        res.writeHead(200, { "Content-Type": "audio/mpeg", "Content-Length": fileSize });
        fs.createReadStream(songPath).pipe(res);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🎵 Music server running on http://localhost:${PORT}`);
});
