// Updated Artists section with new circular cards
import React from "react";
import ReleaseCard from "./ReleaseCard";

const Artists = ({ releases, navigate, isLoading = false, error = null }) => {
  const skeletonCards = Array.from({ length: 6 });

  return (
    <section className="my-10 relative">
      <div className="flex items-center justify-between mb-4 px-5">
        <h2 className="text-3xl font-bold">Browse Artists</h2>
      </div>

      {error && (
        <div className="mx-5 mb-4 bg-red-900/40 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
          <span>{error}</span>
        </div>
      )}

      <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 px-1 ${isLoading ? "opacity-95" : ""}`}>
        {isLoading && releases.length === 0
          ? skeletonCards.map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-gray-800 rounded-full aspect-square animate-pulse"
              ></div>
            ))
          : releases.map((release) => (
              <ReleaseCard key={release.id} release={release} navigate={navigate} />
            ))}
      </div>
    </section>
  );
};

export default Artists;