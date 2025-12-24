// =========================================
// MAIN LOGIC: THEMES, INTERACTIONS & DEMOS
// =========================================

document.addEventListener('DOMContentLoaded', function(){
  
  // --- 1. Theme Logic ---
  const themeBtn = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('cliniq_theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  if(themeBtn){
    themeBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      let next = 'light';
      if (current === 'light') next = 'blue';
      else if (current === 'blue') next = 'dark';
      else next = 'light';
      
      html.setAttribute('data-theme', next);
      localStorage.setItem('cliniq_theme', next);
    });
  }

  // --- 2. Smooth Scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length > 1 && href.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // --- 3. Mobile Menu ---
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const mobileNav = document.getElementById("mobileNav");
  const overlay = document.getElementById("navOverlay");

  function closeMenu() {
    mobileNav.classList.remove("open");
    overlay.classList.remove("active");
  }

  if (mobileBtn) {
    mobileBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
      overlay.classList.toggle("active");
    });
  }

  overlay.addEventListener("click", closeMenu);

  // --- 4. INITIALIZE LIVE DEMOS ---
  initLiveVisuals();
});

// =========================================
// KENYA DISEASE MAP: SHARP COUNTIES & PRECISION GLOW
// =========================================

let kenyaMapChart = null; 

function initKenyaHeroMap() {
  if (typeof Highcharts === "undefined" || !Highcharts.mapChart) return;
  const container = document.getElementById("kenya-map");
  if (!container) return;

  // 1. Load Data
  const mapData = Highcharts.maps["countries/ke/ke-all"];
  
  if (!mapData) {
    console.error("Highcharts Map Data for Kenya not loaded. Check script tags.");
    return;
  }

  // 2. Generate Randomized "Case Data" for visual variety
  const data = mapData.features.map((f) => ({
    "hc-key": f.properties["hc-key"],
    value: Math.floor(Math.random() * 80) + 10 
  }));

  // 3. Initialize Chart
  kenyaMapChart = Highcharts.mapChart("kenya-map", {
    chart: {
      map: "countries/ke/ke-all",
      backgroundColor: "transparent",
      events: {
        load: function () {
          startPulseGenerator(this);
        }
      }
    },
    title: { text: "" },
    legend: { enabled: false },
    credits: { enabled: false },
    mapNavigation: { enabled: false }, 

    // 4. Custom Tooltip
    tooltip: {
      useHTML: true,
      padding: 0,
      backgroundColor: 'transparent',
      borderWidth: 0,
      shadow: false,
      headerFormat: '',
      pointFormat: `
        <div style="
          background: var(--surface); 
          border: 1px solid var(--border); 
          border-radius: 8px; 
          padding: 8px 12px; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">County</div>
          <div style="font-size:0.95rem; font-weight:700; color:var(--text); margin-bottom:4px;">{point.name}</div>
          <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:6px; height:6px; background:#ef4444; border-radius:50%;"></div>
            <span style="font-size:0.8rem; font-weight:600; color:#ef4444;">{point.value} Cases</span>
          </div>
        </div>
      `
    },

    // 5. Colors that create distinct shapes (Blue Theme)
    colorAxis: {
      min: 0,
      stops: [
        [0, 'rgba(11, 116, 255, 0.1)'],  
        [0.5, 'rgba(11, 116, 255, 0.4)'], 
        [1, 'rgba(11, 116, 255, 0.8)']   
      ]
    },

    series: [{
      data: data,
      name: "Active Cases",
      joinBy: "hc-key",
      
      borderColor: "#ffffff", 
      borderWidth: 1.2,       
      nullColor: "#f1f5f9",
      
      states: {
        hover: {
          color: "var(--primary)", 
          borderColor: "#ffffff",
          brightness: 0.1
        }
      },
      dataLabels: { enabled: false }
    }]
  });
}

// =========================================
// PRECISION PULSE GENERATOR
// =========================================
function startPulseGenerator(chart) {
  const container = document.getElementById("kenya-map");
  
  // Spawn a new alert every 2 seconds
  setInterval(() => {
    if (!chart || !chart.series || !chart.series[0]) return;

    // 1. Pick a random county
    const points = chart.series[0].points;
    const validPoints = points.filter(p => p.plotX && p.plotY); 
    if (validPoints.length === 0) return;

    const randomPoint = validPoints[Math.floor(Math.random() * validPoints.length)];

    // 2. Create Marker
    const pulse = document.createElement("div");
    pulse.className = "pulse-marker";
    
    // 3. Position exactly at County Center (chart coordinates + offset)
    const x = chart.plotLeft + randomPoint.plotX;
    const y = chart.plotTop + randomPoint.plotY;

    pulse.style.left = `${x}px`;
    pulse.style.top = `${y}px`;

    // 4. Add visual rings
    pulse.innerHTML = `<div class="pulse-ring"></div><div class="pulse-ring"></div>`;

    container.appendChild(pulse);
    
    // 5. Cleanup
    setTimeout(() => { pulse.remove(); }, 3000);

  }, 1400); 
}

