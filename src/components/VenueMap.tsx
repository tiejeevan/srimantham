'use client';

import React from 'react';
import { MapPin, Navigation, Phone, Compass } from 'lucide-react';
import styles from './VenueMap.module.css';

export default function VenueMap() {
  const address = '6267 Stumph Rd, Cleveland, OH 44130';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  
  // Embed link for 6267 Stumph Rd, Cleveland, OH 44130
  const mapEmbedUrl = "https://maps.google.com/maps?q=6267%20Stumph%20Rd,%20Cleveland,%20OH%2044130&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <div className={`${styles.card} border-traditional`}>
      <div className={styles.header}>
        <Compass className={styles.compassIcon} size={28} />
        <h4>Ceremony Venue</h4>
        <p>Join us at the elegant Royal Hall to share our joy.</p>
        <div className="divider-traditional"></div>
      </div>

      <div className={styles.grid}>
        {/* Contact/Details Column */}
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <MapPin className={styles.icon} size={22} />
            <div>
              <h5>Address</h5>
              <p>{address}</p>
            </div>
          </div>

          <div className={styles.detailItem}>
            <Phone className={styles.icon} size={22} />
            <div>
              <h5>Contact Person</h5>
              <p>Jeevan & Vibhaswi: +1 (314) 755-8899</p>
            </div>
          </div>

          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-gold"
            style={{ width: '100%', marginTop: '1rem', gap: '8px' }}
          >
            <Navigation size={18} />
            Navigate via Google Maps
          </a>
        </div>

        {/* Map Embed Column */}
        <div className={styles.mapContainer}>
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            title="Venue Location Map"
            referrerPolicy="no-referrer-when-downgrade"
            className={styles.iframe}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
