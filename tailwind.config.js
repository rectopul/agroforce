module.exports = {
  content: [
    "./src/pages/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'light': '#f8f8fc',

      'blue-600': '#233D6E',
      'blue-700': '#1d4ed8',
      'blue-800': '#1e40af',
      'blue-900': '#1e3a8a',
      
      'gray-300':  '#d1d5db',
      'gray-450':  '#595959',
      'gray-500': '#6b7280',
      'gray-600':  '#4b5563',
      'gray-700':  '#374151',
      'gray-850':  '#1f2729',
      'gray-900':  '#121214',
      
      'white': '#FFFFFF',
      'cyan-500':  '#61dafb',
      'yellow-500':  '#eba417',

      'e6e6f0': '#e6e6f0',
    },
    extend: {
      height: {
        'aside': 'calc(100vh - 5rem)',
      },
      width: {
        // Header
        'content-main-header': 'calc(99% - 16rem - 2.5rem)',
      }
    },
  },
  plugins: [],
}
