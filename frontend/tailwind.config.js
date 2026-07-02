/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#FF5500",
        surface: "#FFFFFF",
        neutral: "#F2F2F2",
        muted: "#595959",
      },
      fontFamily: {
        heading: ['"Trade Gothic Bold"', 'sans-serif'],
        body: ['"Futura STD Extra Bold Condensed Oblique"', 'sans-serif'],
      },
      boxShadow: {
        brutal: "4px 4px 0px #E5E5E5",
        brutalHover: "6px 6px 0px #FF5500",
      },
      borderRadius: {
        none: '0px',
      }
    },
  },
  plugins: [],
}
