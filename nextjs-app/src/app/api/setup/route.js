import { NextResponse } from 'next/server';
import { getServerConfig, isAppConfigured, saveServerConfig } from '@/lib/serverConfig';

export async function POST(req) {
  try {
    // Yapılandırma dosyası yoksa (Electron) veya geliştirme modunda izin ver
    if (!process.env.CONFIG_FILE && isAppConfigured()) {
      return NextResponse.json(
        { error: 'Uygulama zaten yapılandırılmış. Geliştirme için .env.local kullanın.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const supabaseUrl = (body.supabaseUrl || '').trim();
    const supabaseAnonKey = (body.supabaseAnonKey || '').trim();
    const geminiApiKey = (body.geminiApiKey || '').trim();
    const openaiApiKey = (body.openaiApiKey || '').trim();

    if (!supabaseUrl || !supabaseAnonKey || !geminiApiKey) {
      return NextResponse.json(
        { error: 'Supabase URL, Supabase anahtarı ve Gemini API anahtarı zorunludur.' },
        { status: 400 }
      );
    }

    if (!process.env.CONFIG_FILE) {
      return NextResponse.json(
        { error: 'Bu ortamda dosyaya kayıt desteklenmiyor. .env.local dosyasını düzenleyin.' },
        { status: 400 }
      );
    }

    saveServerConfig({ supabaseUrl, supabaseAnonKey, geminiApiKey, openaiApiKey });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const configured = isAppConfigured();
  const config = getServerConfig();
  return NextResponse.json({
    configured,
    canSave: Boolean(process.env.CONFIG_FILE),
    hasOpenAI: Boolean(config.openaiApiKey),
  });
}
