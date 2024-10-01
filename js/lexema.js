/**
 * Contiene la definición de tipos y expresiones regulares de los lexemas.
 * @namespace Lexema
 */

/**
 * Contiene definiciones de los tipos de lexemas.
 * @typedef {Object.<string, string>} Lexema.Tipo
 * @memberof Lexema
 */

/**
 * Contiene expresiones regulares de los lexemas.
 * @typedef {Object.<string, RegExp>} Lexema.Regex
 * @memberof Lexema
 */

export const Lexema = {
  /**
   * Definiciones de tipos de lexemas.
   */
  Tipo: {
    Funcion: "funcion",
    Reservada: "palabra reservada",
    Logico: "operador lógico",
    Booleano: "literal booleana",
    Nada: "nada",
    Id: "identificador",
    Flotante: "literal numérico flotante",
    Entero: "literal numérico entero",
    Comentario: "comentario",
    Cadena: "literal de cadena",
    Comparacion: "operador de comparación",
    Aritmetico: "operador aritmético",
    MenosUnario: "menos unario",
    Asignacion: "operador de asignación",
    Delimitador: "delimitador",
    ParentesisApertura: "paréntesis de apertura",
    ParentesisCierre: "paréntesis de cierre",
    CorcheteApertura: "corchete de apertura",
    CorcheteCierre: "corchete de cierre",
    LlaveApertura: "llave de apertura",
    LlaveCierre: "llave de cierre",
    FinDeArchivo: "fin de archivo",
    Error: "error",
    Ilegal: "ilegal"
  },

  /**
   * Expresiones regulares de los lexemas.
   */
  Regex: {
    Funcion: /^(equipo|imprimir|entrada|suma|longitud|lista|cadena|rango|cremallera|flotante|entero|rebanada|redondear|tupla|tipo|ordenado|potencia|conjunto)\b/,
    Reservada: /^(si|osi|sino|para|en)/,
    Logico: /^(O|Y|NO)/,
    Booleano: /^(Verdadero|Falso)/,
    Nada: /^Nada/,
    Id: /^[a-zA-Z_][a-zA-Z0-9_]*/,
    Flotante: /^[0-9]+\.[0-9]+/,
    Entero: /^[0-9]+/,
    Comentario: /^(#.*|("""[\s\S]*?""")|('''[\s\S]*?'''))/,
    Cadena: /^(['"][^'"]*['"])/,
    Comparacion: /^(==|!=|>=|<=|>|<)/,
    Aritmetico: /^(\*\*|\+|-|\*|\/|%)/,
    Asignacion: /^=/,
    Delimitador: /^(:|;|\.|,)/,
    ParentesisApertura: /^\(/,
    ParentesisCierre: /^\)/,
    CorcheteApertura: /^\[/,
    CorcheteCierre: /^\]/,
    LlaveApertura: /^\{/,
    LlaveCierre: /^\}/
  },

  /**
   * Obtiene el tipo de lexema de una cadena.
   * @param {string} cadena - La cadena a analizar.
   * @returns {string} El tipo de lexema de la cadena. Si no se encuentra un lexema válido, retorna un lexema ilegal.
   */
  obtenerTipo: (cadena) => {
    for (const [tipo, regex] of Object.entries(Lexema.Regex)) {
      if (regex.test(cadena)) {
        return Lexema.Tipo[tipo];
      }
    }

    return Lexema.Tipo.Ilegal;
  }
}
