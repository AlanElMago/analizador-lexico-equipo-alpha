import { generarMensajeErrorSintaxis } from "./analizador-maestro.js";
import { obtenerTipoSimbolo } from "../expresiones-regulares.js";
import { Tipo } from "../expresiones-regulares.js";

export const instruccion19 = (tokens) => {
    const simbolosEsperados = [
      ["potencia"],           // Token 0
      ["("],                  // Token 1
      [Tipo.Numero],          // Token 2
      [","],                  // Token 3
      [Tipo.Numero],          // Token 4
      [",", ")"],             // Token 5
      [Tipo.Numero],          // Token 6
      [")"]                   // Token 7
    ];

    // Token 0
    let textoSalida = [`${tokens[0]}: nombre de la instrucción`];

   // Token 1
    if (!simbolosEsperados[1].includes(obtenerTipoSimbolo(tokens[1]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[1], simbolosEsperados[1]));

    return textoSalida;
  }
  
  textoSalida.push(`${tokens[1]}: paréntesis de apertura de la instrucción`);
  
  //Token 2
  if (!simbolosEsperados[2].includes(obtenerTipoSimbolo(tokens[2]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[2], simbolosEsperados[2]));

    return textoSalida;
  }
  textoSalida.push(`${tokens[2]}: primer argumento de la instrucción, el número que se va a elevar`);

  // Token 3
    if (!simbolosEsperados[3].includes(obtenerTipoSimbolo(tokens[3]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[3], simbolosEsperados[3]));

    return textoSalida;
  }
  textoSalida.push(`${tokens[3]}: delimitador para separar los argumentos de la instrucción`);

  //Token 4
  if (!simbolosEsperados[4].includes(obtenerTipoSimbolo(tokens[4]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[4], simbolosEsperados[4]));

    return textoSalida;
  }
  textoSalida.push(`${tokens[4]}: segundo argumento de la instrucción y la potencia a la que se va a elevar ese número llamado exponente`);

  // Token 5
  if (!simbolosEsperados[5].includes(obtenerTipoSimbolo(tokens[5]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[5], simbolosEsperados[5]));

    return textoSalida;
  }

  if (obtenerTipoSimbolo(tokens[5]) === ")") {
    textoSalida.push(`${tokens[5]}: paréntesis de cierre de la instrucción`);

    return textoSalida;
  }
  textoSalida.push(`${tokens[5]}: es el delimitador para separar los argumentos de la instruccion`);
  
  //Token 6
  if (!simbolosEsperados[6].includes(obtenerTipoSimbolo(tokens[6]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[6], simbolosEsperados[6]));

    return textoSalida;
  }
  textoSalida.push(`${tokens[6]}: tercer y último argumento de la instrucción, es el valor módulo utilizado para obtener el resultado final`);

  //Token 7
if (!simbolosEsperados[7].includes(obtenerTipoSimbolo(tokens[7]))) {
    textoSalida.push(generarMensajeErrorSintaxis(tokens[7], simbolosEsperados[7]));

    return textoSalida;
  }

  textoSalida.push(`${tokens[7]}: paréntesis de cierre de la instrucción`);

  return textoSalida;
  }

