'use client';

import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import styles from './InvitationCard.module.css';

export default function InvitationCard() {
  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.invitationCard} border-traditional`}>
        {/* Top traditional mandala design placeholder */}
        <div className={styles.mandalaHeader}>
          <div className={styles.mandalaOrnament}>❈</div>
        </div>

        {/* Auspicious header line */}
        <p className={styles.auspiciousLine}>|| Sri Ganeshaya Namaha ||</p>

        {/* Invitation Text */}
        <div className={styles.invitationContent}>
          <span className={styles.subTitle}>With love and blessings, we invite you to the</span>
          <h1 className={styles.mainTitle}>Shreemantam</h1>
          <span className={styles.ceremonySubtitle}>(Traditional Baby Shower Ceremony)</span>
          
          <div className={styles.coupleNames}>
            <h2>Sanjana</h2>
            <span className={styles.ampersand}>&</span>
            <h2>Rahul</h2>
          </div>

          <p className={styles.invitationVerse}>
            "A grand new adventure is about to begin! Join us as we bless the parents-to-be and shower the mother-to-be with love, bangles, and blessings for a safe delivery and a healthy baby."
          </p>

          <div className={styles.divider}>
            <span className={styles.flower}>❀</span>
          </div>

          {/* Quick Info Grid */}
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <Calendar className={styles.infoIcon} size={20} />
              <div className={styles.infoText}>
                <strong>Sunday</strong>
                <span>October 18, 2026</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <Clock className={styles.infoIcon} size={20} />
              <div className={styles.infoText}>
                <strong>Muhurtham</strong>
                <span>10:30 AM onwards</span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <MapPin className={styles.infoIcon} size={20} />
              <div className={styles.infoText}>
                <strong>Grand Palace</strong>
                <span>Royal Hall, Bangalore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative corner mandalas */}
        <div className={`${styles.cornerOrnament} ${styles.topLeft}`}>❈</div>
        <div className={`${styles.cornerOrnament} ${styles.topRight}`}>❈</div>
        <div className={`${styles.cornerOrnament} ${styles.bottomLeft}`}>❈</div>
        <div className={`${styles.cornerOrnament} ${styles.bottomRight}`}>❈</div>
      </div>
    </div>
  );
}
