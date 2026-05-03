import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NotiRest - Turn Notion Databases Into REST APIs | Production-Ready',
  description: 'Connect your Notion databases and generate production-ready REST APIs in seconds. No coding required. Perfect for developers and teams.',
  keywords: 'Notion API, REST API, database API, Notion integration, API generator, serverless API, low-code',
  generator: 'v0.app',
  applicationName: 'NotiRest',
  authors: [{ name: 'NotiRest Team' }],
  creator: 'NotiRest',
  publisher: 'NotiRest',
  metadataBase: new URL('https://notirest.io'),
  openGraph: {
    title: 'NotiRest - Turn Notion Databases Into REST APIs',
    description: 'Generate production-ready REST APIs from your Notion databases instantly.',
    type: 'website',
    url: 'https://notirest.io',
    siteName: 'NotiRest',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotiRest - Notion API Platform',
    description: 'Turn your Notion databases into production-ready REST APIs',
    creator: '@notirest',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  )
}
