import { generarMensajeErrorSintaxis } from "./analizador-maestro.js";
import { obtenerTipoSimbolo } from "../expresiones-regulares.js";

export const instruccion00 = (tokens) => {
  const sintaxisValida = [
    ["equipo"], // Token 0
    ["("],      // Token 1
    [")"]       // Token 2
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

  lineasTexto.push(`${tokens[2]}: paréntesis de cierre de la instrucción`);

  return lineasTexto;
}
