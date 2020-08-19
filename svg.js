const NS = 'http://www.w3.org/2000/svg';

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

function getControlPointElement(point, fill) {
  const circle = document.createElementNS(NS, 'circle');
  circle.setAttribute('cx', point.x);
  circle.setAttribute('cy', point.y);
  circle.setAttribute('r', 0.01);
  circle.setAttribute('fill', fill);
  circle.classList.add('control-point');

  return circle;
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

function getSmoothCubicBezierCommand(point, bezierControlPoint) {
  return buildCommand('S', pt(bezierControlPoint), pt(point));
}
