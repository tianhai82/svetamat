const production = !process.env.ROLLUP_WATCH

module.exports = {
  plugins: [
    require('tailwindcss'),
    require("autoprefixer")
  ]
};
