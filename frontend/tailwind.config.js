/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Deep Earthy Forest / Botanical Green
        agri: {
          50: '#F4F7F5',
          100: '#E5EDE9',
          200: '#CCDCD3',
          300: '#A6C1B3',
          400: '#779E8C',
          500: '#4B796A',
          600: '#2F5D50', // Primary Brand Color
          700: '#244B40',
          800: '#1C3B32',
          900: '#142923',
          950: '#0A1713',
        },
        // Secondary: Soft Sage / Foliage Green
        sage: {
          50: '#F8FAF6',
          100: '#EFF3EC',
          200: '#DFE7DA',
          300: '#C7D5BF',
          400: '#A4B69A', // Secondary Brand Color
          500: '#879C7D',
          600: '#6C8062',
          700: '#53634C',
          800: '#3D4938',
          900: '#273024',
        },
        // Warm Neutral & Cream Canvas
        cream: {
          50: '#FDFCF9',
          100: '#FBF9F5', // Canvas Background
          200: '#F4EFE6', // Soft Section Tint
          300: '#E6E0D4', // Default Border
          400: '#D8D0C1',
          500: '#C2B8A3',
          600: '#A69B85',
        },
        // High-Contrast Typography & Earth Tones
        earth: {
          dark: '#18231E',     // Primary Text
          charcoal: '#26332C', // Secondary Text
          muted: '#526058',    // Supporting / Caption Text
          subtle: '#7D8B84',   // Placeholder / Borders
        },
        // Organic Status Indicators (No Neons)
        terracotta: {
          50: '#FCF2F1',
          100: '#F9E4E2',
          600: '#9E332E',
          700: '#832824',
        },
        harvest: {
          50: '#FDF7F0',
          100: '#FBEDE0',
          600: '#A36015',
          700: '#844D0E',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'Cambria', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(24, 35, 30, 0.05), 0 1px 2px rgba(24, 35, 30, 0.03)',
        'card-hover': '0 6px 16px -2px rgba(24, 35, 30, 0.08), 0 2px 4px -1px rgba(24, 35, 30, 0.04)',
        elevated: '0 12px 28px -4px rgba(24, 35, 30, 0.1), 0 4px 8px -2px rgba(24, 35, 30, 0.04)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
