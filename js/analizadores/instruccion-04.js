import { generarMensajeErrorSintaxis } from "./analizador-maestro.js";
import { obtenerTipoSimbolo } from "../expresiones-regulares.js";
import { Tipo } from "../expresiones-regulares.js";

export const instruccion04 = (tokens) => {
  const simbolosEsperados = [
    ["para"],                // Token 0
    [Tipo.Id],               // Token 1
    ["en"],                  // Token 2
    [Tipo.Id, Tipo.Literal], // Token 3
    [":"]                    // Token 4
  ];

  // Token 0
  let textoSalida = [`${tokens[0]}: nombre de la instrucción`];

  // Token 1
  if (!simbolosEsperados[1].includes(obtenerTipoSimbolo(tokens[1]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[1], simbolosEsperados[1]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[1]}: variable de control del ciclo`);

  // Token 2
  if (!simbolosEsperados[2].includes(tokens[2])) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[2], simbolosEsperados[2]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[2]}: palabra reservada para indicar el inicio del rango`);

  // Token 3
  if (!simbolosEsperados[3].includes(obtenerTipoSimbolo(tokens[3]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[3], simbolosEsperados[3]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[3]}: la secuencia de valores que tomará la variable de control (${obtenerTipoSimbolo(tokens[3])})`);

  // Token 4
  if (!simbolosEsperados[4].includes(obtenerTipoSimbolo(tokens[4]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[4], simbolosEsperados[4]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[4]}: fin de la instrucción`);

  return textoSalida;
}
