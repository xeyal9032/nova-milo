const fs = require('fs');
const path = require('path');

const standaloneDir = path.join(__dirname, '.next', 'standalone');
const publicDir = path.join(__dirname, 'public');
const staticDir = path.join(__dirname, '.next', 'static');

// Hedef yollar
const targetPublicDir = path.join(standaloneDir, 'public');
const targetStaticDir = path.join(standaloneDir, '.next', 'static');

// Klasör kopyalama yardımcı fonksiyonu
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log("Kopyalama işlemi başlatılıyor...");

if (fs.existsSync(publicDir)) {
  console.log("Public dizini kopyalanıyor...");
  copyRecursiveSync(publicDir, targetPublicDir);
}

if (fs.existsSync(staticDir)) {
  console.log("Static dizini kopyalanıyor...");
  copyRecursiveSync(staticDir, targetStaticDir);
}

// .env.local dosyasını da standalone'a kopyala
const envFile = path.join(__dirname, '.env.local');
const targetEnvFile = path.join(standaloneDir, '.env.local');
if (fs.existsSync(envFile)) {
    console.log(".env.local kopyalanıyor...");
    fs.copyFileSync(envFile, targetEnvFile);
}

console.log("Kopyalama tamamlandı!");
