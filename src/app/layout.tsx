import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "סטודיו נועה פילאטיס | שיעורי פילאטיס מקצועיים",
  description: "שיעורי פילאטיס מקצועיים עם נועה גורליק. מנויים וחבילות שיעורים. גישה לספריית וידאו עשירה.",
  keywords: "פילאטיס, נועה גורליק, שיעורי פילאטיס, מנוי פילאטיס, סטודיו פילאטיס",
  authors: [{ name: "נועה גורליק" }],
  openGraph: {
    title: "סטודיו נועה פילאטיס",
    description: "שיעורי פילאטיס מקצועיים בבית שלכם",
    type: "website",
    locale: "he_IL",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: 'var(--color-charcoal)',
                color: 'var(--color-soft-white)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                boxShadow: 'var(--shadow-medium)',
                direction: 'rtl',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
