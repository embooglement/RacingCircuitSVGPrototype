function initializeInputs() {
  const numPointsInput = document.getElementById('num-points');
  const pointsLayoutInput = document.getElementById('points-layout');
  const minRadiusInput = document.getElementById('min-radius');
  const maxRadiusInput = document.getElementById('max-radius');
  const minDeltaRadiusInput = document.getElementById('min-delta-radius');
  const maxDeltaRadiusInput = document.getElementById('max-delta-radius');
  const arcRadiusInput = document.getElementById('arc-radius');
  const showControlPointsInput = document.getElementById('show-control-points');
  const showStraightConnectionsInput = document.getElementById('show-straight-connections');
  const showRadialLinesInput = document.getElementById('show-radial-lines');
  const bezierArcMethodInput = document.getElementById('bezier-arc-method');
  const numPolygonSidesInput = document.getElementById('num-polygon-sides');
  const polygonRadiusInput = document.getElementById('polgon-radius');

  numPoints = parseInt(numPointsInput.value, 10);
  minRadius = parseFloat(minRadiusInput.value);
  maxRadius = parseFloat(maxRadiusInput.value);
  minDeltaRadius = parseFloat(minDeltaRadiusInput.value);
  maxDeltaRadius = parseFloat(maxDeltaRadiusInput.value);
  arcRadius = parseFloat(arcRadiusInput.value);
  numPolygonSides = parseFloat(numPolygonSidesInput.value);
  polygonRadius = parseFloat(polygonRadiusInput.value);

  numPointsInput.addEventListener('change', (e) => {
    numPoints = parseInt(numPointsInput.value, 10);
  });

  minRadiusInput.addEventListener('change', (e) => {
    minRadius = parseFloat(minRadiusInput.value);
  });

  maxRadiusInput.addEventListener('change', (e) => {
    maxRadius = parseFloat(maxRadiusInput.value);
  });

  minDeltaRadiusInput.addEventListener('change', (e) => {
    minDeltaRadius = parseFloat(minDeltaRadiusInput.value);
  });

  maxDeltaRadiusInput.addEventListener('change', (e) => {
    maxDeltaRadius = parseFloat(maxDeltaRadiusInput.value);
  });

  arcRadiusInput.addEventListener('change', (e) => {
    arcRadius = parseFloat(arcRadiusInput.value);
  });

  numPolygonSidesInput.addEventListener('change', (e) => {
    numPolygonSides = parseFloat(numPolygonSidesInput.value);
  });

  polygonRadiusInput.addEventListener('change', (e) => {
    polygonRadius = parseFloat(polygonRadiusInput.value);
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

  const setShowRadialLines = () => {
    const circuit = document.getElementById('circuit');
    if (showRadialLinesInput.checked) {
      circuit.classList.add('show-radial-lines');
    } else {
      circuit.classList.remove('show-radial-lines');
    }
  };

  showRadialLinesInput.addEventListener('change', (e) => {
    setShowRadialLines();
  });
  setShowRadialLines();

  const setBezierArcMethod = () => {
    bezierArcMethod = bezierArcMethodInput.value;
  };

  bezierArcMethodInput.addEventListener('change', (e) => {
    setBezierArcMethod();
  });
  setBezierArcMethod();

  const setPointsLayout = () => {
    pointsLayout = pointsLayoutInput.value;

    const polygonInputs = document.getElementById('polygon-inputs');

    if (pointsLayout === 'polygon') {
      polygonInputs.classList.add('allowed');
    } else {
      polygonInputs.classList.remove('allowed');
    }
  };

  pointsLayoutInput.addEventListener('change', (e) => {
    setPointsLayout();
  });
  setPointsLayout();
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
