/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Calibri', 'sans-serif'],
      },
      colors: {
        light: {
          bg: '#C7C0B6',
          surface: '#E5E1DA',
          accent: '#D1CCC3',
          border: '#B4B0A9',
          text: {
            primary: '#2C2C2C',
            secondary: '#666666',
            muted: '#666666'
          }
        },
        dark: {
          bg: '#212529',
          surface: '#343A40',
          border: '#495057',
          accent: '#2C3136',
          text: {
            primary: '#F8F9FA',
            secondary: '#E9ECEF',
            muted: '#ADB5BD'
          }
        },
        primary: {
          light: '#4C6EF5',
          DEFAULT: '#3B5BDB',
          dark: '#364FC7'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#2C2C2C',
            a: {
              color: '#3B5BDB',
              '&:hover': {
                color: '#364FC7',
              },
            },
            'ul[data-type="taskList"]': {
              listStyle: 'none',
              padding: 0,
              'li': {
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                'label': {
                  cursor: 'pointer',
                },
                'input[type="checkbox"]': {
                  cursor: 'pointer',
                  margin: 0,
                },
              },
            },
          },
        },
        invert: {
          css: {
            color: '#F8F9FA',
            a: {
              color: '#4C6EF5',
              '&:hover': {
                color: '#364FC7',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
