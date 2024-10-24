import { Lexema } from "./lexema.js";

/**
 * El nivel de precedencia de cada operador.
 */
export const tablaPrecedencia = [
  // Nivel de precedencia: 0
  {tipo: Lexema.Tipo.MenosUnario, valor: "-" , nivelPrecedencia: 0}, // Menos unario
  {tipo: Lexema.Tipo.Logico,      valor: "NO", nivelPrecedencia: 0}, // No lógico

  // Nivel de precedencia: 1
  {tipo: Lexema.Tipo.Aritmetico,  valor: "**", nivelPrecedencia: 1}, // Exponenciación

  // Nivel de precedencia: 2
  {tipo: Lexema.Tipo.Aritmetico,  valor: "*" , nivelPrecedencia: 2}, // Multiplicación
  {tipo: Lexema.Tipo.Aritmetico,  valor: "/" , nivelPrecedencia: 2}, // División
  {tipo: Lexema.Tipo.Aritmetico,  valor: "%" , nivelPrecedencia: 2}, // Módulo

  // Nivel de precedencia: 3
  {tipo: Lexema.Tipo.Aritmetico,  valor: "+" , nivelPrecedencia: 3}, // Suma
  {tipo: Lexema.Tipo.Aritmetico,  valor: "-" , nivelPrecedencia: 3}, // Resta

  // Nivel de precedencia: 4
  {tipo: Lexema.Tipo.Comparacion, valor: "<" , nivelPrecedencia: 4}, // Menor que
  {tipo: Lexema.Tipo.Comparacion, valor: "<=", nivelPrecedencia: 4}, // Menor o igual que
  {tipo: Lexema.Tipo.Comparacion, valor: ">" , nivelPrecedencia: 4}, // Mayor que
  {tipo: Lexema.Tipo.Comparacion, valor: ">=", nivelPrecedencia: 4}, // Mayor o igual que
  {tipo: Lexema.Tipo.Comparacion, valor: "==", nivelPrecedencia: 4}, // Igual a
  {tipo: Lexema.Tipo.Comparacion, valor: "!=", nivelPrecedencia: 4}, // No igual a

  // Nivel de precedencia: 5
  {tipo: Lexema.Tipo.Logico,      valor: "Y" , nivelPrecedencia: 5}, // And lógico

  // Nivel de precedencia: 6
  {tipo: Lexema.Tipo.Logico,      valor: "O" , nivelPrecedencia: 6}, // Or lógico

  // Nivel de precedencia: 7
  {tipo: Lexema.Tipo.Asignacion,  valor: "=" , nivelPrecedencia: 7}  // Asignación
]
