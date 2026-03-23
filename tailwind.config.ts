import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#F4E7D3',
        passport: '#1D3557',
        stamp: '#E76F51',
        trail: '#2A9D8F',
      },
      boxShadow: {
        passport: '0 18px 45px rgba(29, 53, 87, 0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config;
