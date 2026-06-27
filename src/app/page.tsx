'use client';

import React, { useEffect, useState } from 'react';
import InvitationCard from '@/components/InvitationCard';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={`${styles.main} bg-mandala`}>
      {/* Hero Invitation Section */}
      <section className={styles.heroSection}>
        <InvitationCard />
      </section>

      {/* Auspicious Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerMandala}>❈</div>
        <p className={styles.footerGreeting}>We look forward to welcoming you!</p>
        <p className={styles.footerHosts}>— Jeevan & Vibhaswi's Family</p>
      </footer>
    </main>
  );
}
