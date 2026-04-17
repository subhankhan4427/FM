/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#02030b',
        gold: '#0406E8',
        violet: '#7A98FF',
        ivory: '#F0EDE8',
        mist: 'rgba(240, 237, 232, 0.45)',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 60px rgba(4, 6, 232, 0.18)',
        glass:
          '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(4, 6, 232, 0.08) inset',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #0406E8 0%, #7A98FF 100%)',
      },
    },
  },
  plugins: [],
};
