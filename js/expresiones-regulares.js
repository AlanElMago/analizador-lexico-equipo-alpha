export const Tipo = {
  Id: "identificador",
  Numero: "número",
  Literal: "literal",
  Comparacion: "operación de comparación"
}

export const Regexs = {
  Id: /^[a-zA-Z_][a-zA-Z0-9_]*/,
  Numero: /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/,
  Literal: /^(['"])(.*?)(\1)|("""(.*?)""")|('''(.*?)''')/,
  Comparacion: /^(==|!=|>=|<=)/
}

export const esId = (token) => Regexs.Id.test(token);
export const esNumero = (token) => Regexs.Numero.test(token);
export const esLiteral = (token) => Regexs.Literal.test(token);
export const esComparacion = (token) => Regexs.Comparacion.test(token);

export const obtenerTipoSimbolo = (token) => {
  if (esId(token)) {
    return Tipo.Id;
  }
  
  if (esNumero(token)) {
    return Tipo.Numero;
  }
  
  if (esLiteral(token)) {
    return Tipo.Literal;
  }
  
  if (esComparacion(token)) {
    return Tipo.Comparacion;
  }

  return token;
}
