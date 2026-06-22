'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Music, Music4 } from 'lucide-react';
import styles from './BackgroundMusic.module.css';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userInteractedRef = useRef(false);

  // Traditional soft Indian flute music url
  const musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'; 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Soft background volume
    }

    // Try to play immediately (might be blocked by browser autoplay policy)
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            removeInteractionListeners();
          })
          .catch((err) => {
            console.log('Autoplay blocked. Waiting for user interaction.');
          });
      }
    };

    const handleUserInteraction = () => {
      if (userInteractedRef.current) return;
      playAudio();
      userInteractedRef.current = true;
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    // Attempt autoplay immediately
    playAudio();

    // Set up listeners for first user click/touch to trigger audio
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    return () => {
      removeInteractionListeners();
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    // Prevent the window click listener from immediately re-enabling it
    e.stopPropagation();
    userInteractedRef.current = true;

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback failed:', err);
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
