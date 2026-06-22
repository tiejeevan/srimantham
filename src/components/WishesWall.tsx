'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquareHeart, Send } from 'lucide-react';
import styles from './WishesWall.module.css';

interface Blessing {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

export default function WishesWall() {
  const [wishes, setWishes] = useState<Blessing[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes');
      const json = await res.json();
      if (json.success) {
        setWishes(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch wishes:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim() || !message.trim()) {
      setError('Please provide both your name and a blessing message.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit. Please try again.');
      }

      setSubmitSuccess(true);
      setName('');
      setMessage('');
      
      // Prepend to current list for instant feedback
      setWishes((prev) => [result.data, ...prev]);
      
      // Reset success banner after 4 seconds
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit blessing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Submit Form Card */}
        <div className={`${styles.formCard} border-traditional`}>
          <div className={styles.cardHeader}>
            <MessageSquareHeart className={styles.headerIcon} size={28} />
            <h4>Leave a Blessing</h4>
            <p>Write your prayers & wishes for the parents-to-be and the little one.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            {submitSuccess && (
              <div className={styles.success}>
                <Sparkles size={16} style={{ marginRight: 6 }} />
                Your blessing has been posted on the wall!
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="wish-name">Your Name</label>
              <input
                type="text"
                id="wish-name"
                placeholder="e.g. Aunt Rekha or Sharma Family"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="wish-message">Blessing / Message</label>
              <textarea
                id="wish-message"
                rows={4}
                placeholder="May the mother and the baby be blessed with good health, joy, and prosperity..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-textarea"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-gold"
              style={{ width: '100%', gap: '8px' }}
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Blessing'}
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Wishes Display Board */}
        <div className={styles.boardCard}>
          <h4 className={styles.boardTitle}>Blessings Board</h4>
          
          {fetching ? (
            <div className={styles.loader}>
              <span className="animate-spin-slow">❈</span> Loading blessings...
            </div>
          ) : wishes.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No blessings posted yet. Be the first to leave a message!</p>
            </div>
          ) : (
            <div className={styles.wishesList}>
              {wishes.map((w) => (
                <div key={w.id} className={styles.wishItem}>
                  <div className={styles.wishCorner}></div>
                  <p className={styles.wishMessage}>"{w.message}"</p>
                  <div className={styles.wishMeta}>
                    <span className={styles.wishAuthor}>— {w.name}</span>
                    <span className={styles.wishDate}>
                      {new Date(w.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
