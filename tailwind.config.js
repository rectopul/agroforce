module.exports = {
  content: [
    "./src/pages/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {      
      'white': '#FFFFFF',

      'green-600': '#16a34a',

      'cyan-500':  '#61dafb',

      'yellow-500':  '#eba417',

      'gray-450':  '#00567b',
      'blue-600': '#00a5b4',
      'blue-700': '#1d4ed8',
      'blue-800': '#1e40af',
      'blue-900': '#1e3a8a',
      
      'gray-50': '#f9fafb',
      'gray-200':  '#e5e7eb',
      'gray-300':  '#d1d5db',

      'gray-400': '#9ca3af',
      'gray-600':  '#4b5563',
      'gray-700':  '#374151',
      'gray-900': '#121214',

      'red-600': '#dc2626',
      'red-700': '#b91c1c',
      'red-800': '#991b1b',
    },
    extend: {
      height: {
        'aside': 'calc(100vh - 5rem)',
        'content': 'calc(100vh - 5rem)',
      },
      width: {
        // Header
        'content-main-header': 'calc(99% - 16rem - 2.5rem)',

        // Separar o componente Aside dos Conteúdos das outras telas
        'container-all-main-contents': 'calc(100vw - 8rem)',
      },
    },
  },
  plugins: [
    
  ],
}
