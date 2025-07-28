// Updated Artists section with new circular cards
import React from "react";
import ReleaseCard from "./ReleaseCard";
const Artists = ({ releases , navigate}) => (
  <section className="my-10 relative">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-3xl font-bold px-5">Browse Artists</h2>
    </div>

    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
    >
      {releases.map((release) => (
        <ReleaseCard key={release.id} release={release} navigate={navigate} />
      ))}
    </div>
  </section>
);
export default Artists;