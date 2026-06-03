export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        offwhite: '#F8F8F2',
        palegreen: '#CFE8D5',
        sage: '#A8C3A0',
        mint: '#DDEFE2',
        surface: '#F2F4EF'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Space Grotesk', 'Bricolage Grotesque', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 40px rgba(35, 56, 42, 0.08)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
