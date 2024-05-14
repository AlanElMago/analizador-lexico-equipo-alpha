import { Scanner } from './scanner.js';
import { Parser } from './parser.js';

const btnAnalizar = document.getElementById('btn-analizar');
const entrada = document.getElementById('entrada');
const salida = document.getElementById('salida');
const btnLimpiar = document.getElementById('btn-limpiar');
const btnEquipo = document.getElementById('btn-equipo');
const btnSalir = document.getElementById('btn-salir');

btnAnalizar.addEventListener('click', (event) => {
    event.preventDefault();
    const texto = entrada.value;
    const scanner = new Scanner(texto);
    const parser = new Parser(scanner);
    const textoSalida = parser.parsear();
    salida.value = textoSalida.join('\n');
});

btnLimpiar.addEventListener('click', (event) => {
    event.preventDefault();
    entrada.value = '';
    salida.value = '';
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
