const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let nextProcess;
let serverPort = 3000;

const configFilePath = () => path.join(app.getPath('userData'), 'nova-milo.env');

function parseEnvFile(content) {
  const env = {};
  content.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      value = value.replace(/(^['"]|['"]$)/g, '').trim();
      env[match[1]] = value;
    }
  });
  return env;
}

function loadUserConfig() {
  const file = configFilePath();
  if (!fs.existsSync(file)) return {};
  try {
    return parseEnvFile(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('Yapılandırma okunamadı:', e);
    return {};
  }
}

function isConfigured() {
  const c = loadUserConfig();
  return Boolean(
    c.NEXT_PUBLIC_SUPABASE_URL &&
    c.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    c.GEMINI_API_KEY
  );
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const portFile = path.join(app.getPath('userData'), 'port.json');
    let preferredPort = 0;

    if (fs.existsSync(portFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(portFile, 'utf8'));
        if (data.port) preferredPort = data.port;
      } catch (e) {
        console.error('Port dosyası okunamadı', e);
      }
    }

    const server = require('http').createServer();
    server.listen(preferredPort, () => {
      const port = server.address().port;
      server.close(() => {
        fs.writeFileSync(portFile, JSON.stringify({ port }));
        resolve(port);
      });
    });

    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE' && preferredPort !== 0) {
        const fallbackServer = require('http').createServer();
        fallbackServer.listen(0, () => {
          const fallbackPort = fallbackServer.address().port;
          fallbackServer.close(() => {
            fs.writeFileSync(portFile, JSON.stringify({ port: fallbackPort }));
            resolve(fallbackPort);
          });
        });
        fallbackServer.on('error', reject);
      } else {
        reject(e);
      }
    });
  });
}

function loadAppUrl(startPath = '/') {
  const url = `http://localhost:${serverPort}${startPath}`;
  mainWindow.loadURL(url).catch((err) => {
    console.error('Failed to load URL:', err);
    mainWindow.loadFile(path.join(__dirname, 'error.html'));
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '..', 'public', 'robot.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    title: 'Nova & Milo - Dashboard',
  });

  try {
    serverPort = await getFreePort();
    console.log(`Starting Next.js on port ${serverPort}...`);

    const standaloneDir = app.isPackaged
      ? path.join(process.resourcesPath, 'app.asar.unpacked', '.next', 'standalone')
      : path.join(__dirname, '..', '.next', 'standalone');

    const serverPath = path.join(standaloneDir, 'server.js');

    if (!fs.existsSync(serverPath)) {
      throw new Error(`Next.js server.js bulunamadı: ${serverPath}`);
    }

    const userConfig = loadUserConfig();
    const env = {
      ...process.env,
      ...userConfig,
      PORT: String(serverPort),
      NODE_ENV: 'production',
      ELECTRON_RUN_AS_NODE: '1',
      CONFIG_FILE: configFilePath(),
    };

    // Geliştirme: .env.local varsa fallback (paketlenmiş EXE'de olmamalı)
    const devEnvFile = path.join(__dirname, '..', '.env.local');
    if (!app.isPackaged && fs.existsSync(devEnvFile)) {
      Object.assign(env, parseEnvFile(fs.readFileSync(devEnvFile, 'utf8')));
      env.CONFIG_FILE = configFilePath();
    }

    nextProcess = spawn(process.execPath, [serverPath], {
      cwd: standaloneDir,
      env,
      stdio: 'inherit',
    });

    const startPath = isConfigured() ? '/' : '/setup';

    const checkServer = () => {
      const http = require('http');
      const req = http.get(`http://localhost:${serverPort}/api/setup/status`, (res) => {
        if (res.statusCode === 200) {
          console.log('Server is ready, loading:', startPath);
          loadAppUrl(startPath);
        } else {
          loadAppUrl(startPath);
        }
      });

      req.on('error', () => {
        setTimeout(checkServer, 1000);
      });
    };

    checkServer();
  } catch (error) {
    console.error('Next.js başlatma hatası:', error);
    mainWindow.loadFile(path.join(__dirname, 'error.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (nextProcess) nextProcess.kill();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

app.on('before-quit', () => {
  if (nextProcess) nextProcess.kill();
});
