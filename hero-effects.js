// ─── Skills Network Effects ───
// Agentic-style floating labels, connecting lines, and pixel grid animation

(function() {
  'use strict';

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
  let isInitialized = false;
  let pixelInterval = null;

  // ─── Main Initialize Function ───
  function initSkillsNetwork() {
    container = document.querySelector('.skills-network-wrapper');
    if (!container) return;

    // Prevent double initialization
    if (isInitialized && labels.length > 0) {
      // Just redraw if already initialized
      repositionLabels();
      drawConnectingLines();
      return;
    }

    linesContainer = document.getElementById('connecting-lines');
    labelsContainer = document.getElementById('floating-labels');
    pixelGridContainer = document.getElementById('pixel-grid');

    if (!linesContainer || !labelsContainer || !pixelGridContainer) return;

    // Clear and recreate everything
    createFloatingLabels();
    createPixelGrid();
    
    // Draw lines after a frame to ensure labels are positioned
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        drawConnectingLines();
      });
    });

    // Set up event listeners
    setupEventListeners();
    
    isInitialized = true;
  }

  // ─── Setup Event Listeners ───
  function setupEventListeners() {
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);
  }

  // ─── Create Floating Labels ───
  function createFloatingLabels() {
    if (!labelsContainer || !container) return;

    labelsContainer.innerHTML = '';
    labels = [];

    var rect = container.getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;

    skillLabels.forEach(function(labelData, index) {
      var el = document.createElement('div');
      el.className = 'floating-label';
      el.textContent = labelData.text;
      el.setAttribute('data-category', labelData.category);
      
      var x = labelData.position.x * width;
      var y = labelData.position.y * height;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      
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

  // ─── Reposition Labels ───
  function repositionLabels() {
    if (!container || labels.length === 0) return;
    
    var rect = container.getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;

    labels.forEach(function(label) {
      label.x = label.data.position.x * width;
      label.y = label.data.position.y * height;
      label.el.style.left = label.x + 'px';
      label.el.style.top = label.y + 'px';
    });
  }

  // ─── Create Pixel Grid ───
  function createPixelGrid() {
    if (!pixelGridContainer) return;

    pixelGridContainer.innerHTML = '';

    var gridSize = 5;
    for (var i = 0; i < gridSize * gridSize; i++) {
      var pixel = document.createElement('div');
      pixel.className = 'pixel';
      pixelGridContainer.appendChild(pixel);
    }

    startPixelAnimation();
  }

  // ─── Pixel Animation ───
  function startPixelAnimation() {
    if (!pixelGridContainer) return;
    
    // Clear any existing interval
    if (pixelInterval) {
      clearInterval(pixelInterval);
    }

    var pixels = pixelGridContainer.querySelectorAll('.pixel');
    
    function animate() {
      pixels.forEach(function(pixel) {
        pixel.style.opacity = (0.2 + Math.random() * 0.7).toString();
      });
    }
    
    animate();
    pixelInterval = setInterval(animate, 800);
  }

  // ─── Draw Connecting Lines ───
  function drawConnectingLines() {
    if (!linesContainer || !container || labels.length === 0) return;

    linesContainer.innerHTML = '';

    var rect = container.getBoundingClientRect();
    var centerX = rect.width / 2;
    var centerY = rect.height / 2;

    labels.forEach(function(label) {
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      
      line.setAttribute('x1', label.x.toString());
      line.setAttribute('y1', label.y.toString());
      line.setAttribute('x2', centerX.toString());
      line.setAttribute('y2', centerY.toString());
      line.classList.add('connecting-line');
      line.setAttribute('data-category', label.data.category);

      linesContainer.appendChild(line);
      label.line = line;
    });
  }

  // ─── Mouse Move Handler ───
  function handleMouseMove(e) {
    if (!container || labels.length === 0) return;

    var rect = container.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;
    var threshold = 180;
    var maxPush = 35;

    labels.forEach(function(label) {
      var dx = mouseX - label.x;
      var dy = mouseY - label.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      var wasHighlighted = label.highlighted;
      label.highlighted = distance < threshold;

      if (label.highlighted !== wasHighlighted) {
        if (label.highlighted) {
          label.el.classList.add('highlighted');
          if (label.line) label.line.classList.add('highlighted');
        } else {
          label.el.classList.remove('highlighted');
          if (label.line) label.line.classList.remove('highlighted');
        }
      }

      if (distance < threshold && distance > 0) {
        var force = Math.pow((threshold - distance) / threshold, 1.5);
        var pushX = (dx / distance) * force * -maxPush;
        var pushY = (dy / distance) * force * -maxPush;
        label.el.style.transform = 'translate(calc(-50% + ' + pushX + 'px), calc(-50% + ' + pushY + 'px))';
      } else {
        label.el.style.transform = 'translate(-50%, -50%)';
      }
    });
  }

  // ─── Handle Resize ───
  function handleResize() {
    if (!container || labels.length === 0) return;
    
    repositionLabels();
    drawConnectingLines();
  }

  // ─── Watch for Skills Page Activation ───
  function watchForSkillsPage() {
    var skillsPage = document.getElementById('page-skills');
    if (!skillsPage) return;

    // Use MutationObserver to detect when skills page becomes active
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          if (skillsPage.classList.contains('active')) {
            setTimeout(initSkillsNetwork, 50);
          }
        }
      });
    });

    observer.observe(skillsPage, { attributes: true });

    // Also check if already active
    if (skillsPage.classList.contains('active')) {
      setTimeout(initSkillsNetwork, 50);
    }
  }

  // ─── Make function globally available ───
  window.initSkillsNetwork = initSkillsNetwork;

  // ─── Initialize when DOM is ready ───
  function onReady() {
    watchForSkillsPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

})();
