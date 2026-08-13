import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
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

export const metadata = {
  title: 'UNRETAIL // Multi-Vendor Thrift & Streetwear Marketplace',
  description:
    'Bringing fragmented offline thrift store racks into a real-time, high-contrast, editorial online marketplace.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark scroll-smooth ${plusJakarta.variable} ${outfit.variable}`}>
      <body className="bg-street-black text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-neon-lime selection:text-black font-sans">
        <div className="relative flex min-h-screen flex-col bg-street-black">
          {children}
        </div>
      </body>
    </html>
  );
}
