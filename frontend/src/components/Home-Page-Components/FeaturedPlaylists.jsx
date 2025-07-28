import React from "react";
import PlaylistCard from "./PlaylistCard";

// Updated FeaturedPlaylists to increase grid density
const FeaturedPlaylists = ({ playlists, navigate }) => (
  <section className="my-10 relative">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-3xl font-bold px-5">Featured Playlists</h2>
    </div>

    
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} navigate={navigate} />
      ))}
    </div>
  </section>
);

export default FeaturedPlaylists;
