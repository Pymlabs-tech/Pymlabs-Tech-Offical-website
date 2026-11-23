import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: '#060913',
          900: '#060913',
          850: '#0A0F1F',
          800: '#0F1629',
          700: '#172036',
          600: '#222D47',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          50: '#F6F7FA',
          100: '#EDEFF4',
          200: '#DFE2EA',
        },
        grey: {
          300: '#B8BECC',
          400: '#8E96A8',
          500: '#646C80',
          600: '#4A5164',
        },
        electric: {
          DEFAULT: '#2E6BFF',
          400: '#5A8BFF',
          600: '#1F55DB',
        },
        violet: {
          DEFAULT: '#7B5CFF',
          400: '#9A83FF',
        },
      },
      fontFamily: {
        display: ['"Inter Tight Variable"', '"Inter Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      maxWidth: {
        frame: '1440px',
      },
      backgroundImage: {
        brand: 'linear-gradient(115deg, #1FA2F2 0%, #2E6BFF 45%, #7B4DF2 100%)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
