module.exports = {
  theme: {
    extend: {},
  },
  variants: {
    boxShadow: ['responsive', 'hover', 'focus', 'active'],
    borderRadius: ['responsive', 'hover'],
    height: ['responsive', 'hover'],
    width: ['responsive', 'hover'],
  },
  plugins: [
    require('tailwindcss-elevation')(['responsive', 'hover', 'active']),
  ],
};
