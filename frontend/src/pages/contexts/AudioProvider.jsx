import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { useQueue } from "./queueContext";
import myImage from "../coverImage.jpg";
import { useSocket } from "./SocketContext";
import { useGroup } from "./GroupContext";
import toast from "react-hot-toast";
const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const socket = useSocket();
  const { groupState, updateGroupState } = useGroup();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(
    localStorage.getItem("currentSong")
      ? JSON.parse(localStorage.getItem("currentSong"))
      : {
          title: "Apna Bana Le",
          artists: "Sachin-Jigar, Arijit Singh",
          coverImage:
            "https://c.saavncdn.com/815/Bhediya-Hindi-2023-20230927155213-500x500.jpg",
          audioSrc:
            "https://aac.saavncdn.com/815/483a6e118e8108cbb3e5cd8701674f32_320.mp4",
          duration: 261,
          id: null,
          isLiked: false,
        }
  );
  const [currentTime, setCurrentTime] = useState(
    parseFloat(localStorage.getItem("currTime")) || 0
  );
  const [currentSongId, setCurrentSongId] = useState(null);

  const audioRef = useRef(new Audio(currentSong.audioSrc));
  const isPresent = (song) => {
    const likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];
    return likedSongs.some((likedSong) => likedSong.id === song.id);
  };
  const [duration, setDuration] = useState(currentSong.duration);
  const [volume, setVolume] = useState(0.7);
  const {
    next,
    prev,
    enqueuenext,
    dequeuenext,
    clearnext,
    peeknext,
    sizenext,
    enqueueprev,
    dequeueprev,
    clearprev,
    peekprev,
    sizeprev,
  } = useQueue();

  useEffect(() => {
    const audio = audioRef.current;
    audio.currentTime = currentTime;
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      localStorage.setItem("currTime", audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      // When current song ends, play the next song automatically
      nextSong();
    };

    // Add event listeners
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    // Set initial volume
    audio.volume = volume;

    // Clean up
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []); // Keep this dependency array empty to only run once

  const togglePlay = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const prevSong = () => {
    const length = sizeprev();

    if (length > 0) {
      const curr = peekprev();
      dequeueprev();
      loadSong(curr);
    }
  };

  // Load and play a song
  function loadSong(song) {
    const audio = audioRef.current;

    setCurrentTime(0);
    // If it's the same song that was already loaded, don't reload
    if (currentSong && song.audioSrc === currentSong.audioSrc) {
      return;
    }

    // Update current song ID for highlighting
    setCurrentSongId(song.id);
    localStorage.setItem("currentSong", JSON.stringify(song));
    // Set the new song
    setCurrentSong(song);

    // Set the new audio source
    audio.src = song.audioSrc;

    // Load the new audio source
    audio.load();
    setIsPlaying(true);

    audio.play();
  }

  const getArtists = (artists) => {
    let updatedArtists = "";
    let flag = 0;
    let count = 0;
    artists.forEach((artist) => {
      if (count >= 2) {
        flag = 1;
        return;
      }
      if (updatedArtists) updatedArtists += ", ";
      updatedArtists += artist.name;
      count++;
    });
    if (flag) {
      updatedArtists += "...";
    }
    return updatedArtists;
  };

  function nextSong() {
    const length = sizenext();

    if (length > 0) {
      const curr = peeknext();
      dequeuenext();
      // Only enqueue previous if there's a valid current song
      if (currentSong && currentSong.title) {
        enqueueprev(currentSong);
      }
      const _currentSong = {
        title: curr.name,
        artists: getArtists(curr.artists.primary),
        coverImage:
          curr.image[Object.keys(curr.image).length - 1].url ||
          "https://via.placeholder.com/50",
        audioSrc:
          curr.downloadUrl[Object.keys(curr.downloadUrl).length - 1].url || "",
        duration: curr.duration,
        id: curr.id, // Store the song ID for highlighting
      };

      if (!_currentSong || !_currentSong.audioSrc) {
        console.error("Invalid song object:", curr);
        return false;
      }

      loadSong(_currentSong);
    } else {
      console.warn("No next song available");
      // If no next song, stop playing or loop back to the beginning
      const audio = audioRef.current;
      audio.pause();
      setIsPlaying(false);
    }
  }

  const [songTimeChange, setSongTimeChange] = useState();

  const seekTo = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    localStorage.setItem("currTime", audio.currentTime);
    setCurrentTime(time);
    setSongTimeChange(time);
  };

  const setAudioVolume = (newVolume) => {
    const audio = audioRef.current;
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  //socket to send current song data to friend
  useEffect(() => {
    // Listen for "recieve-accept" event (when another user accepts the invitation)
    socket.on("receive-accept", (data) => {
      toast.success(data.message);
      if(data.set){
        //means user joined group
        updateGroupState({
          isInGroup : true,
          groupId : data.groupId,
          isAdmin : false,
          groupName : data.groupName
      })
      }
      console.log("group is joined", data.message);
      // Send the current song data to the accepting user
      const songData = {
        groupId: groupState.groupId,
        currentSong: {
          title: currentSong.title,
          artists: currentSong.artists,
          coverImage: currentSong.coverImage,
          audioSrc: currentSong.audioSrc,
          duration: currentSong.duration,
          id: currentSong.id,
        },
        currentTime: currentTime, // Current playback position
        isPlaying: isPlaying, // Whether the song is currently playing
      };

      if (groupState.isAdmin) {
        socket.emit("send-songs-to-user", songData);
      }
    });

    // Clean up socket listeners
    return () => {
      socket.off("recieve-accept");
    };
  }, []);

  //send song data to all group firends
  useEffect(() => {
    const songData = {
      groupId: groupState.groupId,
      currentSong: {
        title: currentSong.title,
        artists: currentSong.artists,
        coverImage: currentSong.coverImage,
        audioSrc: currentSong.audioSrc,
        duration: currentSong.duration,
        id: currentSong.id,
      },
      currentTime: currentTime, // Current playback position
      isPlaying: isPlaying, // Whether the song is currently playing
    };

    if (groupState.isAdmin) {
      socket.emit("send-songs-to-user", songData);
    }
  }, [currentSong, isPlaying, songTimeChange]); // Re-run when song data changes

  useEffect(() => {
    const audio = audioRef.current;
    // Listen for "send-songs-to-user" event
    socket.on("recive-songs-from-user", (data) => {
      const {
        currentSong: receivedSong,
        currentTime: receivedTime,
        isPlaying: receivedIsPlaying,
      } = data;

      // Load the received song into the player

      //set these data if he is not admin
      if (!groupState.isAdmin) {
        loadSong(receivedSong);

        // Seek to the received playback position
        seekTo(receivedTime);
        // Update play/pause state
        if (receivedIsPlaying) {
          audio.play();
          // console.log("togal is working");
          // togglePlay(); // Start playback if the sender is playing
        } else {
          audio.pause();
          setIsPlaying(false);
        }
      }
    });

    // Clean up socket listeners
    return () => {
      socket.off("recive-songs-from-user");
    };
  }, []); // Run once on component mount

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        isPlaying,
        currentTime,
        duration,
        volume,
        currentSong,
        currentSongId, // Expose currentSongId to components
        loadSong,
        togglePlay,
        seekTo,
        setAudioVolume,
        nextSong,
        prevSong,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
