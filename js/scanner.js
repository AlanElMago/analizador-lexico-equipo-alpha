import { tokenizar } from "./tokenizador.js"

export class Scanner {
  constructor(texto) {
    this.tokens = tokenizar(texto);
    this.longitudTexto = texto.length;
  };

  obtenerToken = (i) => {
    return this.tokens[i];
  };

  siguienteToken = () => {
    return this.tokens.shift();
  };

  haySiguienteToken = () => {
    return this.tokens.length > 0;
  };
};
