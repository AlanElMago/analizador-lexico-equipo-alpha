import { generarMensajeErrorSintaxis } from "./analizador-maestro.js";
import { obtenerTipoSimbolo } from "../expresiones-regulares.js";
import { Tipo } from "../expresiones-regulares.js";

export const instruccion04 = (tokens) => {
  const sintaxisValida = [
    ["para"],                // Token 0
    [Tipo.Id],               // Token 1
    ["en"],                  // Token 2
    [Tipo.Id, Tipo.Literal], // Token 3
    [":"]                    // Token 4
  ];

  // Token 0
  let lineasTexto = [`${tokens[0]}: nombre de la instrucción`];

  // Token 1
  if (!sintaxisValida[1].includes(obtenerTipoSimbolo(tokens[1]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[1], sintaxisValida[1]));

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[1]}: variable de control del ciclo`);

  // Token 2
  if (!sintaxisValida[2].includes(tokens[2])) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[2], sintaxisValida[2]));

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[2]}: palabra reservada para indicar el inicio del rango`);

  // Token 3
  if (!sintaxisValida[3].includes(obtenerTipoSimbolo(tokens[3]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[3], sintaxisValida[3]));

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[3]}: la secuencia de valores que tomará la variable de control (${obtenerTipoSimbolo(tokens[3])})`);

  // Token 4
  if (!sintaxisValida[4].includes(obtenerTipoSimbolo(tokens[4]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[4], sintaxisValida[4]));

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[4]}: fin de la instrucción`);

  return lineasTexto;
}
