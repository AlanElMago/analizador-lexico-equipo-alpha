import { generarMensajeErrorSintaxis } from "./analizador-maestro.js";
import { obtenerTipoSimbolo } from "../expresiones-regulares.js";
import { Tipo } from "../expresiones-regulares.js";

export const instruccion06 = (tokens) => {
  const simbolosEsperados = [
    ["suma"],               // Token 0
    ["("],                  // Token 1
    [Tipo.Id],              // Token 2
    [",", ")"],             // Token 3
    [Tipo.Id, Tipo.Numero], // Token 4
    [")"]                   // Token 5
  ];

  // Token 0
  let textoSalida = [`${tokens[0]}: nombre de la instrucción`];

  // Token 1
  if (!simbolosEsperados[1].includes(obtenerTipoSimbolo(tokens[1]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[1], simbolosEsperados[1]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[1]}: paréntesis de apertura de la instrucción`);

  // Token 2
  if (!simbolosEsperados[2].includes(obtenerTipoSimbolo(tokens[2]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[2], simbolosEsperados[2]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[2]}: primer argumento de la instrucción (${obtenerTipoSimbolo(tokens[2])}). Secuencia numérica para sumar`);

  // Token 3
  if (!simbolosEsperados[3].includes(obtenerTipoSimbolo(tokens[3]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[3], simbolosEsperados[3]));

    return textoSalida;
  }

  if (obtenerTipoSimbolo(tokens[3]) === ")") {
    textoSalida.push(`${tokens[3]}: paréntesis de cierre de la instrucción`);

    return textoSalida;
  }

  textoSalida.push(`${tokens[3]}: delimitador para separar los argumentos de la instrucción`);

  // Token 4
  if (!simbolosEsperados[4].includes(obtenerTipoSimbolo(tokens[4]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[4], simbolosEsperados[4]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[4]}: segundo argumento de la instrucción (${obtenerTipoSimbolo(tokens[4])}). Valor inicial para la suma`);

  // Token 5
  if (!simbolosEsperados[5].includes(obtenerTipoSimbolo(tokens[5]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[5], simbolosEsperados[5]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[5]}: paréntesis de cierre de la instrucción`);

  return textoSalida;
}
