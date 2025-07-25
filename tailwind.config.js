/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
        },
        white: {
          DEFAULT: '#ffffff',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
