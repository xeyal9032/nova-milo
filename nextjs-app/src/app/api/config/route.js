import { NextResponse } from 'next/server';
import { getServerConfig } from '@/lib/serverConfig';

/** İstemciye yalnızca public Supabase bilgileri */
export async function GET() {
  const config = getServerConfig();

  return NextResponse.json({
    supabaseUrl: config.supabaseUrl,
    supabaseAnonKey: config.supabaseAnonKey,
    hasGemini: Boolean(config.geminiApiKey),
    hasOpenAI: Boolean(config.openaiApiKey),
  });
}
