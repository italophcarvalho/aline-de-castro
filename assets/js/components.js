/* ============================================================
   COMPONENTS.JS — Interactive Component Logic
   Shuffle, Typewriter, Scheduler Cursor, Canvas Animations
   ============================================================ */

'use strict';

/* ═══════════════════════════════════════
   CARD 1 — Shuffle Stack (Premium Weddings)
   ═══════════════════════════════════════ */
function initShuffleCard(container) {
  if (!container) return;

  const items = [...container.querySelectorAll('.shuffle-item')];
  if (items.length < 2) return;

  // Set initial stack positions
  function applyPositions(arr) {
    arr.forEach((el, i) => {
      el.style.transform  = `translateY(${i * 10}px) scale(${1 - i * 0.04})`;
      el.style.zIndex     = arr.length - i;
      el.style.opacity    = Math.max(1 - i * 0.28, 0).toString();
    });
  }

  applyPositions(items);

  setInterval(() => {
    // Move last item to front
    const arr = [...items];
    arr.unshift(arr.pop());

    // Re-sort DOM zIndex and CSS
    applyPositions(arr);

    // Reorder reference array for next cycle
    items.unshift(items.pop());
  }, 3200);
}

/* ═══════════════════════════════════════
   CARD 2 — Typewriter Telemetry (Corporate Gala)
   ═══════════════════════════════════════ */
function initTypewriterCard(el) {
  if (!el) return;

  const messages = [
    'Miss Universo ES — execução impecável.',
    'Gastronomia Gala — 400 convidados.',
    'Empratados Le Cordon Bleu.',
    'Zero margem de erro. Sempre.',
    'Logística e equipe de alta precisão.',
    'Eventos corporativos de alto padrão.',
  ];

  let msgIndex  = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function tick() {
    const current = messages[msgIndex];

    if (!isDeleting) {
      // Typing forward
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        // Pause at end before deleting
        isDeleting = true;
        pauseTimer = setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 42);
    } else {
      // Deleting
      charIndex--;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        msgIndex = (msgIndex + 1) % messages.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 22);
    }
  }

  // Start after brief delay
  setTimeout(tick, 800);
}

/* ═══════════════════════════════════════
   CARD 3 — Scheduler Cursor (Menu Degustation)
   ═══════════════════════════════════════ */
function initSchedulerCard(container) {
  if (!container) return;

  const grid   = container.querySelector('.scheduler-grid');
  const cursor = container.querySelector('.scheduler-cursor');
  if (!grid || !cursor) return;

  const cells = [...grid.querySelectorAll('.scheduler-cell')];
  if (cells.length === 0) return;

  // Cells to auto-select in sequence (indices into the 7×4 grid)
  const sequence = [2, 9, 16, 3, 10, 17, 5];
  let step = 0;
  let loopTimer = null;

  function getCellCenter(cell) {
    const gr = grid.getBoundingClientRect();
    const cr = cell.getBoundingClientRect();
    return {
      x: cr.left - gr.left + cr.width / 2,
      y: cr.top  - gr.top  + cr.height / 2,
    };
  }

  function moveToCell(cellIndex, callback) {
    const cell   = cells[cellIndex];
    if (!cell) { callback && callback(); return; }
    const center = getCellCenter(cell);

    // Position cursor
    cursor.style.transition = 'left 0.45s cubic-bezier(0.16,1,0.3,1), top 0.45s cubic-bezier(0.16,1,0.3,1)';
    cursor.style.left = (center.x - 10) + 'px';
    cursor.style.top  = (center.y - 10) + 'px';
    cursor.style.opacity = '1';

    // After move, simulate click
    setTimeout(() => {
      cell.classList.add('clicked');
      setTimeout(() => {
        cell.classList.remove('clicked');
        cell.classList.add('active');
        callback && callback();
      }, 180);
    }, 480);
  }

  function runSequence() {
    if (step >= sequence.length) {
      // Pause, then reset
      loopTimer = setTimeout(() => {
        // Clear all active cells
        cells.forEach(c => c.classList.remove('active'));
        cursor.style.opacity = '0';
        step = 0;
        setTimeout(runSequence, 900);
      }, 2000);
      return;
    }

    moveToCell(sequence[step], () => {
      step++;
      setTimeout(runSequence, 320);
    });
  }

  // Start cursor off-screen
  cursor.style.opacity = '0';
  cursor.style.left = '0px';
  cursor.style.top  = '0px';

  setTimeout(runSequence, 1200);
}

