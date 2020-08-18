const NS = 'http://www.w3.org/2000/svg';

function rand(min, max) {
  return (Math.random() * (max - min)) + min;
}

function getSVGElement() {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('xmlns', NS);
  svg.setAttribute('viewBox', '0 0 1 1');
  svg.setAttribute('width', 1);
  svg.setAttribute('height', 1);
  return svg;
}

function getPathElement() {
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('stroke', 'black');
  path.setAttribute('stroke-width', 0.01);
  path.setAttribute('fill', 'transparent');
  return path;
}

function getPathCommands() {
  const d = `
    M 0.10,0.30
    A .20,.20 0,0,1 .50,.30
    A .20,.20 0,0,1 .90,.30
    Q .90,.60 .50,.90
    Q .10,.60 .10,.30
    z
  `;

  return d;
}

function getCircuitElement() {
  const path = getPathElement();
  path.setAttribute('d', getPathCommands());
  return path;

}

function generateNewCircuitSVG() {
  const svg = getSVGElement();
  const circuit = getCircuitElement();
  svg.appendChild(circuit);
  return svg;
}

document.addEventListener('DOMContentLoaded', function() {
  const circuit = document.getElementById('circuit');
  const generateButton = document.getElementById('generate-new-circuit');

  generateButton.addEventListener('click', (e) => {
    while (circuit.firstChild) {
      circuit.firstChild.remove();
    }

    circuit.appendChild(generateNewCircuitSVG());
  });

  circuit.appendChild(generateNewCircuitSVG());
});
