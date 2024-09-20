import { Token } from "./token.js";
import { tokenizar } from "./tokenizador.js"

export class Scanner {
  constructor(texto) {
    this.indice = 0;
    this.tokens = tokenizar(texto);
    this.longitudTexto = texto.length;
  };

  obtenerToken = (i) => this.tokens[i];

  siguienteToken = () => {
    if (!this.haySiguienteToken()) {
      return new Token();
    }

    const siguienteToken = this.tokens[this.indice];

    this.indice++;

    return siguienteToken;
  };

  haySiguienteToken = () => this.indice < this.tokens.length;

  reiniciar = () => this.indice = 0;
};
