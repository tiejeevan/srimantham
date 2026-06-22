'use client';

import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import styles from './InvitationCard.module.css';

export default function InvitationCard() {
  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.invitationCard} border-traditional`}>
        {/* Cute Baby Ganesha Image */}
        <div className={styles.ganeshaHeader}>
          <img 
            src="/baby-ganesha.png" 
            alt="Lord Ganesha" 
            className={styles.ganeshaImg}
          />
        </div>

        {/* Auspicious header line */}
        <p className={styles.auspiciousLine}>|| Sri Ganeshaya Namaha ||</p>

        {/* Invitation Text */}
        <div className={styles.invitationContent}>
          <span className={styles.subTitle}>With love and blessings, we invite you to the</span>
          <h1 className={styles.mainTitle}>Shreemantam</h1>
          <span className={styles.ceremonySubtitle}>(Traditional Baby Shower Ceremony)</span>
          
          <div className={styles.coupleNames}>
            <h2>Jeevan</h2>
            <span className={styles.ampersand}>&</span>
            <h2>Vibhaswi</h2>
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
                <strong>Friday</strong>
                <span>July 3, 2026</span>
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
                <strong>Cleveland, OH</strong>
                <span>6267 Stumph Rd, 44130</span>
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
