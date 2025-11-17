import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchPage from "./Search";
import MusicPlayer from "./Music_player";
import myImage from "./coverImage.jpg";
import Navbar from "../components/Navbar";
import { useAudio } from "./contexts/AudioProvider";
import MyFriendButton from "../components/connect_components/MyFriendButton";
import GroupSidebarButton from "../components/groups_components/GroupSidebarButton";
import HeroSection from "../components/Home-Page-Components/HeroSection";
import FeaturedPlaylists from "../components/Home-Page-Components/FeaturedPlaylists";
import Artists from "../components/Home-Page-Components/Artists";
import GenresSection from "../components/Home-Page-Components/GenresSection";
import Footer from "../components/Home-Page-Components/Footer";
import { getHomePlaylists, getHomeArtists } from "../services/operations/songsAPI";


 

// Main MusicHomepage component
const HOME_PLAYLIST_CACHE_KEY = "tunesync_home_playlists_v1";
const HOME_PLAYLIST_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const readCachedPlaylists = () => {
  if (typeof window === "undefined") {
    return { playlists: [], meta: null, timestamp: 0 };
  }
  try {
    const cached = sessionStorage.getItem(HOME_PLAYLIST_CACHE_KEY);
    if (!cached) return { playlists: [], meta: null, timestamp: 0 };
    const parsed = JSON.parse(cached);
    if (!parsed.timestamp) return { playlists: [], meta: null, timestamp: 0 };
    if (Date.now() - parsed.timestamp > HOME_PLAYLIST_CACHE_TTL) {
      return { playlists: [], meta: null, timestamp: 0 };
    }
    return {
      playlists: parsed.playlists || [],
      meta: parsed.meta || null,
      timestamp: parsed.timestamp,
    };
  } catch (error) {
    console.warn("Failed to parse cached playlists", error);
    return { playlists: [], meta: null, timestamp: 0 };
  }
};

