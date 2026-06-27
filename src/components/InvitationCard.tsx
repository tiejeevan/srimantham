'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, X, Navigation, Phone, CalendarPlus } from 'lucide-react';
import styles from './InvitationCard.module.css';

const MiniCountdown = () => {
  const targetDate = '2026-07-03T10:30:00';
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: false });

  useEffect(() => {
    const calculate = () => {
      const formattedDate = targetDate.replace(/-/g, '/').replace('T', ' ');
      const difference = +new Date(formattedDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isCompleted: false,
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
    };

    setTimeLeft(calculate());
    const timer = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.isCompleted) {
    return <div className={styles.miniCelebration}>The ceremony has begun!</div>;
  }

  return (
    <div className={styles.miniCountdown}>
      <div className={styles.miniTimeBox}>
        <span className={styles.miniTimeNum}>{timeLeft.days}</span>
        <span className={styles.miniTimeLbl}>Days</span>
      </div>
      <span className={styles.miniTimeDiv}>:</span>
      <div className={styles.miniTimeBox}>
        <span className={styles.miniTimeNum}>{timeLeft.hours}</span>
        <span className={styles.miniTimeLbl}>Hrs</span>
      </div>
      <span className={styles.miniTimeDiv}>:</span>
      <div className={styles.miniTimeBox}>
        <span className={styles.miniTimeNum}>{timeLeft.minutes}</span>
        <span className={styles.miniTimeLbl}>Mins</span>
      </div>
      <span className={styles.miniTimeDiv}>:</span>
      <div className={styles.miniTimeBox}>
        <span className={styles.miniTimeNum}>{timeLeft.seconds}</span>
        <span className={styles.miniTimeLbl}>Secs</span>
      </div>
    </div>
  );
};

export default function InvitationCard() {
  const [activeModal, setActiveModal] = useState<'day' | 'muhurtham' | 'location' | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

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
          
          <div className={styles.coupleNames}>
            <h2>Jeevan & Vibhaswi</h2>
          </div>

          <p className={styles.invitationVerse}>
            "A grand new adventure is about to begin! Join us as we bless the parents-to-be and shower the mother-to-be with love, bangles, and blessings for a safe delivery and a healthy baby."
          </p>

          {/* Interactive Info Bar (Single Line) */}
          <div className={styles.infoBar}>
            <button 
              onClick={() => setActiveModal('day')} 
              className={styles.infoBtn}
              title="Click for day details"
            >
              <Calendar className={styles.infoIcon} size={15} />
              <span>Friday, July 3</span>
            </button>
            <span className={styles.barDivider}>•</span>
            <button 
              onClick={() => setActiveModal('muhurtham')} 
              className={styles.infoBtn}
              title="Click for muhurtham & countdown"
            >
              <Clock className={styles.infoIcon} size={15} />
              <span>10:30 AM Onwards</span>
            </button>
            <span className={styles.barDivider}>•</span>
            <button 
              onClick={() => setActiveModal('location')} 
              className={styles.infoBtn}
              title="Click to view venue on map"
            >
              <MapPin className={styles.infoIcon} size={15} />
              <span>Cleveland, OH</span>
            </button>
          </div>
        </div>

        {/* Decorative corner mandalas */}
        <div className={`${styles.cornerOrnament} ${styles.topLeft}`}>❈</div>
        <div className={`${styles.cornerOrnament} ${styles.topRight}`}>❈</div>
        <div className={`${styles.cornerOrnament} ${styles.bottomLeft}`}>❈</div>
        <div className={`${styles.cornerOrnament} ${styles.bottomRight}`}>❈</div>
      </div>

      {/* Modal Popup Overlays */}
      {activeModal && (
        <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalClose} 
              onClick={() => setActiveModal(null)} 
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {activeModal === 'day' && (
              <div className={styles.modalInner}>
                <div className={styles.modalHeaderIcon}>
                  <Calendar size={32} />
                </div>
                <h3>Friday, July 3, 2026</h3>
                <div className={styles.modalDivider}></div>
                <p className={styles.modalDesc}>
                  We are delighted to invite you to share in our joy on this beautiful day.
                </p>
                <div className={styles.modalMetaInfo}>
                  <div className={styles.metaRow}>
                    <strong>Date:</strong> <span>Friday, July 3, 2026</span>
                  </div>
                  <div className={styles.metaRow}>
                    <strong>Dress Code:</strong> <span>Traditional / Indian Ethnic wear</span>
                  </div>
                </div>
                <a 
                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Jeevan+%26+Vibhaswi%27s+Shreemantam&dates=20260703T143000Z/20260703T183000Z&details=Traditional+Baby+Shower+Ceremony+%28Shreemantam%29+for+Vibhaswi+and+Jeevan.+Lunch+will+be+served.&location=6267+Stumph+Rd,+Cleveland,+OH+44130" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-gold"
                  style={{ width: '100%', marginTop: '1.25rem', gap: '8px' }}
                >
                  <CalendarPlus size={18} />
                  Add to Calendar
                </a>
              </div>
            )}

            {activeModal === 'muhurtham' && (
              <div className={styles.modalInner}>
                <div className={styles.modalHeaderIcon}>
                  <Clock size={32} />
                </div>
                <h3>Auspicious Muhurtham</h3>
                <div className={styles.modalDivider}></div>
                <p className={styles.muhurthamTime}>10:30 AM Onwards</p>
                <div className={styles.lunchDetails}>
                  <strong>Lunch Details:</strong>
                  <p>Traditional South Indian vegetarian lunch buffet will be served starting at 12:30 PM.</p>
                </div>
                <div className={styles.modalDivider}></div>
                <span className={styles.countdownTitle}>Auspicious Countdown:</span>
                <MiniCountdown />
              </div>
            )}

            {activeModal === 'location' && (
              <div className={styles.modalInner}>
                <div className={styles.modalHeaderIcon}>
                  <MapPin size={32} />
                </div>
                <h3>The Venue</h3>
                <div className={styles.modalDivider}></div>
                <h4 className={styles.venueName}>Royal Hall</h4>
                <p className={styles.venueAddress}>6267 Stumph Rd, Cleveland, OH 44130</p>
                <div className={styles.contactRow}>
                  <Phone size={14} className={styles.phoneIcon} />
                  <span>+1 (314) 755-8899</span>
                </div>
                <div className={styles.modalMapContainer}>
                  <iframe
                    src="https://maps.google.com/maps?q=6267%20Stumph%20Rd,%20Cleveland,%20OH%2044130&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="160"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="Modal Location Map"
                  ></iframe>
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=6267+Stumph+Rd,+Cleveland,+OH+44130" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-gold"
                  style={{ width: '100%', marginTop: '1.25rem', gap: '8px' }}
                >
                  <Navigation size={18} />
                  Navigate via Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