// =========================================
// LIVE VISUALS ENGINE
// =========================================
function initLiveVisuals() {
  
  // A. Home Page Map (CORRECTED FUNCTION CALL)
  if(document.getElementById('kenya-map')) initKenyaHeroMap();

  // B. Emergency Page Demos
  if(document.querySelector('#emergencyVisualDemo')) initEmergencyVisualDemo();
  
  // C. Nearby Hospitals Map (SVG Loader)
  if(document.getElementById("nearbyHospitalsMap")) loadMapAnimation();

  // D. Application Page Feature Demos
  if(document.getElementById('visual-disease')) initDiseaseDemo();
  if(document.getElementById('visual-doctors')) initDoctorsMultiColumn();
  if(document.getElementById('visual-pillbox')) initPillboxDemo();
  if(document.getElementById('visual-devices')) initDevicesDemo();
  if(document.getElementById('visual-consumables')) initConsumablesDemo();
  if(document.getElementById('visual-tests')) initTestsDemo();
  if(document.getElementById('visual-audio')) initAudioDemo();
}

// Helper to get CSS variables
function getCssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

// --- Emergency Page Visual Demos ---
function initEmergencyVisualDemo() {
  const container = document.querySelector('#emergencyVisualDemo');
  if (!container) return;
  container.innerHTML = ''; 

  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);

  // Resize canvas to fix blurriness
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  const ctx = canvas.getContext('2d');
  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const primaryColor = getCssVar('--primary');
    const dangerColor = getCssVar('--danger') || '#ef4444';
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const pulseStrength = Math.sin(frame * 0.05) * 5 + 5; 

    // Pulse
    ctx.fillStyle = dangerColor;
    ctx.globalAlpha = 0.5 - Math.sin(frame * 0.05) * 0.2; 
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60 + pulseStrength, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Text
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 16px var(--font-main)';
    ctx.textAlign = 'center';
    ctx.fillText('URGENCY MONITOR', centerX, centerY + 85);

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

// --- Load nearby hospitals map animation ---
function loadMapAnimation() {
  const container = document.getElementById("nearbyHospitalsMap");
  if (!container) return;
  container.innerHTML = `<div style="display:grid; place-items:center; height:100%; color:var(--text-muted);">Scanning Area...</div>`;
}

/* =================================================================
   NEW & IMPROVED ANIMATIONS (THE BIG 7)
================================================================= */

