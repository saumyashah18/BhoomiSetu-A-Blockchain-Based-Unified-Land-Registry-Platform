/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF', // White background
        surface: 'rgba(249, 115, 22, 0.03)', // Very subtle orange
        surfaceHighlight: 'rgba(249, 115, 22, 0.08)', // Light orange
        primary: {
          DEFAULT: '#3B82F6', // Blue 500
          hover: '#F97316',   // Orange 500 (hover to orange)
          glow: 'rgba(249, 115, 22, 0.3)' // Orange glow
        },
        text: {
          main: '#1E3A5F',    // Dark blue
          muted: '#4A5568'    // Slate gray (visible on white)
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'fade-in': 'fadeIn 1s ease-in forwards',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
