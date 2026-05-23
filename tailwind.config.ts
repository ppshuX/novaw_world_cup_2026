import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        summer: {
          sky: '#64c7ff',
          blue: '#1177d6',
          grass: '#25b96f',
          lime: '#b7f46d',
          orange: '#ff9f43',
          sunset: '#ff6b6b',
          night: '#32245f',
          ink: '#172033',
        },
      },
      boxShadow: {
        glow: '0 0 36px rgba(100, 199, 255, 0.38)',
        card: '0 18px 48px rgba(24, 36, 62, 0.12)',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
