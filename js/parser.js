import { Lexema } from "./lexema.js";
import { Token } from "./token.js";

export class Parser {
  constructor(scanner) {
    this.scanner = scanner;
    this.lineas = [];
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
    if (tokenActual.tipo === Lexema.Tipo.Id && this.scanner.obtenerToken(0).valor === "=") {
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
   */
  parsearLlamadaFuncion = (tokenActual) => {
      tokenActual = this.consumirToken(tokenActual); // <IdFuncion>

      if (tokenActual.tipo !== Lexema.Tipo.ParentesisApertura) {
        this.generarMensajeError(`ErrorSintaxis: Se esperaba un paréntesis de apertura (columna ${tokenActual.columna})`, tokenActual);

        return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
      }

      tokenActual = this.consumirToken(tokenActual); // "("

      if (tokenActual.tipo === Lexema.Tipo.ParentesisCierre) {
        tokenActual = this.consumirToken(tokenActual); // ")"

        return tokenActual;
      }

      tokenActual = this.parsearListaArgumentos(tokenActual); // <ListaArgumentos>

      if (tokenActual.tipo !== Lexema.Tipo.ParentesisCierre) {
        this.generarMensajeError(`ErrorSintaxis: Se esperaba un paréntesis de cierre o una coma. Se encontró '${tokenActual.valor}' (columna ${tokenActual.columna})`, tokenActual);

        return new Token(Lexema.Tipo.Error, "Error", tokenActual.columna);
      }

      tokenActual = this.consumirToken(tokenActual); // ")"

      return tokenActual;
  };

  /*
   * Gramática:
   * <ListaArgumentos> -> <Expresion> | <Expresion> "," <ListaArgumentos>
   */
  parsearListaArgumentos = (tokenActual) => {
    tokenActual = this.parsearExpresion(tokenActual); // <Expresion>

    if (tokenActual.valor === ",") {
      tokenActual = this.consumirToken(tokenActual); // ","

      return this.parsearListaArgumentos(tokenActual); // <ListaArgumentos>
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
