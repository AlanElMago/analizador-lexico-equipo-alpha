import { Scanner } from './scanner.js';
import { Parser } from './parser_deprecado.js';
import { Paarser } from './parser.js';
import { generarArbolSintactico } from './arbol_d3.js';
import { analizarLexico, analizarSintactico } from './a_lex-sintax.js';

const btnAnalizar = document.getElementById('btn-analizar');
const btnSintax = document.getElementById('btn-sintax');
const btnLexSintax = document.getElementById('btn-lexsintax');
const entrada = document.getElementById('entrada');
const salida = document.getElementById('salida');
const btnLimpiar = document.getElementById('btn-limpiar');
const btnEquipo = document.getElementById('btn-equipo');
const btnSalir = document.getElementById('btn-salir');

btnAnalizar.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById("tree-container").innerHTML = '';
    const texto = entrada.value;
    const scanner = new Scanner(texto);
    const parser = new Parser(scanner);
    const textoSalida = parser.parsear();
    salida.value = textoSalida.join('\n');
});

btnSintax.addEventListener('click', (event) => {
    event.preventDefault();
    const texto = entrada.value;
    const scanner = new Scanner(texto);
    const paarser = new Paarser(scanner);
    const arbol = paarser.parsear();

    if (paarser.hayErrores()) {
        salida.value = "Error al generar el árbol sintáctico";
        return;
    }

    document.getElementById("tree-container").innerHTML = '';
    document.getElementById("tree-container").style.display = 'block';

    generarArbolSintactico(arbol);

    salida.style.display = 'none';
});

btnLexSintax.addEventListener('click', (event) => {
    event.preventDefault();
    salida.style.display = 'block';
    const texto = entrada.value;

    // Análisis léxico
    salida.value = analizarLexico(texto);

    // // Análisis sintáctico
    const resultado = analizarSintactico(texto);

    // Limpiar el contenedor del árbol y mostrarlo
    document.getElementById("tree-container").innerHTML = '';
    document.getElementById("tree-container").style.display = 'block';

    if (resultado.error) {
        salida.value += "\n" + resultado.mensaje;
    } else {
        generarArbolSintactico(resultado.arbol);
    }
});

btnLimpiar.addEventListener('click', (event) => {
    event.preventDefault();
    entrada.value = '';
    salida.value = '';
    salida.style.display = 'block';
    
    const treeContainer = document.getElementById("tree-container");
    while (treeContainer.firstChild) {
        treeContainer.removeChild(treeContainer.firstChild);
    }
});

btnEquipo.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('Modal').style.display = 'block';
});

document.getElementsByClassName('close')[0].addEventListener('click', function() {
    document.getElementById('Modal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('Modal')) {
        document.getElementById('Modal').style.display = 'none';
    }
});

btnSalir.addEventListener('click', (event) => {
    event.preventDefault();
    window.close();
});
