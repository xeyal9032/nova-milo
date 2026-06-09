"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { supabase } from '../utils/supabaseClient';
import styles from './login.module.css';

export default function Login() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [uiMessage, setUiMessage] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const showMessage = (msg) => {
    setUiMessage(msg);
    setTimeout(() => setUiMessage(''), 3000);
  };

  // Kayıt Ol Formu İşlemleri
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    if (!name || !email || !password) {
      showMessage(t('fillAllFields'));
      return;
    }

    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "...";
    submitBtn.disabled = true;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) throw error;

      if (data.session) {
        const userName = data.user?.user_metadata?.name || email.split('@')[0];
        e.target.reset();
        router.push(`/dashboard?user=${encodeURIComponent(userName)}`);
        return;
      }
      showMessage(t('registerSuccess', { name }) + ' E-posta onayı gerekiyorsa gelen kutunuzu kontrol edin.');
      e.target.reset();
      setIsRightPanelActive(false);
    } catch (error) {
      showMessage("Kayıt Hatası: " + error.message);
    } finally {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  };

  // Giriş Yap Formu İşlemleri
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      showMessage(t('fillEmailPass'));
      return;
    }

    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "...";
    submitBtn.disabled = true;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      const userName = data.user?.user_metadata?.name || email.split('@')[0];
      e.target.reset();
      router.push(`/dashboard?user=${encodeURIComponent(userName)}`);
    } catch (error) {
      const msg = error.message === 'Email not confirmed'
        ? 'E-posta henüz onaylanmamış. Gelen kutunuzu kontrol edin veya Supabase\'de e-posta onayını kapatın.'
        : error.message;
      showMessage("Giriş Hatası: " + msg);
    } finally {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const emailInput = document.querySelector(`.${styles['sign-in-container']} input[type="email"]`);
    if (emailInput && emailInput.value) {
      showMessage(t('passResetSent', { email: emailInput.value }));
    } else {
      showMessage(t('enterEmailFirst'));
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', margin: '-20px 0 50px', position: 'relative', width: '100%' }}>
      <LanguageSwitcher style={{ position: 'absolute', top: '20px', right: '30px' }} />
      
      {uiMessage && (
        <div style={{ position: 'absolute', top: '20px', background: '#3b60c4', color: 'white', padding: '10px 20px', borderRadius: '8px', zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          {uiMessage}
        </div>
      )}

      <div className={`${styles.container} ${isRightPanelActive ? styles['right-panel-active'] : ''}`} id="container">
        {/* Kayıt Ol Formu */}
        <div className={`${styles['form-container']} ${styles['sign-up-container']}`}>
          <form onSubmit={handleRegister}>
            <h1>{t('createAccount')}</h1>
            <div className={styles['social-container']}>
              <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
              <a href="#" className={styles.social}><i className="fab fa-google"></i></a>
              <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>{t('orUseEmailForRegister')}</span>
            <input type="text" name="name" placeholder={t('namePlaceholder')} />
            <input type="email" name="email" placeholder={t('emailPlaceholder')} />
            <input type="password" name="password" placeholder={t('passwordPlaceholder')} />
            <button type="submit">{t('signUp')}</button>
          </form>
        </div>

        {/* Giriş Yap Formu */}
        <div className={`${styles['form-container']} ${styles['sign-in-container']}`}>
          <form onSubmit={handleLogin}>
            <h1>{t('signInTitle')}</h1>
            <div className={styles['social-container']}>
              <a href="#" className={styles.social}><i className="fab fa-facebook-f"></i></a>
              <a href="#" className={styles.social}><i className="fab fa-google"></i></a>
              <a href="#" className={styles.social}><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>{t('orUseAccount')}</span>
            <input type="email" name="email" placeholder={t('emailPlaceholder')} />
            <input type="password" name="password" placeholder={t('passwordPlaceholder')} />
            <a href="#" className={styles['forgot-password']} onClick={handleForgotPassword}>{t('forgotPassword')}</a>
            <button type="submit" className={styles['sign-in-btn']}>{t('signIn')}</button>
          </form>
        </div>

        {/* Hareketli Panel */}
        <div className={styles['overlay-container']}>
          <div className={styles.overlay}>
            <div className={`${styles['overlay-panel']} ${styles['overlay-left']}`}>
              <h1>{t('welcomeBackTitle')}</h1>
              <p>{t('welcomeBackDesc')}</p>
              <button type="button" className={styles.ghost} onClick={() => setIsRightPanelActive(false)}>
                {t('signIn')}
              </button>
            </div>
            <div className={`${styles['overlay-panel']} ${styles['overlay-right']}`}>
              <h1>{t('helloFriendTitle')}</h1>
              <p>{t('helloFriendDesc')}</p>
              <button type="button" className={styles.ghost} onClick={() => setIsRightPanelActive(true)}>
                {t('signUp')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
