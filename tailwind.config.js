module.exports = {
  theme: {
    extend: {},
  },
  variants: {
    boxShadow: ['responsive', 'hover', 'focus', 'active'],
    opacity: ['responsive', 'hover', 'focus', 'disabled'],
  },
  plugins: [
    require('tailwindcss-elevation')(['responsive', 'hover', 'active']),
  ],
};
