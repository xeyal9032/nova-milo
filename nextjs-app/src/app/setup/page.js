"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { resetSupabaseClient } from '../../utils/supabaseClient';
import styles from './setup.module.css';

export default function SetupPage() {
  const router = useRouter();
  const [canSave, setCanSave] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/setup')
      .then((r) => r.json())
      .then((data) => {
        setCanSave(data.canSave);
        if (data.configured && data.canSave) {
          router.replace('/');
        }
      });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const form = new FormData(e.target);
    const payload = {
      supabaseUrl: form.get('supabaseUrl'),
      supabaseAnonKey: form.get('supabaseAnonKey'),
      geminiApiKey: form.get('geminiApiKey'),
      openaiApiKey: form.get('openaiApiKey'),
    };

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kayıt başarısız');

      resetSupabaseClient();
      setMessage('Kaydedildi! Yönlendiriliyorsunuz...');
      setTimeout(() => router.push('/'), 800);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src="/robot.png" alt="Milo" className={styles.mascot} />
        <h1>Nova Milo — İlk Kurulum</h1>
        <p className={styles.subtitle}>
          API anahtarlarınız yalnızca <strong>bu bilgisayarda</strong> saklanır; EXE içine gömülmez.
        </p>

        {!canSave ? (
          <div className={styles.devNote}>
            <p>Geliştirme modundasınız. Anahtarları <code>nextjs-app/.env.local</code> dosyasına ekleyin:</p>
            <pre>{`NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
OPENAI_API_KEY=...`}</pre>
            <button type="button" className={styles.btn} onClick={() => router.push('/')}>
              Ana sayfaya dön
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label>
              Supabase Project URL
              <input name="supabaseUrl" type="url" placeholder="https://xxxxx.supabase.co" required />
            </label>
            <label>
              Supabase Publishable / Anon Key
              <input name="supabaseAnonKey" type="password" placeholder="sb_publishable_..." required />
            </label>
            <label>
              Gemini API Key
              <input name="geminiApiKey" type="password" placeholder="AIza..." required />
            </label>
            <label>
              OpenAI API Key <span className={styles.optional}>(isteğe bağlı — Milo sesi)</span>
              <input name="openaiApiKey" type="password" placeholder="sk-proj-..." />
            </label>
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kaydet ve Başla'}
            </button>
          </form>
        )}

        {message && <p className={styles.message}>{message}</p>}

        <p className={styles.help}>
          Supabase: Dashboard → Settings → API · Gemini:{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">Google AI Studio</a>
        </p>
      </div>
    </div>
  );
}
