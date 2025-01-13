import { Scanner } from './scanner.js';
import { Parser } from './parser.js';
import { Traductor } from '../js/traductor.js';

const archivo = document.getElementById('archivo');
const nuevo = document.getElementById('btn-nuevo');
const guardar = document.getElementById('btn-guardar');
const guardarComo = document.getElementById('btn-guardar-como');
const button_salir = document.getElementById('btn-salir');
const button = document.getElementById('btn-traducir');
const button_revisar = document.getElementById('btn-revisar');
const entrada = document.getElementById('entrada');
const salida_traduccion = document.getElementById('salida-traduccion');
const salida_errores = document.getElementById('salida-errores');

//Función para traducir
button.addEventListener('click', () => {
  const scanner = new Scanner(entrada.value);
  const parser = new Parser(scanner);

  parser.parsear();

  if (parser.hayErrores()) {
    salida_traduccion.value = '';
    salida_errores.value = parser.errores.join("\n");

    return;
  } else {
    salida_errores.value = '';
  }

  const traductor = new Traductor(scanner);
  salida_traduccion.value = traductor.traducir();
});

//Crear nuevo archivo
nuevo.addEventListener('click', () => {
  window.location.assign(window.location.href);
});

//Función para guardar archivo
guardar.addEventListener('click', () => {
  let enlace = document.createElement('a');

  if (salida_traduccion.value.trim()) {
    enlace.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(salida_traduccion.value));
    enlace.setAttribute('download', 'traduccion.py');
  } else if (salida_errores.value.trim()) {
    enlace.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(salida_errores.value));
    enlace.setAttribute('download', 'errores.txt');
  } else if (entrada.value.trim()) {
    enlace.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(entrada.value));
    enlace.setAttribute('download', 'codigo.txt');
  } else {
    alert("No hay contenido para guardar.");
    return;
  }

  enlace.style.display = 'none';
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
});

//Función para guardar archivo con nombre
guardarComo.addEventListener('click', () => {
  let enlace = document.createElement('a');
  let nombre = prompt('Guardar archivo como...');

  if (!nombre) {
    alert("Debes proporcionar un nombre para el archivo.");
    return;
  }

  if (salida_traduccion.value.trim()) {
    enlace.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(salida_traduccion.value));
    enlace.setAttribute('download', `${nombre}.py`);
  } else if (salida_errores.value.trim()) {
    enlace.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(salida_errores.value));
    enlace.setAttribute('download', `${nombre}.txt`);
  } else if (entrada.value.trim()) {
    enlace.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(entrada.value));
    enlace.setAttribute('download', `${nombre}.txt`);
  } else {
    alert("No hay contenido para guardar.");
    return;
  }

  enlace.style.display = 'none';
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
});

//Función para cargar archivo
archivo.addEventListener('change', () => {
  const file = archivo.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      entrada.value = e.target.result;
    };
    reader.readAsText(file);
  }
});

//Función para revisar errores
button_revisar.addEventListener('click', () => {
  const scanner = new Scanner(entrada.value);
  const parser = new Parser(scanner);

  parser.parsear();

  if (parser.hayErrores()) {
    salida_errores.value = parser.errores.join("\n");
  } else {
    salida_errores.value = 'No hay errores';
  }
});

button_salir.addEventListener('click', (event) => {
  event.preventDefault();
  window.close();
});
