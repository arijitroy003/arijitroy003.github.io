// ─── Skills Network Effects ───
// Agentic-style floating labels, connecting lines, and pixel grid animation

// Skill labels with categories and positions (percentage of container)
const skillLabels = [
  // Languages (green)
  { text: 'Python', category: 'languages', position: { x: 0.08, y: 0.15 } },
  { text: 'Golang', category: 'languages', position: { x: 0.22, y: 0.08 } },
  { text: 'TypeScript', category: 'languages', position: { x: 0.78, y: 0.10 } },
  { text: 'SQL', category: 'languages', position: { x: 0.42, y: 0.05 } },
  { text: 'Scala', category: 'languages', position: { x: 0.60, y: 0.07 } },
  
  // Cloud (blue)
  { text: 'Kubernetes', category: 'cloud', position: { x: 0.92, y: 0.18 } },
  { text: 'AWS', category: 'cloud', position: { x: 0.95, y: 0.42 } },
  { text: 'Docker', category: 'cloud', position: { x: 0.04, y: 0.32 } },
  { text: 'Terraform', category: 'cloud', position: { x: 0.88, y: 0.30 } },
  { text: 'GCP', category: 'cloud', position: { x: 0.03, y: 0.48 } },
  
  // Data (amber)
  { text: 'Snowflake', category: 'data', position: { x: 0.90, y: 0.58 } },
  { text: 'Databricks', category: 'data', position: { x: 0.94, y: 0.72 } },
  { text: 'dbt', category: 'data', position: { x: 0.82, y: 0.88 } },
  { text: 'Airflow', category: 'data', position: { x: 0.35, y: 0.92 } },
  { text: 'Kafka', category: 'data', position: { x: 0.55, y: 0.94 } },
  { text: 'Delta Lake', category: 'data', position: { x: 0.68, y: 0.90 } },
  
  // AI/LLM (purple)
  { text: 'LangChain', category: 'ai', position: { x: 0.05, y: 0.55 } },
  { text: 'GenAI', category: 'ai', position: { x: 0.50, y: 0.04 } },
  { text: 'MCP Servers', category: 'ai', position: { x: 0.72, y: 0.95 } },
  { text: 'OpenAI', category: 'ai', position: { x: 0.15, y: 0.12 } },
  { text: 'Vector DBs', category: 'ai', position: { x: 0.06, y: 0.68 } },
  
  // Databases (pink)
  { text: 'MongoDB', category: 'databases', position: { x: 0.08, y: 0.78 } },
  { text: 'BigQuery', category: 'databases', position: { x: 0.20, y: 0.90 } },
  { text: 'DynamoDB', category: 'databases', position: { x: 0.12, y: 0.85 } },
  
  // Research (gray)
  { text: 'Data Mesh', category: 'research', position: { x: 0.04, y: 0.42 } },
  { text: 'GitOps', category: 'research', position: { x: 0.96, y: 0.52 } },
  { text: 'MLOps', category: 'research', position: { x: 0.88, y: 0.82 } },
];

// Store references
let labels = [];
let container = null;
let linesContainer = null;
let pixelGridContainer = null;
let labelsContainer = null;
let animationFrameId = null;

// ─── Main Initialize Function (called from script.js) ───
function initSkillsNetwork() {
  console.log('Initializing skills network...');
  
  container = document.querySelector('.skills-network-wrapper');
  if (!container) {
    console.log('Container not found');
    return;
  }

  linesContainer = document.getElementById('connecting-lines');
  labelsContainer = document.getElementById('floating-labels');
  pixelGridContainer = document.getElementById('pixel-grid');

  // Clear and recreate everything
  createFloatingLabels();
  createPixelGrid();
  
  // Draw lines after labels are positioned
  requestAnimationFrame(() => {
    drawConnectingLines();
  });

  // Set up event listeners
  setupEventListeners();
  
  console.log('Skills network initialized with', labels.length, 'labels');
}

