import { generarMensajeErrorSintaxis } from "./analizador-maestro.js";
import { obtenerTipoSimbolo } from "../expresiones-regulares.js";
import { Tipo } from "../expresiones-regulares.js";


export const instruccion20 = (tokens) => {
    const simbolosEsperados = [
      ["conjunto"],                         // Token 0
      ["="],                                // Token 1
      ["set"],                              // Token 2
      ["("],                                // Token 3
      [Tipo.Id],                            // Token 4
      [ ")"],                               // Token 5

    ];
    // Token 0
    let textoSalida = [`${tokens[0]}: nombre de la instrucción`];

    //Token 1
    if (!simbolosEsperados[1].includes(obtenerTipoSimbolo(tokens[1]))) {
      textoSalida.push(generarMensajeErrorSintaxis(tokens[1], simbolosEsperados[2]));
      
          return textoSalida;
        }
      
        textoSalida.push(`${tokens[1]}: signo de igualdad para especificar a que es equivalente el conjunto`);

    //Token 2
    if (!simbolosEsperados[2].includes(tokens[2])) {
        textoSalida.push(generarMensajeErrorSintaxis(tokens[2], simbolosEsperados[2]));
    
        return textoSalida;
      }
    
      textoSalida.push(`${tokens[2]}: palabra reservada de la función seguida por paréntesis`);

    //Token 3
      if (!simbolosEsperados[3].includes(obtenerTipoSimbolo(tokens[3]))) {
        textoSalida.push(generarMensajeErrorSintaxis(tokens[3], simbolosEsperados[3]));
    
        return textoSalida;
      }
      
      textoSalida.push(`${tokens[3]}: paréntesis de apertura de la instrucción`);
    //Token 4
    if (!simbolosEsperados[4].includes(tokens[4])) {
        textoSalida.push(generarMensajeErrorSintaxis(tokens[4], simbolosEsperados[4]));
    
        return textoSalida;
      }
      textoSalida.push(`${tokens[4]}: un objeto que se pueda iterar, como una lista, cadena, rango, tupla, diccionario, etc. `);
      
    //Token 5
    if (!simbolosEsperados[5].includes(obtenerTipoSimbolo(tokens[5]))) {
        textoSalida.push(generarMensajeErrorSintaxis(tokens[5], simbolosEsperados[5]));
    
        return textoSalida;
      }
    
      textoSalida.push(`${tokens[5]}: paréntesis de cierre de la instrucción`);
    
      return textoSalida;
}