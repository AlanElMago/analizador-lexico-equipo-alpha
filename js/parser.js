import { ArbolSintactico } from "./arbol_sintactico.js";
import { Lexema } from "./lexema.js";
import { Token } from "./token.js";

export class Paarser {
  constructor(scanner) {
    this.scanner = scanner;
    this.errores = [];
    this.tokenActual = new Token();
  };

  // Retorna el arbol sintactico
  parsear = () => {
    // TODO: validar reglas de producción primero

    if (this.hayErrores()) {
      const tokenError = new Token(Lexema.Tipo.Error, "ErrorSintaxis");

      return new ArbolSintactico(tokenError);
    }

    const arregloRpn = construirArregloRpn(this);

    return construirArbol(arregloRpn);
  };

  consumirToken = () => {
    if (this.tokenActual.tipo === Lexema.Tipo.FinDeArchivo) {
      return;
    }

    this.tokenActual = this.scanner.siguienteToken();
  };

  hayErrores = () => this.errores.length > 0;
};

// La precedencia se maneja de manera invertida. Es decir, entre menor el nivel de precedencia de un operador, mayor
// será su prioridad.
//
// Por ejemplo: la multipicación se hace antes que la suma por que el nivel de precedencia de la multipicación es 0 y
// el nivel de precedencia de la suma es 1.
const tablaPrecedencia = [
  // Nivel de precedencia: 0
  // Multiplicación, División, Módulo
  [ new Token(Lexema.Tipo.Aritmetico, "*"),
    new Token(Lexema.Tipo.Aritmetico, "/"),
    new Token(Lexema.Tipo.Aritmetico, "%") ],

  // Nivel de precedencia: 1
  // Suma, Resta
  [ new Token(Lexema.Tipo.Aritmetico, "+"),
    new Token(Lexema.Tipo.Aritmetico, "-") ],

  // Nivel de precedencia: 2
  // Menor que, Menor o igual que
  // Mayor que, Mayor o igual que
  [ new Token(Lexema.Tipo.Comparacion,  "<"),
    new Token(Lexema.Tipo.Comparacion, "<="),
    new Token(Lexema.Tipo.Comparacion,  ">"),
    new Token(Lexema.Tipo.Comparacion, ">=") ],
  
  // Nivel de precedencia: 3
  // Igual a, No igual a
  [ new Token(Lexema.Tipo.Comparacion, "=="),
    new Token(Lexema.Tipo.Comparacion, "!=") ],
  
  // Nivel de precedencia: 4
  // And Lógico
  [ new Token(Lexema.Tipo.Logico, "Y") ],

  // Nivel de precedencia: 5
  // Or Lógico
  [ new Token(Lexema.Tipo.Logico, "O") ],

  // Nivel de precedencia: 6
  // Asignación
  [ new Token(Lexema.Tipo.Asignacion, "=") ],
]

class Operador {
  constructor(token, nivelPrecedencia) {
    this.token = token;
    this.nivelPrecedencia = nivelPrecedencia;
  }
}

class PilaOperadores {
  constructor() {
    this.arreglo = [];
  }

  push = (token) => this.arreglo.push(new Operador(token, obtenerNivelPrecedenciaToken(token)));

  pop = () => this.arreglo.pop();

  mirarTope = () => this.arreglo[this.arreglo.length - 1];

  estaVacia = () => this.arreglo.length <= 0;
}

const obtenerNivelPrecedenciaToken = (token) => {
  let nivelPrecedencia = -1;

  tablaPrecedencia.forEach((operadores, nivel) => {
    operadores.forEach(operador => {
      if (token.tipo === operador.tipo && token.valor === operador.valor) {
        nivelPrecedencia = nivel;
      }
    });
  });

  return nivelPrecedencia;
}

