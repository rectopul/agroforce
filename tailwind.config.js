module.exports = {
  content: [
    './src/pages/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/components/**/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      sm: '1100px',
      // => @media (min-width: 640px) { ... }

      md: '1350px',
      // => @media (min-width: 768px) { ... }

      gg: '1550px',

      lg: '1900px',
      // => @media (min-width: 1024px) { ... }
    },
    colors: {
      white: '#FFFFFF',

      'green-600': '#16a34a',
      'green-800': '#15803d',

      'cyan-500': '#61dafb',

      'yellow-500': '#eba417',

      'gray-450': '#00567b',
      'blue-480': '#0060b9',
      'blue-600': '#00a5b4',
      'blue-700': '#1d4ed8',
      'blue-900': '#133774',

      'gray-50': '#f9fafb',
      'gray-200': '#e5e7eb',
      'gray-300': '#d1d5db',

      'gray-400': '#9ca3af',
      'gray-600': '#4b5563',
      'gray-700': '#374151',
      'gray-900': '#121214',

      'red-600': '#dc2626',
      'red-700': '#b91c1c',
      'red-800': '#991b1b',
    },
    extend: {
      height: {
        aside: 'calc(100vh - 5rem)',
        content: 'calc(100vh - 5rem)',

        // Importação de planilha
        'importation-header': '17vh',
        'importation-aside': '83vh',
        'importation-content': 'calc(100vh - 15vh)',
      },
      width: {
        // Header
        'content-main-header': 'calc(99% - 16rem - 2.5rem)',

        // Separar o componente Aside dos Conteúdos das outras telas
        'container-all-main-contents': 'calc(100vw - 8rem)',

        // Importação de planilha
        'aside-content-importation': 'calc(100vw - 88vw)',
        'importation-content': 'calc(100vw - 12vw)',
      },
    },
  },
  plugins: [

  ],
};
