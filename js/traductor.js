import { Lexema } from "./lexema.js";

export class Traductor {
  constructor(scanner) {
    this.scanner = scanner;
  }

  traducir = () => {
    let textoTraducido = "";
    let linea = 1;
    let columna = 0;

    this.scanner.reiniciar();

    while(this.scanner.obtenerTokenActual().tipo !== Lexema.Tipo.FinDeArchivo) {
      while(this.scanner.obtenerTokenActual().columna > columna) {
        textoTraducido += " ";
        columna++;
      }

      while (this.scanner.obtenerTokenActual().linea > linea) {
        textoTraducido += "\n";
        linea++;
        columna = 0;
      }

      const tokenActual = this.scanner.obtenerTokenActual();

      if (tokenActual.tipo === Lexema.Tipo.Funcion
          || tokenActual.tipo === Lexema.Tipo.Reservada
          || tokenActual.tipo === Lexema.Tipo.Logico
          || tokenActual.tipo === Lexema.Tipo.Booleano) {
        textoTraducido += traducciones[tokenActual.valor];
        columna += tokenActual.longitud;

        this.scanner.siguienteToken();

        continue;
      }

      textoTraducido += tokenActual.valor;
      columna += tokenActual.longitud;

      this.scanner.siguienteToken();
    }

    return textoTraducido;
  }
}

const traducciones = {
  // funciones
  imprimir: "print",
  entrada: "input",
  suma: "sum",
  longitud: "len",
  lista: "list",
  cadena: "str",
  rango: "range",
  cremallera: "zip",
  flotante: "float",
  entero: "int",
  rebanada: "slice",
  redondear: "round",
  tupla: "tuple",
  tipo: "type",
  ordenado: "sorted",
  potencia: "pow",
  conjunto: "set",

  // palabras reservadas
  si: "if",
  osi: "elif",
  sino: "else",
  para: "for",
  mientras: "while",
  en: "in",

  // operadores lógicos
  O: "or",
  Y: "and",
  NO: "not",

  // literales booleanos
  Verdadero: "True",
  Falso: "False"
}
