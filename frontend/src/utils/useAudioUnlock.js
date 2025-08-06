import { useEffect, useState } from "react";

const useAudioUnlock = () => {
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

  useEffect(() => {
    const unlockAudio = async () => {
      try {
        const audio = new Audio();
        // A valid 1-second silent MP3 audio (base64-encoded)
        audio.src =
          "data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAeAAACABAAZGF0YQAAAAA=";
        await audio.play(); // Try to play
        audio.pause();      // Pause immediately
        setIsAudioUnlocked(true);
        console.log("Audio unlocked!");
      } catch (error) {
        console.error("Failed to unlock audio:", error);
      }
    };

    // Add user interaction event listener (once)
    const handleClick = () => {
      unlockAudio();
      document.removeEventListener("click", handleClick);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return isAudioUnlocked;
};

export default useAudioUnlock;