// ─── Setup Event Listeners ───
function setupEventListeners() {
  // Remove old listeners
  if (container) {
    container.onmousemove = handleMouseMove;
  }
  window.onresize = handleResize;
}

// ─── Create Floating Labels ───
function createFloatingLabels() {
  if (!labelsContainer || !container) return;

  // Clear existing
  labelsContainer.innerHTML = '';
  labels = [];

  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  skillLabels.forEach((labelData, index) => {
    const el = document.createElement('div');
    el.className = 'floating-label';
    el.textContent = labelData.text;
    el.setAttribute('data-category', labelData.category);
    el.style.animationDelay = `${index * 0.04}s`;
    
    // Position immediately
    const x = labelData.position.x * width;
    const y = labelData.position.y * height;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
    labelsContainer.appendChild(el);

    labels.push({
      el: el,
      data: labelData,
      x: x,
      y: y,
      highlighted: false,
      line: null
    });
  });
}

// ─── Create Pixel Grid ───
function createPixelGrid() {
  if (!pixelGridContainer) return;

  pixelGridContainer.innerHTML = '';

  const gridSize = 5;
  for (let i = 0; i < gridSize * gridSize; i++) {
    const pixel = document.createElement('div');
    pixel.className = 'pixel';
    pixelGridContainer.appendChild(pixel);
  }

  startPixelAnimation();
}

// ─── Pixel Animation ───
function startPixelAnimation() {
  if (!pixelGridContainer) return;

  const pixels = pixelGridContainer.querySelectorAll('.pixel');
  
  function animate() {
    pixels.forEach(pixel => {
      pixel.style.opacity = 0.2 + Math.random() * 0.7;
    });
  }
  
  animate();
  setInterval(animate, 800);
}

// ─── Draw Connecting Lines ───
function drawConnectingLines() {
  if (!linesContainer || !container) return;

  linesContainer.innerHTML = '';

  const rect = container.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  labels.forEach(label => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    
    // Use stored positions
    line.setAttribute('x1', label.x);
    line.setAttribute('y1', label.y);
    line.setAttribute('x2', centerX);
    line.setAttribute('y2', centerY);
    line.classList.add('connecting-line');
    line.setAttribute('data-category', label.data.category);

    linesContainer.appendChild(line);
    label.line = line;
  });
}

// ─── Mouse Move Handler ───
function handleMouseMove(e) {
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const threshold = 180; // Larger detection radius
  const maxPush = 35; // Maximum push distance in pixels

  labels.forEach(label => {
    const dx = mouseX - label.x;
    const dy = mouseY - label.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const wasHighlighted = label.highlighted;
    label.highlighted = distance < threshold;

    // Toggle highlight class
    if (label.highlighted !== wasHighlighted) {
      label.el.classList.toggle('highlighted', label.highlighted);
      if (label.line) {
        label.line.classList.toggle('highlighted', label.highlighted);
      }
    }

    // Push away effect - stronger and more noticeable
    if (distance < threshold && distance > 0) {
      // Exponential falloff for more dramatic effect near cursor
      const force = Math.pow((threshold - distance) / threshold, 1.5);
      const pushX = (dx / distance) * force * -maxPush;
      const pushY = (dy / distance) * force * -maxPush;
      label.el.style.transform = `translate(calc(-50% + ${pushX}px), calc(-50% + ${pushY}px))`;
    } else {
      label.el.style.transform = 'translate(-50%, -50%)';
    }
  });
}

// ─── Handle Resize ───
function handleResize() {
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // Reposition labels
  labels.forEach(label => {
    label.x = label.data.position.x * width;
    label.y = label.data.position.y * height;
    label.el.style.left = `${label.x}px`;
    label.el.style.top = `${label.y}px`;
  });

  // Redraw lines
  drawConnectingLines();
}

// ─── Make function globally available ───
window.initSkillsNetwork = initSkillsNetwork;
