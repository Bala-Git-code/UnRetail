/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,mdx}',
    './components/**/*.{js,jsx,mdx}',
    './lib/**/*.{js,jsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Inter', 'sans-serif'],
        heading: ['var(--font-outfit)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        neon: {
          lime: '#ccff00',
          orange: '#ff5500',
          cyan: '#00f0ff',
        },
        street: {
          black: '#09090b',
          dark: '#121215',
          card: '#18181b',
          border: '#27272a',
          muted: '#71717a',
        },
        thrift: {
          amber: '#f59e0b',
          cream: '#fef3c7',
          vintage: '#b45309',
        }
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
