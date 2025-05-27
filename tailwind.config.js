/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
        },
        error: {
          DEFAULT: 'var(--error)',
          dark: 'var(--error-dark)',
        },
        background: 'var(--background)',
        text: {
          DEFAULT: 'var(--text)',
          light: 'var(--text-light)',
        },
      },
    },
  },
  plugins: [],
}