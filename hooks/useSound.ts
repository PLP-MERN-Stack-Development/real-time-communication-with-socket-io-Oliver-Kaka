
import { useState, useEffect, useCallback } from 'react';

const useSound = (url: string) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, [audio]);
  
  const play = useCallback(() => {
    if (!playing) {
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Error playing sound:", e));
    }
  }, [audio, playing]);

  return play;
};

export default useSound;