const MusicHomepage = () => {
  const navigate = useNavigate();
  const { isPlaying } = useAudio();

  const cachedHome = useMemo(() => readCachedPlaylists(), []);

  const [_Artists] = useState([
    {
      id: 485956,
      title: "Yo Yo Honey Singh",
      imageUrl: myImage,
    },
    {
      id: 697691,
      title: "Karan Aujla",
      imageUrl: myImage,
    },
    {
      id: 455109,
      title: "Lata Mangeshkar",
      imageUrl: myImage,
    },
    {
      id: 459320,
      title: "Arjit Singh",
      imageUrl: myImage,
    },
    {
      id: 464656,
      title: "Armaan Malik",
      imageUrl: myImage,
    },
    {
      id: 455130,
      title: "Shreya Ghoshal",
      imageUrl: myImage,
    }
  ]);

  // Genres data
  const genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Jazz",
    "Electronic",
    "Classical",
    "Country",
  ];

  const [homePlaylists, setHomePlaylists] = useState(cachedHome.playlists);
  const [homeMeta, setHomeMeta] = useState(cachedHome.meta);
  const [homeUpdatedAt, setHomeUpdatedAt] = useState(cachedHome.timestamp);
  const [homeError, setHomeError] = useState(null);
  const [isHomeLoading, setIsHomeLoading] = useState(false);
  const [homeArtists, setHomeArtists] = useState([]);
  const [artistsError, setArtistsError] = useState(null);
  const [isArtistsLoading, setIsArtistsLoading] = useState(false);
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchPage, setShowSearchPage] = useState(false);

  // Check if profile data needs to be set from params


  // Get mock data for display

  // Toggle search page visibility
  const toggleSearchPage = () => {
    setShowSearchPage(!showSearchPage);
  };

  // Close search page and reset query
  const closeSearchPage = () => {
    setShowSearchPage(false);
    setSearchQuery("");
  };
  
  //  Use a "User Interaction Unlock" Mechanism
    //  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  
    //  useEffect(() => {
    //    const unlockAudio = async () => {
    //      try {
    //        const audio = new Audio();
    //        audio.src =
    //          "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjMyLjEwNQAAAAAAAAAAAAAA//...";
    //        await audio.play(); // Play silent audio
    //        audio.pause(); // Pause immediately
    //        setIsAudioUnlocked(true);
    //        console.log("Audio unlocked!");
    //      } catch (error) {
    //        console.error("Failed to unlock audio:", error);
    //      }
    //    };
   
    //    // Unlock audio on user interaction
    //    document.addEventListener("click", unlockAudio, { once: true });
    //  }, []);
  //  Use a "User Interaction Unlock" Mechanism
   

  const fetchHomeData = useCallback(async () => {
    setIsHomeLoading(true);
    setHomeError(null);
    try {
      const response = await getHomePlaylists(12);
      const normalizedPlaylists = (response?.playlists || []).map((playlist) => ({
        id: playlist.id,
        title: playlist.title,
        description:
          playlist.genre || playlist.description
            ? playlist.description || `Curated ${playlist.genre}`
            : `${playlist.nb_tracks || 0} tracks`,
        imageUrl: playlist.picture || playlist.image || myImage,
        songsCount: playlist.nb_tracks || playlist.songCount || 0,
        source: playlist.genre ? `Genre • ${playlist.genre}` : "Deezer",
      }));

      setHomePlaylists(normalizedPlaylists);
      setHomeMeta(response?.sourceCounts || null);
      const payload = {
        playlists: normalizedPlaylists,
        meta: response?.sourceCounts || null,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(HOME_PLAYLIST_CACHE_KEY, JSON.stringify(payload));
      setHomeUpdatedAt(payload.timestamp);
    } catch (error) {
      setHomeError(error?.message || "Unable to load playlists right now.");
    } finally {
      setIsHomeLoading(false);
    }
  }, []);

  const fetchHomeArtistsData = useCallback(async () => {
    setIsArtistsLoading(true);
    setArtistsError(null);
    try {
      const response = await getHomeArtists(10);
      const normalizedArtists = (response?.artists || []).map((artist) => ({
        id: artist.id,
        title: artist.name,
        imageUrl: artist.picture || artist.picture_medium || myImage,
        trackPreview: artist.trackPreview || null,
      }));

      setHomeArtists(normalizedArtists);
    } catch (error) {
      setArtistsError(error?.message || "Unable to load artists right now.");
    } finally {
      setIsArtistsLoading(false);
    }
  }, []);

  useEffect(() => {
    const isCacheFresh =
      homePlaylists.length > 0 &&
      homeUpdatedAt &&
      Date.now() - homeUpdatedAt < HOME_PLAYLIST_CACHE_TTL;

    if (!isCacheFresh) {
      fetchHomeData();
    }
  }, [fetchHomeData, homePlaylists.length, homeUpdatedAt]);

  useEffect(() => {
    if (homeArtists.length === 0) {
      fetchHomeArtistsData();
    }
  }, [fetchHomeArtistsData, homeArtists.length]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
      {/* Header Component */}
      <Navbar show = {"Home"}  isplaying = {isPlaying}/>

      <MyFriendButton />
      <GroupSidebarButton />
      {/* Search Page Component (conditionally rendered) */}
      {showSearchPage && (
        <SearchPage
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClose={closeSearchPage}
        />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-24">
        {/* Hero Section */}
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleSearchPage={toggleSearchPage}
        />

        {/* Featured Playlists */}
        <FeaturedPlaylists
          playlists={homePlaylists}
          navigate={navigate}
          isLoading={isHomeLoading}
          error={homeError}
          onRetry={fetchHomeData}
          lastUpdated={homeUpdatedAt}
          meta={homeMeta}
        />

        {/* Browse Artists */}
        <Artists releases={homeArtists.length > 0 ? homeArtists : _Artists} navigate={navigate} isLoading={isArtistsLoading} error={artistsError} />

        {/* Genres */}
        <GenresSection genres={genres} />
      </main>

      {/* Music Player (fixed at bottom) */}
      <MusicPlayer/>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MusicHomepage;
