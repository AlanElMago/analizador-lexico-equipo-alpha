import * as d3 from 'https://cdn.skypack.dev/d3@7';

export const generarArbolSintactico = (arbol) => {
  d3.select("#tree-container").selectAll("svg").remove();

  const width = 600, height = 600;

  const svg = d3.select("#tree-container").append("svg")
    .attr("width", width + 100)
    .attr("height", height + 100)
    .append("g")
    .attr("transform", "translate(50, 50)");

  const treeData = convertirArbol(arbol);
  const root = d3.hierarchy(treeData);
  
  const treeLayout = d3.tree().size([height - 100, width - 200]);
  treeLayout(root);

  svg.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkVertical()  // Cambia de linkHorizontal a linkVertical
      .x(d => d.x)                // Intercambia x e y para hacer el árbol vertical
      .y(d => d.y))
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2);

  // Dibujar los nodos
  const node = svg.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x}, ${d.y})`);  // Intercambia x e y

  node.append("circle")
    .attr("r", 10)
    .attr("fill", "#fff")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);

  node.append("text")
    .attr("dy", ".35em")
    .attr("x", 0)  // Centra el texto horizontalmente
    .attr("text-anchor", "middle")  // Centra el texto horizontalmente
    .text(d => d.data.name);
};

// Función que convierte el árbol sintáctico en un formato compatible con D3.js
const convertirArbol = (arbol) => {
  if (!arbol) return null;

  return {
    name: arbol.token.valor,
    children: arbol.hijos.map(hijo => convertirArbol(hijo))
  };
};
