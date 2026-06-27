'use client';

import React, { useEffect, useState } from 'react';
import InvitationCard from '@/components/InvitationCard';
import Countdown from '@/components/Countdown';
import BackgroundMusic from '@/components/BackgroundMusic';
import styles from './page.module.css';

export default function Home() {
  const targetEventDate = '2026-07-03T10:30:00'; // Target date for Shreemantam

  return (
    <main className={`${styles.main} bg-mandala`}>
      {/* Background audio track */}
      <BackgroundMusic />

      {/* Hero Invitation Section */}
      <section className={styles.heroSection}>
        <InvitationCard />
      </section>

      {/* Countdown Timer Section */}
      <section className={styles.countdownSection}>
        <Countdown targetDate={targetEventDate} />
      </section>

      {/* Auspicious Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerMandala}>❈</div>
        <p className={styles.footerGreeting}>We look forward to welcoming you!</p>
        <p className={styles.footerHosts}>— Jeevan & Vibhaswi's Family</p>
        <div className={styles.copyright}>
          <p>© 2026 Shreemantam Invitation. Crafted with love.</p>
        </div>
      </footer>
    </main>
  );
}
