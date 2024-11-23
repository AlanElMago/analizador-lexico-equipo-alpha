import { Scanner } from './scanner.js';
import { Parser } from './parser.js';
import { generarArbolSintactico } from './arbol_d3.js';

const btnLexico = document.getElementById('btn-lexico');
const btnSintactico = document.getElementById('btn-sintactico');
const btnLexicoSintactico = document.getElementById('btn-lexico-y-sintactico');
const btnSemantico = document.getElementById('btn-semantico');
const entrada = document.getElementById('entrada');
const salida = document.getElementById('salida');
const btnLimpiar = document.getElementById('btn-limpiar');
const btnEquipo = document.getElementById('btn-equipo');
const btnSalir = document.getElementById('btn-salir');

const analisisLexico = () => {
  const texto = entrada.value;
  const scanner = new Scanner(texto);
  const parser = new Parser(scanner);

  parser.parsear();

  salida.value = parser.infoTokens.join("\n");

  if (parser.hayErrores()) {
    salida.value += "\n";
    salida.value += parser.errores.join("\n");
  }
}

const analisisSintactico = () => {
  const texto = entrada.value;
  const scanner = new Scanner(texto);
  const parser = new Parser(scanner);
  const arbol = parser.parsear();

  generarArbolSintactico(arbol);
};

btnLexico.addEventListener('click', (event) => {
  event.preventDefault();

  salida.style.display = 'block';
  document.getElementById("tree-container").innerHTML = "";
  document.getElementById("tree-container").style.display = 'none';

  analisisLexico();
});

btnSintactico.addEventListener('click', (event) => {
  event.preventDefault();

  salida.style.display = 'none';
  document.getElementById("tree-container").innerHTML = "";
  document.getElementById("tree-container").style.display = 'block';

  analisisSintactico();
})

btnLexicoSintactico.addEventListener('click', (event) => {
  event.preventDefault();

  salida.style.display = 'block';
  document.getElementById("tree-container").innerHTML = "";
  document.getElementById("tree-container").style.display = 'block';

  analisisLexico();
  analisisSintactico();
});

btnSemantico.addEventListener('click', (event) => {
  event.preventDefault();

  const scanner = new Scanner(entrada.value);
  const parser = new Parser(scanner);

  parser.parsear();
  const reglasProduccion = parser.validador.reglasProduccion;

  const salidaa = [];
  for (const [regla, valores] of Object.entries(reglasProduccion)) {
    let linea = `${regla} -> `;

    valores.forEach(valor => linea += `${valor} | `);
    salidaa.push(linea.slice(0, -2));
  }

  salida.value = salidaa.join("\n");
  if (parser.hayErrores()) {
    salida.value += "\n";
    salida.value += parser.errores.join("\n");
  }

  console.log(salidaa);
});

btnLimpiar.addEventListener('click', (event) => {
  event.preventDefault();

  entrada.value = "";
  salida.value = "";
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

document.getElementsByClassName('close')[0].addEventListener('click', () => {
  document.getElementById('Modal').style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target == document.getElementById('Modal')) {
    document.getElementById('Modal').style.display = 'none';
  }
});

btnSalir.addEventListener('click', (event) => {
  event.preventDefault();
  window.close();
});