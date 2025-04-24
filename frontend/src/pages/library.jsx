import React, { useState, useEffect } from 'react';
import { Heart, ChevronLeft, Play, Clock, ListMusic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import myImage from './coverImage.jpg'; // Placeholder image
import MusicPlayer from './Music_player';
import { useQueue } from './contexts/queueContext';
import { handleSongClick } from './playlist';
import { useAudio } from './contexts/AudioProvider';

const MusicLibrary = () => {
  const [activeTab, setActiveTab] = useState('songs'); // 'songs' or 'playlists'
  const [likedSongs, setLikedSongs] = useState([]);
  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const navigate = useNavigate();
  //track, index , clearnext , loadSong , enqueuenext , playlistData
  const {
    clearnext , 
    enquenext
  } = useQueue();
  const {
    loadSong , 
    currentSong,
    seekTo
  } = useAudio();
  // Mock function to simulate fetching liked songs and playlists
  useEffect(() => {
    // In a real app, this would be API calls
    const mockLikedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [
      {
        id: '1',
        name: 'Blinding Lights',
        artists: { 
          primary: [{ name: 'The Weeknd' }] 
        },
        image: {
          2: { url: 'https://via.placeholder.com/150' }
        },
        duration: 200,
        downloadUrl: {
          0: { url: 'mock-url-1' }
        }
      },
      // More mock songs...
    ];
    
    const mockLikedPlaylists = [
      {
        id: '1',
        playlist_name: 'Chill Vibes',
        description: 'Relaxing tracks for a calm evening',
        image: 'https://via.placeholder.com/300',
        songsCount: 15,
        songs: [] // Add song data if needed
      },
      {
        id: '2',
        playlist_name: 'Workout Mix',
        description: 'High-energy tracks to keep you motivated',
        image: 'https://via.placeholder.com/300',
        songsCount: 20,
        songs: [] // Add song data if needed
      },
      // More mock playlists...
    ];

    setLikedSongs(mockLikedSongs);
    setLikedPlaylists(mockLikedPlaylists);
  }, []);

  const handlePlayAllSongs = () => {
    handleSongClick(likedSongs[0], 0, clearnext, loadSong, enquenext, likedSongs , currentSong , seekTo)
  };

  const handleOpenPlaylist = (playlist) => {
    navigate('/playlist', { 
      state: { 
        playlist: playlist 
      } 
    });
  };

  const totaltime = (songs) => {
    let time = 0;
    songs.forEach((element) => {
      time += element.duration;
    });
    time = Math.floor(time / 60);
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    if (hours === 0) {
      return `${minutes} min`;
    } else if (hours === 1) {
      return `${hours} hour ${minutes} min`;
    }
    return `${hours} hours ${minutes} min`;
  };

  const renderContent = () => {
    if (activeTab === 'songs') {
      return (
        <div className="mt-2">
          {likedSongs.map((track, index) => (
            <div
              key={track.id}
              className="group grid grid-cols-12 gap-4 items-center p-3 rounded-md mb-1 cursor-pointer hover:bg-gray-800/40 transition-colors"
              onClick={() => handleSongClick(track, index, clearnext, loadSong, enquenext, likedSongs , currentSong , seekTo)}
            >
              <div className="col-span-1 text-center flex justify-center">
                <span className="text-gray-400">{index + 1}</span>
              </div>
              <div className="col-span-7 flex items-center">
                <img
                  src={track.coverImage|| myImage}
                  alt={track.title}
                  className="w-10 h-10 rounded shadow-md mr-3"
                />
                <h3 className="font-medium text-white group-hover:text-green-400 transition-colors">
                  {track.title}
                </h3>
              </div>
              <div className="col-span-3 text-sm text-gray-400 truncate">
                {track.artists}
              </div>
              <div className="col-span-1 flex justify-end items-center gap-3">
                <span className="text-sm text-gray-400">
                  {`${Math.floor(track.duration / 60)}:${track.duration % 60 < 10 ? '0' : ''}${track.duration % 60}`}
                </span>
                <Heart
                  size={14}
                  className="text-green-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {likedPlaylists.map((playlist) => (
          <div 
            key={playlist.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors group cursor-pointer"
            onClick={() => handleOpenPlaylist(playlist)}
          >
            <div className="relative mb-4">
              <img 
                src={playlist.image} 
                alt={playlist.playlist_name}
                className="w-full h-48 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
              />
              <button 
                className="absolute bottom-2 right-2 bg-green-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenPlaylist(playlist);
                }}
              >
                <Play size={20} fill="white" />
              </button>
            </div>
            <h3 className="text-white font-semibold text-lg truncate">
              {playlist.playlist_name}
            </h3>
            <p className="text-gray-400 text-sm truncate">
              {playlist.description}
            </p>
            <div className="text-gray-500 text-xs mt-2">
              {playlist.songsCount} Songs
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen w-full text-white font-sans overflow-x-hidden">
      <Navbar show="Library" />
      
      {/* Header with back button */}
      <header className="p-6 flex items-center">
        <button 
          className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="ml-4 text-xl font-medium">Music Library</h2>
      </header>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 rounded-full p-1 flex items-center">
          <button
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${
              activeTab === 'songs' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-400 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('songs')}
          >
            <Heart size={16} /> Liked Songs
          </button>
          <button
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-colors ${
              activeTab === 'playlists' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-400 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('playlists')}
          >
            <ListMusic size={16} /> Liked Playlists
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full">
        {/* Left Side - Info */}
        <div className="w-full lg:w-2/5 flex flex-col p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <div className="flex flex-col items-center lg:items-start">
            {/* Cover */}
            <div className="relative group w-64 h-64 mb-8 shadow-2xl">
              <img
                src={activeTab === 'songs' ? myImage : likedPlaylists[0]?.image || myImage}
                alt={activeTab === 'songs' ? 'Liked Songs' : 'Liked Playlists'}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
              {activeTab === 'songs' && (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button 
                    className="bg-green-500 p-4 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    onClick={handlePlayAllSongs}
                  >
                    <Play size={24} fill="white" />
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-2 text-center lg:text-left">
              {activeTab === 'songs' ? 'Liked Songs' : 'Liked Playlists'}
            </h1>
            <p className="text-gray-300 text-lg mb-6 max-w-lg text-center lg:text-left">
              {activeTab === 'songs' 
                ? 'All the songs you\'ve loved and saved' 
                : 'Playlists you\'ve added to your library'}
            </p>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-gray-400 text-sm">
                {activeTab === 'songs' 
                  ? `${likedSongs.length} songs • Approximately ${totaltime(likedSongs)}` 
                  : `${likedPlaylists.length} playlists`}
              </span>
            </div>

            {activeTab === 'songs' && (
              <div className="flex gap-4 mb-8">
                <button 
                  className="bg-green-500 hover:bg-green-600 transition-colors py-3 px-8 rounded-full font-medium flex items-center gap-2"
                  onClick={handlePlayAllSongs}
                >
                  <Play size={18} fill="white" /> Play
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Track/Playlist List */}
        <div className="w-full lg:w-3/5 flex flex-col h-full overflow-y-auto p-6 lg:border-l border-gray-800 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {activeTab === 'songs' && (
            <div className="p-4 bg-gray-800/40 sticky top-0 backdrop-blur-md z-10 rounded-md">
              <div className="grid grid-cols-12 gap-4 text-gray-400 text-sm uppercase tracking-wider">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-7">Title</div>
                <div className="col-span-3">Artist</div>
                <div className="col-span-1 flex justify-end">
                  <Clock size={16} />
                </div>
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </div>
      <MusicPlayer/>
    </div>
  );
};

export default MusicLibrary;