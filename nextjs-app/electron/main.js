const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let nextProcess;

function getFreePort() {
  return new Promise((resolve, reject) => {
    const portFile = path.join(app.getPath('userData'), 'port.json');
    let preferredPort = 0;
    
    // Daha önce atanmış bir port var mı kontrol et
    if (fs.existsSync(portFile)) {
       try {
         const data = JSON.parse(fs.readFileSync(portFile, 'utf8'));
         if (data.port) preferredPort = data.port;
       } catch (e) {
         console.error("Port dosyası okunamadı", e);
       }
    }

    const server = require('http').createServer();
    // Eğer preferredPort varsa onu dene, yoksa (0) rastgele al
    server.listen(preferredPort, () => {
      const port = server.address().port;
      server.close(() => {
         // Başarıyla bir port aldıysak bunu dosyaya kaydet
         fs.writeFileSync(portFile, JSON.stringify({ port }));
         resolve(port);
      });
    });

    server.on('error', (e) => {
      // Eğer tercih edilen port doluysa (EADDRINUSE), rastgele port (0) ile tekrar dene
      if (e.code === 'EADDRINUSE' && preferredPort !== 0) {
         console.log(`Port ${preferredPort} dolu, yeni port aranıyor...`);
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

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '..', 'public', 'robot.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true,
    title: "Nova & Milo - Dashboard"
  });

  // Start Next.js standalone server
  try {
    const port = await getFreePort();
    console.log(`Starting Next.js on port ${port}...`);

    // Standalone dizini yolunu bul
    // Electron derlendiğinde asar içinde olur, bu yüzden standalone klasörünün asar dışına kopyalanması veya asar unpack yapılması gerekir
    const standaloneDir = app.isPackaged 
        ? path.join(process.resourcesPath, 'app.asar.unpacked', '.next', 'standalone')
        : path.join(__dirname, '..', '.next', 'standalone');
    
    const serverPath = path.join(standaloneDir, 'server.js');

    if (!fs.existsSync(serverPath)) {
       throw new Error(`Next.js server.js bulunamadı: ${serverPath}`);
    }

    const env = { 
        ...process.env, 
        PORT: port,
        NODE_ENV: 'production',
        ELECTRON_RUN_AS_NODE: '1'
    };

    // .env.local dosyasını manuel okuyup env nesnesine ekle
    const targetEnvFile = path.join(standaloneDir, '.env.local');
    if (fs.existsSync(targetEnvFile)) {
       const envFileContent = fs.readFileSync(targetEnvFile, 'utf8');
       envFileContent.split('\n').forEach(line => {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match) {
             const key = match[1];
             let value = match[2] || '';
             value = value.replace(/(^['"]|['"]$)/g, '').trim();
             env[key] = value;
          }
       });
    }

    nextProcess = spawn(process.execPath, [serverPath], {
      cwd: standaloneDir,
      env: env,
      stdio: 'inherit' // Bu loglar arka planda terminalde kalır
    });

    // Sunucunun ayağa kalkmasını bekleyen bir kontrol fonksiyonu
    const checkServer = () => {
      const http = require('http');
      const req = http.get(`http://localhost:${port}`, (res) => {
        if (res.statusCode === 200) {
          console.log("Server is ready, loading page.");
          mainWindow.loadURL(`http://localhost:${port}`).catch(err => {
             console.error("Failed to load URL:", err);
             mainWindow.loadFile(path.join(__dirname, 'error.html'));
          });
        } else {
          // Eğer 200 dönmezse ama yanıt verirse yine de yükle
          mainWindow.loadURL(`http://localhost:${port}`);
        }
      });

      req.on('error', (err) => {
        console.log("Waiting for server...");
        setTimeout(checkServer, 1000);
      });
    };

    // Kontrole başla
    checkServer();

  } catch (error) {
    console.error("Next.js başlatma hatası:", error);
    mainWindow.loadFile(path.join(__dirname, 'error.html'));
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    if (nextProcess) {
       nextProcess.kill();
    }
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
    if (nextProcess) {
        nextProcess.kill();
    }
});
