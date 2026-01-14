import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd5cc',
          300: '#ffb5a6',
          400: '#ff8a73',
          500: '#f86b4d',
        },
        sage: {
          50: '#f6f9f6',
          100: '#e8f0e8',
          200: '#d4e4d4',
          300: '#b3cfb3',
          400: '#8ab58a',
          500: '#6a9b6a',
        },
        cream: {
          50: '#fdfcfa',
          100: '#faf7f2',
          200: '#f5f0e6',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-record': 'pulseRecord 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRecord: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(239, 68, 68, 0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config

