'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Utensils, 
  UtensilsCrossed, 
  UserX, 
  Search, 
  Download, 
  Lock, 
  RefreshCw,
  LogOut
} from 'lucide-react';
import styles from './page.module.css';

interface Rsvp {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  status: boolean;
  guestsCount: number;
  foodPreference: string;
  notes: string | null;
  createdAt: string;
}

interface Stats {
  totalResponses: number;
  totalAttendingGuests: number;
  vegCount: number;
  nonVegCount: number;
  declinedCount: number;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'attending' | 'veg' | 'non-veg' | 'declined'>('all');
  const [isMounted, setIsMounted] = useState(false);
  const [eventDate, setEventDate] = useState('2026-07-03T10:30:00');
  const [tempEventDate, setTempEventDate] = useState('2026-07-03T10:30:00');
  const [eventMessage, setEventMessage] = useState('A grand new adventure is about to begin! Join us as we bless the parents-to-be and shower the mother-to-be with love, bangles, and blessings for a safe delivery and a healthy baby.');
  const [tempEventMessage, setTempEventMessage] = useState('A grand new adventure is about to begin! Join us as we bless the parents-to-be and shower the mother-to-be with love, bangles, and blessings for a safe delivery and a healthy baby.');
  
  const [coupleBgSize, setCoupleBgSize] = useState('95');
  const [tempBgSize, setTempBgSize] = useState('95');
  const [coupleBgOpacity, setCoupleBgOpacity] = useState('22');
  const [tempBgOpacity, setTempBgOpacity] = useState('22');
  const [coupleBgBottom, setCoupleBgBottom] = useState('0');
  const [tempBgBottom, setTempBgBottom] = useState('0');

  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  useEffect(() => {
    setIsMounted(true);
    // Check if token exists in session storage
    const savedToken = sessionStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      fetchData(savedToken);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    fetchData(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setToken(null);
    setStats(null);
    setRsvps([]);
  };

  const fetchData = async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin?token=${encodeURIComponent(pwd)}`);
      const json = await res.json();
      
      if (res.ok && json.success) {
        setToken(pwd);
        sessionStorage.setItem('admin_token', pwd);
        setStats(json.stats);
        setRsvps(json.rsvps);
        if (json.settings) {
          if (json.settings.event_date) {
            setEventDate(json.settings.event_date);
            setTempEventDate(json.settings.event_date);
          }
          if (json.settings.event_message) {
            setEventMessage(json.settings.event_message);
            setTempEventMessage(json.settings.event_message);
          }
          if (json.settings.couple_bg_size) {
            setCoupleBgSize(json.settings.couple_bg_size);
            setTempBgSize(json.settings.couple_bg_size);
          }
          if (json.settings.couple_bg_opacity) {
            setCoupleBgOpacity(json.settings.couple_bg_opacity);
            setTempBgOpacity(json.settings.couple_bg_opacity);
          }
          if (json.settings.couple_bg_bottom) {
            setCoupleBgBottom(json.settings.couple_bg_bottom);
            setTempBgBottom(json.settings.couple_bg_bottom);
          }
        }
      } else {
        setAuthError(json.error || 'Invalid password.');
        sessionStorage.removeItem('admin_token');
      }
    } catch (err) {
      setAuthError('Connection failed. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess(false);
    setSettingsLoading(true);

    try {
      const res = await fetch(`/api/admin?token=${encodeURIComponent(token || '')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            event_date: tempEventDate,
            event_message: tempEventMessage,
            couple_bg_size: tempBgSize,
            couple_bg_opacity: tempBgOpacity,
            couple_bg_bottom: tempBgBottom,
          }
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setEventDate(tempEventDate);
        setEventMessage(tempEventMessage);
        setCoupleBgSize(tempBgSize);
        setCoupleBgOpacity(tempBgOpacity);
        setCoupleBgBottom(tempBgBottom);
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      } else {
        setSettingsError(json.error || 'Failed to save configuration.');
      }
    } catch (err) {
      setSettingsError('Failed to save configuration due to a connection error.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const exportToCsv = () => {
    if (rsvps.length === 0) return;
    
    // CSV headers
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Attending', 'Guests Count', 'Food Preference', 'Notes', 'Date Submitted'];
    
    // Map RSVPs to rows
    const rows = rsvps.map(r => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      r.email ? `"${r.email.replace(/"/g, '""')}"` : 'N/A',
      r.phone ? `"${r.phone.replace(/"/g, '""')}"` : 'N/A',
      r.status ? 'Yes' : 'No',
      r.status ? r.guestsCount : 0,
      r.status ? (r.foodPreference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian') : 'N/A',
      r.notes ? `"${r.notes.replace(/"/g, '""')}"` : 'N/A',
      new Date(r.createdAt).toLocaleString()
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `seemantham_rsvps_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRsvps = rsvps.filter((r) => {
    // Search filter
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || 
                          (r.email && r.email.toLowerCase().includes(search.toLowerCase())) ||
                          (r.phone && r.phone.includes(search)) ||
                          (r.notes && r.notes.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    // Dropdown filters
    if (filter === 'attending') return r.status === true;
    if (filter === 'veg') return r.status === true && r.foodPreference === 'veg';
    if (filter === 'non-veg') return r.status === true && r.foodPreference === 'non-veg';
    if (filter === 'declined') return r.status === false;

    return true;
  });

  if (!isMounted) return null;

  // Render Login Form if token is not verified
  if (!token) {
    return (
      <main className={`${styles.adminMain} bg-mandala`}>
        <div className={`${styles.loginCard} border-traditional`}>
          <div className={styles.lockIcon}>
            <Lock size={36} />
          </div>
          <h2>Admin Dashboard</h2>
          <p>Please enter the 6-digit access PIN.</p>
          <div className="divider-traditional"></div>
          
          <form onSubmit={handleLogin} className={styles.loginForm}>
            {authError && <div className={styles.error}>{authError}</div>}
            
            <div className="form-group">
              <label className="form-label" htmlFor="admin-pass">Access PIN</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                id="admin-pass"
                placeholder="••••••"
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,6}$/.test(val)) {
                    setPassword(val);
                  }
                }}
                className="form-input"
                required
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-maroon" 
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.dashboardContainer}>
      {/* Header bar */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h2>Seemantham Admin Portal</h2>
          <p>Real-time RSVP analytics and attendee registry.</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            onClick={() => fetchData(token)} 
            className="btn-gold" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '6px' }}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? styles.spinning : ''} />
            Refresh
          </button>
          <button 
            onClick={handleLogout} 
            className="btn-maroon" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '6px' }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Stats Cards Section */}
      {stats && (
        <section className={styles.statsSection}>
          {/* Card 1: Total Attending Guests */}
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.guests}`}>
              <Users size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Attending Guests</span>
              <h3 className={styles.statVal}>{stats.totalAttendingGuests}</h3>
            </div>
          </div>

          {/* Card 2: Vegetarian Guests */}
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.veg}`}>
              <Utensils size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Vegetarian Meals</span>
              <h3 className={styles.statVal}>{stats.vegCount}</h3>
            </div>
          </div>

          {/* Card 3: Non-Vegetarian Guests */}
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.nonVeg}`}>
              <UtensilsCrossed size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Non-Veg Meals</span>
              <h3 className={styles.statVal}>{stats.nonVegCount}</h3>
            </div>
          </div>

          {/* Card 4: Declined RSVPs */}
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.declined}`}>
              <UserX size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Declined RSVPs</span>
              <h3 className={styles.statVal}>{stats.declinedCount}</h3>
            </div>
          </div>
        </section>
      )}

      {/* Event Configuration Section */}
      <section className={styles.configSection}>
        <div className={styles.configCard}>
          <div className={styles.configHeader}>
            <h3>Ceremony Schedule Settings</h3>
            <p>
              Configure the date and time of the Seemantham ceremony. This dynamically updates the invitation details, countdown timer, and Google Calendar links throughout the entire application.
            </p>
          </div>
          <div className={styles.configGrid}>
            <form onSubmit={handleSaveSettings} className={styles.configForm}>
              {settingsError && <div className={styles.settingsError}>{settingsError}</div>}
              {settingsSuccess && <div className={styles.settingsSuccess}>Ceremony settings saved successfully!</div>}
              
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Ceremony Date & Time</label>
                <input
                  type="datetime-local"
                  value={tempEventDate}
                  onChange={(e) => setTempEventDate(e.target.value)}
                  className="form-input"
                  required
                  disabled={settingsLoading}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Invitation Verse / Inline Message</label>
                <textarea
                  value={tempEventMessage}
                  onChange={(e) => setTempEventMessage(e.target.value)}
                  className="form-textarea"
                  rows={3}
                  placeholder="Enter the custom invitation verse..."
                  required
                  disabled={settingsLoading}
                />
              </div>

              {/* Background Illustration Configuration */}
              <div style={{ margin: '1.5rem 0 1rem', borderTop: '1px dashed rgba(207, 168, 50, 0.3)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontFamily: 'var(--font-accent)', color: 'var(--color-maroon-deep)', fontSize: '1.15rem', marginBottom: '0.4rem', textAlign: 'left' }}>
                  Background Illustration Controls
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '1rem', textAlign: 'left', lineHeight: '1.4' }}>
                  Fine-tune the size, opacity, and vertical offset position of the couple blessing background image.
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>Illustration Size</span>
                  <strong>{tempBgSize}%</strong>
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={tempBgSize}
                  onChange={(e) => setTempBgSize(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--color-maroon-deep)', cursor: 'pointer' }}
                  disabled={settingsLoading}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>Illustration Opacity / Visibility</span>
                  <strong>{tempBgOpacity}%</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tempBgOpacity}
                  onChange={(e) => setTempBgOpacity(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--color-maroon-deep)', cursor: 'pointer' }}
                  disabled={settingsLoading}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>Vertical Position Offset</span>
                  <strong>{tempBgBottom}px</strong>
                </label>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  value={tempBgBottom}
                  onChange={(e) => setTempBgBottom(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--color-maroon-deep)', cursor: 'pointer' }}
                  disabled={settingsLoading}
                />
              </div>

              <button
                type="submit"
                className="btn-gold"
                style={{ padding: '0.6rem 2rem', display: 'inline-flex', alignItems: 'center', width: 'auto' }}
                disabled={settingsLoading}
              >
                {settingsLoading ? 'Saving...' : 'Save Configuration'}
              </button>
            </form>

            {/* Interactive Live Card Preview */}
            <div className={styles.miniPreviewCard}>
              <h4 className={styles.previewTitle}>Live Invitation Card Preview</h4>
              <div className={styles.miniCardFrame}>
                {/* Background image reflecting live values */}
                <div 
                  className={styles.miniCardBgCouple}
                  style={{
                    width: `${tempBgSize}%`,
                    opacity: parseFloat(tempBgOpacity) / 100,
                    bottom: `${Math.round(parseFloat(tempBgBottom) * 0.52)}px`
                  }}
                >
                  <img src="/couple_blessing_asset.png" alt="Couple" className={styles.miniCardBgCoupleImg} />
                </div>

                <div className={styles.miniCardContent}>
                  <div className={styles.miniGaneshaHeader}>
                    <img src="/baby-ganesha.png" alt="Ganesha" className={styles.miniGaneshaImg} />
                  </div>
                  <p className={styles.miniCardShloka}>|| Sri Ganeshaya Namaha ||</p>
                  <h2 className={styles.miniCardTitle}>Seemantham</h2>
                  <h3 className={styles.miniCardNames}>Jeevan & Vibhaswi</h3>
                  <p className={styles.miniCardVerse}>{tempEventMessage ? `"${tempEventMessage}"` : ''}</p>
                  <div className={styles.miniCardButton}>Join Celebration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registry Controls Box */}
      <section className={styles.registrySection}>
        <div className={styles.registryHeader}>
          <h3>RSVP Registry ({filteredRsvps.length})</h3>
          <div className={styles.registryActions}>
            <button 
              onClick={exportToCsv} 
              className="btn-gold" 
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem', gap: '8px' }}
              disabled={rsvps.length === 0}
            >
              <Download size={16} />
              Export to CSV
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Search guests, email, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.selectBox}>
            <select
              value={filter}
              onChange={(e: any) => setFilter(e.target.value)}
              className={styles.selectInput}
            >
              <option value="all">All Responses</option>
              <option value="attending">Joyfully Accepting</option>
              <option value="veg">Vegetarians</option>
              <option value="non-veg">Non-Vegetarians</option>
              <option value="declined">Regretfully Declining</option>
            </select>
          </div>
        </div>

        {/* Table representation of Guest RSVPs */}
        <div className={styles.tableWrapper}>
          {filteredRsvps.length === 0 ? (
            <div className={styles.emptyTable}>
              <p>No matching RSVPs found.</p>
            </div>
          ) : (
            <table className={styles.rsvpTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact Information</th>
                  <th>Attendance Status</th>
                  <th>Guests Count</th>
                  <th>Food Choice</th>
                  <th>Special Notes</th>
                  <th>Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.map((rsvp) => (
                  <tr key={rsvp.id} className={rsvp.status ? '' : styles.rowDeclined}>
                    <td>
                      <strong className={styles.guestName}>{rsvp.name}</strong>
                    </td>
                    <td>
                      <div className={styles.contactDetails}>
                        {rsvp.email && <span>{rsvp.email}</span>}
                        {rsvp.phone && <span>{rsvp.phone}</span>}
                        {!rsvp.email && !rsvp.phone && <span className={styles.mutedText}>—</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${rsvp.status ? styles.badgeAttending : styles.badgeDeclined}`}>
                        {rsvp.status ? 'Attending' : 'Declining'}
                      </span>
                    </td>
                    <td>{rsvp.status ? rsvp.guestsCount : 0}</td>
                    <td>
                      {rsvp.status ? (
                        <span className={`${styles.badge} ${rsvp.foodPreference === 'veg' ? styles.badgeVeg : styles.badgeNonVeg}`}>
                          {rsvp.foodPreference === 'veg' ? 'Vegetarian' : 'Non-Veg'}
                        </span>
                      ) : (
                        <span className={styles.mutedText}>—</span>
                      )}
                    </td>
                    <td className={styles.notesCell}>
                      {rsvp.notes ? <p title={rsvp.notes}>{rsvp.notes}</p> : <span className={styles.mutedText}>None</span>}
                    </td>
                    <td>
                      <span className={styles.submittedDate}>
                        {new Date(rsvp.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
