import { InfoFunciones } from "./info_funciones.js";
import { Lexema } from "./lexema.js";
import { Token } from "./token.js";

export class Parser {
  constructor(scanner) {
    this.scanner = scanner;
    this.lineas = [];
    this.contadorFunciones = 0;
    this.contadorArgumentos = {};
  };

  parsear = () => {
    let tokenActual = this.scanner.siguienteToken();

    tokenActual = this.parsearSentencia(tokenActual);

    return this.lineas;
  };

  /*
   * Gramática:
   * <Sentencia> -> <Asignacion> | <Expresion> | <SentenciaSi> | <SentenciaOsi> | <SentenciaSino> | <SentenciaPara> | <SentenciaMientras>
   */
  parsearSentencia = (tokenActual) => {
    if (tokenActual.tipo === Lexema.Tipo.Id && this.scanner.haySiguienteToken() && this.scanner.obtenerToken(0).valor === "=") {
      tokenActual = this.parsearAsignacion(tokenActual);
    } else if (tokenActual.valor === "si") {
      tokenActual = this.parsearSentenciaSi(tokenActual);
    } else if (tokenActual.valor === "osi") {
      tokenActual = this.parsearSentenciaOsi(tokenActual);
    } else if (tokenActual.valor === "sino") {
      tokenActual = this.parsearSentenciaSino(tokenActual);
    } else if (tokenActual.valor === "para") {
      tokenActual = this.parsearSentenciaPara(tokenActual);
    } else if (tokenActual.valor === "mientras") {
      tokenActual = this.parsearSentenciaMientras(tokenActual);
    } else { 
      tokenActual = this.parsearExpresion(tokenActual);
    }

    if (tokenActual.tipo !== Lexema.Tipo.FinDeArchivo) {
      if (tokenActual.tipo === Lexema.Tipo.Asignacion) {
        this.generarMensajeError(`ErrorSintaxis: Solo se permiten asignaciones de variables (columna ${tokenActual.columna})`, tokenActual);
      }
      else{
        this.generarMensajeError(`ErrorSintaxis: Símbolo inesperado '${tokenActual.valor}' (tipo ${tokenActual.tipo}) (columna ${tokenActual.columna})`, tokenActual);
      }

      return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
    }

    return tokenActual;
  };

  /*
   * Gramática:
   * <Asignacion> -> <Id> "=" <Expresion>
   */
  parsearAsignacion = (tokenActual) => {
    tokenActual = this.consumirToken(tokenActual); // <Id>

    // Ya se comprobó que el siguiente token es un signo de igual
    tokenActual = this.consumirToken(tokenActual); // "="

    tokenActual = this.parsearExpresion(tokenActual); // <Expresion>

    return tokenActual;
  };

  /*
   * Gramática:
   * <Expresion> -> <Termino> <OpComparacion> <Expresion> | <Termino> ("+" | "-") <Expresion> | <Termino>
   */
  parsearExpresion = (tokenActual) => {
    tokenActual = this.parsearTermino(tokenActual); // <Termino>

    if (tokenActual.tipo === Lexema.Tipo.Comparacion) {
      tokenActual = this.consumirToken(tokenActual); // <OpComparacion>

      return this.parsearExpresion(tokenActual); // <Expresion>
    }

    if (tokenActual.valor === "+" || tokenActual.valor === "-") {
      tokenActual = this.consumirToken(tokenActual); // "+" | "-"

      return this.parsearExpresion(tokenActual); // <Expresion>
    }

    return tokenActual;
  };

  /*
   * Gramática:
   * <Termino> -> <Factor> ("*" | "/" | "%") <Expresion> | <Factor>
   */
  parsearTermino = (tokenActual) => {
    tokenActual = this.parsearFactor(tokenActual); // <Factor>

    if (tokenActual.valor === "*" || tokenActual.valor === "/" || tokenActual.valor === "%") {
      tokenActual = this.consumirToken(tokenActual); // "*" | "/" | "%"

      return this.parsearExpresion(tokenActual); // <Termino>
    }

    return tokenActual;
  };