// 1. DISEASE TRACKING: Expanding Radar & Hotspots
function initDiseaseDemo() {
  const container = document.getElementById('visual-disease');
  if (!container) return;
  container.innerHTML = ''; 
  
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  let angle = 0;
  const hotspots = [
    {x: 0.3, y: 0.4, r: 0, maxR: 20, speed: 0.5, color: '#ef4444'},
    {x: 0.6, y: 0.7, r: 10, maxR: 30, speed: 0.3, color: '#f59e0b'},
    {x: 0.7, y: 0.3, r: 5, maxR: 15, speed: 0.7, color: '#ef4444'}
  ];

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = getCssVar('--border');
    ctx.lineWidth = 1;
    const gridSize = 40;
    for(let x=0; x<width; x+=gridSize) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,height); ctx.stroke(); }
    for(let y=0; y<height; y+=gridSize) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(width,y); ctx.stroke(); }

    // Radar Scan
    const cx = width/2;
    const cy = height/2;
    const radius = Math.min(width, height) * 0.4;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI*2);
    ctx.strokeStyle = getCssVar('--primary');
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    
    const gradient = ctx.createLinearGradient(0, 0, radius, 0);
    gradient.addColorStop(0, 'rgba(11, 116, 255, 0)');
    gradient.addColorStop(1, 'rgba(11, 116, 255, 0.4)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0, radius, -0.2, 0.2);
    ctx.fill();
    ctx.restore();

    // Hotspots
    hotspots.forEach(spot => {
        const sx = spot.x * width;
        const sy = spot.y * height;
        
        spot.r += spot.speed;
        if(spot.r > spot.maxR) spot.r = 0;
        
        ctx.beginPath();
        ctx.arc(sx, sy, spot.r, 0, Math.PI*2);
        ctx.strokeStyle = spot.color;
        ctx.globalAlpha = 1 - (spot.r / spot.maxR);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI*2);
        ctx.fillStyle = spot.color;
        ctx.fill();
    });

    angle += 0.03;
    requestAnimationFrame(animate);
  }
  animate();
}
// 2. DOCTOR FINDER: Scrolling Grid of Doctors
function initDoctorsMultiColumn() {
  const container = document.getElementById("visual-doctors");
  if (!container) return;

  container.innerHTML = "";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.gap = "24px";
  container.style.overflow = "hidden";
  container.style.padding = "20px 0";

  // Doctor data
  const doctors = [
    {name: 'Dr. Sarah W.', spec: 'Cardiologist', img: '❤️', bg: '#fee2e2', text: '#991b1b'},
    {name: 'Dr. James K.', spec: 'Pediatrician', img: '👶', bg: '#dcfce7', text: '#166534'},
    {name: 'Dr. Amina M.', spec: 'Neurologist', img: '🧠', bg: '#e0f2fe', text: '#075985'},
    {name: 'Dr. Peter O.', spec: 'Dentist', img: '🦷', bg: '#fef9c3', text: '#854d0e'},
    {name: 'Dr. Lina T.', spec: 'Dermatologist', img: '🌿', bg: '#ede9fe', text: '#5b21b6'},
    {name: 'Dr. Kevin R.', spec: 'Orthopedic', img: '🦴', bg: '#d1fae5', text: '#065f46'}
  ];

  // Speeds for each column
  const speeds = [0.3, 0.55, 0.9];

  // Create a single card
  function createCard(d) {
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.gap = "14px";
    card.style.padding = "14px";
    card.style.borderRadius = "16px";
    card.style.background = "var(--bg)";
    card.style.border = "1px solid var(--border)";
    card.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
    card.style.minHeight = "70px";

    card.innerHTML = `
      <div style="
        width:40px; height:40px; 
        background:${d.bg};
        border-radius:50%;
        display:grid; place-items:center;
        font-size:1.2rem;">
        ${d.img}
      </div>
      <div>
        <div style="font-weight:700; font-size:0.95rem;">${d.name}</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">${d.spec}</div>
      </div>
      <div style="margin-left:auto; width:10px; height:10px; background:#22c55e; border-radius:50%;"></div>
    `;
    return card;
  }

  // Create a scrolling column
  function createColumn(speedIndex) {
    const wrapper = document.createElement("div");
    wrapper.style.width = "260px";
    wrapper.style.height = "340px";
    wrapper.style.overflow = "hidden";
    wrapper.style.position = "relative";

    const track = document.createElement("div");
    track.style.display = "flex";
    track.style.flexDirection = "column";
    track.style.gap = "16px";
    track.style.position = "absolute";
    track.style.top = "0";
    track.style.left = "0";
    wrapper.appendChild(track);

    const repeated = [...doctors, ...doctors, ...doctors, ...doctors];
    repeated.forEach(d => track.appendChild(createCard(d)));

    let y = 0;
    const speed = speeds[speedIndex];

    function scroll() {
      y -= speed;

      const cardHeight = 86;
      const resetPoint = cardHeight * doctors.length;

      if (Math.abs(y) >= resetPoint) y = 0;

      track.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(scroll);
    }
    scroll();

    return wrapper;
  }

  // Build the 3 columns
  const col1 = createColumn(0);
  const col2 = createColumn(1);
  const col3 = createColumn(2);

  container.appendChild(col1);
  container.appendChild(col2);
  container.appendChild(col3);
}

// 3. PILLBOX: Interactive Checkbox Animation
function initPillboxDemo() {
  const container = document.getElementById('visual-pillbox');
  if (!container) return;
  container.innerHTML = '';
  
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.gap = '1rem';

  const pills = [
    { name: 'Morning Meds', time: '08:00 AM', color: 'var(--primary)' },
    { name: 'Vitamin C', time: '01:00 PM', color: '#f59e0b' },
    { name: 'Night Dose', time: '09:00 PM', color: '#8b5cf6' }
  ];

  pills.forEach((pill, idx) => {
    const row = document.createElement('div');
    row.style.background = 'var(--bg)';
    row.style.border = '1px solid var(--border)';
    row.style.width = '80%';
    row.style.padding = '12px 20px';
    row.style.borderRadius = '12px';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.justifyContent = 'space-between';
    row.style.transition = '0.3s';
    
    row.innerHTML = `
      <div style="display:flex; flex-direction:column;">
        <span style="font-weight:600; font-size:0.95rem;">${pill.name}</span>
        <span style="font-size:0.75rem; color:var(--text-muted);">${pill.time}</span>
      </div>
      <div class="check-box-${idx}" style="width:24px; height:24px; border:2px solid ${pill.color}; border-radius:6px; display:grid; place-items:center; transition:0.3s;">
        <svg class="check-icon" style="width:16px; opacity:0; transition:0.2s;" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
    `;
    container.appendChild(row);

    // Auto-animate loop
    setInterval(() => {
      const box = row.querySelector(`.check-box-${idx}`);
      const icon = box.querySelector('.check-icon');
      
      // Toggle On
      setTimeout(() => {
        box.style.background = pill.color;
        icon.style.opacity = '1';
      }, idx * 2000 + 1000);

      // Toggle Off
      setTimeout(() => {
        box.style.background = 'transparent';
        icon.style.opacity = '0';
      }, idx * 2000 + 2500);

    }, 6000);
  });
}

