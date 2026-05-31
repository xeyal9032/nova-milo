"use client";

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher({ style }) {
  const { lang, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'tr', label: 'TR', flag: 'https://flagcdn.com/w40/tr.png' },
    { code: 'en', label: 'EN', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'ru', label: 'RU', flag: 'https://flagcdn.com/w40/ru.png' },
    { code: 'de', label: 'DE', flag: 'https://flagcdn.com/w40/de.png' },
    { code: 'az', label: 'AZ', flag: 'https://flagcdn.com/w40/az.png' }
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  return (
    <div style={{ position: 'relative', zIndex: 1000, ...style }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#fff',
          border: '1px solid #ddd',
          padding: '8px 15px',
          borderRadius: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          fontWeight: 'bold',
          color: '#333'
        }}
      >
        <img src={currentLang.flag} alt={currentLang.label} style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px' }} />
        <span>{currentLang.label}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '110%',
          right: 0,
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minWidth: '100px'
        }}>
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => {
                changeLanguage(l.code);
                setIsOpen(false);
              }}
              style={{
                background: l.code === lang ? '#f0f2f5' : 'transparent',
                border: 'none',
                padding: '10px 15px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                fontWeight: l.code === lang ? 'bold' : 'normal',
                color: '#333'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f0f2f5'}
              onMouseLeave={(e) => {
                if(l.code !== lang) e.target.style.background = 'transparent';
              }}
            >
              <img src={l.flag} alt={l.label} style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '2px' }} />
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
