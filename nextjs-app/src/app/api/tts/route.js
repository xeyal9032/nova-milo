import { NextResponse } from 'next/server';
import { getServerConfig } from '@/lib/serverConfig';

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Metin boş olamaz." }, { status: 400 });
    }

    const apiKey = getServerConfig().openaiApiKey;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY tanımlı değil.' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1', // En hızlı model
        input: text,
        voice: 'nova', // Nova: Çok tatlı, enerjik, samimi ve kadınsı bir sestir.
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API Hatası');
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('TTS Hatası:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
