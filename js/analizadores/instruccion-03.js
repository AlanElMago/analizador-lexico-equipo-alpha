import { generarMensajeErrorSintaxis } from "./analizador-maestro.js";
import { obtenerTipoSimbolo } from "../expresiones-regulares.js";
import { Tipo } from "../expresiones-regulares.js";

export const instruccion03 = (tokens) => {
  const simbolosEsperados = [
    ["si", "osi", "sino"],       // Token 0
    [":", Tipo.Id, Tipo.Numero], // Token 1
    [":", Tipo.Comparacion],     // Token 2
    [Tipo.Id, Tipo.Numero],      // Token 3
    [":"]                        // Token 4
  ];

  // Token 0
  let textoSalida = [`${tokens[0]}: nombre de la instrucción`];

  // Token 1
  if (!simbolosEsperados[1].includes(obtenerTipoSimbolo(tokens[1]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[1], simbolosEsperados[1]));

    return textoSalida;
  }

  if (tokens[1] === ":") {
    textoSalida.push(tokens[0] === "sino"
      ? `${tokens[1]}: fin de la instrucción`
      : generarMensajeErrorSintaxis(tokens[1], [":"]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[1]}: el símbolo para evaluar (${obtenerTipoSimbolo(tokens[1])})`);

  // Token 2
  if (!simbolosEsperados[2].includes(obtenerTipoSimbolo(tokens[2]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[2], simbolosEsperados[2]));

    return textoSalida;
  }

  if (obtenerTipoSimbolo(tokens[2]) === ":") {
    textoSalida.push(`${tokens[2]}: fin de la instrucción`);

    return textoSalida;
  }

  textoSalida[1] = `${tokens[1]}: el primer símbolo para comparar (${obtenerTipoSimbolo(tokens[1])})`;
  textoSalida.push(`${tokens[2]}: operación de comparación`);

  // Token 3
  if (!simbolosEsperados[3].includes(obtenerTipoSimbolo(tokens[3]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[3], simbolosEsperados[3]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[3]}: el segundo símbolo para comparar (${obtenerTipoSimbolo(tokens[3])})`);

  // Token 4
  if (!simbolosEsperados[4].includes(obtenerTipoSimbolo(tokens[4]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[4], simbolosEsperados[4]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[4]}: fin de la instrucción`);

  return textoSalida;
}
