import fs from 'fs';
import path from 'path';

/** .env formatındaki dosyayı okur */
function parseEnvFile(content) {
  const result = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    value = value.replace(/^(['"])(.*)\1$/, '$2');
    result[key] = value;
  }
  return result;
}

function readFileConfig() {
  const configPath = process.env.CONFIG_FILE;
  if (!configPath || !fs.existsSync(configPath)) return {};
  try {
    return parseEnvFile(fs.readFileSync(configPath, 'utf8'));
  } catch {
    return {};
  }
}

/** Sunucu tarafı yapılandırma — CONFIG_FILE veya process.env */
export function getServerConfig() {
  const file = readFileConfig();
  const get = (key) => file[key] || process.env[key] || '';

  return {
    supabaseUrl: get('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: get('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    geminiApiKey: get('GEMINI_API_KEY'),
    openaiApiKey: get('OPENAI_API_KEY'),
  };
}

export function isAppConfigured() {
  const c = getServerConfig();
  return Boolean(c.supabaseUrl && c.supabaseAnonKey && c.geminiApiKey);
}

/** İlk kurulum — anahtarları kullanıcı dizinine yazar */
export function saveServerConfig(values) {
  const configPath = process.env.CONFIG_FILE;
  if (!configPath) {
    throw new Error('CONFIG_FILE tanımlı değil; yapılandırma kaydedilemez.');
  }

  const lines = [
    `NEXT_PUBLIC_SUPABASE_URL=${values.supabaseUrl}`,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${values.supabaseAnonKey}`,
    `GEMINI_API_KEY=${values.geminiApiKey}`,
    `OPENAI_API_KEY=${values.openaiApiKey || ''}`,
  ];

  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, lines.join('\n') + '\n', 'utf8');
}
