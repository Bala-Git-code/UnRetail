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
        sans: ['var(--font-plus-jakarta)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['var(--font-outfit)', 'var(--font-plus-jakarta)', '-apple-system', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        neon: {
          lime: '#ccff00',
          orange: '#ff5500',
          cyan: '#00f0ff',
        },
        street: {
          black: '#09090b',
          dark: '#111114',
          card: '#16161a',
          cardHover: '#1c1c22',
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
