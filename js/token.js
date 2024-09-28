import { Lexema } from "./lexema.js"
import { tablaPrecedencia } from "./tabla_precedencia.js";

export class Token {
  constructor(tipo = Lexema.Tipo.Nada, valor = "", columna = 0) {
    this.tipo = tipo;
    this.valor = valor;
    this.columna = columna;
    this.longitud = valor.length;
    this.nivelPrecedencia = obtenerNivelPrecedencia(tipo, valor);
    this.numArgumentos = obtenerNumeroArgumentos(tipo, valor);
  }

  esOperador = () =>
         this.tipo === Lexema.Tipo.MenosUnario
      || this.tipo === Lexema.Tipo.Logico
      || this.tipo === Lexema.Tipo.Aritmetico
      || this.tipo === Lexema.Tipo.Comparacion
      || this.tipo === Lexema.Tipo.Asignacion;

  esUnario = () => this.numArgumentos === 1;

  esBinario = () => this.numArgumentos === 2;

  esAsociativoIzquierda = () =>
      this.tipo !== Lexema.Tipo.MenosUnario
   && this.tipo !== Lexema.Tipo.Asignacion
   && this.valor !== "**"
   && this.valor !== "NO";
}

const obtenerNumeroArgumentos = (tipo, valor) => {
  if (tipo === Lexema.Tipo.MenosUnario || valor === "NO") {
    return 1; // es un operador unario
  }

  if (   tipo === Lexema.Tipo.Aritmetico
      || tipo === Lexema.Tipo.Comparacion
      || tipo === Lexema.Tipo.Asignacion
      || tipo === Lexema.Tipo.Logico && valor !== "NO" ) {
    return 2; // es un operador binario
  }

  return 0;
}

const obtenerNivelPrecedencia = (tipo, valor) => {
  for (const operador of tablaPrecedencia) {
    if (tipo === operador.tipo && valor === operador.valor) {
      return operador.nivelPrecedencia;
    }
  }

  return -1;
}
