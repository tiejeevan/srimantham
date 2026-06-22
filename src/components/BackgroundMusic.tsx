'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Music, Music4 } from 'lucide-react';
import styles from './BackgroundMusic.module.css';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Traditional soft Indian flute music url
  const musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'; 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // Soft background volume
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Autoplay blocked by browser. Interaction required.', err);
        });
    }
  };

  return (
    <div className={styles.musicContainer}>
      <audio ref={audioRef} src={musicUrl} loop />
      <button 
        onClick={togglePlay} 
        className={`${styles.musicBtn} ${isPlaying ? styles.playing : ''}`}
        title={isPlaying ? 'Mute Music' : 'Play Music'}
        aria-label="Toggle background music"
      >
        {isPlaying ? (
          <Music4 className={styles.iconActive} size={24} />
        ) : (
          <Music className={styles.iconInactive} size={24} />
        )}
        <span className={styles.pulseRing}></span>
      </button>
    </div>
  );
}
