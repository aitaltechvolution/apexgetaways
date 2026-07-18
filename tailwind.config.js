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
        surface:  { light:'#F8F9FC', dark:'#070D1A' },
        card:     { light:'#FFFFFF', dark:'#0F1826' },
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"','ui-sans-serif','system-ui','sans-serif'] },
      keyframes: {
        fadeIn:     { '0%':{ opacity:'0' }, '100%':{ opacity:'1' } },
        fadeUp:     { '0%':{ opacity:'0',transform:'translateY(30px)' }, '100%':{ opacity:'1',transform:'translateY(0)' } },
        fadeLeft:   { '0%':{ opacity:'0',transform:'translateX(-30px)' }, '100%':{ opacity:'1',transform:'translateX(0)' } },
        fadeRight:  { '0%':{ opacity:'0',transform:'translateX(30px)' }, '100%':{ opacity:'1',transform:'translateX(0)' } },
        scaleIn:    { '0%':{ opacity:'0',transform:'scale(0.9)' }, '100%':{ opacity:'1',transform:'scale(1)' } },
        float:      { '0%,100%':{ transform:'translateY(0px)' }, '50%':{ transform:'translateY(-10px)' } },
        shimmer:    { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
        marquee:    { '0%':{ transform:'translateX(0)' }, '100%':{ transform:'translateX(-50%)' } },
        pulse_gold: { '0%,100%':{ boxShadow:'0 0 0 0 rgba(201,168,76,0.4)' }, '50%':{ boxShadow:'0 0 0 12px rgba(201,168,76,0)' } },
        spin_slow:  { '0%':{ transform:'rotate(0deg)' }, '100%':{ transform:'rotate(360deg)' } },
        count_up:   { '0%':{ opacity:'0',transform:'translateY(10px)' }, '100%':{ opacity:'1',transform:'translateY(0)' } },
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'fade-up':    'fadeUp 0.7s ease-out forwards',
        'fade-left':  'fadeLeft 0.7s ease-out forwards',
        'fade-right': 'fadeRight 0.7s ease-out forwards',
        'scale-in':   'scaleIn 0.6s ease-out forwards',
        'float':      'float 4s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s infinite linear',
        'marquee':    'marquee 30s linear infinite',
        'pulse-gold': 'pulse_gold 2s infinite',
        'spin-slow':  'spin_slow 20s linear infinite',
      },
      boxShadow: {
        'card':       '0 4px 24px rgba(0,0,0,0.07)',
        'card-hover': '0 16px 48px rgba(0,0,0,0.14)',
        'glow':       '0 0 24px rgba(10,22,40,0.4)',
        'glow-gold':  '0 0 24px rgba(201,168,76,0.5)',
        'nav':        '0 2px 24px rgba(0,0,0,0.1)',
        'gold-sm':    '0 4px 16px rgba(201,168,76,0.3)',
      },
      backgroundImage: {
        'navy-gradient':   'linear-gradient(135deg,#0A1628 0%,#162040 100%)',
        'gold-gradient':   'linear-gradient(135deg,#C9A84C 0%,#F5C842 50%,#A07830 100%)',
        'hero-overlay':    'linear-gradient(to bottom,rgba(5,13,26,0.55) 0%,rgba(5,13,26,0.85) 100%)',
        'card-shine':      'linear-gradient(135deg,rgba(255,255,255,0.05) 0%,transparent 50%)',
      },
      backgroundSize: { '200%': '200% 100%' },
    }
  },
  plugins: []
}
