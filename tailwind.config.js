/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1e3a8a', // Azul escuro do background e logo
          light: '#f8fafc', // Fundo cinza bem claro das telas
          dark: '#1f2937', // Sidebar escura
        }
      },
      backgroundImage: {
        'login-pattern': "url('/waves-bg.svg')", // Assumindo que você colocará a imagem de ondas na pasta public
      }
    },
  },
  plugins: [],
}