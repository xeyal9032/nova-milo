document.addEventListener('DOMContentLoaded', () => {
    // URL'den kullanıcı adını al
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('user') || 'Kullanıcı';

    // Karşılama mesajını güncelle
    document.getElementById('welcomeMessage').innerText = `Hoşgeldin, ${userName}!`;

    // Çıkış Yap Butonu
    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // --- CHATBOT MANTIĞI ---
    const chatWidget = document.getElementById('chatWidget');
    const minimizeChatBtn = document.getElementById('minimizeChat');
    const chatIcon = document.getElementById('chatIcon');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessage');

    // Sayfa açıldığında botun ilk mesajını gönder
    setTimeout(() => {
        addMessage(`Merhaba ${userName}! Başarıyla giriş yaptın. Sana nasıl yardımcı olabilirim? 🤖`, 'bot');
    }, 800);

    // Chat'i küçült (Simge durumuna getir)
    minimizeChatBtn.addEventListener('click', () => {
        chatWidget.classList.remove('active');
        chatIcon.classList.remove('hidden');
    });

    // Chat'i büyüt
    chatIcon.addEventListener('click', () => {
        chatIcon.classList.add('hidden');
        chatWidget.classList.add('active');
    });

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender);
        msgDiv.innerText = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        addMessage(text, 'user');
        chatInput.value = '';
        
        // Robotun cevabını simüle et
        setTimeout(() => {
            let reply = "Şu anda sadece bir arayüz demosuyum, ancak gelecekte gerçek bir yapay zeka ile bağlanabilirim!";
            const lowerText = text.toLowerCase();
            
            if(lowerText.includes("merhaba") || lowerText.includes("selam")) {
                reply = "Merhaba! Kontrol panelinde sana nasıl yardımcı olabilirim?";
            } else if (lowerText.includes("nasılsın")) {
                reply = "Ben bir sanal asistanım, her zaman harikayım! Sen nasılsın?";
            } else if (lowerText.includes("yardım")) {
                reply = "Hesap ayarların, bildirimlerin veya çıkış yapmak için sol üstteki menüyü kullanabilirsin.";
            } else if (lowerText.includes("kimsin")) {
                reply = "Ben senin kişisel sanal asistanınım.";
            }
            
            addMessage(reply, 'bot');
        }, 1000);
    }

    sendMessageBtn.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });
});
