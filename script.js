const NS = 'http://www.w3.org/2000/svg';

function rand(min, max) {
  return (Math.random() * (max - min)) + min;
}

function generateNewCircuitSVG() {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('xmlns', NS);
  svg.setAttribute('viewBox', '0 0 100 100');

  const circle = document.createElementNS(NS, 'circle');
  circle.setAttribute('cx', 50);
  circle.setAttribute('cy', 50);
  circle.setAttribute('r', rand(15, 40));
  circle.setAttribute('fill', 'purple');

  svg.appendChild(circle);

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
