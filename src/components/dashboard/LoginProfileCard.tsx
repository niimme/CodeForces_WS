'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserProgress } from '../../types';
import {
  INITIAL_BADGES,
  loginUser,
  logoutUser,
  loginWithCredentials,
  registerAccount,
} from '../../lib/userProgress';
import { UserSettingsModal } from '../settings/UserSettingsModal';

interface LoginProfileCardProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  forceOpenModal?: boolean;
  onModalClose?: () => void;
}

export const LoginProfileCard: React.FC<LoginProfileCardProps> = ({
  progress,
  onUpdateProgress,
  forceOpenModal,
  onModalClose,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (forceOpenModal) {
      setShowLoginModal(true);
    }
  }, [forceOpenModal]);

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setLoginError(null);
    setAccountNotFound(false);
    onModalClose?.();
  };

  // Modal active tab: 'signin' | 'register'
  const [modalTab, setModalTab] = useState<'signin' | 'register'>('signin');

  // Sign In form state
  const [handleInput, setHandleInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountNotFound, setAccountNotFound] = useState(false);

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = !!progress.isLoggedIn;

  const getRankColor = (rank?: string) => {
    const r = (rank || '').toLowerCase();
    if (r.includes('legendary') || r.includes('grandmaster')) return { color: '#ef4444', label: 'Grandmaster' };
    if (r.includes('master')) return { color: '#f97316', label: 'Master' };
    if (r.includes('candidate')) return { color: '#a855f7', label: 'Candidate Master' };
    if (r.includes('expert')) return { color: '#3b82f6', label: 'Expert' };
    if (r.includes('specialist')) return { color: '#06b6d4', label: 'Specialist' };
    if (r.includes('pupil')) return { color: '#10b981', label: 'Pupil' };
    return { color: '#64748b', label: 'Newbie' };
  };

  const handleSignOut = () => {
    const guest = logoutUser();
    onUpdateProgress(guest);
  };

  const handleModalSignIn = () => {
    const targetHandle = handleInput.trim();
    if (!targetHandle) {
      setLoginError('Please enter your username or email.');
      return;
    }
    if (!passwordInput) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setLoginError(null);
    setAccountNotFound(false);

    try {
      const res = loginWithCredentials(targetHandle, passwordInput);
      if (res.success && res.user) {
        onUpdateProgress(res.user);
        handleCloseModal();
        setHandleInput('');
        setPasswordInput('');
      } else {
        setLoginError(res.error || 'Login failed. Please verify credentials.');
        if (res.notFound) {
          setAccountNotFound(true);
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalRegister = () => {
    const cleanUser = regUsername.trim().replace(/^@/, '');
    const cleanEmail = regEmail.trim();

    if (!cleanUser || cleanUser.length < 2) {
      setLoginError('Username must be at least 2 characters.');
      return;
    }
    if (cleanEmail && !cleanEmail.includes('@')) {
      setLoginError('Please enter a valid email address or leave it blank.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setLoginError('Password must be at least 4 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setLoginError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      const res = registerAccount(cleanEmail || cleanUser, regPassword, cleanUser);
      if (res.success && res.user) {
        onUpdateProgress(res.user);
        handleCloseModal();
        setRegUsername('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
      } else {
        setLoginError(res.error || 'Registration failed.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCreateFromSignIn = () => {
    const cleanUser = handleInput.trim().replace(/^@/, '');
    if (!cleanUser || !passwordInput) return;
    setIsLoading(true);
    setLoginError(null);
    try {
      const res = registerAccount(cleanUser, passwordInput, cleanUser);
      if (res.success && res.user) {
        onUpdateProgress(res.user);
        handleCloseModal();
        setHandleInput('');
        setPasswordInput('');
      } else {
        setLoginError(res.error || 'Could not create account.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const rankInfo = getRankColor(progress.rank);

  return (
    <>
      <div
        className="profile-card"
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
          padding: '20px',
        }}
      >
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: isLoggedIn
                  ? 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)'
                  : '#e2e8f0',
                color: isLoggedIn ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '18px',
                boxShadow: isLoggedIn ? '0 3px 10px rgba(37, 99, 235, 0.25)' : 'none',
                overflow: 'hidden',
              }}
            >
              {isLoggedIn && progress.avatarUrl ? (
                <img src={progress.avatarUrl} alt={progress.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : isLoggedIn ? (
                (progress.name || progress.handle || 'U').charAt(0).toUpperCase()
              ) : (
                '👤'
              )}
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a', lineHeight: 1.2 }}>
                {isLoggedIn ? progress.name : 'Guest User'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: isLoggedIn ? rankInfo.color : '#94a3b8' }}>
                  @{isLoggedIn ? progress.handle : 'guest'}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    background: isLoggedIn ? '#f1f5f9' : '#fef2f2',
                    color: isLoggedIn ? '#64748b' : '#dc2626',
                    padding: '1px 6px',
                    borderRadius: '8px',
                    fontWeight: 700,
                  }}
                >
                  {isLoggedIn ? progress.rank || 'Specialist' : 'Signed Out'}
                </span>
              </div>
            </div>
          </div>

          {isLoggedIn && (
            <div
              className="streak-pill"
              title={`${progress.streakDays} days problem-solving streak!`}
              style={{
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                color: '#ea580c',
                padding: '4px 10px',
                borderRadius: '14px',
                fontSize: '12.5px',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>🔥</span>
              <span>{progress.streakDays}</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        {isLoggedIn ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Rating</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: rankInfo.color, marginTop: '2px' }}>
                {progress.rating || 1200}
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Solved</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                {progress.completedProblemIds.length} / 20
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.45, margin: 0 }}>
              Sign in to track your Codeforces rating and save your practice progress.
            </p>
          </div>
        )}



        {/* Auth Action Buttons */}
        {isLoggedIn ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowSettingsModal(true)}
              style={{
                flex: 1,
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: '12px',
                fontWeight: 700,
                padding: '8px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
              id="btn-profile-card-settings"
              title="Language, Ligatures & User Settings"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </button>

            <button
              onClick={handleSignOut}
              style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontSize: '12px',
                fontWeight: 700,
                padding: '8px 10px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.15s ease',
              }}
              id="btn-sign-out"
              title="Sign Out"
            >
              <span>🚪</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setShowSettingsModal(true)}
              style={{
                width: '100%',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: '12.5px',
                fontWeight: 700,
                padding: '9px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              id="btn-guest-settings"
            >
              <span>⚙️</span>
              <span>Language & Editor Settings</span>
            </button>

            <button
              onClick={() => setShowLoginModal(true)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                padding: '10px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)',
              }}
              id="btn-primary-sign-in"
            >
              <span>🔑</span>
              <span>Sign In / Register</span>
            </button>
          </div>
        )}
      </div>

      {/* Login Portal (Rendered on document.body with max z-index to NEVER clip under cards) */}
      {mounted &&
        showLoginModal &&
        createPortal(
          <div
            className="login-modal-overlay"
            onClick={handleCloseModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 9999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              className="login-modal-card"
              onClick={e => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                maxWidth: '460px',
                width: '100%',
                padding: '28px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
                color: '#0f172a',
                position: 'relative',
                animation: 'modalSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '20px',
                    }}
                  >
                    🔑
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {modalTab === 'signin' ? 'Account Sign In' : 'Create Real Account'}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                      {modalTab === 'signin'
                        ? 'Sign in to save solutions, streaks & achievements'
                        : 'Create your account to persist ratings, solutions & code'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    fontSize: '16px',
                    color: '#64748b',
                    cursor: 'pointer',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  id="btn-close-login-modal"
                >
                  ✕
                </button>
              </div>

              {/* Segmented Tab Switcher */}
              <div
                style={{
                  display: 'flex',
                  background: '#f1f5f9',
                  padding: '4px',
                  borderRadius: '12px',
                  marginBottom: '18px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setModalTab('signin');
                    setLoginError(null);
                    setAccountNotFound(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '9px',
                    border: 'none',
                    background: modalTab === 'signin' ? '#ffffff' : 'transparent',
                    color: modalTab === 'signin' ? '#0f172a' : '#64748b',
                    fontWeight: modalTab === 'signin' ? 700 : 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: modalTab === 'signin' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                  id="tab-btn-modal-signin"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalTab('register');
                    setLoginError(null);
                    setAccountNotFound(false);
                    if (handleInput.trim() && !regUsername) {
                      setRegUsername(handleInput.trim());
                    }
                    if (passwordInput && !regPassword) {
                      setRegPassword(passwordInput);
                      setRegConfirmPassword(passwordInput);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '9px',
                    border: 'none',
                    background: modalTab === 'register' ? '#ffffff' : 'transparent',
                    color: modalTab === 'register' ? '#0f172a' : '#64748b',
                    fontWeight: modalTab === 'register' ? 700 : 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: modalTab === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                  id="tab-btn-modal-register"
                >
                  Create Account
                </button>
              </div>

              {loginError && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#dc2626',
                    fontSize: '12.5px',
                    marginBottom: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚠️</span>
                    <span>{loginError}</span>
                  </div>
                  {accountNotFound && modalTab === 'signin' && (
                    <button
                      type="button"
                      onClick={handleQuickCreateFromSignIn}
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: '4px',
                        background: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                      id="btn-quick-create-account"
                    >
                      Create account as &quot;{handleInput.trim()}&quot; with this password &rarr;
                    </button>
                  )}
                </div>
              )}

              {/* TAB 1: Sign In Form */}
              {modalTab === 'signin' && (
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Username or Email
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your username or email"
                      value={handleInput}
                      onChange={e => {
                        setHandleInput(e.target.value);
                        setAccountNotFound(false);
                      }}
                      onKeyDown={e => e.key === 'Enter' && handleModalSignIn()}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      id="input-login-username-modal"
                      autoFocus
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '11.5px',
                          color: '#2563eb',
                          cursor: 'pointer',
                          padding: 0,
                          fontWeight: 600,
                        }}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={passwordInput}
                      onChange={e => {
                        setPasswordInput(e.target.value);
                        setAccountNotFound(false);
                      }}
                      onKeyDown={e => e.key === 'Enter' && handleModalSignIn()}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      id="input-login-password-modal"
                    />
                  </div>

                  <button
                    onClick={() => handleModalSignIn()}
                    disabled={isLoading || !handleInput.trim() || !passwordInput}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: isLoading || !handleInput.trim() || !passwordInput ? 'not-allowed' : 'pointer',
                      opacity: isLoading || !handleInput.trim() || !passwordInput ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)',
                    }}
                    id="btn-confirm-cf-handle"
                  >
                    {isLoading ? <span>Signing In...</span> : <span>Sign In &rarr;</span>}
                  </button>
                </div>
              )}

              {/* TAB 2: Create Real Account Form */}
              {modalTab === 'register' && (
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Choose a username"
                      value={regUsername}
                      onChange={e => setRegUsername(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleModalRegister()}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      id="input-modal-reg-username"
                      autoFocus
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com (optional)"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleModalRegister()}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      id="input-modal-reg-email"
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                        Password (min. 4 characters)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '11.5px',
                          color: '#2563eb',
                          cursor: 'pointer',
                          padding: 0,
                          fontWeight: 600,
                        }}
                      >
                        {showRegPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Create your password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleModalRegister()}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      id="input-modal-reg-password"
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Confirm Password
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleModalRegister()}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      id="input-modal-reg-confirm"
                    />
                  </div>

                  <button
                    onClick={() => handleModalRegister()}
                    disabled={isLoading || !regUsername.trim() || !regPassword || !regConfirmPassword}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: isLoading || !regUsername.trim() || !regPassword || !regConfirmPassword ? 'not-allowed' : 'pointer',
                      opacity: isLoading || !regUsername.trim() || !regPassword || !regConfirmPassword ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.28)',
                    }}
                    id="btn-modal-reg-submit"
                  >
                    {isLoading ? <span>Creating Account...</span> : <span>Create Account & Sign In &rarr;</span>}
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      <UserSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        currentUser={progress}
        onUserUpdate={onUpdateProgress}
      />
    </>
  );
};
