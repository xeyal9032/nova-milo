import './globals.css'
import { LanguageProvider } from '../contexts/LanguageContext'
export const metadata = {
  title: 'Profesyonel Giriş Portalı',
  description: 'Next.js ile oluşturulmuş profesyonel giriş uygulaması',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
