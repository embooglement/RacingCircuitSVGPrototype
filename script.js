const NS = 'http://www.w3.org/2000/svg';
let numPoints = 0;
let minRadius = 0;
let maxRadius = 0;

// TODO(kevin): maybe remove this
let arcRadius = 0;

let showControlPoints = true;

function getNumPoints() {
  return numPoints;
}

function getRadius() {
  return rand(minRadius, maxRadius);
}

function getArcRadius() {
  return arcRadius;
}

function rand(min, max) {
  return (Math.random() * (max - min)) + min;
}

function pt(point) {
  return '' + point.x + ',' + point.y;
}

function distance(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function toDegrees(radians) {
  return radians * 180 / Math.PI;
}

function buildCommand(command, ...args) {
  let c = ' ' + command;
  for (const arg of args) {
    c += ' ';
    c += arg;
  }

  return c;
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
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('fill', 'transparent');
  return path;
}

function getPathPoints() {
  const numPoints = getNumPoints();
  const deltaTheta = 2 * Math.PI / numPoints;

  let points = [];
  let bezierControlPoints = [];
  let theta = 0;
  let prevPoint = null;
  let towardsCenter = true;

  for (let i = 0; i < numPoints; ++i) {
    const radius = getRadius();
    const x = radius * Math.cos(theta) + 0.5;
    const y = radius * Math.sin(theta) + 0.5;

    const point = { x, y };
    points.push(point);

    if (i > 0) {
      const controlPoint = getBezierControlPoint(point, points[i - 1], towardsCenter);
      bezierControlPoints.push(controlPoint);
    }

    theta += deltaTheta;
  }

  const controlPoint = getBezierControlPoint(points[points.length - 1], points[0], towardsCenter);
  bezierControlPoints.push(controlPoint);

  return { points, bezierControlPoints };
}

function getEllipticalArcCommand(point, prevPoint) {
  // Whether or not to use the larger elliptical curve between two points. We
  // never want this turned on because the points are close together and we
  // want shorter paths connecting them.
  const largeSweepFlag = 0;

  // Whether or not to use clockwise (0) or counterclockwise (1) arc. The
  // counterclockwise arcs lead to convex shapes, whereas the clockwise arcs
  // lead to concave shapes, so we want this flag to be set to counterclockwise.
  const sweepFlag = 1;

  const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
  const dist = distance(point, prevPoint);
  const radii = {
    x: getArcRadius(),
    y: dist / 2,
  };

  return buildCommand('A', pt(radii), toDegrees(angle), largeSweepFlag, sweepFlag, pt(point));
}

function getBezierControlPoint(point, prevPoint, towardsCenter) {
  // Find the 3rd point in an isosceles triangle, where `point` and `prevPoint`
  // are the base. The 3rd point's distance from the base is `radius`. A
  // positive `radius` projects towards the center of the track, a negative
  // radius projects outwards.

  const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
  const projectedAngle = towardsCenter ? angle + Math.PI / 2 : angle - Math.PI / 2;
  const xDist = point.x - prevPoint.x;
  const yDist = point.y - prevPoint.y;
  const radius = getArcRadius();

  const x = prevPoint.x + xDist / 2 + (radius * Math.cos(projectedAngle));
  const y = prevPoint.y + yDist / 2 + (radius * Math.sin(projectedAngle));

  return { x, y };
}

function getSmoothCubicBezierCommand(point, bezierControlPoint) {
  return buildCommand('S', pt(bezierControlPoint), pt(point));
}

function getPathCommands({ points, bezierControlPoints }) {
  const firstPoint = points[0];
  points = points.slice(1);
  points.push(firstPoint);

  let commands = [buildCommand('M', pt(firstPoint))];

  for (let i = 0; i < points.length; ++i) {
    const point = points[i];
    const bezierControlPoint = bezierControlPoints[i];

    // TODO(kevin): dynamically choose how to connect two points? i.e. use
    // elliptical arcs AND bezier curves.
    // const command = getEllipticalArcCommand(point, prevPoint);
    const command = getSmoothCubicBezierCommand(point, bezierControlPoint);
    commands.push(command);
  }

  commands.push(buildCommand('z'));
  return commands.join(' ');
}

function getControlPointElement(point, fill) {
  const circle = document.createElementNS(NS, 'circle');
  circle.setAttribute('cx', point.x);
  circle.setAttribute('cy', point.y);
  circle.setAttribute('r', 0.01);
  circle.setAttribute('fill', fill);
  circle.classList.add('control-point');

  return circle;
}

function getCircuitElement() {
  const g = document.createElementNS(NS, 'g');
  const { points, bezierControlPoints } = getPathPoints();

  // Show the circuit if nothing but straight lines connected the points
  const polygonPoints = points.map(pt).join(' ');
  const polygon = document.createElementNS(NS, 'polygon');
  polygon.setAttribute('points', polygonPoints);
  polygon.setAttribute('stroke-width', 0.005);
  polygon.setAttribute('stroke-dasharray', '0.01 0.01')
  polygon.setAttribute('fill', 'transparent');
  polygon.setAttribute('stroke', 'blue');
  polygon.classList.add('straight-connections');
  g.appendChild(polygon);

  // Generate the actual race circuit's path
  const path = getPathElement(points);
  path.setAttribute('d', getPathCommands({ points, bezierControlPoints }));
  g.appendChild(path);

  // Show the control points
  for (const point of points) {
    const controlPointElement = getControlPointElement(point, 'red');
    g.appendChild(controlPointElement);
  }

  for (const bezierControlPoint of bezierControlPoints) {
    const controlPointElement = getControlPointElement(bezierControlPoint, 'orange');
    g.appendChild(controlPointElement);
  }

  return g;
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
  const arcRadiusInput = document.getElementById('arc-radius');
  const showControlPointsInput = document.getElementById('show-control-points');
  const showStraightConnectionsInput = document.getElementById('show-straight-connections');

  numPoints = parseInt(numPointsInput.value, 10);
  minRadius = parseFloat(minRadiusInput.value);
  maxRadius = parseFloat(maxRadiusInput.value);
  arcRadius = parseFloat(arcRadiusInput.value);

  numPointsInput.addEventListener('change', (e) => {
    numPoints = parseInt(numPointsInput.value, 10);
  });

  minRadiusInput.addEventListener('change', (e) => {
    minRadius = parseFloat(minRadiusInput.value);
  });

  maxRadiusInput.addEventListener('change', (e) => {
    maxRadius = parseFloat(maxRadiusInput.value);
  });

  arcRadiusInput.addEventListener('change', (e) => {
    arcRadius = parseFloat(arcRadiusInput.value);
  });

  const setShowControlPoints = () => {
    const circuit = document.getElementById('circuit');
    if (showControlPointsInput.checked) {
      circuit.classList.add('show-control-points');
    } else {
      circuit.classList.remove('show-control-points');
    }
  };

  showControlPointsInput.addEventListener('change', (e) => {
    setShowControlPoints();
  });
  setShowControlPoints();

  const setShowStraightConnections = () => {
    const circuit = document.getElementById('circuit');
    if (showStraightConnectionsInput.checked) {
      circuit.classList.add('show-straight-connections');
    } else {
      circuit.classList.remove('show-straight-connections');
    }
  };

  showStraightConnectionsInput.addEventListener('change', (e) => {
    setShowStraightConnections();
  });
  setShowStraightConnections();
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
