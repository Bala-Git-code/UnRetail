import { Plus_Jakarta_Sans, Outfit, JetBrains_Mono } from 'next/font/google';
import RouteTransitionLoader from '@/components/RouteTransitionLoader';
import { CartProvider } from '@/lib/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata = {
  title: 'UNRETAIL — Curated Thrift & Streetwear Marketplace',
  description:
    'Real-time inventory from verified physical thrift stores and streetwear boutiques. Safe escrow payments and authentic vintage grails.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`dark scroll-smooth ${plusJakarta.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-street-black text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-neon-lime selection:text-black font-sans"
      >
        <CartProvider>
          <RouteTransitionLoader>
            <div className="relative flex min-h-screen flex-col bg-street-black">
              {children}
            </div>
          </RouteTransitionLoader>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
