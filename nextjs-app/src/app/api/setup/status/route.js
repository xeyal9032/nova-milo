import { NextResponse } from 'next/server';
import { isAppConfigured } from '@/lib/serverConfig';

export async function GET() {
  return NextResponse.json({ configured: isAppConfigured() });
}
