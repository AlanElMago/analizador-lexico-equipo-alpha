import { Token } from "./token.js";

export class ArbolSintactico {
  constructor(token = new Token()) {
    this.token = token;
    this.hijos = [];
  }
}

// Padre, Izquierda a Derecha
export const generarNotacionPolaca = (arbol, cadena = "") => {
  if (arbol == null) {
    return cadena;
  }

  // Padre
  cadena += arbol.token.valor + " ";

  // Izquierda a Derecha
  arbol.hijos.forEach(hijo => cadena = generarNotacionPolaca(hijo, cadena));

  return cadena;
}

// Izquierda a Derecha, Padre
export const generarNotacionPolacaInversa = (arbol, cadena = "") => {
  if (arbol == null) {
    return cadena;
  }

  // Izquierda a Derecha
  arbol.hijos.forEach(hijo => cadena = generarNotacionPolacaInversa(hijo, cadena));

  // Padre
  cadena += arbol.token.valor + " ";

  return cadena;
}
