import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Play, Clock, Heart, ChevronLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MusicPlayer from "./Music_player";
import myImage from "./coverImage.jpg";
import { useQueue } from "./contexts/queueContext";
import { useAudio } from "./contexts/AudioProvider";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { getPlaylistDetail, getArtistDetail } from "../services/operations/songsAPI";
import { buildPlayerSong, formatTrackArtists } from "../utils/trackUtils";

export const handleSongClick = (
  track,
  index,
  clearnext,
  loadSong,
  enqueuenext,
  playlistData,
  currentSong,
  seekTo
) => {
  const playableSong = buildPlayerSong(track, myImage);

  if (!playableSong?.audioSrc) {
    toast.error("Preview unavailable for this track.");
    return;
  }

  if (currentSong && playableSong.audioSrc === currentSong.audioSrc) {
    seekTo?.(0);
    return;
  }

  clearnext?.();
  loadSong(playableSong);

  const tracks = Array.isArray(playlistData?.tracks)
    ? playlistData.tracks
    : Array.isArray(playlistData?.songs)
    ? playlistData.songs
    : Array.isArray(playlistData)
    ? playlistData
    : [];

  for (let i = index + 1; i < tracks.length; i++) {
    enqueuenext?.(tracks[i]);
  }
};


const totaltime = (tracks = []) => {
  const totalSeconds = tracks.reduce(
    (sum, track) => sum + (track?.duration || 0),
    0
  );
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes} min`;
  } else if (hours === 1) {
    return `${hours} hour ${minutes} min`;
  }
  return `${hours} hours ${minutes} min`;
};

const getTime = (time = 0) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

const normalizePlaylist = (data) => {
  if (!data) return null;
  const tracks = data.tracks || data.songs || [];
  return {
    id: data.id,
    title: data.title || data.name || "Playlist",
    description: data.description || "",
    imageUrl: data.imageUrl || data.image || data.picture || myImage,
    songsCount:
      data.songsCount ||
      data.nb_tracks ||
      data.trackCount ||
      (Array.isArray(tracks) ? tracks.length : 0),
    tracks,
    isArtist: Boolean(data.isArtist),
  };
};

const normalizeArtistPlaylist = (artist) => {
  if (!artist) return null;
  const tracks = artist.topTracks || artist.tracks || [];
  const fanText = artist.nb_fan
    ? `${new Intl.NumberFormat().format(artist.nb_fan)} fans`
    : "Artist mix";

  return {
    id: artist.id,
    title: artist.name || "Artist",
    description: fanText,
    imageUrl: artist.picture || artist.image || artist.imageUrl || myImage,
    songsCount: tracks.length,
    tracks,
    isArtist: true,
  };
};

const Playlist = ({ playlistData, similarPlaylists, isLoading, error, onRetry }) => {
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const {
    enqueuenext,
    clearnext,
  } = useQueue();

  const navigate = useNavigate();

  const { loadSong, currentSongId, seekTo, currentSong } = useAudio();

  const playlistSummary =
    playlistData || {
      title: "Playlist",
      description: "",
      imageUrl: myImage,
      songsCount: 0,
      tracks: [],
    };

  const tracks = playlistSummary.tracks || [];
  const hasTracks = tracks.length > 0;

  const handlePlayAll = () => {
    if (!tracks.length) {
      toast.error("No tracks available yet.");
      return;
    }
    const firstPlayableIndex = tracks.findIndex(
      (track) => buildPlayerSong(track, myImage)?.audioSrc
    );
    if (firstPlayableIndex === -1) {
      toast.error("No previews available in this playlist.");
      return;
    }
    handleSongClick(
      tracks[firstPlayableIndex],
      firstPlayableIndex,
      clearnext,
      loadSong,
      enqueuenext,
      playlistSummary,
      currentSong,
      seekTo
    );
  };

  const renderTrackRow = (track, index) => {
    const playableCandidate = buildPlayerSong(track, myImage);
    const isPlayable = Boolean(playableCandidate?.audioSrc);
    const isActive = currentSongId === track.id;

    return (
      <div
        key={track.id || `${track.title}-${index}`}
        className={`group grid grid-cols-12 gap-4 items-center p-3 rounded-md mb-1 transition-colors ${
          isActive
            ? "bg-green-900/40 hover:bg-green-800/50"
            : "hover:bg-gray-800/40"
        } ${isPlayable ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
        onMouseEnter={() => setHoveredTrack(track.id)}
        onMouseLeave={() => setHoveredTrack(null)}
        onClick={() => {
          if (!isPlayable) {
            toast.error("Preview unavailable for this track.");
            return;
          }
          handleSongClick(
            track,
            index,
            clearnext,
            loadSong,
            enqueuenext,
            playlistSummary,
            currentSong,
            seekTo
          );
        }}
      >
        <div className="col-span-1 text-center flex justify-center">
          {hoveredTrack === track.id ? (
            <Play size={14} className="text-white" />
          ) : isActive ? (
            <Play size={14} className="text-green-400" />
          ) : (
            <span className="text-gray-400">{index + 1}</span>
          )}
        </div>
        <div className="col-span-6 flex items-center gap-3">
          <img
            src={
              track.image ||
              track.albumCover ||
              track.picture ||
              playlistSummary.imageUrl ||
              myImage
            }
            alt={track.title || track.name}
            className="w-12 h-12 rounded shadow-md object-cover"
          />
          <div>
            <h3
              className={`font-medium transition-colors ${
                isActive ? "text-green-400" : "text-white group-hover:text-green-400"
              }`}
            >
              {track.title || track.name}
            </h3>
            <p className="text-xs text-gray-400">
              {formatTrackArtists(track)}
            </p>
          </div>
        </div>
        <div className="col-span-4 text-sm text-gray-400 truncate">
          {track.album || track.albumTitle || "Single"}
        </div>
        <div className="col-span-1 flex flex-col items-end gap-2">
          <span className={`text-sm ${isActive ? "text-green-400" : "text-gray-400"}`}>
            {getTime(track.duration || 30)}
          </span>
          <span className="text-xs text-gray-500">
            {isPlayable ? "Preview" : "No Preview"}
          </span>
        </div>
      </div>
    );
  };

  const headerLabel = playlistSummary.isArtist ? "Artist" : "Playlist";

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen w-full text-white font-sans overflow-x-hidden">
      <Navbar show={"Home"} />
      <header className="p-6 flex items-center">
        <button
          className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="ml-4 text-xl font-medium">{headerLabel}</h2>
      </header>

      {error && (
        <div className="mx-6 mb-4 bg-red-900/40 border border-red-700 text-red-100 px-4 py-3 rounded-lg flex items-center justify-between gap-4">
          <span>{error}</span>
          {onRetry && (
            <button className="text-xs underline" onClick={onRetry}>
              Retry
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-2/5 flex flex-col p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <div className="flex flex-col items-center lg:items-start">
            <div className={`relative group w-64 h-64 mb-8 shadow-2xl ${isLoading ? "opacity-70" : ""}`}>
              <img
                src={playlistSummary.imageUrl || myImage}
                alt="Playlist Cover"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  className="bg-green-500 p-4 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePlayAll}
                  disabled={!hasTracks}
                >
                  <Play size={24} fill="white" />
                </button>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-2 text-center lg:text-left">
              {playlistSummary.title || "Unknown Title"}
            </h1>
            <p className="text-gray-300 text-lg mb-6 max-w-lg text-center lg:text-left">
              {playlistSummary.description || "No Description"}
            </p>

            <div className="flex items-center gap-3 mb-8 text-gray-400 text-sm">
              <span>
                {playlistSummary.songsCount || tracks.length} songs • Approximately{" "}
                {totaltime(tracks)}
              </span>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                className="bg-green-500 hover:bg-green-600 transition-colors py-3 px-8 rounded-full font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePlayAll}
                disabled={!hasTracks}
              >
                <Play size={18} fill="white" /> Play
              </button>
              <button className="bg-transparent border border-gray-600 hover:border-white transition-colors py-3 px-6 rounded-full">
                <Heart size={18} />
              </button>
            </div>
          </div>

          
        </div>

        <div className="w-full lg:w-3/5 flex flex-col h-full overflow-y-auto p-6 lg:border-l border-gray-800 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <div className="p-4 bg-gray-800/40 sticky top-0 backdrop-blur-md z-10 rounded-md">
            <div className="grid grid-cols-12 gap-4 text-gray-400 text-sm uppercase tracking-wider">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-6">Title</div>
              <div className="col-span-4">Album</div>
              <div className="col-span-1 flex justify-end">
                <Clock size={16} />
              </div>
            </div>
          </div>

          <div className="mt-2">
            {isLoading && !hasTracks ? (
              <div className="text-center text-gray-400 py-12">
                Loading playlist...
              </div>
            ) : hasTracks ? (
              tracks.map((track, index) => renderTrackRow(track, index))
            ) : (
              <div className="text-center text-gray-400 py-12">
                No tracks available yet.
              </div>
            )}
          </div>
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
};

const PlaylistPage = () => {
  const location = useLocation();
  const { playlistId: routePlaylistId } = useParams();
  const initialPlaylist = location?.state?.playlist;
  const initialArtist = location?.state?.artist;

  const isArtistRoute = routePlaylistId?.startsWith("artist-");
  const artistRouteId = isArtistRoute ? routePlaylistId.replace("artist-", "") : null;
  const isArtistMode = Boolean(initialArtist) || isArtistRoute;

  const derivedPlaylistId = isArtistMode
    ? null
    : routePlaylistId || initialPlaylist?.id || null;
  const artistId = isArtistMode
    ? initialArtist?.id || artistRouteId
    : null;

  const [playlistData, setPlaylistData] = useState(
    !isArtistMode && initialPlaylist ? normalizePlaylist(initialPlaylist) : null
  );
  const [isLoading, setIsLoading] = useState(
    isArtistMode || !initialPlaylist
  );
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (isArtistMode) {
      if (!artistId) {
        setError("Artist id is missing.");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await getArtistDetail(artistId, 20);
        setPlaylistData(
          normalizeArtistPlaylist({
            ...response,
            picture: response?.picture || response?.image,
            topTracks: response?.topTracks || [],
          })
        );
      } catch (fetchError) {
        setError(fetchError?.message || "Unable to load this artist.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!derivedPlaylistId) {
      setError("Playlist id is missing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getPlaylistDetail(derivedPlaylistId);
      setPlaylistData(
        normalizePlaylist({
          ...response,
          imageUrl: response?.image || response?.picture,
          tracks: response?.tracks || [],
        })
      );
    } catch (fetchError) {
      setError(fetchError?.message || "Unable to load this playlist.");
    } finally {
      setIsLoading(false);
    }
  }, [artistId, derivedPlaylistId, isArtistMode]);

  useEffect(() => {
    if (isArtistMode) {
      if (!artistId) {
        setError("Artist id is missing.");
        return;
      }
    } else if (!derivedPlaylistId) {
      setError("Playlist id is missing.");
      return;
    }

    const expectedId = isArtistMode ? artistId : derivedPlaylistId;
    if (
      !playlistData ||
      playlistData.id !== expectedId ||
      (playlistData.tracks || []).length === 0
    ) {
      fetchData();
    }
  }, [artistId, derivedPlaylistId, fetchData, isArtistMode, playlistData]);

  const similarPlaylistsData = useMemo(
    () => [
      {
        id: 1,
        playlist_name: "Relaxing Jazz",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        playlist_name: "Lofi Beats",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 3,
        playlist_name: "Ambient Sounds",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 4,
        playlist_name: "Mellow Piano",
        image: "https://via.placeholder.com/150",
      },
      {
        id: 5,
        playlist_name: "Chill Study Music",
        image: "https://via.placeholder.com/150",
      },
    ],
    []
  );

  return (
    <Playlist
      playlistData={playlistData}
      similarPlaylists={similarPlaylistsData}
      isLoading={isLoading}
      error={error}
      onRetry={fetchData}
    />
  );
};

export default PlaylistPage;