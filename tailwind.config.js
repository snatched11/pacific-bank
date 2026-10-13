/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B4F6C',
          dark: '#083A50',
          light: '#14719A',
        },
        accent: {
          DEFAULT: '#1B9AAA',
          soft: '#E6F6F8',
        },
        surface: {
          DEFAULT: '#F4F7F9',
          card: '#FFFFFF',
        },
        success: {
          DEFAULT: '#0F7B5C',
          soft: '#E8F6F1',
        },
        danger: {
          DEFAULT: '#C0392B',
          soft: '#FDEEEC',
        },
        muted: {
          DEFAULT: '#5B6B76',
          light: '#8A98A3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(11, 79, 108, 0.08)',
        card: '0 8px 32px rgba(11, 79, 108, 0.1)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
