'use client';

import React, { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

interface CountdownProps {
  targetDate: string; // ISO string, e.g., '2026-10-18T10:00:00'
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: false };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isCompleted: false,
      };
    } else {
      timeLeft.isCompleted = true;
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: false });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isMounted) {
    return (
      <div className={styles.countdownLoader}>
        <span className="animate-spin-slow">❈</span> Loading Countdown...
      </div>
    );
  }

  if (timeLeft.isCompleted) {
    return (
      <div className={styles.celebrationMessage}>
        <h3>The Auspicious Event Has Begun!</h3>
        <p>Thank you for joining and blessing the couple.</p>
      </div>
    );
  }

  return (
    <div className={styles.countdownContainer}>
      <div className={styles.timeBox}>
        <span className={styles.timeNumber}>{String(timeLeft.days).padStart(2, '0')}</span>
        <span className={styles.timeLabel}>Days</span>
      </div>
      <div className={styles.timeDivider}>❈</div>
      <div className={styles.timeBox}>
        <span className={styles.timeNumber}>{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className={styles.timeLabel}>Hours</span>
      </div>
      <div className={styles.timeDivider}>❈</div>
      <div className={styles.timeBox}>
        <span className={styles.timeNumber}>{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className={styles.timeLabel}>Mins</span>
      </div>
      <div className={styles.timeDivider}>❈</div>
      <div className={styles.timeBox}>
        <span className={styles.timeNumber}>{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className={styles.timeLabel}>Secs</span>
      </div>
    </div>
  );
}
