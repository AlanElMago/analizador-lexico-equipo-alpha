export const Lexema = {
  Tipo: {
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
    Asignacion: "operador de asignación",
    Delimitador: "delimitador",
    ParentesisApertura: "paréntesis de apertura",
    ParentesisCierre: "paréntesis de cierre",
    CorcheteApertura: "corchete de apertura",
    CorcheteCierre: "corchete de cierre",
    LlaveApertura: "llave de apertura",
    LlaveCierre: "llave de cierre",
    Ilegal: "ilegal"
  },

  Regex: {
    Reservada: /^(equipo|imprimir|entrada|si|osi|sino|para|en|mientras|suma|longitud|lista|cadena|rango|cremallera|flotante|entero|rebanada|redondear|tupla|tipo|ordenado|potencia|conjunto)/,
    Logico: /^(y|o|no)/,
    Booleano: /^(Verdadero|Falso)/,
    Nada: /^Nada/,
    Id: /^[a-zA-Z_][a-zA-Z0-9_]*/,
    Flotante: /^[0-9]+\.[0-9]+/,
    Entero: /^[0-9]+/,
    Comentario: /^(#.*|("""[\s\S]*?""")|('''[\s\S]*?'''))/,
    Cadena: /^(['"][^'"]*['"])/,
    Comparacion: /^(==|!=|>=|<=|>|<)/,
    Aritmetico: /^(\+|-|\*|\/|%)/,
    Asignacion: /^=/,
    Delimitador: /^(:|;|\.|,)/,
    ParentesisApertura: /^\(/,
    ParentesisCierre: /^\)/,
    CorcheteApertura: /^\[/,
    CorcheteCierre: /^\]/,
    LlaveApertura: /^\{/,
    LlaveCierre: /^\}/
  },

  obtenerTipo: (token) => {
    for (const tipo in Lexema.Tipo) {
      if (Lexema.Regex[tipo].test(token)) {
        return Lexema.Tipo[tipo];
      }
    }

    return Lexema.Tipo.Ilegal;
  }
}
