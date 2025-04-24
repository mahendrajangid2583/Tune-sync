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





// Component for the hero section
const HeroSection = ({ searchQuery, setSearchQuery, toggleSearchPage }) => (
  <section className="my-8 rounded-xl overflow-hidden">
    <div
      className="bg-gradient-to-r from-purple-900 to-indigo-900 py-20 px-8 text-center relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(76, 29, 149, 0.7), rgba(30, 27, 75, 0.9)), url('/api/placeholder/1200/500')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
        Your Music, Your Way
      </h1>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
        Stream millions of songs and podcasts. Discover new artists and create
        the perfect playlist for every moment.
      </p>

      <div
        className="max-w-xl mx-auto flex rounded-full overflow-hidden bg-gray-800"
        onClick={(e) => {
          e.stopPropagation();
          toggleSearchPage();
        }}
      >
        <input
          type="text"
          placeholder="Search for songs, artists, or podcasts..."
          className="flex-1 py-4 px-6 bg-transparent text-white focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="bg-purple-600 px-6 py-4 font-medium hover:bg-purple-700 transition-colors">
          Search
        </button>
      </div>
    </div>
  </section>
);

// Component for featured playlists section
// Updated PlaylistCard with smaller size

const PlaylistCard = ({ playlist, navigate }) => (
  <div
    onClick={() => navigate('/playlist', { state: { playlist: playlist } })}
    className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group w-full text-left cursor-pointer"
  >
    <div className="aspect-square overflow-hidden">
      <img
        src={playlist.imageUrl}
        alt={playlist.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        style={{ maxHeight: "400px" }}
      />
    </div>
    <div className="p-3">
      <h3 className="font-bold text-sm">{playlist.title}</h3>
      <p className="text-gray-400 text-xs mt-1">{playlist.description}</p>
    </div>
  </div>
);


// Updated ReleaseCard for Artists with circular image
const ReleaseCard = ({ release, navigate}) => (
  <div 
     onClick={() => navigate('/playlist', { state: { playlist: release } })}
    className="bg-transparent text-center hover:bg-gray-800 rounded-lg p-2 transition-colors group cursor-pointer"
  >
    <div className="aspect-square overflow-hidden rounded-full mx-auto" style={{ width: "200px", height: "200px" }}>
      <img
        src={release.imageUrl}
        alt={release.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-2">
      <h2 className="font-bold text-l">{release.title}</h2>
    </div>
  </div>
);

// Updated GenreTile with smaller size
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

// Updated FeaturedPlaylists to increase grid density
const FeaturedPlaylists = ({ playlists, navigate }) => (
  <section className="my-10 relative">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-3xl font-bold px-5">Featured Playlists</h2>
    </div>

    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} navigate={navigate} />
      ))}
    </div>
  </section>
);

// Updated Artists section with new circular cards
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

// Updated GenresSection with denser grid
const GenresSection = ({ genres }) => (
  <section className="my-10">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">Browse Genres</h2>
      <a href="#" className="text-purple-500 hover:text-purple-400 font-medium">
        View All
      </a>
    </div>

    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {genres.map((genre, index) => (
        <GenreTile key={index} genre={genre} />
      ))}
    </div>
  </section>
);
// Component for the music player

// Component for the footer
const Footer = () => (
  <footer className="bg-gray-800 mt-20 pt-12 pb-24">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-lg mb-4">Company</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Jobs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                For the Record
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4">Communities</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                For Artists
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Developers
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Advertising
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Investors
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4">Useful Links</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Web Player
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Mobile App
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4">Connect with us</h4>
          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>

            <a
              href="#"
              className="bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-400 text-sm">
        <p>© 2025 Harmony Music. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

 

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
      id: 459633,
      title: "Atif Aslam",
      imageUrl: myImage,
    },
    {
      id: 697691,
      title: "Karan Aujla",
      imageUrl: myImage,
    },
    {
      id: 455144,
      title: "Kishore Kumar",
      imageUrl: myImage,
    },
    {
      id: 459320,
      title: "Arjit Singh",
      imageUrl: myImage,
    },
    {
      id: 468245,
      title: "Diljit Dosanjh",
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
     const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  
     useEffect(() => {
       const unlockAudio = async () => {
         try {
           const audio = new Audio();
           audio.src =
             "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjMyLjEwNQAAAAAAAAAAAAAA//...";
           await audio.play(); // Play silent audio
           audio.pause(); // Pause immediately
           setIsAudioUnlocked(true);
           console.log("Audio unlocked!");
         } catch (error) {
           console.error("Failed to unlock audio:", error);
         }
       };
   
       // Unlock audio on user interaction
       document.addEventListener("click", unlockAudio, { once: true });
     }, []);
  
  

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header Component */}
      <Navbar show = {"Home"}  isplaying = {isPlaying}/>
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
