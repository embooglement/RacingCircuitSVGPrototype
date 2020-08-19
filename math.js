function rand(min, max) {
  return (Math.random() * (max - min)) + min;
}

function pt(point) {
  return '' + point.x + ',' + point.y;
}

function distance(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function clamp(value, min, max) {
  if (value < min) return min;
  else if (value > max) return max;
  else return value;
}

function lerp(start, end, t) {
  return start + t * (end - start);
}

function lerpPoints(start, end, t) {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
  };
}

function toDegrees(radians) {
  return radians * 180 / Math.PI;
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
