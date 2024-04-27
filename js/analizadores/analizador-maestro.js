import { tokenizar } from '../tokenizador.js';

import { instruccion00 } from './instruccion-00.js';
import { instruccion01 } from './instruccion-01.js';
import { instruccion02 } from './instruccion-02.js';
import { instruccion03 } from './instruccion-03.js';
import { instruccion04 } from './instruccion-04.js';
import { instruccion05 } from './instruccion-05.js';
import { instruccion06 } from './instruccion-06.js';
// import { instruccion07 } from './instruccion-07.js';
// import { instruccion08 } from './instruccion-08.js';
// import { instruccion09 } from './instruccion-09.js';
// import { instruccion10 } from './instruccion-10.js';
// import { instruccion11 } from './instruccion-11.js';
// import { instruccion12 } from './instruccion-12.js';
// import { instruccion13 } from './instruccion-13.js';
// import { instruccion14 } from './instruccion-14.js';
// import { instruccion15 } from './instruccion-15.js';
// import { instruccion16 } from './instruccion-16.js';
// import { instruccion17 } from './instruccion-17.js';
// import { instruccion18 } from './instruccion-18.js';
// import { instruccion19 } from './instruccion-19.js';
// import { instruccion20 } from './instruccion-20.js';

export const analizar = (texto) => {
  const tokens = tokenizar(texto);

  if (tokens.length === 0) {
    return;
  }

  const nombre_instruccion = tokens[0];

  switch (nombre_instruccion) {
    case "equipo":
      return instruccion00(tokens);
    case "imprimir":
      return instruccion01(tokens);
    case "entrada":
      return instruccion02(tokens);
    case "si":
    case "osi":
    case "sino":
      return instruccion03(tokens);
    case "para":
      return instruccion04(tokens);
    case "mientras":
      return instruccion05(tokens);
    case "suma":
      return instruccion06(tokens);
    case "longitud":
      // return instruccion07(tokens);
    case "lista":
      // return instruccion08(tokens);
    case "cadena":
      // return instruccion09(tokens);
    case "rango":
      // return instruccion10(tokens);
    case "cremallera":
      // return instruccion11(tokens);
    case "flotante":
      // return instruccion12(tokens);
    case "entero":
      // return instruccion13(tokens);
    case "rebanada":
      // return instruccion14(tokens);
    case "redondear":
      // return instruccion15(tokens);
    case "tupla":
      // return instruccion16(tokens);
    case "tipo":
      // return instruccion17(tokens);
    case "ordenado":
      // return instruccion18(tokens);
    case "potencia":
      // return instruccion19(tokens);
    case "conjunto":
      // return instruccion20(tokens);
    default:
      return `Símbolo no reconocido: ${nombre_instruccion}`;
  }
}

export const generarMensajeErrorSintaxis = (tokenActual, tokensValidos) => {
  return `Error de sintaxis: se esperaba uno de los siguientes símbolos: ${tokensValidos.join(", ")}. Símbolo encontrado: ${tokenActual}`;
}
