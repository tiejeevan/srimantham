'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, X, Navigation, Phone, CalendarPlus, ChevronDown } from 'lucide-react';
import styles from './InvitationCard.module.css';
import RSVPForm from './RSVPForm';

function useTransparentTrimmedImage(src: string, threshold: number = 245) {
  const [processedSrc, setProcessedSrc] = useState<string>('');

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      let minX = canvas.width;
      let maxX = 0;
      let minY = canvas.height;
      let maxY = 0;

      // Convert near-white pixels to transparent and find content bounding box
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          
          if (r >= threshold && g >= threshold && b >= threshold) {
            data[idx + 3] = 0; // set alpha to transparent
          } else {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      if (maxX < minX || maxY < minY) {
        setProcessedSrc(canvas.toDataURL('image/png'));
        return;
      }

      // Add padding
      minX = Math.max(0, minX - 2);
      minY = Math.max(0, minY - 2);
      maxX = Math.min(canvas.width - 1, maxX + 2);
      maxY = Math.min(canvas.height - 1, maxY + 2);

      const trimWidth = maxX - minX + 1;
      const trimHeight = maxY - minY + 1;

      const trimCanvas = document.createElement('canvas');
      trimCanvas.width = trimWidth;
      trimCanvas.height = trimHeight;
      const trimCtx = trimCanvas.getContext('2d');
      if (!trimCtx) return;

      trimCtx.drawImage(
        canvas,
        minX, minY, trimWidth, trimHeight,
        0, 0, trimWidth, trimHeight
      );

      setProcessedSrc(trimCanvas.toDataURL('image/png'));
    };
  }, [src, threshold]);

  return processedSrc;
}

