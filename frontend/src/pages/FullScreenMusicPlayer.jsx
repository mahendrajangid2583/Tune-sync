import React, { useRef, useState, useEffect } from "react";
import { useAudio } from "./contexts/AudioProvider";

const FullScreenMusicPlayer = ({ isOpen, onClose }) => {
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    currentSong,
    loadSong,
    togglePlay,
    seekTo,
    setAudioVolume,
    nextSong,
    prevSong,
  } = useAudio();

  const progressBarRef = useRef(null);
  const [formattedDuration, setFormattedDuration] = useState(
    currentSong.duration
  );

  const isPresent = (song) => {
    const likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];
    return likedSongs.some((likedSong) => likedSong.id === song.id);
  };

  const [isLiked, setIsLiked] = useState(isPresent(currentSong));

  useEffect(() => {
    setIsLiked(isPresent(currentSong));
  }, [currentSong]);

  useEffect(() => {
    if (duration > 0 && duration - currentTime < 0) {
      nextSong();
    }
  }, [currentTime]);

  useEffect(() => {
    if (duration) {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      setFormattedDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
    }
  }, [duration]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setAudioVolume(newVolume);
  };

  const handleSeek = (e) => {
    if (!progressBarRef.current) return;
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = offsetX / width;
    const newTime = percentage * duration;
    seekTo(newTime);
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    const likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];
    if (!isLiked) {
      likedSongs.push(currentSong);
    } else {
      const index = likedSongs.findIndex((song) => song.id === currentSong.id);
      if (index > -1) {
        likedSongs.splice(index, 1);
      }
    }
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  };

  const title = currentSong?.title || "Unknown Title";
  const artists = currentSong?.artists || "Unknown Artist";
  const coverImage = currentSong?.coverImage || "coverImage.jpg";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-8">
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7 7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-white font-medium">Now Playing</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Cover Image */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-80 h-80 max-w-[80vw] max-h-[80vw] rounded-lg overflow-hidden shadow-2xl">
          <img
            src={coverImage}
            alt={`${title} by ${artists}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "coverImage.jpg";
            }}
          />
        </div>
      </div>

      {/* Song Info */}
      <div className="px-8 py-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-lg text-gray-400">{artists}</p>
      </div>

      {/* Progress Bar */}
      <div className="px-8 mb-6">
        <div
          className="h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer mb-2"
          ref={progressBarRef}
          onClick={handleSeek}
        >
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formattedDuration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 pb-8">
        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-8 mb-6">
          <button
            className="text-gray-400 hover:text-white transition-colors"
            onClick={prevSong}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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

          <button
            className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center hover:bg-purple-700 shadow-lg transition-all duration-200"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 ml-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            className="text-gray-400 hover:text-white transition-colors"
            onClick={nextSong}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between">
          <button
            className={`${
              isLiked ? "text-purple-500" : "text-gray-400"
            } hover:text-purple-600 transition-colors`}
            onClick={handleLikeClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m-3.536-1.536a3 3 0 010-4.072M9 9v6a1 1 0 01-1.707.707L4.586 13H3a1 1 0 01-1-1v-2a1 1 0 011-1h1.586L7.293 6.293A1 1 0 019 6z"
              />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-gray-400 text-sm min-w-[3ch]">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Placeholder for additional controls */}
          <div className="w-7"></div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-webkit-slider-track {
          background: #374151;
          border-radius: 4px;
        }

        .slider::-moz-range-track {
          background: #374151;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default FullScreenMusicPlayer;
