import { generarMensajeErrorSintaxis } from "./analizador-maestro.js";
import { obtenerTipoSimbolo } from "../expresiones-regulares.js";
import { Tipo } from "../expresiones-regulares.js";

export const instruccion05 = (tokens) => {
  const sintaxisValida = [
    ["mientras"],                // Token 0
    [":", Tipo.Id, Tipo.Numero], // Token 1
    [":", Tipo.Comparacion],     // Token 2
    [Tipo.Id, Tipo.Numero],      // Token 3
    [":"]                        // Token 4
  ];

  // Token 0
  let lineasTexto = [`${tokens[0]}: nombre de la instrucción`];

  // Token 1
  if (!sintaxisValida[1].includes(obtenerTipoSimbolo(tokens[1]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[1], sintaxisValida[1]));

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[1]}: el símbolo para evaluar (${obtenerTipoSimbolo(tokens[1])})`);

  // Token 2
  if (!sintaxisValida[2].includes(obtenerTipoSimbolo(tokens[2]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[2], sintaxisValida[2]));

    return lineasTexto;
  }

  if (obtenerTipoSimbolo(tokens[2]) === ":") {
    lineasTexto.push(`${tokens[2]}: fin de la instrucción`);

    return lineasTexto;
  }

  lineasTexto[1] = `${tokens[1]}: el primer símbolo para comparar (${obtenerTipoSimbolo(tokens[1])})`;
  lineasTexto.push(`${tokens[2]}: operación de comparación`);

  // Token 3
  if (!sintaxisValida[3].includes(obtenerTipoSimbolo(tokens[3]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[3], sintaxisValida[3]));

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[3]}: el segundo símbolo para comparar (${obtenerTipoSimbolo(tokens[3])})`);

  // Token 4
  if (!sintaxisValida[4].includes(obtenerTipoSimbolo(tokens[4]))) {
    lineasTexto.push(generarMensajeErrorSintaxis(tokens[4], sintaxisValida[4]));

    return lineasTexto;
  }

  lineasTexto.push(`${tokens[4]}: fin de la instrucción`);

  return lineasTexto;
}
