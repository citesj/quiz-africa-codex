import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      chromebook: '1366px',
      xl: '1536px',
      '2xl': '1920px',
    },
    extend: {
      colors: {
        'color-paper': '#F4EBD8',
        'color-paper-deep': '#E6D8BD',
        'color-ink': '#29231A',
        'color-stamp': '#A65136',
        'color-olive': '#5F6B3B',
        'color-ochre': '#C58A2E',
        'color-terracotta': '#B65A3C',
      },
      boxShadow: {
        passport: '0 24px 55px rgba(53, 35, 16, 0.28)',
        photo: '0 12px 24px rgba(41, 35, 26, 0.2)',
      },
      fontFamily: {
        title: ['"Bitter"', '"Times New Roman"', 'serif'],
        body: ['"Inter"', '"Segoe UI"', 'sans-serif'],
      },
      backgroundImage: {
        paper:
          'radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.35) 0%, transparent 40%), repeating-linear-gradient(135deg, rgba(145, 112, 72, 0.06) 0px, rgba(145, 112, 72, 0.06) 2px, transparent 2px, transparent 8px)',
      },
    },
  },
  plugins: [],
} satisfies Config;
