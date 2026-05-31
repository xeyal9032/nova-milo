"use client";

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import AnimatedRobot from '../../components/AnimatedRobot';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../utils/supabaseClient';
import { CloudSun, Crosshair, Battery, Wifi, Clock, Activity } from 'lucide-react';
import styles from './dashboard.module.css';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();
  const userName = searchParams.get('user') || 'Kullanıcı';

  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [weatherData, setWeatherData] = useState({ temp: '--', city: lang === 'en' ? 'Loading...' : 'Bekleniyor...' });
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [networkType, setNetworkType] = useState('WiFi');
  const [isOnline, setIsOnline] = useState(true);
  const [activeSeconds, setActiveSeconds] = useState(0);
  
  // Nova Extended Systems
  const [hardwareInfo, setHardwareInfo] = useState({ cores: '?', ram: '?' });
  const [isFocused, setIsFocused] = useState(true);
  const [audioData, setAudioData] = useState(new Array(10).fill(0));
  const [coords, setCoords] = useState({ lat: '--', lon: '--' });
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState({
    BTC: { price: '...', trend: 'neutral' },
    ETH: { price: '...', trend: 'neutral' },
    SOL: { price: '...', trend: 'neutral' }
  });
  const [nasaData, setNasaData] = useState(null);
  const chatMessagesRef = useRef(null);

  // NOVA v2.0 States
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');
  const [systemLogs, setSystemLogs] = useState([]);
  const [hudAlerts, setHudAlerts] = useState([]);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const weatherJson = await weatherRes.json();
            const temp = Math.round(weatherJson.current_weather.temperature);
            
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=${lang}`);
            const geoJson = await geoRes.json();
            const city = geoJson.address?.city || geoJson.address?.town || geoJson.address?.state || 'Konum';

            setWeatherData({ temp, city });
            setCoords({ lat: lat.toFixed(2), lon: lon.toFixed(2) });
          } catch (error) {
            console.error("Hava durumu çekilemedi", error);
            setWeatherData({ temp: '?', city: 'Hata' });
          }
        },
        (error) => {
          console.error("Konum izni alınamadı", error);
          setWeatherData({ temp: '--', city: 'Konum Yok' });
        }
      );
    }
  }, [lang]);

  useEffect(() => {
    // Session Timer
    const timer = setInterval(() => {
      if (!document.hidden) {
        setActiveSeconds(prev => prev + 1);
      }
    }, 1000);

    // Battery
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => setBatteryLevel(Math.round(battery.level * 100)));
        battery.addEventListener('chargingchange', () => setIsCharging(battery.charging));
      });
    }

    // Network
    const updateNetwork = () => {
      setIsOnline(navigator.onLine);
      if (navigator.connection) {
        setNetworkType(navigator.connection.effectiveType || 'WiFi');
      }
    };
    
    updateNetwork();
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
    if (navigator.connection) {
      navigator.connection.addEventListener('change', updateNetwork);
    }

    // Hardware Info
    setHardwareInfo({
      cores: navigator.hardwareConcurrency || '?',
      ram: navigator.deviceMemory || '?'
    });

    // Focus Tracking
    const handleVisibilityChange = () => {
      setIsFocused(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Crypto Ticker (Binance WebSocket)
  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@miniTicker/ethusdt@miniTicker/solusdt@miniTicker');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.s && data.c) {
        const symbol = data.s.replace('USDT', '');
        const currentPrice = parseFloat(data.c);
        
        setCryptoPrices(prev => {
          const oldPrice = parseFloat(prev[symbol]?.price || 0);
          let trend = prev[symbol]?.trend || 'neutral';
          
          if (currentPrice > oldPrice && oldPrice > 0) trend = 'up';
          else if (currentPrice < oldPrice && oldPrice > 0) trend = 'down';
          
          if (oldPrice !== currentPrice) {
            return {
              ...prev,
              [symbol]: {
                price: currentPrice >= 1000 ? currentPrice.toFixed(2) : currentPrice.toFixed(3),
                trend
              }
            };
          }
          return prev;
        });
      }
    };

    return () => ws.close();
  }, []);

  // NASA APOD Fetch
  useEffect(() => {
    const fetchNasa = async () => {
      try {
        const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        const data = await res.json();
        if (data && data.url) {
          setNasaData(data);
        }
      } catch (err) {
        console.error("NASA API Error:", err);
      }
    };
    fetchNasa();
  }, []);

  // NOVA v2.0 - Load User Prefs and Start Matrix Flow
  useEffect(() => {
    const savedHistory = localStorage.getItem('nova_terminal_history');
    if (savedHistory) {
       try { setTerminalHistory(JSON.parse(savedHistory)); } catch(e){}
    }
    
    // Matrix Flow
    const interval = setInterval(() => {
      const logs = [
        "SYSTEM_SCAN_COMPLETED_[" + Math.floor(Math.random()*100) + "%]",
        "NETWORK_PACKET_RECEIVED",
        "DECRYPTING_DATA_STREAM...",
        "ENCRYPTION_KEY_VALIDATED",
        "SYNCING_WITH_ORBITAL_SATELLITE",
        "MEM_USAGE_" + (40 + Math.floor(Math.random()*20)) + "%"
      ];
      setSystemLogs(prev => {
        const newLogs = [...prev, logs[Math.floor(Math.random() * logs.length)]];
        if(newLogs.length > 5) newLogs.shift();
        return newLogs;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // HUD Alert Helper
  const addAlert = (message, type='info') => {
    const id = Date.now();
    setHudAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setHudAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 4000);
  };

  // Terminal Handler
  const handleTerminalSubmit = (e) => {
    if(e.key === 'Enter' && terminalInput.trim() !== '') {
      const cmd = terminalInput.trim().toLowerCase();
      let response = '';
      
      if(cmd === '/clear') {
         setTerminalHistory([]);
         setTerminalInput('');
         localStorage.removeItem('nova_terminal_history');
         return;
      } else if (cmd.startsWith('/weather')) {
         const cityParts = cmd.replace('/weather', '').trim();
         const city = cityParts || weatherData.city;
         response = `Fetching weather data for ${city.toUpperCase()}... Temp: ${weatherData.temp}°C`;
         addAlert(`Weather requested for ${city.toUpperCase()}`, 'success');
      } else if (cmd.startsWith('/crypto')) {
         response = `BTC: $${cryptoPrices.BTC?.price} | ETH: $${cryptoPrices.ETH?.price} | SOL: $${cryptoPrices.SOL?.price}`;
         addAlert("Crypto radar updated", 'success');
      } else if (cmd === '/help') {
         response = "AVAILABLE COMMANDS: /weather [city], /crypto, /clear, /help";
         addAlert("Help menu opened", 'info');
      } else {
         response = `Command not recognized: ${cmd}`;
         addAlert("Invalid command", 'error');
      }
      
      const newHistory = [...terminalHistory, { type: 'cmd', text: `NOVA>_ ${terminalInput}` }, { type: 'res', text: response }];
      setTerminalHistory(newHistory);
      localStorage.setItem('nova_terminal_history', JSON.stringify(newHistory));
      setTerminalInput('');
      
      setTimeout(() => {
         if(terminalEndRef.current) terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleAudioRadar = async () => {
    if (isAudioActive) {
      setIsAudioActive(false);
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      microphone.connect(analyser);
      analyser.fftSize = 32;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsAudioActive(true);

      const updateAudio = () => {
        if (!isAudioActive && document.getElementById('chatWidget')) {
          // If deactivated, we could stop tracking, but for simplicity let it run while active
        }
        analyser.getByteFrequencyData(dataArray);
        // Take first 10 bins for visualizer
        setAudioData(Array.from(dataArray).slice(0, 10));
        requestAnimationFrame(updateAudio);
      };
      
      updateAudio();
    } catch (err) {
      console.error("Mikrofon izni reddedildi:", err);
      alert("Ses radarı için mikrofon izni gerekiyor.");
    }
  };

  const speakText = async (text, forcePlay = false) => {
    if (!isVoiceEnabled && !forcePlay) return;
    
    const cleanText = text.replace(/[*#_`~>]/g, '').trim();
    if (!cleanText) return;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ses dosyası alınamadı");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      if (window.currentMiloAudio) {
        window.currentMiloAudio.pause();
      }
      window.currentMiloAudio = audio;
      
      audio.play();
    } catch (error) {
      console.error("OpenAI TTS Oynatma Hatası:", error);
    }
  };


  const handleMicrophoneClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Tarayıcınız ses tanımayı desteklemiyor. Lütfen Chrome kullanın.");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    switch(lang) {
      case 'en': recognition.lang = 'en-US'; break;
      case 'ru': recognition.lang = 'ru-RU'; break;
      case 'de': recognition.lang = 'de-DE'; break;
      case 'az': recognition.lang = 'az-AZ'; break; 
      default: recognition.lang = 'tr-TR'; break;
    }
    
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsRecording(true);
    
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setInputValue(speechResult);
      // Mikrofon ile söylenenleri otomatik gönder (Telefon görüşmesi gibi)
      setTimeout(() => {
        handleSendMessage(speechResult);
      }, 300);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);
    
    recognition.start();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{
        id: Date.now(),
        text: t('botGreeting', { name: userName }),
        sender: 'bot'
      }]);
    }, 800);

    return () => clearTimeout(timer);
  }, [userName, t]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLogout = () => {
    router.push('/');
  };

  const handleSendMessage = async (autoText = null) => {
    const messageContent = typeof autoText === 'string' ? autoText : inputValue;
    if (!messageContent.trim() || isLoading) return;

    const userMessage = messageContent;
    const newMessages = [...messages, { id: Date.now(), text: userMessage, sender: 'user' }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage, lang }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages(prev => [...prev, { id: Date.now(), text: `Hata: ${data.error}`, sender: 'bot' }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now(), text: data.reply, sender: 'bot' }]);
        speakText(data.reply);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now(), text: t('errorConn'), sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles['dashboard-container']} ${isEmergencyMode ? styles['emergency-mode'] : ''} ${!isFocused ? styles['unfocused-mode'] : ''}`}>
      <header className={styles.header}>
        <h1 id="welcomeMessage" className={styles['header-h1']}>{t('welcomeDashboard')}, {userName}!</h1>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <LanguageSwitcher />
          <button 
            className={styles.emergencyBtn} 
            onClick={() => setIsEmergencyMode(!isEmergencyMode)}
          >
            {isEmergencyMode ? t('restoreSystem') : t('emergency')}
          </button>
          <button id="logoutBtn" className={styles.logoutBtn} onClick={handleLogout}>{t('logout')}</button>
        </div>
      </header>

      <main className={styles['dashboard-main']}>
      
        {/* NOVA v2.0 - HUD Alerts */}
        <div className={styles['hud-alerts-container']}>
          {hudAlerts.map(alert => (
             <div key={alert.id} className={`${styles['hud-alert']} ${styles[alert.type]}`}>
               {alert.type === 'success' ? '✓ ' : alert.type === 'error' ? '⚠ ' : 'ℹ '}
               {alert.message}
             </div>
          ))}
        </div>
        
        {/* Sci-Fi Merkez Üssü */}
        <div className={styles['scifi-center']}>
          
          {/* Sol Panel: Nova Sistemleri */}
          <div className={styles['scifi-left-panel']}>
            <div className={styles['hud-widget']}>
            <div className={styles['hud-header']}>
              <Crosshair size={16} className={styles['hud-icon']} /> 
              <span>NOVA.SYSTEM</span>
            </div>
            <div className={styles['hud-content']} style={{ flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <img src="/nova.png" alt="Nova Robot" className={styles['nova-icon']} />
              <div className={styles['hud-data']} style={{ textAlign: 'center', marginTop: '10px' }}>
                <h3 className={styles['hud-city']}>{weatherData.city.toUpperCase()}</h3>
                <p className={styles['hud-temp']} style={{ fontSize: '28px', color: '#00ff9d', textShadow: '0 0 10px rgba(0,255,157,0.5)' }}>{weatherData.temp}°C</p>
                <span className={styles['hud-status']} style={{ color: '#00ff9d', border: '1px solid #00ff9d', marginBottom: '15px' }}>NOVA ONLINE</span>
                
                <div className={styles['nova-stats']}>
                  <div className={styles['nova-stat-row']}>
                    <Battery size={14} color={isCharging ? '#00ff9d' : '#00ffff'} />
                    <span>{batteryLevel !== null ? `%${batteryLevel} ${isCharging ? t('charging') : ''}` : t('calculating')}</span>
                  </div>
                  <div className={styles['nova-stat-row']}>
                    <Wifi size={14} color={isOnline ? '#00ff9d' : 'red'} />
                    <span>{isOnline ? networkType.toUpperCase() : 'OFFLINE'}</span>
                  </div>
                  <div className={styles['nova-stat-row']}>
                    <Clock size={14} color="#00ffff" />
                    <span>{formatTime(activeSeconds)}</span>
                  </div>
                  <div className={styles['nova-stat-row']}>
                    <Activity size={14} color="#00ffff" />
                    <span>CPU: {hardwareInfo.cores} | RAM: {hardwareInfo.ram}GB</span>
                  </div>
                  <div className={styles['nova-stat-row']}>
                    <Crosshair size={14} color="#00ff9d" />
                    <span style={{ fontSize: '9px' }}>LAT: {coords.lat} | LON: {coords.lon}</span>
                  </div>
                  
                  {/* Audio Visualizer Button */}
                  <button className={styles['audio-radar-btn']} onClick={toggleAudioRadar}>
                    {isAudioActive ? t('audioRadarOn') : t('audioRadarOff')}
                  </button>
                  
                  {isAudioActive && (
                    <div className={styles['audio-visualizer']}>
                      {audioData.map((val, idx) => (
                        <div 
                          key={idx} 
                          className={styles['audio-bar']} 
                          style={{ height: `${Math.max(5, (val / 255) * 40)}px` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Kripto Radar */}
          <div className={styles['crypto-ticker-container']}>
            <div className={styles['crypto-header']}>LIVE.MARKET</div>
            <div className={styles['crypto-list']}>
              {['BTC', 'ETH', 'SOL'].map((coin) => (
                <div key={coin} className={styles['crypto-item']}>
                  <span className={styles['crypto-symbol']}>{coin}</span>
                  <span 
                    className={styles['crypto-price']} 
                    style={{ 
                      color: cryptoPrices[coin].trend === 'up' ? '#00ff9d' : cryptoPrices[coin].trend === 'down' ? '#ff0033' : '#a0c0d0',
                      textShadow: `0 0 8px ${cryptoPrices[coin].trend === 'up' ? 'rgba(0,255,157,0.5)' : cryptoPrices[coin].trend === 'down' ? 'rgba(255,0,51,0.5)' : 'rgba(160,192,208,0.5)'}`
                    }}
                  >
                    ${cryptoPrices[coin].price}
                  </span>
                </div>
              ))}
            </div>
          </div>

            {/* NASA APOD (Sol Panele Taşındı) */}
            {nasaData && (
              <div className={styles['nasa-panel']}>
                <div className={styles['crypto-header']}>NASA DEEP.SPACE LINK</div>
                <img src={nasaData.url} alt={nasaData.title} className={styles['nasa-img']} />
                <div className={styles['nasa-content']}>
                  <h4 className={styles['nasa-title']}>{nasaData.title}</h4>
                  <p className={styles['nasa-desc']}>{nasaData.explanation?.substring(0, 150)}...</p>
                </div>
              </div>
            )}

            {/* NOVA v2.0 - Matrix Logs */}
            <div className={styles['matrix-logs']}>
              {systemLogs.map((log, i) => <div key={i} className={styles['matrix-log-line']}>{log}</div>)}
            </div>

            {/* NOVA v2.0 - Terminal */}
            <div className={styles['terminal-container']}>
              <div className={styles['crypto-header']}>NOVA.TERMINAL</div>
              <div className={styles['terminal-history']}>
                {terminalHistory.map((item, i) => (
                  <div key={i} className={item.type === 'cmd' ? styles['terminal-cmd'] : styles['terminal-res']}>
                    {item.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
              <div className={styles['terminal-input-wrapper']}>
                 <span style={{color: '#00ff9d', marginRight: '5px', fontSize: '11px', fontFamily: 'monospace'}}>NOVA&gt;_</span>
                 <input 
                    type="text" 
                    className={styles['terminal-input']}
                    value={terminalInput}
                    onChange={e => setTerminalInput(e.target.value)}
                    onKeyDown={handleTerminalSubmit}
                    placeholder="/help, /weather, /crypto, /clear"
                 />
              </div>
            </div>
          </div>

          {/* Sağ Merkez: Robot ve Sohbet Penceresi */}
          <div className={styles['robot-chat-container']}>
            <AnimatedRobot />

            <div className={`${styles['chat-widget']} ${isChatActive ? styles.active : ''}`} id="chatWidget">
              <div className={styles['chat-header']}>
                <span className={styles['header-title-container']}>
                  <img src="/robot.png" alt="Robot Icon" className={styles['header-robot-icon']} />
                  {t('assistantBot')}
                </span>
                <div>
                  <button 
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} 
                    className={styles['chat-speaker-btn']}
                    title="Sesi Aç/Kapat"
                  >
                    <i className={`fas ${isVoiceEnabled ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
                  </button>
                  <button onClick={() => setIsChatActive(false)} className={styles['chat-header-btn']}>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
              
              <div className={styles['chat-messages']} ref={chatMessagesRef}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`${styles['chat-message']} ${msg.sender === 'bot' ? styles.bot : styles.user}`}>
                    {msg.sender === 'bot' ? (
                      <div>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                        <button 
                          onClick={() => speakText(msg.text, true)} 
                          className={styles['message-play-btn']}
                          title="Bu mesajı sesli dinle"
                        >
                          <i className="fas fa-play-circle"></i> {t('speak')}
                        </button>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className={`${styles['chat-message']} ${styles.bot}`}>
                    <span className={styles.loadingDots}>{t('thinking')}</span>
                  </div>
                )}
              </div>
              
              <div className={styles['chat-input-area']}>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t('typeMessage')} 
                  className={styles['chat-input']}
                />
                <button 
                  onClick={handleMicrophoneClick} 
                  className={`${styles['chat-mic-btn']} ${isRecording ? styles.recording : ''}`}
                  title="Sesle Yaz"
                >
                  <i className="fas fa-microphone"></i>
                </button>
                <button onClick={handleSendMessage} className={styles['chat-send-btn']}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>

            <div 
              className={`${styles['chat-icon']} ${isChatActive ? styles.hidden : ''}`} 
              onClick={() => setIsChatActive(true)}
            >
              <i className="fas fa-comment-dots"></i>
            </div>
          </div>



        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', background: '#111' }}>Yükleniyor...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