// 4. DEVICES: Smooth ECG Chart
function initDevicesDemo() {
  const container = document.getElementById('visual-devices');
  if(!container) return;
  container.innerHTML = '';
  
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  let dataPoints = [];
  let xOffset = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    const cellSize = 30;
    ctx.beginPath();
    for(let x=0; x<width; x+=cellSize) { ctx.moveTo(x,0); ctx.lineTo(x,height); }
    for(let y=0; y<height; y+=cellSize) { ctx.moveTo(0,y); ctx.lineTo(width,y); }
    ctx.stroke();

    // ECG Value
    xOffset += 3; 
    const cycle = xOffset % 300; 
    let yVal = height / 2;

    // PQRST wave simulation
    if(cycle > 200 && cycle < 210) yVal -= 10; // P
    else if(cycle > 220 && cycle < 230) yVal += 10; // Q
    else if(cycle >= 230 && cycle < 240) yVal -= 80; // R (Spike)
    else if(cycle >= 240 && cycle < 250) yVal += 30; // S
    else if(cycle > 260 && cycle < 280) yVal -= 15; // T
    
    yVal += Math.random() * 4 - 2;

    dataPoints.push(yVal);
    if(dataPoints.length > width / 3) dataPoints.shift(); 

    // Draw Line
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ef4444'; 
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;

    for(let i=0; i<dataPoints.length; i++) {
      const x = i * 3;
      if(i===0) ctx.moveTo(x, dataPoints[i]);
      else ctx.lineTo(x, dataPoints[i]);
    }
    ctx.stroke();
    
    ctx.shadowBlur = 0;

    // "Live" Dot
    const lastX = (dataPoints.length - 1) * 3;
    const lastY = dataPoints[dataPoints.length - 1];
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI*2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    requestAnimationFrame(animate);
  }
  animate();
}

// 5. CONSUMABLES: Horizontal Sliding Products
function initConsumablesDemo() {
  const container = document.getElementById("visual-consumables");
  if (!container) return;

  container.innerHTML = "";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.gap = "24px";
  container.style.overflow = "hidden";
  container.style.padding = "20px 0";

  // Consumable data (with emojis)
  const consumables = [
    { name: "Masks", emoji: "😷", color: "#bfdbfe" },
    { name: "Sanitizer", emoji: "🧴", color: "#bbf7d0" },
    { name: "Gloves", emoji: "🧤", color: "#ddd6fe" },
    { name: "Vitamins", emoji: "💊", color: "#fef3c7" },
    { name: "Plasters", emoji: "🩹", color: "#fecaca" },
    { name: "Thermometers", emoji: "🌡️", color: "#fde68a" },
    { name: "Gauze", emoji: "🩼", color: "#e0f2fe" }
  ];

  const speeds = [0.35, 0.55, 0.85]; 

  // Create a consumable card component
  function createCard(item) {
    const card = document.createElement("div");
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.gap = "14px";
    card.style.padding = "14px";
    card.style.minHeight = "70px";
    card.style.borderRadius = "16px";
    card.style.background = "var(--bg)";
    card.style.border = "1px solid var(--border)";
    card.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
    card.style.transition = "transform .25s ease";

    card.innerHTML = `
      <div style="
        width:40px; height:40px;
        background:${item.color};
        border-radius:12px;
        display:grid; place-items:center;
        font-size:1.4rem;">
        ${item.emoji}
      </div>

      <div style="font-weight:700; font-size:0.95rem;">
        ${item.name}
      </div>
    `;

    card.onmouseenter = () => (card.style.transform = "translateY(-4px)");
    card.onmouseleave = () => (card.style.transform = "translateY(0)");

    return card;
  }

  // Create a vertical looping column
  function createColumn(speedIndex) {
    const wrapper = document.createElement("div");
    wrapper.style.width = "260px";
    wrapper.style.height = "340px";
    wrapper.style.overflow = "hidden";
    wrapper.style.position = "relative";

    const track = document.createElement("div");
    track.style.display = "flex";
    track.style.flexDirection = "column";
    track.style.position = "absolute";
    track.style.top = "0";
    wrapper.appendChild(track);

    // Repeat consumables for infinite loop
    const repeated = [...consumables, ...consumables, ...consumables];
    repeated.forEach((item) => track.appendChild(createCard(item)));

    let y = 0;
    const speed = speeds[speedIndex];

    function animate() {
      y -= speed;

      const itemHeight = 86;
      const resetPoint = itemHeight * consumables.length;

      if (Math.abs(y) >= resetPoint) y = 0;

      track.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(animate);
    }

    animate();

    return wrapper;
  }

  // Add three independently scrolling columns
  container.appendChild(createColumn(0));
  container.appendChild(createColumn(1));
  container.appendChild(createColumn(2));
}

