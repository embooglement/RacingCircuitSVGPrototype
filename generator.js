let numPoints = 0;
let pointsLayout = '';
let minRadius = 0;
let maxRadius = 0;
let minDeltaRadius = 0;
let maxDeltaRadiues = 0;
let arcRadius = 0;
let bezierArcMethod = '';
let numPolygonSides = 0;
let polygonRadius = 0;

function getNumPoints() {
  return numPoints;
}

function getPointsLayout() {
  return pointsLayout;
}

function getRadius(prevRadius) {
  let radius = rand(minRadius, maxRadius);

  if (prevRadius !== null) {
    const diff = radius - prevRadius;

    if (diff >= 0) {
      if (diff < getMinDeltaRadius()) {
        radius = prevRadius + getMinDeltaRadius();
      } else if (diff > getMaxDeltaRadius()) {
        radius = prevRadius + getMaxDeltaRadius();
      }
    } else if (diff < 0) {
      if (-diff < getMinDeltaRadius()) {
        radius = prevRadius - getMinDeltaRadius();
      } else if (-diff > getMaxDeltaRadius()) {
        radius = prevRadius - getMaxDeltaRadius();
      }
    }
  }

  return radius;
}

function getMinDeltaRadius() {
  return minDeltaRadius;
}

function getMaxDeltaRadius() {
  return maxDeltaRadius;
}

function getArcRadius() {
  return arcRadius;
}

function getBezierArcMethod() {
  return bezierArcMethod;
}

function getNumPolygonSides() {
  return numPolygonSides;
}

function getPolygonRadius() {
  return polygonRadius;
}

function getCirclePathPoints() {
  const numPoints = getNumPoints();
  const deltaTheta = 2 * Math.PI / numPoints;

  let points = [];
  let theta = 0;
  let prevPoint = null;
  let prevRadius = null;

  for (let i = 0; i < numPoints; ++i) {
    const radius = getRadius(prevRadius);
    const x = radius * Math.cos(theta) + 0.5;
    const y = radius * Math.sin(theta) + 0.5;

    const point = { x, y };
    points.push(point);
    theta += deltaTheta;
  }

  return points;
}

function getPolygonPathPoints() {
  const numSides = getNumPolygonSides();
  const polygonRadius = getPolygonRadius();

  const numPoints = getNumPoints();
  const numPointsPerSide = Math.round(numPoints / numSides);
  let theta = rand(0, Math.PI / 2);
  let deltaTheta = 2 * Math.PI / numSides;
  let points = [];
  let prevRadius = null;

  for (let i = 0; i < numSides; ++i) {
    const start = {
      x: polygonRadius * Math.cos(theta) + 0.5,
      y: polygonRadius * Math.sin(theta) + 0.5,
    };

    const end = {
      x: polygonRadius * Math.cos(theta + deltaTheta) + 0.5,
      y: polygonRadius * Math.sin(theta + deltaTheta) + 0.5,
    }

    for (let j = 0; j < numPointsPerSide; ++j) {
      const polygonX = lerp(start.x, end.x, j / (numPointsPerSide - 1));
      const polygonY = lerp(start.y, end.y, j / (numPointsPerSide - 1));
      const angle = Math.atan2(polygonY - 0.5, polygonX - 0.5);
      const radius = getRadius(prevRadius);
      const displacement = Math.abs(radius - polygonRadius);
      const x = polygonX + displacement * Math.cos(angle);
      const y = polygonY + displacement * Math.sin(angle);

      points.push({ x, y });
      prevRadius = radius;
    }

    theta += deltaTheta;
  }

  return points;
}

function getPathPoints() {
  const pointsLayout = getPointsLayout();

  if (pointsLayout === 'circle') return getCirclePathPoints();
  else if (pointsLayout === 'polygon') return getPolygonPathPoints();
  else throw new Error(`Unknown points layout "${pointsLayout}"`);
}

function getBezierControlPoints(points) {
  const arcMethod = getBezierArcMethod();

  if (arcMethod === 'alternate' && numPoints % 2 === 0) {
    console.warn('Alternating bezier curve directions only works well with an odd number of points');
  }

  let bezierControlPoints = [];
  let prevPoint = null;
  let towardsCenter = false;
  let shouldAlternate = false;

  if (arcMethod === 'inwards') {
    towardsCenter = true;
  } else if (arcMethod === 'alternate') {
    shouldAlternate = true;
  }

  for (let i = 0; i < points.length; ++i) {
    if (i > 0) {
      const controlPoint = getBezierControlPoint(points[i], points[i - 1], towardsCenter);
      bezierControlPoints.push(controlPoint);
    }

    if (shouldAlternate) {
      towardsCenter = !towardsCenter;
    }
  }

  const controlPoint = getBezierControlPoint(points[points.length - 1], points[0], towardsCenter);
  bezierControlPoints.push(controlPoint);

  return bezierControlPoints;
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

function getCircuitElement() {
  const g = document.createElementNS(NS, 'g');
  const points = getPathPoints();
  const bezierControlPoints = getBezierControlPoints(points);

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
    const radialLine = document.createElementNS(NS, 'line');
    radialLine.setAttribute('x1', 0.5);
    radialLine.setAttribute('y1', 0.5);
    radialLine.setAttribute('x2', point.x);
    radialLine.setAttribute('y2', point.y);
    radialLine.setAttribute('stroke', 'green');
    radialLine.setAttribute('stroke-width', 0.005);
    radialLine.setAttribute('stroke-dasharray', '0.01 0.01');
    radialLine.classList.add('radial-line');
    g.appendChild(radialLine);

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
