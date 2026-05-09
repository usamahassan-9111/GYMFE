/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontSize: {
        xs: '0.875rem',
        sm: '1rem',
        base: '1.1rem',
        lg: '1.35rem',
        xl: '1.5rem',
        '2xl': '1.875rem',
        '3xl': '2.25rem',
        '4xl': '2.8rem',
      },
      colors: {
        sfBlue: '#0b4db8',
        sfRed: '#e11d48',
        sfDark: '#07111f',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(225, 29, 72, 0.25), 0 16px 40px rgba(11, 77, 184, 0.25)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(11,77,184,0.35), transparent 30%), radial-gradient(circle at bottom right, rgba(225,29,72,0.22), transparent 35%), linear-gradient(135deg, rgba(3,7,18,0.94), rgba(3,7,18,0.82))',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        slideIn: 'slideIn 0.6s ease-out both',
        fadeIn: 'fadeIn 0.7s ease-out',
        scaleIn: 'scaleIn 0.5s ease-out',
        pulse: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        marquee: 'marquee 18s linear infinite',
      },
    },
  },
  plugins: [],
};