/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:  { DEFAULT:'#0A1628', light:'#1A2B45', dark:'#050D1A' },
        gold:     { DEFAULT:'#C9A84C', light:'#E8C96D', dark:'#A07830', bright:'#F5C842' },
        navy:     { DEFAULT:'#0A1628', light:'#162040', dark:'#050D1A', mid:'#0F2040' },
        surface:  { light:'#FFFFFF', dark:'#070D1A' },
        card:     { light:'#FFFFFF', dark:'#0F1826' },
        muted:    '#f8f6f2',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp:   { '0%':{ opacity:'0', transform:'translateY(30px)' }, '100%':{ opacity:'1', transform:'translateY(0)' } },
        float:    { '0%,100%':{ transform:'translateY(0px)' }, '50%':{ transform:'translateY(-10px)' } },
        marquee:  { '0%':{ transform:'translateX(0)' }, '100%':{ transform:'translateX(-50%)' } },
        shimmer:  { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
      },
      animation: {
        'fade-up':  'fadeUp 0.7s ease-out forwards',
        'float':    'float 4s ease-in-out infinite',
        'marquee':  'marquee 35s linear infinite',
        'shimmer':  'shimmer 1.5s infinite linear',
      },
      boxShadow: {
        'gold-sm':     '0 4px 16px rgba(201,168,76,0.25)',
        'gold-md':     '0 8px 32px rgba(201,168,76,0.2)',
        'gold-lg':     '0 16px 48px rgba(201,168,76,0.18)',
        'card':        '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover':  '0 12px 40px rgba(201,168,76,0.15)',
        'navy':        '0 4px 20px rgba(10,22,40,0.2)',
        'glow':        '0 8px 24px rgba(10,22,40,0.25)',
        'glow-accent': '0 8px 24px rgba(201,168,76,0.3)',
      },
      backgroundImage: {
        'gold-gradient':    'linear-gradient(135deg,#C9A84C,#F5C842)',
        'navy-gradient':    'linear-gradient(135deg,#0A1628,#162040)',
        'primary-gradient': 'linear-gradient(135deg,#0A1628,#162040)',
        'accent-gradient':  'linear-gradient(135deg,#C9A84C,#F5C842)',
        'hero-overlay':     'linear-gradient(to bottom,rgba(5,13,26,0.6) 0%,rgba(5,13,26,0.85) 100%)',
      },
    }
  },
  plugins: []
}