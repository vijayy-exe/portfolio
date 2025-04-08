import './globals.css';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata, Viewport } from 'next'


const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4285F4',
} as const

export const metadata: Metadata = {
  metadataBase: new URL('https://www.vijaybs.dev'),
  
  title: 'Vijay BS',
  description: 'Co-Founder @channelise, CSE (Data Science) Sophomore @ VIT Chennai, A Full Stack Developer with expertise in web development, graphic design, UI/UX, and Event Management.',
  
  keywords: 'Vijay BS, Full Stack Developer, Web Development, Graphic Design, UI/UX, Event Manager, React Developer, JavaScript Developer, Chennai Developer',
  
  authors: [{ name: 'Vijay BS', url: 'https://www.vijaybs.dev' }],
  
  icons: {
    icon: '/favicon.ico', 
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.vijaybs.dev',
    title: 'Vijay BS - Full Stack Developer',
    description: 'A Full Stack Developer with expertise in web development, graphic design, UI/UX, and Event Manager',
    siteName: 'Vijay BS Portfolio',
  },
  
  twitter: {
    card: 'summary',
    title: 'Vijay BS - Full Stack Developer',
    description: 'A Full Stack Developer with expertise in web development, graphic design, UI/UX, and Event Manager',
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

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },

  alternates: {
    canonical: 'https://www.vijaybs.dev',
  },
} as const





export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen text-white flex flex-col`}>
        <header className="p-3  z-20 relative">
          <nav className="flex justify-end space-x-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</a>
            <a href="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8 ">
          {children}
          <SpeedInsights />
        </main>
        <footer className="text-center py-3 bg-gray-800 bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg text-white z-20">
        <p className="text-sm">© {new Date().getFullYear()} @Vijay BS</p>
        </footer>
      </body>
    </html>
  );
}
