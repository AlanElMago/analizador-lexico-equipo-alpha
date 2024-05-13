export class Token {
  constructor(tipo, valor, columna) {
    this.tipo = tipo,
    this.valor = valor,
    this.columna = columna,
    this.longitud = valor.length
  }
}
