const NS = 'http://www.w3.org/2000/svg';

function rand(min, max) {
  return (Math.random() * (max - min)) + min;
}

function getSVG() {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('xmlns', NS);
  svg.setAttribute('viewBox', '0 0 1 1');
  svg.setAttribute('width', 1);
  svg.setAttribute('height', 1);
  return svg;
}

function getCircuit() {
  const circle = document.createElementNS(NS, 'circle');
  circle.setAttribute('cx', 0.5);
  circle.setAttribute('cy', 0.5);
  circle.setAttribute('r', rand(0.15, 0.4));
  circle.setAttribute('stroke', 'black');
  circle.setAttribute('stroke-width', 0.01);
  circle.setAttribute('fill', 'transparent');

  return circle;
}

function generateNewCircuitSVG() {
  const svg = getSVG();
  const circuit = getCircuit();
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
