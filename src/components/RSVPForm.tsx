'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, UserCheck, Heart } from 'lucide-react';
import styles from './RSVPForm.module.css';

export default function RSVPForm({ isModal = false, onRsvpDone }: { isModal?: boolean; onRsvpDone?: (name: string) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: true, // true = Attending, false = Declined
    guestsCount: 1,
    foodPreference: 'veg', // veg, non-veg
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name.trim()) {
      setError('Please provide your name.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
      setLoading(false);

      // Persist RSVP to localStorage so the nudge won't show again
      onRsvpDone?.(formData.name.trim());

      // Trigger Confetti!
      if (formData.status) {
        triggerConfetti();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit RSVP.');
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffd700', '#c5a029', '#800020', '#ff6f00', '#f48fb1'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffd700', '#c5a029', '#800020', '#ff6f00', '#f48fb1'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  if (submitted) {
    return (
      <div className={isModal ? styles.modalSuccessCard : `${styles.successCard} border-traditional`}>
        <div className={styles.successIcon}>
          <UserCheck size={48} />
        </div>
        <h3>Thank You!</h3>
        <div className={styles.heartDecoration} style={{ marginTop: '1rem' }}>
          <Heart size={20} fill="var(--color-maroon-rich)" />
        </div>
      </div>
    );
  }

  return (
    <div className={isModal ? styles.modalFormWrapper : `${styles.formWrapper} border-traditional`}>
      <div className={styles.formIntro}>
        <h3>Will you join our celebration?</h3>
        <p>Please share your response below before June 20, 2026 to help us make the best arrangements.</p>
        <div className="divider-traditional"></div>
      </div>

      <form onSubmit={handleSubmit} className={styles.rsvpForm}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        {/* Guest Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            disabled={loading}
          />
        </div>

        {/* Contact Info (Row) */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address (Optional)</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="e.g. +91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
          </div>
        </div>

        {/* Number of guests */}
        <div className="form-group">
          <label className="form-label" htmlFor="guestsCount">Number of Guests *</label>
          <select
            id="guestsCount"
            name="guestsCount"
            value={formData.guestsCount}
            onChange={handleChange}
            className="form-select"
            disabled={loading}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        {/* Notes/Wishes */}
        <div className="form-group">
          <label className="form-label" htmlFor="notes">Special notes</label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="any special message to add"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-maroon animate-pulse-gold" 
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Send RSVP'}
          <Send size={18} style={{ marginLeft: '8px' }} />
        </button>
      </form>
    </div>
  );
}
