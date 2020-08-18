const NS = 'http://www.w3.org/2000/svg';
let numPoints = 0;
let minRadius = 0;
let maxRadius = 0;

function getNumPoints() {
  return numPoints;
}

function getRadius() {
  return rand(minRadius, maxRadius);
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
  path.setAttribute('stroke-width', 0.008);
  path.setAttribute('fill', 'transparent');
  return path;
}

function getPathPoints() {
  const numPoints = getNumPoints();
  const deltaTheta = 2 * Math.PI / numPoints;

  let points = [];
  let theta = 0;

  for (let i = 0; i < numPoints; ++i) {
    const radius = getRadius();
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

function initializeInputs() {
  const numPointsInput = document.getElementById('num-points');
  const minRadiusInput = document.getElementById('min-radius');
  const maxRadiusInput = document.getElementById('max-radius');

  numPoints = parseInt(numPointsInput.value, 10);
  minRadius = parseFloat(minRadiusInput.value);
  maxRadius = parseFloat(maxRadiusInput.value);

  console.log("numPoints is", numPoints);
  console.log("minRadius is", minRadius);
  console.log("maxRadius is", maxRadius);

  numPointsInput.addEventListener('change', (e) => {
    numPoints = parseInt(numPointsInput.value, 10);
    console.log('numPoints is now', numPoints);
  });

  minRadiusInput.addEventListener('change', (e) => {
    minRadius = parseFloat(minRadiusInput.value);
    console.log('minRadius is now', minRadius);
  });

  maxRadiusInput.addEventListener('change', (e) => {
    maxRadius = parseFloat(maxRadiusInput.value);
    console.log('maxRadius is now', maxRadius);
  });
}

function initalizeCircuitGenerator() {
  const circuit = document.getElementById('circuit');
  const generateButton = document.getElementById('generate-new-circuit');

  generateButton.addEventListener('click', (e) => {
    while (circuit.firstChild) {
      circuit.firstChild.remove();
    }

    circuit.appendChild(generateNewCircuitSVG());
  });

  circuit.appendChild(generateNewCircuitSVG());
}

document.addEventListener('DOMContentLoaded', function() {
  initializeInputs();
  initalizeCircuitGenerator();
});
