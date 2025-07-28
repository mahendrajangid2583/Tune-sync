// Updated GenreTile with smaller size
import React from "react";
const GenreTile = ({ genre }) => (
  <div
    className="h-16 rounded-lg flex items-center justify-center font-semibold bg-gradient-to-r from-purple-900 to-indigo-800 hover:from-purple-800 hover:to-indigo-700 hover:scale-105 transition-all cursor-pointer"
    style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/api/placeholder/300/300')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {genre}
  </div>
);
export default GenreTile;