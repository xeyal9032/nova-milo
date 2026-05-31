"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';

const translations = {
  tr: {
    createAccount: "Hesap Oluştur",
    orUseEmailForRegister: "veya kayıt için e-postanızı kullanın",
    namePlaceholder: "İsim",
    emailPlaceholder: "E-posta Adresi",
    passwordPlaceholder: "Şifre",
    signUp: "KAYIT OL",
    signInTitle: "Giriş Yap",
    orUseAccount: "veya hesabınızı kullanın",
    forgotPassword: "Şifrenizi mi unuttunuz?",
    signIn: "GİRİŞ YAP",
    welcomeBackTitle: "Tekrar Hoşgeldiniz!",
    welcomeBackDesc: "Bizimle bağlantıda kalmak için lütfen kişisel bilgilerinizle giriş yapın",
    helloFriendTitle: "Merhaba!",
    helloFriendDesc: "Bugün bizimle inanılmaz bir yolculuğa başlamak için hemen bir hesap oluşturun",
    welcomeDashboard: "Hoşgeldin",
    logout: "Çıkış Yap",
    assistantBot: "Milo",
    typeMessage: "Bir mesaj yazın...",
    botGreeting: "Merhaba {name}! Başarıyla giriş yaptın. Ben Milo, sana nasıl yardımcı olabilirim? 🤖",
    thinking: "Düşünüyor...",
    errorConn: "Bağlantı hatası oluştu.",
    fillAllFields: "Lütfen tüm alanları doldurun.",
    fillEmailPass: "Lütfen e-posta ve şifrenizi girin.",
    registerSuccess: "Kayıt Başarılı!\\nHoşgeldin {name}. Lütfen giriş yapınız.",
    passResetSent: "Şifre sıfırlama bağlantısı {email} adresine gönderildi.",
    enterEmailFirst: "Lütfen önce e-posta adresinizi girin, ardından 'Şifremi Unuttum'a tıklayın.",
    speak: "Seslendir",
    emergency: "ACİL DURUM",
    restoreSystem: "SİSTEMİ NORMALE DÖNDÜR",
    charging: "(Şarj)",
    calculating: "Hesaplanıyor",
    audioRadarOn: "SES RADARI: AÇIK",
    audioRadarOff: "SES RADARI: KAPALI"
  },
  en: {
    createAccount: "Create Account",
    orUseEmailForRegister: "or use your email for registration",
    namePlaceholder: "Name",
    emailPlaceholder: "Email Address",
    passwordPlaceholder: "Password",
    signUp: "SIGN UP",
    signInTitle: "Sign In",
    orUseAccount: "or use your account",
    forgotPassword: "Forgot your password?",
    signIn: "SIGN IN",
    welcomeBackTitle: "Welcome Back!",
    welcomeBackDesc: "To keep connected with us please login with your personal info",
    helloFriendTitle: "Hello, Friend!",
    helloFriendDesc: "Enter your personal details and start your journey with us",
    welcomeDashboard: "Welcome",
    logout: "Log Out",
    assistantBot: "Milo",
    typeMessage: "Type a message...",
    botGreeting: "Hello {name}! You have successfully logged in. I am Milo, how can I help you? 🤖",
    thinking: "Thinking...",
    errorConn: "Connection error occurred.",
    fillAllFields: "Please fill in all fields.",
    fillEmailPass: "Please enter your email and password.",
    registerSuccess: "Registration Successful!\\nWelcome {name}. Please log in.",
    passResetSent: "Password reset link sent to {email}.",
    enterEmailFirst: "Please enter your email address first, then click 'Forgot Password'.",
    speak: "Speak",
    emergency: "EMERGENCY",
    restoreSystem: "RESTORE SYSTEM",
    charging: "(Charging)",
    calculating: "Calculating",
    audioRadarOn: "AUDIO RADAR: ON",
    audioRadarOff: "AUDIO RADAR: OFF"
  },
  ru: {
    createAccount: "Создать Аккаунт",
    orUseEmailForRegister: "или используйте email для регистрации",
    namePlaceholder: "Имя",
    emailPlaceholder: "Электронная почта",
    passwordPlaceholder: "Пароль",
    signUp: "РЕГИСТРАЦИЯ",
    signInTitle: "Войти",
    orUseAccount: "или используйте ваш аккаунт",
    forgotPassword: "Забыли пароль?",
    signIn: "ВОЙТИ",
    welcomeBackTitle: "С возвращением!",
    welcomeBackDesc: "Чтобы оставаться на связи с нами, пожалуйста, войдите",
    helloFriendTitle: "Привет!",
    helloFriendDesc: "Введите свои данные и начните путешествие с нами",
    welcomeDashboard: "Добро пожаловать",
    logout: "Выйти",
    assistantBot: "Milo",
    typeMessage: "Введите сообщение...",
    botGreeting: "Здравствуйте, {name}! Вы успешно вошли. Я Milo, чем я могу помочь? 🤖",
    thinking: "Думает...",
    errorConn: "Произошла ошибка подключения.",
    fillAllFields: "Пожалуйста, заполните все поля.",
    fillEmailPass: "Пожалуйста, введите ваш email и пароль.",
    registerSuccess: "Регистрация успешна!\\nДобро пожаловать, {name}. Пожалуйста, войдите.",
    passResetSent: "Ссылка для сброса пароля отправлена на {email}.",
    enterEmailFirst: "Сначала введите email, затем нажмите 'Забыли пароль'.",
    speak: "Озвучить",
    emergency: "ЭКСТРЕННО",
    restoreSystem: "ВОССТАНОВИТЬ СИСТЕМУ",
    charging: "(Зарядка)",
    calculating: "Вычисление",
    audioRadarOn: "АУДИО РАДАР: ВКЛ",
    audioRadarOff: "АУДИО РАДАР: ВЫКЛ"
  },
  de: {
    createAccount: "Konto Erstellen",
    orUseEmailForRegister: "oder nutzen Sie Ihre E-Mail zur Registrierung",
    namePlaceholder: "Name",
    emailPlaceholder: "E-Mail Adresse",
    passwordPlaceholder: "Passwort",
    signUp: "REGISTRIEREN",
    signInTitle: "Anmelden",
    orUseAccount: "oder verwenden Sie Ihr Konto",
    forgotPassword: "Passwort vergessen?",
    signIn: "ANMELDEN",
    welcomeBackTitle: "Willkommen zurück!",
    welcomeBackDesc: "Bitte loggen Sie sich ein, um mit uns in Verbindung zu bleiben",
    helloFriendTitle: "Hallo!",
    helloFriendDesc: "Geben Sie Ihre Daten ein und beginnen Sie Ihre Reise mit uns",
    welcomeDashboard: "Willkommen",
    logout: "Abmelden",
    assistantBot: "Milo",
    typeMessage: "Schreiben Sie eine Nachricht...",
    botGreeting: "Hallo {name}! Sie haben sich erfolgreich angemeldet. Ich bin Milo, wie kann ich helfen? 🤖",
    thinking: "Denkt nach...",
    errorConn: "Verbindungsfehler aufgetreten.",
    fillAllFields: "Bitte füllen Sie alle Felder aus.",
    fillEmailPass: "Bitte geben Sie Ihre E-Mail und Ihr Passwort ein.",
    registerSuccess: "Registrierung erfolgreich!\\nWillkommen {name}. Bitte melden Sie sich an.",
    passResetSent: "Link zum Zurücksetzen des Passworts an {email} gesendet.",
    enterEmailFirst: "Bitte geben Sie zuerst Ihre E-Mail-Adresse ein und klicken Sie auf 'Passwort vergessen'.",
    speak: "Vorlesen",
    emergency: "NOTFALL",
    restoreSystem: "SYSTEM WIEDERHERSTELLEN",
    charging: "(Laden)",
    calculating: "Berechnung",
    audioRadarOn: "AUDIO RADAR: AN",
    audioRadarOff: "AUDIO RADAR: AUS"
  },
  az: {
    createAccount: "Hesab Yarat",
    orUseEmailForRegister: "və ya qeydiyyat üçün e-poçtunuzu istifadə edin",
    namePlaceholder: "Ad",
    emailPlaceholder: "E-poçt Ünvanı",
    passwordPlaceholder: "Şifrə",
    signUp: "QEYDİYYATDAN KEÇ",
    signInTitle: "Daxil Ol",
    orUseAccount: "və ya hesabınızı istifadə edin",
    forgotPassword: "Şifrənizi unutmusunuz?",
    signIn: "DAXİL OL",
    welcomeBackTitle: "Yenidən Xoş Gəlmisiniz!",
    welcomeBackDesc: "Bizimlə əlaqədə qalmaq üçün şəxsi məlumatlarınızla daxil olun",
    helloFriendTitle: "Salam!",
    helloFriendDesc: "Bu gün bizimlə inanılmaz bir səyahətə başlamaq üçün dərhal hesab yaradın",
    welcomeDashboard: "Xoş Gəldin",
    logout: "Çıxış Et",
    assistantBot: "Milo",
    typeMessage: "Bir mesaj yazın...",
    botGreeting: "Salam {name}! Uğurla daxil oldunuz. Mən Milo, sizə necə kömək edə bilərəm? 🤖",
    thinking: "Düşünür...",
    errorConn: "Bağlantı xətası baş verdi.",
    fillAllFields: "Zəhmət olmasa bütün sahələri doldurun.",
    fillEmailPass: "Zəhmət olmasa e-poçt və şifrənizi daxil edin.",
    registerSuccess: "Qeydiyyat Uğurlu Oldu!\\nXoş gəldin {name}. Zəhmət olmasa daxil olun.",
    passResetSent: "Şifrə sıfırlama linki {email} ünvanına göndərildi.",
    enterEmailFirst: "Zəhmət olmasa əvvəlcə e-poçt ünvanınızı daxil edin, sonra 'Şifrəmi Unutdum' düyməsinə klikləyin.",
    speak: "Səsləndir",
    emergency: "TƏCİLİ VƏZİYYƏT",
    restoreSystem: "SİSTEMİ NORMAL HALA QAYTAR",
    charging: "(Şarj)",
    calculating: "Hesablanır",
    audioRadarOn: "SƏS RADARI: AÇIQ",
    audioRadarOff: "SƏS RADARI: BAĞLI"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('tr');

  useEffect(() => {
    // Tarayıcıdan daha önce seçilen dili al
    const savedLang = localStorage.getItem('appLang');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('appLang', newLang);
    }
  };

  const t = (key, params = {}) => {
    let text = translations[lang][key] || translations['tr'][key] || key;
    // Eğer {name} veya {email} gibi değişkenler varsa değiştir
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
