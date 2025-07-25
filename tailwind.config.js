const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
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
  plugins: [],
};
export default config;
