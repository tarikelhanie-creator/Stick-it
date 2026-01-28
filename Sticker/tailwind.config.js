// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fadeOut': 'fadeOut 2s ease-out forwards',
        'pop': 'pop 1s ease-in-out',
        'fadeIn': 'fadeIn 0.3s ease-out 0.2s forwards', // Added delay for curtain effect
        'slideUp': 'slideUpCurtain 0.5s ease-out forwards', // Renamed to avoid conflict
        'slideDown': 'slideDownCurtain 0.5s ease-out forwards', // Renamed to avoid conflict
        'bounce-slow': 'bounce 2s infinite',
        'ping-small': 'pingSmall 1.5s infinite',
        'slideIn': 'slideIn 0.4s ease-out',
        'slideInUp': 'slideInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'slideInDown': 'slideInDown 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse': 'pulse 2s infinite',
        'fadeInUp': 'fadeInUp 0.6s ease-out',
        'chalkWrite': 'chalkWrite 0.8s ease-out',
        'curtainDown': 'curtainDown 0.6s ease-out',
        'curtainUp': 'curtainUp 0.6s ease-out',
      },
      fontFamily: {
        'chalk': ['"Comic Neue"', '"Segoe Print"', 'cursive', 'sans-serif'],
      },
      keyframes: {
        // Curtain animations (slide full screen)
        slideDownCurtain: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        slideUpCurtain: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' }
        },
        curtainDown: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'top' }
        },
        curtainUp: {
          '0%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'top' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0', visibility: 'hidden' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px) scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          },
        },
        chalkWrite: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '80%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Regular slide animations (for elements)
        slideInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(40px) scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          },
        },
        slideInDown: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        pingSmall: {
          '75%, 100%': {
            transform: 'scale(1.5)',
            opacity: '0',
          },
        },
      },
      animationDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}