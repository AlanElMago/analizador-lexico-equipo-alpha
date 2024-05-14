import { generarMensajeErrorSintaxis } from "./analizador-maestro.js";
import { obtenerTipoSimbolo } from "../expresiones-regulares.js";
import { Tipo } from "../expresiones-regulares.js";

export const instruccion08 = (tokens) => { 
    const simbolosEsperados = [
        ["lista"],                      // Token 0
        ["("],                          // Token 1
        [")", Tipo.Id, Tipo.Literal],   // Token 2
        [")"]                           // Token 3
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

    if (obtenerTipoSimbolo(tokens[2]) === ")") {
        textoSalida.push(`${tokens[2]}: paréntesis de cierre de la instrucción`);
    
        return textoSalida;
    }

    textoSalida.push(`${tokens[2]}: argumento de la instrucción (${obtenerTipoSimbolo(tokens[2])}). Secuencia que se desea convertir en lista`);

    // Token 3
    if (!simbolosEsperados[3].includes(obtenerTipoSimbolo(tokens[3]))) {
        textoSalida.push(generarMensajeErrorSintaxis(tokens[3], simbolosEsperados[3]));
    
        return textoSalida;
    }

    textoSalida.push(`${tokens[3]}: paréntesis de cierre de la instrucción`);

    return textoSalida;
}