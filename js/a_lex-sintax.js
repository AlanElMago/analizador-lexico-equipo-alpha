import { Scanner } from './scanner.js';
import { Parser } from './parser_deprecado.js';
import { Paarser } from './parser.js';

export const analizarLexico = (texto) => {
    const scanner = new Scanner(texto);
    const parser = new Parser(scanner);
    return parser.parsear().join('\n');
};

export const analizarSintactico = (texto) => {
    const scanner = new Scanner(texto);
    const paarser = new Paarser(scanner);
    const arbol = paarser.parsear();

    if (paarser.hayErrores()) {
        return { error: true, mensaje: "Error al generar el árbol sintáctico" };
    }

    return { error: false, arbol };
};