// https://nextjs.org/docs/pages/building-your-application/configuring/babel

// Path: next.config.js

module.exports = {
  presets: ["next/babel"], // Utilizando as configurações padrão do Next.js para Babel
  plugins: [
    // Adicione aqui os plugins que deseja utilizar, por exemplo:
    // "@babel/plugin-proposal-class-properties",
    // "@babel/plugin-transform-runtime",
  ],
};