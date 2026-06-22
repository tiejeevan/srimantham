'use client';

import React from 'react';
import { MapPin, Navigation, Phone, Compass } from 'lucide-react';
import styles from './VenueMap.module.css';

export default function VenueMap() {
  const address = 'Grand Palace, Royal Hall, Palace Cross Road, Vasanth Nagar, Bengaluru, Karnataka 560052';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  
  // Embed link for Bangalore Palace area placeholder
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.484257121087!2d77.59202491534954!3d12.998428817751998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1642289cf789%3A0xc39bc6551b93fcd!2sBangalore%20Palace!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin";

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
              <p>Chowdapu Family: +91 98765 43210</p>
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