// 6. CLINIC TESTS: Bubbling Apparatus Animation
function initTestsDemo() {
  const container = document.getElementById('visual-tests');
  if (!container) return;
  container.innerHTML = '';

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  let width, height;
  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  // Bubbles
  const bubbles = [];
  for(let i=0; i<15; i++) {
    bubbles.push({
      x: Math.random() * 40 - 20,
      y: Math.random() * 80,
      r: Math.random() * 4 + 2,
      speed: Math.random() * 1 + 0.5
    });
  }

  let colorHue = 200; 

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    const cx = width / 2;
    const cy = height / 2 + 50;
    
    colorHue = (colorHue + 0.2) % 360;
    const liquidColor = `hsla(${colorHue}, 70%, 60%, 0.6)`;
    const bubbleColor = `hsla(${colorHue}, 70%, 80%, 0.8)`;

    ctx.save();
    ctx.translate(cx, cy);

    // Draw Flask
    ctx.beginPath();
    ctx.moveTo(-30, -120); 
    ctx.lineTo(30, -120);  
    ctx.lineTo(30, -60);   
    ctx.lineTo(80, 40);    
    ctx.quadraticCurveTo(80, 80, 0, 80); 
    ctx.quadraticCurveTo(-80, 80, -80, 40); 
    ctx.lineTo(-30, -60);  
    ctx.closePath();
    
    ctx.strokeStyle = getCssVar('--text');
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.clip(); 

    // Liquid
    const liquidLevel = 20 + Math.sin(Date.now() / 1000) * 5; 
    ctx.fillStyle = liquidColor;
    ctx.fillRect(-80, -liquidLevel, 160, 200);
    
    // Bubbles
    bubbles.forEach(b => {
      b.y -= b.speed;
      if (b.y < -liquidLevel - 10) b.y = 80; 
      
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = bubbleColor;
      ctx.fill();
    });

    ctx.restore();
    
    // Flask Rim
    ctx.beginPath();
    ctx.rect(cx - 35, cy - 125, 70, 10);
    ctx.fillStyle = getCssVar('--surface');
    ctx.fill();
    ctx.stroke();

    requestAnimationFrame(animate);
  }
  animate();
}

// 7. AUDIO GUIDE: Multi-colored Waveform
function initAudioDemo() {
  const container = document.getElementById('visual-audio');
  if (!container) return;
  container.innerHTML = '';
  
  // Custom dark background for this specific visual
  container.style.background = '#020617';

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width, height;
  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  let time = 0;
  const waves = [
    { color: '#38bdf8', speed: 0.02, amp: 40, freq: 0.01 }, // Blue
    { color: '#e879f9', speed: 0.03, amp: 30, freq: 0.02 }, // Purple
    { color: '#4ade80', speed: 0.01, amp: 20, freq: 0.015 },// Green
    { color: '#facc15', speed: 0.04, amp: 10, freq: 0.03 }, // Yellow
    { color: '#f87171', speed: 0.025, amp: 15, freq: 0.025 } // Red
  ];

  function animate() {
    ctx.clearRect(0, 0, width, height);

    waves.forEach((wave, i) => {
      ctx.beginPath();
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = 3;
      
      for (let x = 0; x < width; x++) {
        const y = height / 2 + 
                  Math.sin(x * wave.freq + time * (i+1)) * wave.amp * Math.sin(time); 
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    time += 0.05;
    requestAnimationFrame(animate);
  }
  animate();
}

// Service worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../../service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
}
