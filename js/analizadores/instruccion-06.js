import { generarMensajeErrorSintaxis } from "./analizador-maestro.js";
import { obtenerTipoSimbolo } from "../expresiones-regulares.js";
import { Tipo } from "../expresiones-regulares.js";

export const instruccion06 = (tokens) => {
  const sintaxisValida = [
    ["suma"],               // Token 0
    ["("],                  // Token 1
    [Tipo.Id],              // Token 2
    [",", ")"],             // Token 3
    [Tipo.Id, Tipo.Numero], // Token 4
    [")"]                   // Token 5
  ];

  // Token 0
  let lineasTexto = [`${tokens[0]}: nombre de la instrucción`];

  // Token 1
  if (!sintaxisValida[1].includes(obtenerTipoSimbolo(tokens[1]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[1], sintaxisValida[1]));

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[1]}: paréntesis de apertura de la instrucción`);

  // Token 2
  if (!sintaxisValida[2].includes(obtenerTipoSimbolo(tokens[2]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[2], sintaxisValida[2]));

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[2]}: primer argumento de la instrucción (${obtenerTipoSimbolo(tokens[2])}). Secuencia numérica para sumar`);

  // Token 3
  if (!sintaxisValida[3].includes(obtenerTipoSimbolo(tokens[3]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[3], sintaxisValida[3]));

    return lineasTexto;
  }

  if (obtenerTipoSimbolo(tokens[3]) === ")") {
    lineasTexto.push(`${tokens[3]}: paréntesis de cierre de la instrucción`);

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[3]}: delimitador para separar los argumentos de la instrucción`);

  // Token 4
  if (!sintaxisValida[4].includes(obtenerTipoSimbolo(tokens[4]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[4], sintaxisValida[4]));

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[4]}: segundo argumento de la instrucción (${obtenerTipoSimbolo(tokens[4])}). Valor inicial para la suma`);

  // Token 5
  if (!sintaxisValida[5].includes(obtenerTipoSimbolo(tokens[5]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[5], sintaxisValida[5]));

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[5]}: paréntesis de cierre de la instrucción`);

  return lineasTexto;
}