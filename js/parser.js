import { ArbolSintactico } from "./arbol_sintactico.js";
import { Lexema } from "./lexema.js";
import { validarSentencia } from "./reglas_produccion.js";
import { Token } from "./token.js";

export class Parser {
  constructor(scanner) {
    this.scanner = scanner;
    this.analisis = [];
    this.errores = [];
  };

  // Retorna el arbol sintactico
  parsear = () => {
    validarSentencia(this);

    if (this.hayErrores()) {
      const tokenError = new Token(Lexema.Tipo.Error, "Error de Sintaxis");

      return new ArbolSintactico(tokenError);
    }

    if (this.obtenerTokenActual().tipo === Lexema.Tipo.Reservada) {
      const tokenError = new Token(Lexema.Tipo.Error, "Operación no Soportada");

      return new ArbolSintactico(tokenError);
    }

    const arregloNpi = construirArregloNpi(this);

    return construirArbol(arregloNpi);
  };

  obtenerTokenActual = () => this.scanner.obtenerTokenActual();

  haySiguienteToken = () => this.scanner.haySiguienteToken();

  obtenerToken = (i) => this.scanner.obtenerToken(i);

  siguienteToken = () => this.scanner.siguienteToken();

  reiniciar = () => this.scanner.reiniciar();

  registrarToken = () => {
    const tokenActual = this.obtenerTokenActual();

    this.analisis.push(`${tokenActual.valor} - Tipo: ${tokenActual.tipo}, Columna: ${tokenActual.columna}`);
    this.scanner.siguienteToken();
  }

  registrarError = (funcionMensajeError) => this.errores.push(funcionMensajeError(this.obtenerTokenActual()));

  hayErrores = () => this.errores.length > 0;
};

class PilaOperadores {
  constructor() {
    this.pila = [];
  }

  push = (token) => this.pila.push(token);

  pop = () => this.pila.pop();

  peek = () => this.pila[this.pila.length - 1];

  estaVacia = () => this.pila.length <= 0;
}

// Shunting yard algorithm (modificado por Alan Franco)
// https://en.wikipedia.org/wiki/Shunting_yard_algorithm
const construirArregloNpi = (parser) => {
  const salida = [];
  const pilaOperadores = new PilaOperadores();

  while (parser.obtenerTokenActual().tipo !== Lexema.Tipo.FinDeArchivo) {
    const tokenActual = parser.obtenerTokenActual();
    parser.siguienteToken();

    if (   tokenActual.tipo === Lexema.Tipo.Entero
        || tokenActual.tipo === Lexema.Tipo.Flotante
        || tokenActual.tipo === Lexema.Tipo.Booleano
        || tokenActual.tipo === Lexema.Tipo.Cadena
        || tokenActual.tipo === Lexema.Tipo.Id ) {
      salida.push(tokenActual);
    }

    else if (tokenActual.tipo === Lexema.Tipo.Funcion) {
      pilaOperadores.push(tokenActual);
    }

    else if (tokenActual.esOperador()) {
      while (!pilaOperadores.estaVacia() && pilaOperadores.peek().tipo !== Lexema.Tipo.ParentesisApertura
          && (pilaOperadores.peek().nivelPrecedencia < tokenActual.nivelPrecedencia
            || (pilaOperadores.peek().nivelPrecedencia === tokenActual.nivelPrecedencia
              && tokenActual.esAsociativoIzquierda()))) {
        salida.push(pilaOperadores.pop())
      }

      pilaOperadores.push(tokenActual);
    }

    else if (tokenActual.valor === ",") {
      while (pilaOperadores.peek().tipo !== Lexema.Tipo.ParentesisApertura) {
        salida.push(pilaOperadores.pop());
      }
    }

    else if (tokenActual.tipo === Lexema.Tipo.ParentesisApertura) {
      pilaOperadores.push(tokenActual);
    }

    else if (tokenActual.tipo === Lexema.Tipo.ParentesisCierre) {
      while (pilaOperadores.peek().tipo !== Lexema.Tipo.ParentesisApertura) {
        salida.push(pilaOperadores.pop());
      }

      pilaOperadores.pop();

      if (!pilaOperadores.estaVacia() && pilaOperadores.peek().tipo === Lexema.Tipo.Id) {
        salida.push(pilaOperadores.pop());
      }
    }
  }

  while (!pilaOperadores.estaVacia()) {
    salida.push(pilaOperadores.pop());
  }

  return salida;
}

const construirArbol = (arregloNpi = []) => {
  if (arregloNpi.length <= 0) {
    return new ArbolSintactico();
  }

  if (arregloNpi.length <= 1) {
    return new ArbolSintactico(arregloNpi.pop());
  }

  // Padre
  const arbol = new ArbolSintactico(arregloNpi.pop());

  // Hijos
  for (let numArgumento = 0; numArgumento < arbol.token.numArgumentos; numArgumento++) {
    const tokenActual = arregloNpi[arregloNpi.length - 1]; 

    if (tokenActual.esOperador()) {
      arbol.hijos.unshift(construirArbol(arregloNpi));
    } else {
      arbol.hijos.unshift(new ArbolSintactico(arregloNpi.pop()));
    }
  }

  return arbol;
}
