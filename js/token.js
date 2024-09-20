import { Lexema } from "./lexema.js"

export class Token {
  constructor(tipo = Lexema.Tipo.Nada, valor = "", columna = 0) {
    this.tipo = tipo;
    this.valor = valor;
    this.columna = columna;
    this.longitud = valor.length;
  }
}