// Shunting yard algorithm (modificado por Alan Franco)
// https://en.wikipedia.org/wiki/Shunting_yard_algorithm
const construirArregloRpn = (parser) => {
  const arreglo = [];
  const pilaOperadores = new PilaOperadores();

  // while there are tokens to be read
  while (parser.tokenActual.tipo !== Lexema.Tipo.FinDeArchivo)
  {
    // read a token
    parser.consumirToken();

    // if the token is:
    // - a number or identifier
    if ( parser.tokenActual.tipo === Lexema.Tipo.Entero
      || parser.tokenActual.tipo === Lexema.Tipo.Flotante
      || parser.tokenActual.tipo === Lexema.Tipo.Id )
    {
      // put it into the output queue
      arreglo.push(parser.tokenActual);
    }

    // - a function
    // TODO: implement function case

    // - an operator o1:
    else if ( parser.tokenActual.tipo === Lexema.Tipo.Aritmetico
           || parser.tokenActual.tipo === Lexema.Tipo.Asignacion
           || parser.tokenActual.tipo === Lexema.Tipo.Logico
           || parser.tokenActual.tipo === Lexema.Tipo.Comparacion )
    {
      // while (
      //   the operator stack is not empty,
      //   and there is an operator o2 at the top of the operator stack which is not a left parenthesis,
      //   and o2 has less than or equal precedence to o1
      // ):
      while (!pilaOperadores.estaVacia()
        && pilaOperadores.mirarTope().token.tipo !== Lexema.Tipo.ParentesisApertura
        && pilaOperadores.mirarTope().nivelPrecedencia <= obtenerNivelPrecedenciaToken(parser.tokenActual))
      {
        // pop o2 from the operator stack into the output queue
        arreglo.push(pilaOperadores.pop().token)
      }

      // push o1 onto the operator stack
      pilaOperadores.push(parser.tokenActual);
    }

    // - a left parenthisis:
    else if ( parser.tokenActual.tipo === Lexema.Tipo.ParentesisApertura )
    {
      // push it onto the operator stack
      pilaOperadores.push(parser.tokenActual);
    }

    // - a right parenthisis:
    else if ( parser.tokenActual.tipo === Lexema.Tipo.ParentesisCierre )
    {
      // while the operator at the top of the operator stack is not a left parenthesis:
      while (pilaOperadores.mirarTope().token.tipo !== Lexema.Tipo.ParentesisApertura)
      {
        // pop the operator from the operator stack into the output queue
        arreglo.push(pilaOperadores.pop().token);
      }

      // pop the left parenthesis from the operator stack and discard it
      pilaOperadores.pop();

      // TODO: if there is a function token at the top of the operator stack, then:
      //   pop the function from the operator stack into the output queue
    }
  }

  // while there are tokens on the operator stack:
  while (!pilaOperadores.estaVacia())
  {
    // pop the operator from the operator stack onto the output queue
    arreglo.push(pilaOperadores.pop().token);
  }

  return arreglo;
}

const construirArbol = (arregloRpn = []) => {
  if (arregloRpn.length <= 0) {
    return new ArbolSintactico();
  }

  if (arregloRpn.length <= 1) {
    return new ArbolSintactico(arregloRpn.pop());
  }

  // Padre
  const arbol = new ArbolSintactico(arregloRpn.pop());

  // Hijo Derecho
  let tokenActual = arregloRpn[arregloRpn.length - 1]; 

  if (   tokenActual.tipo === Lexema.Tipo.Entero
      || tokenActual.tipo === Lexema.Tipo.Flotante
      || tokenActual.tipo === Lexema.Tipo.Id ) {
    arbol.hijos.unshift(new ArbolSintactico(arregloRpn.pop()));
  } else {
    arbol.hijos.unshift(construirArbol(arregloRpn));
  }

  // Hijo Izquierdo
  tokenActual = arregloRpn[arregloRpn.length - 1]; 

  if (   tokenActual.tipo === Lexema.Tipo.Entero
      || tokenActual.tipo === Lexema.Tipo.Flotante
      || tokenActual.tipo === Lexema.Tipo.Id ) {
    arbol.hijos.unshift(new ArbolSintactico(arregloRpn.pop()));
  } else {
    arbol.hijos.unshift(construirArbol(arregloRpn));
  }
    
  return arbol;
}
