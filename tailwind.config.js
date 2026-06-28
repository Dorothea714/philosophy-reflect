/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#f9eddb',
          200: '#f2d7b0',
          300: '#e9bb7b',
          400: '#df9a4a',
          500: '#d4822e',
          600: '#c46a24',
          700: '#a35220',
          800: '#844220',
          900: '#6c381d',
        },
        ink: {
          50: '#f7f5f0',
          100: '#ede8db',
          200: '#dbd0b4',
          300: '#c5b385',
          400: '#b49a62',
          500: '#a6884f',
          600: '#8f7043',
          700: '#745838',
          800: '#624a33',
          900: '#54402f',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
