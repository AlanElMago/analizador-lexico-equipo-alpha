import { esId, esLiteral, esNumero } from "../expresiones-regulares.js";
import { tipoSimbolo } from "../expresiones-regulares.js";

export const instruccion01 = (tokens) => {
  // Token 0
  let texto = `${tokens[0]}: nombre de la instrucción\n`;

  // Token 1
  if (tokens[1] !== "(") {
    return `${texto}Error de sintaxis: se esperaba '('\n`;
  }

  texto += `${tokens[1]}: paréntesis de apertura de la instrucción\n`;

  // Token 2
  if (tokens[2] === ")") {
    texto += `${tokens[2]}: paréntesis de cierre de la instrucción\n`;
    return texto;
  }

  if (!esLiteral(tokens[2]) && !esNumero(tokens[2]) && !esId(tokens[2])) {
    return `${texto}Error de sintaxis: se esperaba un literal, un número o un identificador\n`;
  }

  texto += `${tokens[2]}: primer argumento de la instrucción (${tipoSimbolo(tokens[2])}). `;
  texto += "Mensaje que se imprimirá al usuario.\n";

  // Token 3
  if (tokens[3] !== ")") {
    return `${texto}Error de sintaxis: se esperaba ')'\n`;
  }

  texto += `${tokens[3]}: paréntesis de cierre de la instrucción\n`;

  return texto;
}