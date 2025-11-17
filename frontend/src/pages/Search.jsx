import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "./Music_player";
import { useAudio } from "./contexts/AudioProvider";
import { useGroup } from "./contexts/GroupContext";
import toast from "react-hot-toast";
import myImage from "./coverImage.jpg";
import { searchCatalog } from "../services/operations/songsAPI";
import useDebounce from "../utils/useDebounce";
import { buildPlayerSong } from "../utils/trackUtils";

const initialResults = { tracks: [], artists: [], playlists: [] };

const SearchPage = (params) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [results, setResults] = useState(initialResults);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const debouncedQuery = useDebounce(params.searchQuery, 450);
  const { groupState } = useGroup();
  const { loadSong } = useAudio();
  const navigate = useNavigate();

  useEffect(() => {
    if (!debouncedQuery?.trim()) {
      setResults(initialResults);
      setIsLoading(false);
      setErrorMessage(null);
      return;
    }

    let isCancelled = false;
    const fetchResults = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await searchCatalog(debouncedQuery);
        if (isCancelled) return;

        setResults({
          tracks: response?.tracks || [],
          artists: response?.artists || [],
          playlists: response?.playlists || [],
        });
        setRecentSearches((prev) => {
          const normalized = debouncedQuery.trim();
          if (!normalized) return prev;
          if (prev[0] === normalized) return prev;

          const nextHistory = [normalized, ...prev.filter((item) => item !== normalized)];
          return nextHistory.slice(0, 5);
        });
      } catch (error) {
        if (isCancelled) return;
        setResults(initialResults);
        setErrorMessage(error?.message || "Something went wrong. Please try again.");
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  const handleSongSelect = (track) => {
    if (groupState?.isInGroup && !groupState?.isAdmin) {
      toast.error("You are not admin, leave the group to play a preview.");
      return;
    }

    const playableSong = buildPlayerSong(track, myImage);

    if (!playableSong?.audioSrc) {
      toast.error("Preview unavailable for this track.");
      return;
    }

    loadSong(playableSong);
  };

  const handleArtistNavigate = (artist) => {
    if (!artist?.id) return;
    const artistPath = `artist-${artist.id}`;
    navigate(`/playlist/${artistPath}`, {
      state: { artist },
    });
  };

  // Clear a specific recent search
  const removeRecentSearch = (search) => {
    setRecentSearches(recentSearches.filter((item) => item !== search));
  };

  // Clear all recent searches
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
  };

   

  return (
    <div className="fixed inset-0 bg-gray-900 text-white z-50 overflow-y-auto transition-opacity duration-300 ease-in-out">
      {/* Search Header */}
      <div className="sticky top-0 bg-gray-900 shadow-lg z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex rounded-full overflow-hidden bg-gray-800 max-w-3xl mx-auto">
            <button
              onClick={params.onClose}
              className="p-4 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search for songs, artists, or podcasts..."
              className="flex-1 py-4 px-4 bg-transparent text-white focus:outline-none"
              value={params.searchQuery}
              onChange={(e) => params.setSearchQuery(e.target.value)}
              autoFocus
            />
            {params.searchQuery && (
              <button
                onClick={() => params.setSearchQuery("")}
                className="p-4 text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Search content */}
      <div className="container mx-auto px-4 py-6">
        {/* Show appropriate content based on search state */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : params.searchQuery.trim() === "" ? (
          // When no search query, show recent searches
          <div>
            {recentSearches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Recent Searches</h2>
                  <button
                    onClick={clearAllRecentSearches}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Clear All
                  </button>
                </div>
                <ul className="space-y-3">
                  {recentSearches.map((search, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors"
                    >
                      <button
                        className="flex-1 text-left"
                        onClick={() => params.setSearchQuery(search)}
                      >
                        {search}
                      </button>
                      <button
                        onClick={() => removeRecentSearch(search)}
                        className="text-gray-400 hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <h2 className="text-xl font-bold mb-4">Trending Searches</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  "Hip Hop Hits",
                  "Workout Playlists",
                  "Focus Music",
                  "Top Charts",
                  "New Releases",
                  "Chill Vibes",
                  "Party Mix",
                  "90s Nostalgia",
                ].map((trend, index) => (
                  <button
                    key={index}
                    className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition-colors"
                    onClick={() => params.setSearchQuery(trend)}
                  >
                    {trend}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : !!errorMessage ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-400">{errorMessage}</p>
            <p className="text-gray-500 mt-2">
              Please check your connection or try again later.
            </p>
          </div>
        ) : debouncedQuery.trim() !== "" && results.tracks.length === 0 && results.playlists.length === 0 && results.artists.length === 0 ? (
          // No results found
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              No results found for "{params.searchQuery}"
            </p>
            <p className="text-gray-500 mt-2">
              Try searching for something else
            </p>
          </div>
        ) : (
          // Show search results
          <div>
            <h2 className="text-xl font-bold mb-6">
              Top Results for "{params.searchQuery}"
            </h2>
            {results.tracks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Tracks</h3>
                <div className="space-y-3">
                  {results.tracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={track.image || track.albumCover || myImage}
                        alt={track.title}
                        className="w-14 h-14 rounded object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{track.title}</h4>
                        <p className="text-sm text-gray-400">
                          {(track.artists || []).join(", ")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-500">
                          {track.duration
                            ? `${Math.floor(track.duration / 60)}:${String(
                                track.duration % 60
                              ).padStart(2, "0")}`
                            : "0:30"}
                        </span>
                        <button
                          disabled={!track.preview}
                          className={`px-4 py-1 rounded-full text-sm ${
                            track.preview
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "bg-gray-600 text-gray-300 cursor-not-allowed"
                          }`}
                          onClick={() => handleSongSelect(track)}
                        >
                          {track.preview ? "Play" : "No Preview"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            

            {results.artists.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4">Artists</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {results.artists.map((artist) => (
                    <div
                      key={artist.id}
                      className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => handleArtistNavigate(artist)}
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3">
                        <img
                          src={artist.picture || artist.picture_medium || myImage}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-medium truncate">{artist.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {artist.nb_fan
                          ? `${new Intl.NumberFormat().format(
                              artist.nb_fan
                            )} fans`
                          : "Artist"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            

            {results.playlists.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold mb-4">Playlists</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {results.playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(`/playlist/${playlist.id}`, {
                          state: { playlist },
                        })
                      }
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={playlist.picture || playlist.image || myImage}
                          alt={playlist.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium truncate">
                          {playlist.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          {playlist.nb_tracks
                            ? `${playlist.nb_tracks} tracks`
                            : "Playlist"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Music Player - Only show when a song is selected */}
      <MusicPlayer/>
    </div>
  );
};

export default SearchPage;