  /*
   * Gramática:
   * <Factor> -> <Id> | <Literal> | <LlamadaFuncion> | "(" <Expresion> ")" |
   * <Literal> -> <LiteralBooleano> | <LiteralEntero> | <LiteralFlotante> | <LiteralCadena>
   */
  parsearFactor = (tokenActual) => {
    if (tokenActual.tipo === Lexema.Tipo.Id) {
      tokenActual = this.consumirToken(tokenActual); // <Id>

      return tokenActual;
    }

    if (tokenActual.tipo === Lexema.Tipo.Booleano
        || tokenActual.tipo === Lexema.Tipo.Entero
        || tokenActual.tipo === Lexema.Tipo.Flotante
        || tokenActual.tipo === Lexema.Tipo.Cadena) {
      tokenActual = this.consumirToken(tokenActual); // <Literal>

      return tokenActual;
    }

    if (tokenActual.tipo === Lexema.Tipo.Funcion) {
      tokenActual = this.parsearLlamadaFuncion(tokenActual); // <LlamadaFuncion>

      return tokenActual;
    }

    if (tokenActual.tipo === Lexema.Tipo.ParentesisApertura) {
      tokenActual = this.consumirToken(tokenActual); // "("

      tokenActual = this.parsearExpresion(tokenActual); // <Expresion>

      if (tokenActual.tipo !== Lexema.Tipo.ParentesisCierre) {
        this.generarMensajeError(`ErrorSintaxis: Se esperaba un paréntesis de cierre (columna ${tokenActual.columna})`, tokenActual);

        return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
      }

      tokenActual = this.consumirToken(tokenActual); // ")"

      return tokenActual;
    }

    if (tokenActual.valor === '"' || tokenActual.valor === "'") {
      this.generarMensajeError(`ErrorSintaxis: literal no terminado (columna ${tokenActual.columna})`, tokenActual);

      return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
    }

    if (tokenActual.tipo === Lexema.Tipo.Ilegal) {
      this.generarMensajeError(`ErrorSintaxis: Caracter no válido '${tokenActual.valor}' (columna ${tokenActual.columna})`, tokenActual);

      return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
    }

    this.generarMensajeError(`ErrorSintaxis: Símbolo inesperado '${tokenActual.valor}' (tipo ${tokenActual.tipo}) (columna ${tokenActual.columna})`, tokenActual);

    return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
  };

  /*
   * Gramática:
   * <LlamadaFuncion> -> <IdFuncion> "(" <ListaArgumentos> ")" | <IdFuncion> "(" ")"
   * 
   * Nota: También se encarga de verificar la cantidad de argumentos de las funciones y de proporcionar información sobre las funciones y sus argumentos.
   */
  parsearLlamadaFuncion = (tokenActual) => {
      const nombreFuncion = tokenActual.valor;
      const numFuncion = this.contadorFunciones + 1;
      const minArgumentos = InfoFunciones.NumAgrumentosLimites[nombreFuncion].min;
      const maxArgumentos = InfoFunciones.NumAgrumentosLimites[nombreFuncion].max;

      this.contadorFunciones++;
      this.contadorArgumentos[numFuncion] = 0;

      tokenActual = this.consumirToken(tokenActual); // <IdFuncion>
      this.lineas[this.lineas.length - 1] += ` ### Función (${String.fromCharCode(96 + numFuncion)}) ###`;

      if (tokenActual.tipo !== Lexema.Tipo.ParentesisApertura) {
        this.generarMensajeError(`ErrorSintaxis: Se esperaba un paréntesis de apertura (columna ${tokenActual.columna})`, tokenActual);

        return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
      }

      tokenActual = this.consumirToken(tokenActual); // "("

      if (tokenActual.tipo === Lexema.Tipo.ParentesisCierre) {
        if (minArgumentos > 0) {
          this.generarMensajeError(`ErrorSintaxis: Se esperaba al menos ${minArgumentos} argumento(s) (columna ${tokenActual.columna})`, tokenActual);

          return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
        }

        tokenActual = this.consumirToken(tokenActual); // ")"

        // Mostrar información de la función
        this.lineas.push("")
        this.lineas.push(`----------------Información de la Función (${String.fromCharCode(96 + numFuncion)})--------------------`);
        this.lineas.push(`Función (${nombreFuncion}): ${InfoFunciones.DescFunciones[nombreFuncion]}`);
        this.lineas.push("Sin argumentos.");
        this.lineas.push("-----------------------------------------------------------------");
        this.lineas.push("")

        return tokenActual;
      }

      tokenActual = this.parsearListaArgumentos(tokenActual, minArgumentos, maxArgumentos, numFuncion); // <ListaArgumentos>

      if (tokenActual.tipo !== Lexema.Tipo.ParentesisCierre) {
        this.generarMensajeError(`ErrorSintaxis: Se esperaba un paréntesis de cierre o una coma. Se encontró '${tokenActual.valor}' (columna ${tokenActual.columna})`, tokenActual);

        return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
      }

      tokenActual = this.consumirToken(tokenActual); // ")"

      // Mostrar información de la función
      this.lineas.push("")
      this.lineas.push(`----------------Información de la Función (${String.fromCharCode(96 + numFuncion)})--------------------`);
      this.lineas.push(`Función (${nombreFuncion}): ${InfoFunciones.DescFunciones[nombreFuncion]}`);
      InfoFunciones.DescArgumentos[nombreFuncion][this.contadorArgumentos[numFuncion]].forEach(linea => {
        this.lineas.push(linea); 
      });
      this.lineas.push("-----------------------------------------------------------------");
      this.lineas.push("")

      // this.contadorArgumentos[numFuncion] = 0; // reiniciar contador de argumentos

      return tokenActual;
  };

