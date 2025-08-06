// line 536 may be a part of doubt , when token expires or I want to open Id of some other guy.
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Navbar";
import SearchPage from "./Search";
import { fetchProfile } from "../services/operations/auth";
import MusicPlayer from "./Music_player";
import myImage from "./coverImage.jpg";
import { fetchArtist, fetchPlaylist } from "../services/operations/songsAPI";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";
import {useAudio} from "./contexts/AudioProvider";
import MyFriendButton from "../components/connect_components/MyFriendButton";
import GroupSidebarButton from "../components/groups_components/GroupSidebarButton";
import HeroSection from "../components/Home-Page-Components/HeroSection";

import FeaturedPlaylists from "../components/Home-Page-Components/FeaturedPlaylists";
import Artists from "../components/Home-Page-Components/Artists";
import GenresSection from "../components/Home-Page-Components/GenresSection";
import Footer from "../components/Home-Page-Components/Footer";
import useAudioUnlock from "../utils/useAudioUnlock";


 

// Main MusicHomepage component
const MusicHomepage = (params) => {
  // Router hooks
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const {
    isPlaying
  } = useAudio();
  // Extract data from location state or params

   const [_Artists, setArtists] = useState([
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

  const [featuredPlaylists, setfeaturedPlaylists] = useState(

    [
    {
      id: 1208889681,
      title: "Lofi Music",
      description: "Relax your mind",
      imageUrl: myImage,
      songsCount:0
    },
    {
      id: 1219015193,
      title: "Old is gold",
      description: "Relaxing beats for your day",
      imageUrl: myImage,
      songsCount:0
    },
    {
      id: 1139074020,
      title: "Love songs",
      description: "__",
      imageUrl: myImage,
      songsCount:0
    },
    {
      id: 1219169738,
      title: "Indie Discoveries",
      description: "Fresh indie tracks for you",
      imageUrl: myImage,
      songsCount:0
    },
    {
      id: 156710699,
      title: "Classic Rock",
      description: "Timeless rock anthems",
      imageUrl: myImage,
      songsCount:0
    },
  ]);




  useEffect(() => {
    const fetchAllPlaylists = async () => {
      try {
        if(featuredPlaylists.songsCount > 0){
           return;
        }
        const updatedPlaylists = await Promise.all(
          featuredPlaylists.map(async (element) => {
            const response = await fetchPlaylist(element.id);
            console.log("response Home", response.image);
            return {
              ...element,
              imageUrl: response.image[Object.keys(response.image).length - 1].url,
              title: response.name,
              description: response.description,
              songsCount:response.songCount,
              songs: response.songs
            };
          })
        );
         
        setfeaturedPlaylists(updatedPlaylists); // Update state with new array
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    const fetchAllArtists = async () => {
      try {
        const updatedArtists = await Promise.all(
          _Artists.map(async (element) => {
            const response = await fetchArtist(element.id);
            console.log("first check", response);
            return {
              ...element,
              imageUrl: response.image[Object.keys(response.image).length - 1].url,
              title: response.name,
              description: response.description,
              songsCount:10,
              songs: response.topSongs
            };
          })
        );
       
        setArtists(updatedArtists);
        setloading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllArtists();
    fetchAllPlaylists();

  }, []);




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
    useAudioUnlock();

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
        <FeaturedPlaylists playlists={featuredPlaylists} navigate={navigate} />

        {/* New Releases */}
        <Artists releases={_Artists} navigate = {navigate}/>

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
