export const InfoFunciones = {
  NumAgrumentosLimites: {
    imprimir:   { min: 0, max: 1 },
    entrada:    { min: 0, max: 1 },
    suma:       { min: 1, max: 2 },
    longitud:   { min: 1, max: 1 },
    lista:      { min: 0, max: 1 },
    cadena:     { min: 1, max: 1 },
    rango:      { min: 1, max: 3 },
    cremallera: { min: 2, max: 2 },
    flotante:   { min: 0, max: 1 },
    entero:     { min: 0, max: 1 },
    rebanada:   { min: 1, max: 3 },
    redondear:  { min: 1, max: 2 },
    tupla:      { min: 0, max: 1 },
    tipo:       { min: 1, max: 1 },
    ordenado:   { min: 1, max: 2 },
    potencia:   { min: 2, max: 3 },
    conjunto:   { min: 0, max: 1 }
  },

  DescFunciones: {
    imprimir:   "Muestra un mensaje en la consola.",
    entrada:    "Solicita una entrada al usuario.",
    suma:       "Suma los elementos de una secuencia.",
    longitud:   "Obtiene la longitud de una secuencia.",
    lista:      "Crea una lista a partir de una secuencia.",
    cadena:     "Convierte un objeto a una cadena.",
    rango:      "Genera una secuencia de números enteros.",
    cremallera: "Crea una tupla de tuplas donde la tupla i-ésima contiene el i-ésimo elemento de las dos secuencias.",
    flotante:   "Convierte un valor a flotante.",
    entero:     "Convierte un valor a entero.",
    rebanada:   "Obtiene un conjunto de indices de una secuencia.",
    redondear:  "Redondea un número a una cantidad de decimales dada.",
    tupla:      "Convierte una secuencia a tupla.",
    tipo:       "Obtiene el tipo de un objeto.",
    ordenado:   "Ordena una secuencia.",
    potencia:   "Calcula la potencia de un número.",
    conjunto:   "Convierte una secuencia a conjunto."
  },

  DescArgumentos: {
    imprimir: {
      1: ["Argumento 1 (expresión): expresión o mensaje que se mostrará al usuario."]
    },
    entrada: {
      1: ["Argumento 1 (mensaje): mensaje que se mostrará al usuario."]
    },
    suma: {
      1: ["Argumento 1 (secuencia): secuencia de números que se sumarán."],
      2: ["Argumento 1 (secuencia): secuencia de números que se sumarán.", "Argumento 2 (inicio): valor inicial de la suma."]
    },
    longitud: {
      1: ["Argumento 1 (secuencia): secuencia de la que se obtendrá la longitud."]
    },
    lista: {
      1: ["Argumento 1 (secuencia): secuencia que definirá los elementos de lista."]
    },
    cadena: {
      1: ["Argumento 1 (objeto): objeto que se convertirá a cadena."]
    },
    rango: {
      1: ["Argumento 1 (fin): limite superior del rango (excluyente)."],
      2: ["Argumento 1 (inicio): limite inferior del rango (inclutente).", "Argumento 2 (fin): limite superior del rango (excluyente)."],
      3: ["Argumento 1 (inicio): limite inferior del rango (inclutente).", "Argumento 2 (fin): limite superior del rango (excluyente).", "Argumento 3 (varianza): incremento o decremento del siguiente valor de la secuencia del rango."]
    },
    cremallera: {
      2: ["Argumento 1 (secuencia1): primera secuencia que se combinará.", "Argumento 2 (secuencia2): segunda secuencia que se combinará."]
    },
    flotante: {
      1: ["Argumento 1 (valor): valor que se convertirá a flotante."]
    },
    entero: {
      1: ["Argumento 1 (valor): valor que se convertirá a entero."]
    },
    rebanada: {
      1: ["Argumento 1 (fin): limite superior de la rebanada (excluyente)."],
      2: ["Argumento 1 (inicio): limite inferior de la rebanada (incluyente).", "Argumento 2 (fin): limite superior de la rebanada (excluyente)."],
      3: ["Argumento 1 (inicio): limite inferior de la rebanada (incluyente).", "Argumento 2 (fin): limite superior de la rebanada (excluyente).", "Argumento 3 (varianza): incremento o decremento del siguiente valor de la secuencia de la rebanada."]
    },
    redondear: {
      1: ["Argumento 1 (número): número que se redondeará."],
      2: ["Argumento 1 (número): número que se redondeará.", "Argumento 2 (decimales): cantidad de decimales a redondear."]
    },
    tupla: {
      1: ["Argumento 1 (secuencia): secuencia que se convertirá a tupla."]
    },
    tipo: {
      1: ["Argumento 1 (objeto): objeto del que se obtendrá el tipo."]
    },
    ordenado: {
      1: ["Argumento 1 (secuencia): secuencia que se ordenará."],
      2: ["Argumento 1 (secuencia): secuencia que se ordenará.", "Argumento 2 (inverso): valor booleano que indica si se ordenará de forma inversa."]
    },
    potencia: {
      2: ["Argumento 1 (base): base de la potencia.", "Argumento 2 (exponente): exponente de la potencia."],
      3: ["Argumento 1 (base): base de la potencia.", "Argumento 2 (exponente): exponente de la potencia.", "Argumento 3 (módulo): módulo de la potencia."]
    },
    conjunto: {
      1: ["Argumento 1 (secuencia): secuencia que se convertirá a conjunto."]
    }
  }
}