const MiniCountdown = ({ targetDate }: { targetDate: string }) => {
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
  }, [targetDate]);

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
  const [activeModal, setActiveModal] = useState<'day' | 'muhurtham' | 'location' | 'rsvp' | null>(null);
  const [eventDateStr, setEventDateStr] = useState('2026-07-03T10:30:00');
  const [eventMessage, setEventMessage] = useState('A grand new adventure is about to begin! Join us as we bless the parents-to-be and shower the mother-to-be with love, bangles, and blessings for a safe delivery and a healthy baby.');
  const [ganeshaStage, setGaneshaStage] = useState(0); // 0 = original, 1 = enlarged, 2 = hidden verse

  const [coupleBgSize, setCoupleBgSize] = useState('95');
  const [coupleBgOpacity, setCoupleBgOpacity] = useState('22');
  const [coupleBgBottom, setCoupleBgBottom] = useState('0');

  const coupleSrc = useTransparentTrimmedImage('/couple_blessing_asset.png') || '/couple_blessing_asset.png';

  const handleGaneshaDoubleClick = () => {
    setGaneshaStage((prev) => (prev + 1) % 3);
  };

  useEffect(() => {
    fetch('/api/settings?t=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.settings?.event_date) {
            setEventDateStr(data.settings.event_date);
          }
          if (data.settings?.event_message) {
            setEventMessage(data.settings.event_message);
          }
          if (data.settings?.couple_bg_size) {
            setCoupleBgSize(data.settings.couple_bg_size);
          }
          if (data.settings?.couple_bg_opacity) {
            setCoupleBgOpacity(data.settings.couple_bg_opacity);
          }
          if (data.settings?.couple_bg_bottom) {
            setCoupleBgBottom(data.settings.couple_bg_bottom);
          }
        }
      })
      .catch((err) => console.error('Error fetching event settings:', err));
  }, []);

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

  // Date Parsing & Formatting Helpers
  const parseEventDate = (dateStr: string) => {
    const formatted = dateStr.replace(/-/g, '/').replace('T', ' ');
    return new Date(formatted);
  };

  const dateObj = parseEventDate(eventDateStr);
  
  const formattedDay = isNaN(dateObj.getTime())
    ? 'Friday, July 3'
    : dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const formattedFullDate = isNaN(dateObj.getTime())
    ? 'Friday, July 3, 2026'
    : dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const formattedTime = isNaN(dateObj.getTime())
    ? '10:30 AM Onwards'
    : dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) + ' Onwards';

  const getCalendarDates = (dateStr: string) => {
    const dateObj = parseEventDate(dateStr);
    if (isNaN(dateObj.getTime())) {
      return '20260703T143000Z/20260703T183000Z';
    }
    const startDate = new Date(dateObj);
    const endDate = new Date(dateObj.getTime() + 4 * 60 * 60 * 1000); // 4 hours duration
    const toUTCString = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return `${toUTCString(startDate)}/${toUTCString(endDate)}`;
  };

  const calendarDates = getCalendarDates(eventDateStr);

  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.invitationCard} border-traditional`}>

        {/* Background Couple Illustration */}
        <div 
          className={styles.bgCoupleIllustration}
          style={{
            width: `${coupleBgSize}%`,
            opacity: parseFloat(coupleBgOpacity) / 100,
            bottom: `${coupleBgBottom}px`
          }}
        >
          <img src={coupleSrc} alt="Couple Blessing" className={styles.bgCoupleImg} />
        </div>

        {/* Cute Baby Ganesha Image */}
        <div className={`${styles.ganeshaHeader} ${(ganeshaStage === 1 || ganeshaStage === 2) ? styles.ganeshaEnlarged : ''}`}>
          <img 
            src="/baby-ganesha.png" 
            alt="Lord Ganesha" 
            className={styles.ganeshaImg}
            onDoubleClick={handleGaneshaDoubleClick}
            title="Double click me! ❈"
            style={{ cursor: 'pointer' }}
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

          {ganeshaStage !== 2 && (
            <p className={styles.invitationVerse}>
              "{eventMessage}"
            </p>
          )}

          <div className={styles.rsvpTriggerContainer}>
            <button 
              onClick={() => setActiveModal('rsvp')} 
              className={styles.rsvpTriggerBtn}
            >
              Join Celebration
            </button>
          </div>

          {/* Interactive Info Bar (Pill Buttons) */}
          <div className={styles.infoBar}>
            <button 
              onClick={() => setActiveModal('day')} 
              className={styles.infoBtn}
              title="Click for day details"
            >
              <Calendar className={styles.infoIcon} size={16} />
              <span className={styles.infoText}>{formattedDay}</span>
              <ChevronDown className={styles.chevronIcon} size={14} />
            </button>
            <button 
              onClick={() => setActiveModal('muhurtham')} 
              className={styles.infoBtn}
              title="Click for muhurtham & countdown"
            >
              <Clock className={styles.infoIcon} size={16} />
              <span className={styles.infoText}>{formattedTime}</span>
              <ChevronDown className={styles.chevronIcon} size={14} />
            </button>
            <button 
              onClick={() => setActiveModal('location')} 
              className={styles.infoBtn}
              title="Click to view venue on map"
            >
              <MapPin className={styles.infoIcon} size={16} />
              <span className={styles.infoText}>Cleveland, OH Venue</span>
              <ChevronDown className={styles.chevronIcon} size={14} />
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
          <div className={`${styles.modalContent} ${activeModal === 'rsvp' ? styles.rsvpModalContent : ''}`} onClick={(e) => e.stopPropagation()}>
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
                <h3>{formattedFullDate}</h3>
                <div className={styles.modalDivider}></div>
                <p className={styles.modalDesc}>
                  We are delighted to invite you to share in our joy on this beautiful day.
                </p>
                <div className={styles.modalMetaInfo}>
                  <div className={styles.metaRow}>
                    <strong>Date:</strong> <span>{formattedFullDate}</span>
                  </div>
                </div>
                <a 
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Jeevan+%26+Vibhaswi%27s+Shreemantam&dates=${calendarDates}&details=Traditional+Baby+Shower+Ceremony+%28Shreemantam%29+for+Vibhaswi+and+Jeevan.+Lunch+will+be+served.&location=6267+Stumph+Rd,+Cleveland,+OH+44130`}
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
                <p className={styles.muhurthamTime}>{formattedTime}</p>
                <div className={styles.lunchDetails}>
                  <strong>Lunch Details:</strong>
                  <p>Traditional South Indian vegetarian lunch buffet will be served starting at 12:30 PM.</p>
                </div>
                <div className={styles.modalDivider}></div>
                <span className={styles.countdownTitle}>Auspicious Countdown:</span>
                <MiniCountdown targetDate={eventDateStr} />
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
                  <span>Jeevan & Vibhaswi: +1 (314) 755-8899</span>
                </div>
                <div className={styles.modalMapContainer}>
                  <iframe
                    src="https://maps.google.com/maps?q=6267%20Stumph%20Rd,%20Cleveland,%20OH%2044130&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="200"
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

            {activeModal === 'rsvp' && (
              <div className={styles.modalInner} style={{ textAlign: 'left', width: '100%' }}>
                <RSVPForm isModal={true} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
