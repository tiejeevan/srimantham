'use client';

import React, { useEffect, useState } from 'react';
import InvitationCard from '@/components/InvitationCard';
import Countdown from '@/components/Countdown';
import RSVPForm from '@/components/RSVPForm';
import WishesWall from '@/components/WishesWall';
import VenueMap from '@/components/VenueMap';
import BackgroundMusic from '@/components/BackgroundMusic';
import styles from './page.module.css';

// Falling marigold/rose petals background component
function FlowerPetals() {
  const [petals, setPetals] = useState<Array<{ id: number; left: string; delay: string; duration: string; scale: number; type: 'saffron' | 'pink' | 'marigold' }>>([]);

  useEffect(() => {
    // Generate petals only on client-side to prevent hydration mismatches
    const generated = Array.from({ length: 24 }).map((_, i) => {
      const types: ('saffron' | 'pink' | 'marigold')[] = ['saffron', 'pink', 'marigold'];
      return {
        id: i,
        left: `${Math.random() * 100}vw`,
        delay: `${Math.random() * 15}s`,
        duration: `${8 + Math.random() * 10}s`,
        scale: 0.5 + Math.random() * 0.8,
        type: types[i % 3],
      };
    });
    setPetals(generated);
  }, []);

  return (
    <div className="flower-container">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className={`flower-petal ${petal.type === 'pink' ? 'pink' : petal.type === 'marigold' ? 'marigold' : ''}`}
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            transform: `scale(${petal.scale})`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const targetEventDate = '2026-07-03T10:30:00'; // Target date for Shreemantam

  return (
    <main className={`${styles.main} bg-mandala`}>
      {/* Background audio track */}
      <BackgroundMusic />

      {/* Decorative falling marigold flowers */}
      <FlowerPetals />

      {/* Hero Invitation Section */}
      <section className={styles.heroSection}>
        <div className={styles.topBanner}>
          <span>❈ SWAGATHAM ❈</span>
        </div>
        <InvitationCard />
      </section>

      {/* Countdown Timer Section */}
      <section className={styles.countdownSection}>
        <div className="section-header">
          <span className="section-subtitle">Auspicious Countdown</span>
          <h2 className="section-title">Celebrating Soon</h2>
          <div className="divider-traditional"></div>
        </div>
        <Countdown targetDate={targetEventDate} />
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className={styles.rsvpSection}>
        <div className="section-header">
          <span className="section-subtitle">Confirm Attendance</span>
          <h2 className="section-title">Be Our Guest</h2>
          <div className="divider-traditional"></div>
        </div>
        <div className="section-container">
          <RSVPForm />
        </div>
      </section>

      {/* Venue & Location Section */}
      <section id="venue" className={styles.venueSection}>
        <div className="section-header">
          <span className="section-subtitle">Event Location</span>
          <h2 className="section-title">The Venue</h2>
          <div className="divider-traditional"></div>
        </div>
        <div className="section-container">
          <VenueMap />
        </div>
      </section>

      {/* Guest Blessings Board Section */}
      <section id="blessings" className={styles.blessingsSection}>
        <div className="section-header">
          <span className="section-subtitle">Wishes & Prayers</span>
          <h2 className="section-title">Blessings Wall</h2>
          <div className="divider-traditional"></div>
        </div>
        <div className="section-container">
          <WishesWall />
        </div>
      </section>

      {/* Auspicious Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerMandala}>❈</div>
        <p className={styles.footerGreeting}>We look forward to welcoming you!</p>
        <p className={styles.footerHosts}>— Chowdapu & Jeevan & Vibhaswi's Family</p>
        <div className={styles.copyright}>
          <p>© 2026 Shreemantam Invitation. Crafted with love.</p>
        </div>
      </footer>
    </main>
  );
}
