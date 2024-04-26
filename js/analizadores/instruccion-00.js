export const instruccion00 = (tokens) => {
  let texto = `${tokens[0]}: nombre de la instrucción\n`;

  if (tokens[1] !== "(") {
    return `${texto}Error de sintaxis: se esperaba '('\n`;
  }

  texto += `${tokens[1]}: paréntesis de apertura de la instrucción\n`;

  if (tokens[2] !== ")") {
    return `${texto}Error de sintaxis: se esperaba ')'\n`;
  }

  texto += `${tokens[2]}: paréntesis de cierre de la instrucción\n`;

  return texto;
}
