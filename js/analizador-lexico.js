import { Lexema } from "./lexema.js";
import { tokenizar } from "./tokenizador.js"

export const analizar = (texto) => {
  let generarMensajeErrorSintaxis = (token) => {
    if (token.valor === '"' || token.valor === "'") {
      return `Error de sintaxis (columna ${token.columna}): literal de cadena no terminada`;
    }

    return `Error de sintaxis (columna ${token.columna}): sintaxis inválida (caracter inesperado '${token.valor}')`;
  }

  let tokens = tokenizar(texto);
  let lineas = [];

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    let linea = `${token.valor} - Tipo: ${token.tipo}, Columna: ${token.columna}`;

    if (token.tipo === Lexema.Tipo.Ilegal) {
      lineas.push(generarMensajeErrorSintaxis(token));

      break;
    }

    lineas.push(linea);
  }

  let dosPuntosObligatorio = /^(si|osi|sino|mientras|para)/.test(tokens[0].valor);
  if (dosPuntosObligatorio && tokens[tokens.length - 1].valor !== ':') {
    lineas.push(`Error de sintaxis (columna ${tokens[0].columna}): se esperaba ':'`);
  }

  return lineas;
}
