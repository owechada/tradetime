/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			customGray: '#F3F2F7',
  			primary: '#636AE8',
  			customBlack: '#2E2E2E',
  			neutral500: '#9095A0',
  			lightPurple: '#D8CBF5',
  			loaderbg: 'rgba(16, 24, 40, 0.7)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'fadeIn': {
  				from: { opacity: '0', transform: 'translateY(10px)' },
  				to: { opacity: '1', transform: 'translateY(0)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fadeIn': 'fadeIn 0.5s ease-out forwards'
  		}
  	}
  },
  plugins: [],
}