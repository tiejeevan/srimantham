'use client';

import React, { useEffect, useState } from 'react';
import InvitationCard from '@/components/InvitationCard';
import Countdown from '@/components/Countdown';
import RSVPForm from '@/components/RSVPForm';
import WishesWall from '@/components/WishesWall';
import VenueMap from '@/components/VenueMap';
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
        <p className={styles.footerHosts}>— Jeevan & Vibhaswi's Family</p>
        <div className={styles.copyright}>
          <p>© 2026 Shreemantam Invitation. Crafted with love.</p>
        </div>
      </footer>
    </main>
  );
}