/* ═══════════════════════════════════════
   CANVAS: Card 1 — Concentric Circles (Rotating)
   ═══════════════════════════════════════ */
function initConcentricCanvas(canvas) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let angle = 0;
  let raf   = null;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const gold = '#f2ca50';
  const goldDim = 'rgba(242,202,80,0.18)';

  function draw() {
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(w, h) * 0.45;

    // Draw concentric arcs
    const rings = 5;
    for (let i = 0; i < rings; i++) {
      const r   = maxR * ((i + 1) / rings);
      const rot = angle + (i % 2 === 0 ? 0 : Math.PI);
      const startA = rot;
      const endA   = rot + Math.PI * 1.7;

      ctx.beginPath();
      ctx.arc(cx, cy, r, startA, endA);
      ctx.strokeStyle = i === 0 ? gold : goldDim;
      ctx.lineWidth   = i === 0 ? 1.5 : 0.8;
      ctx.stroke();
    }

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = gold;
    ctx.fill();

    angle += 0.006;
    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
}

/* ═══════════════════════════════════════
   CANVAS: Card 2 — Laser Line Scan on Dot Grid
   ═══════════════════════════════════════ */
function initLaserCanvas(canvas) {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let raf   = null;
  let scanY = 0;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const gold    = '#f2ca50';
  const goldDot = 'rgba(242,202,80,0.25)';

  function draw() {
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);

    const cols = 14;
    const rows = 10;
    const gapX = w / (cols + 1);
    const gapY = h / (rows + 1);

    // Draw dot grid
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const x   = c * gapX;
        const y   = r * gapY;
        const pct = y / h;
        const lit = Math.abs(y - scanY) < gapY * 1.2;

        ctx.beginPath();
        ctx.arc(x, y, lit ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = lit ? gold : goldDot;
        ctx.fill();
      }
    }

    // Laser line
    const lineAlpha = 0.55;
    const grad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, `rgba(242,202,80,${lineAlpha})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 2, w, 4);

    scanY += 1.4;
    if (scanY > h + 10) scanY = -10;

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
}

/* ═══════════════════════════════════════
   SVG ECG: Card 3 — Electrocardiogram Path
   ═══════════════════════════════════════ */
function initECGAnimation(svgEl) {
  if (!svgEl) return;

  const path = svgEl.querySelector('.ecg-path');
  if (!path) return;

  // Build ECG-style path data
  const w = 400;
  const h = 120;
  const baseline = h / 2;

  const points = [
    [0, baseline],
    [40, baseline],
    [50, baseline + 8],
    [60, baseline - 40],
    [70, baseline + 55],
    [80, baseline - 20],
    [90, baseline],
    [140, baseline],
    [150, baseline + 6],
    [160, baseline - 32],
    [170, baseline + 45],
    [180, baseline - 16],
    [190, baseline],
    [240, baseline],
    [250, baseline + 8],
    [260, baseline - 40],
    [270, baseline + 55],
    [280, baseline - 20],
    [290, baseline],
    [340, baseline],
    [350, baseline + 6],
    [360, baseline - 32],
    [370, baseline + 45],
    [380, baseline - 16],
    [390, baseline],
    [400, baseline],
  ];

  const d = points.map((p, i) =>
    (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]
  ).join(' ');

  path.setAttribute('d', d);
  svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);

  // Restart animation loop
  function restart() {
    path.style.animation = 'none';
    path.getBoundingClientRect(); // reflow
    path.style.animation = '';
  }

  path.addEventListener('animationiteration', () => {
    // Keep looping — handled by CSS infinite
  });
}

/* ═══════════════════════════════════════
   INIT — Called from main.js
   ═══════════════════════════════════════ */
function initAllComponents() {
  // Shuffle card
  initShuffleCard(document.querySelector('.shuffle-stack'));

  // Typewriter card
  initTypewriterCard(document.querySelector('.typewriter-text'));

  // Scheduler card
  initSchedulerCard(document.querySelector('.scheduler-display'));

  // Canvas: concentric circles (Protocol Card 1)
  initConcentricCanvas(document.querySelector('#canvas-concentric'));

  // Canvas: laser scan (Protocol Card 2)
  initLaserCanvas(document.querySelector('#canvas-laser'));

  // SVG ECG (Protocol Card 3)
  initECGAnimation(document.querySelector('.ecg-svg'));
}

// Export for consumption by main.js
window.AlineComponents = { initAllComponents };
