const NS = 'http://www.w3.org/2000/svg';
const NUM_POINTS = 50;
const RADIUS = 0.3;

function getNumPoints() {
  return NUM_POINTS;
}

function getRadius() {
  return RADIUS;
}

function rand(min, max) {
  return (Math.random() * (max - min)) + min;
}

function pt(point) {
  return '' + point.x + ',' + point.y;
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

function getPathPoints() {
  const numPoints = getNumPoints();
  const radius = getRadius();
  const deltaTheta = 2 * Math.PI / numPoints;

  let points = [];
  let theta = 0;

  for (let i = 0; i < numPoints; ++i) {
    const x = radius * Math.cos(theta) + 0.5;
    const y = radius * Math.sin(theta) + 0.5;
    points.push({ x, y });
    theta += deltaTheta;
  }

  return points;
}

function getPathCommands() {
  // const d = `
  //   M 0.10,0.30
  //   A .20,.20 0,0,1 .50,.30
  //   A .20,.20 0,0,1 .90,.30
  //   Q .90,.60 .50,.90
  //   Q .10,.60 .10,.30
  //   z
  // `;

  let points = getPathPoints();
  const firstPoint = points[0];
  points = points.slice(1);

  let d = 'M ';
  d += pt(firstPoint);

  for (const point of points) {
    d += ' L';
    d += pt(point);
  }

  d += ' z';

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
