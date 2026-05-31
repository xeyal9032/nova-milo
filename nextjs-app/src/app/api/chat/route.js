import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, lang = 'tr' } = await req.json();

    // API Anahtarı kontrolü
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Lütfen sunucuya bir GEMINI_API_KEY ekleyin.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Güçlü ve hızlı bir model kullanıyoruz
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Sistem promptu (Botun kişiliği)
    const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const prompt = `Sen sevimli ve yardımsever bir yapay zeka asistanısın. Adın Milo. Kullanıcılarla nazik bir şekilde konuş.
    Şu anki tarih: ${today}. Sana gün, ay, yıl sorulduğunda bu bilgiyi kullanarak cevap ver.
    
    ÖNEMLİ KURAL 1: Kullanıcıya HER ZAMAN "${lang}" diliyle yanıt ver. (Örn: tr, en, ru, de, az). Asla başka bir dilde yanıt verme.
    ÖNEMLİ KURAL 2: Her mesaja "Merhaba" diyerek veya kendini tanıtarak başlama. Sadece doğrudan soruya yanıt ver. Uzun uzun selamlaşma yapma.
    
    Kullanıcının Sorusu/Mesajı: ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Hata detayı: ' + (error.message || error.toString()) + ' | Key var mı: ' + !!process.env.GEMINI_API_KEY },
      { status: 500 }
    );
  }
}