  /*
   * Gramática:
   * <ListaArgumentos> -> <Expresion> | <Expresion> "," <ListaArgumentos>
   */
  parsearListaArgumentos = (tokenActual, minArgumentos, maxArgumentos, numFuncion) => {
    this.contadorArgumentos[numFuncion]++;
    this.lineas.push(`    ### Argumento ${String.fromCharCode(96 + numFuncion)}${this.contadorArgumentos[numFuncion]} ###`);

    tokenActual = this.parsearExpresion(tokenActual); // <Expresion>

    if (tokenActual.valor === ",") {
      tokenActual = this.consumirToken(tokenActual); // ","

      return this.parsearListaArgumentos(tokenActual, minArgumentos, maxArgumentos, numFuncion); // <ListaArgumentos>
    }

    if (this.contadorArgumentos[numFuncion] > maxArgumentos) {
      this.generarMensajeError(`ErrorSintaxis: Se superó la cantidad máxima de argumentos de la función (columna ${tokenActual.columna})`, tokenActual);

      return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
    }

    if (this.contadorArgumentos[numFuncion] < minArgumentos) {
      this.generarMensajeError(`ErrorSintaxis: Se esperaba al menos ${minArgumentos} argumento(s) (columna ${tokenActual.columna})`, tokenActual);

      return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
    }

    return tokenActual;
  };

  /*
   * Gramática:
   * <SentenciaSi> -> "si" <Expresion> ":"
   */
  parsearSentenciaSi = (tokenActual) => {
    tokenActual = this.consumirToken(tokenActual); // "si"

    tokenActual = this.parsearExpresion(tokenActual); // <Expresion>

    if (tokenActual.valor !== ":") {
      this.generarMensajeError(`ErrorSintaxis: Se esperaba ':'. Se encontró '${tokenActual.valor}' (columna ${tokenActual.columna})`, tokenActual);

      return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
    }

    tokenActual = this.consumirToken(tokenActual); // ":"

    return tokenActual;
  };

  /*
   * Gramática:
   * <SentenciaOsi> -> "osi" <Expresion> ":"
   */
  parsearSentenciaOsi = (tokenActual) => {
    tokenActual = this.consumirToken(tokenActual); // "osi"

    tokenActual = this.parsearExpresion(tokenActual); // <Expresion>

    if (tokenActual.valor !== ":") {
      this.generarMensajeError(`ErrorSintaxis: Se esperaba ':'. Se encontró '${tokenActual.valor}' (columna ${tokenActual.columna})`, tokenActual);

      return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
    }

    tokenActual = this.consumirToken(tokenActual); // ":"

    return tokenActual;
  };

  /*
   * Gramática:
   * <SentenciaSino> -> "sino" ":"
   */
  parsearSentenciaSino = (tokenActual) => {
    tokenActual = this.consumirToken(tokenActual); // "sino"

    if (tokenActual.valor !== ":") {
      this.generarMensajeError(`ErrorSintaxis: Se esperaba ':'. Se encontró '${tokenActual.valor}' (columna ${tokenActual.columna})`, tokenActual);

      return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
    }

    tokenActual = this.consumirToken(tokenActual); // ":"

    return tokenActual;

  };

  /*
   * Gramática:
   * <SentenciaPara> -> "para" <Id> "en" <Expresion> ":"
   */
  parsearSentenciaPara = (tokenActual) => {
    tokenActual = this.consumirToken(tokenActual); // "para"

    tokenActual = this.consumirToken(tokenActual); // <Id>

    if (tokenActual.valor !== "en") {
      this.generarMensajeError(`ErrorSintaxis: Se esperaba 'en'. Se encontró '${tokenActual.valor}' (columna ${tokenActual.columna})`, tokenActual);

      return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
    }

    tokenActual = this.consumirToken(tokenActual); // "en"

    tokenActual = this.parsearExpresion(tokenActual); // <Expresion>

    if (tokenActual.valor !== ":") {
      this.generarMensajeError(`ErrorSintaxis: Se esperaba ':'. Se encontró '${tokenActual.valor}' (columna ${tokenActual.columna})`, tokenActual);

      return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
    }

    tokenActual = this.consumirToken(tokenActual); // ":"

    return tokenActual;
  };

  /*
   * Gramática:
   * <SentenciaMientras> -> "mientras" <Expresion> ":"
   */
  parsearSentenciaMientras = (tokenActual) => {
    tokenActual = this.consumirToken(tokenActual); // "mientras"

    tokenActual = this.parsearExpresion(tokenActual); // <Expresion>

    if (tokenActual.valor !== ":") {
      this.generarMensajeError(`ErrorSintaxis: Se esperaba ':'. Se encontró '${tokenActual.valor}' (columna ${tokenActual.columna})`, tokenActual);

      return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
    }

    tokenActual = this.consumirToken(tokenActual); // ":"

    return tokenActual;
  };

  // Registrar el token actual y obtener el siguiente token del scanner
  consumirToken = (tokenActual) => {
    this.lineas.push(`${tokenActual.valor} - Tipo: ${tokenActual.tipo}, Columna: ${tokenActual.columna}`);

    if (!this.scanner.haySiguienteToken()) {
      return new Token(Lexema.Tipo.FinDeArchivo, "EOF", this.scanner.longitudTexto);
    }

    return this.scanner.siguienteToken();
  };

  generarMensajeError = (mensaje, tokenActual) => {
    if (tokenActual.tipo !== Lexema.Tipo.Error) {
      this.lineas.push(mensaje);
    }
  };
};
