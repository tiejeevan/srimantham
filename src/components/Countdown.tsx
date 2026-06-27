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
    // Format the date string so it is parsed correctly across all browsers (especially Safari)
    const formattedDate = targetDate.replace(/-/g, '/').replace('T', ' ');
    const difference = +new Date(formattedDate) - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: false };

    if (!isNaN(difference) && difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isCompleted: false,
      };
    } else if (isNaN(difference)) {
      console.error("Invalid targetDate format passed to Countdown:", targetDate);
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
        <span className={styles.spinner}>❈</span> Loading...
      </div>
    );
  }

  if (timeLeft.isCompleted) {
    return (
      <div className={styles.celebrationMessage}>
        <h3>The Auspicious Event Has Begun!</h3>
      </div>
    );
  }

  return (
    <div className={styles.countdownWrapper}>
      <span className={styles.wrapperLabel}>Auspicious Muhurtham Countdown</span>
      <div className={styles.countdownContainer}>
        <div className={styles.timeBox}>
          <span className={styles.timeNumber}>{String(timeLeft.days).padStart(2, '0')}</span>
          <span className={styles.timeLabel}>Days</span>
        </div>
        <div className={styles.timeDivider}>:</div>
        <div className={styles.timeBox}>
          <span className={styles.timeNumber}>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className={styles.timeLabel}>Hours</span>
        </div>
        <div className={styles.timeDivider}>:</div>
        <div className={styles.timeBox}>
          <span className={styles.timeNumber}>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className={styles.timeLabel}>Mins</span>
        </div>
        <div className={styles.timeDivider}>:</div>
        <div className={styles.timeBox}>
          <span className={styles.timeNumber}>{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className={styles.timeLabel}>Secs</span>
        </div>
      </div>
    </div>
  );
}
