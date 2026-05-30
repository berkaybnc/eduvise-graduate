/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A56DB',
        'primary-dark': '#003FB1',
        secondary: '#006A61',
        'secondary-container': '#86F2E4',
        background: '#F8F9FA',
        surface: '#FFFFFF',
        'surface-low': '#F3F4F5',
        border: '#E5E7EB',
        'text-primary': '#191C1D',
        'text-secondary': '#434654',
        'text-muted': '#737686',
        error: '#BA1A1A',
        'error-container': '#FFDAD6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        modal: '0px 4px 12px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
