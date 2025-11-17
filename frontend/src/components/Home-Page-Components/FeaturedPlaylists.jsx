import React from "react";
import PlaylistCard from "./PlaylistCard";

const formatTimestamp = (timestamp) => {
  if (!timestamp) return null;
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    return null;
  }
};

const FeaturedPlaylists = ({
  playlists,
  navigate,
  isLoading = false,
  error = null,
  onRetry,
  lastUpdated,
  meta,
}) => {
  const showSkeleton = isLoading && (!playlists || playlists.length === 0);
  const skeletonCards = Array.from({ length: 6 });
  const timestampLabel = formatTimestamp(lastUpdated);

  return (
    <section className="my-10 relative">
      <div className="flex items-center justify-between mb-4 px-5">
        <h2 className="text-3xl font-bold">Featured Playlists</h2>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {timestampLabel && <span>Updated {timestampLabel}</span>}
          <button
            className="px-3 py-1 border border-gray-600 rounded-full hover:border-white transition-colors"
            onClick={onRetry}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-5 mb-4 bg-red-900/40 border border-red-700 text-red-100 px-4 py-3 rounded-lg flex items-center justify-between gap-4">
          <span>{error}</span>
          <button
            className="text-xs underline hover:text-white"
            onClick={onRetry}
          >
            Retry
          </button>
        </div>
      )}

      {meta && (
        <p className="text-xs text-gray-400 px-5 mb-4">
          Sources • Chart {meta.chart || 0} • Genre {meta.genre || 0} • Curated{" "}
          {meta.curated || 0}
        </p>
      )}

      <div
        className={`grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 px-1 ${
          isLoading ? "opacity-95" : ""
        }`}
      >
        {showSkeleton
          ? skeletonCards.map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-gray-800 rounded-lg h-44 animate-pulse"
              ></div>
            ))
          : playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                navigate={navigate}
              />
            ))}
      </div>
    </section>
  );
};

export default FeaturedPlaylists;
