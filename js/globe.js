/** Original procedural illustration. This is a projected 3D sphere drawn on Canvas 2D,
 * not a geographic or infrastructure dataset. Approximate land polygons are decorative.
 * Animation pauses offscreen, in hidden tabs, on request, or with reduced-motion enabled.
 */
export function startGlobe(canvas, button) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    button.hidden = true;
    return;
  }
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = motion.matches,
    visible = true,
    frame = 0,
    last = 0,
    angle = -0.2;
  const TAU = Math.PI * 2,
    rad = Math.PI / 180;
  // Longitude/latitude sketches authored for the artwork, intentionally approximate.
  const lands = [
    [
      [-168, 66],
      [-140, 70],
      [-122, 58],
      [-105, 53],
      [-91, 50],
      [-62, 53],
      [-53, 46],
      [-68, 43],
      [-80, 25],
      [-98, 17],
      [-106, 24],
      [-116, 31],
      [-126, 48],
      [-151, 58],
    ],
    [
      [-81, 12],
      [-65, 11],
      [-51, 3],
      [-35, -7],
      [-42, -23],
      [-53, -34],
      [-67, -56],
      [-76, -47],
      [-73, -28],
      [-81, -5],
    ],
    [
      [-17, 34],
      [7, 37],
      [34, 31],
      [51, 10],
      [43, -15],
      [32, -34],
      [18, -35],
      [8, -16],
      [-1, 5],
      [-16, 15],
    ],
    [
      [-11, 36],
      [-10, 58],
      [14, 70],
      [35, 62],
      [49, 70],
      [84, 76],
      [142, 63],
      [177, 57],
      [155, 38],
      [139, 35],
      [121, 20],
      [104, 0],
      [94, 19],
      [71, 8],
      [53, 29],
      [39, 40],
      [28, 38],
      [11, 44],
    ],
    [
      [112, -12],
      [131, -11],
      [146, -18],
      [154, -28],
      [141, -39],
      [117, -34],
    ],
    [
      [-54, 59],
      [-43, 60],
      [-21, 76],
      [-31, 83],
      [-54, 79],
      [-63, 68],
    ],
  ];
  const peru = [
    [-81, -4],
    [-75, 0],
    [-69, -5],
    [-69, -17],
    [-75, -14],
    [-78, -8],
  ];
  function inside(x, y, p) {
    let hit = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [a, b] = p[i],
        [c, d] = p[j];
      if (b > y !== d > y && x < ((c - a) * (y - b)) / (d - b) + a) hit = !hit;
    }
    return hit;
  }
  const dots = [];
  for (let lat = -75; lat <= 78; lat += 2.3)
    for (let lon = -180; lon < 180; lon += 2.3 / Math.cos(lat * rad)) {
      if (lands.some((p) => inside(lon, lat, p)))
        dots.push({ lon, lat, peru: inside(lon, lat, peru) });
    }
  const project = (lon, lat, r = 1) => {
    const lo = (lon + 71) * rad + angle,
      la = lat * rad;
    const x = Math.cos(la) * Math.sin(lo),
      y = -Math.sin(la),
      z = Math.cos(la) * Math.cos(lo);
    const tilt = 0.17;
    return {
      x: x * r,
      y: (y * Math.cos(tilt) - z * Math.sin(tilt)) * r,
      z: (y * Math.sin(tilt) + z * Math.cos(tilt)) * r,
    };
  };
  function draw() {
    const size = Math.max(1, canvas.clientWidth),
      dpr = Math.min(devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(size * dpr)) {
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const cx = size * 0.5,
      cy = size * 0.49,
      r = size * 0.365;
    const bg = ctx.createRadialGradient(
      cx - r * 0.3,
      cy - r * 0.4,
      r * 0.1,
      cx + r * 0.1,
      cy + r * 0.05,
      r * 1.05,
    );
    bg.addColorStop(0, "#fcfaf3");
    bg.addColorStop(0.55, "#ece9df");
    bg.addColorStop(0.86, "#dedace");
    bg.addColorStop(1, "#c9c8bd");
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.clip();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#858a7728";
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let pen = false;
      for (let lon = -180; lon <= 180; lon += 2) {
        const p = project(lon, lat);
        if (p.z > 0) {
          if (!pen) ctx.moveTo(cx + p.x * r, cy + p.y * r);
          else ctx.lineTo(cx + p.x * r, cy + p.y * r);
          pen = true;
        } else pen = false;
      }
      ctx.stroke();
    }
    for (let lon = -180; lon < 180; lon += 30) {
      ctx.beginPath();
      let pen = false;
      for (let lat = -90; lat <= 90; lat += 2) {
        const p = project(lon, lat);
        if (p.z > 0) {
          if (!pen) ctx.moveTo(cx + p.x * r, cy + p.y * r);
          else ctx.lineTo(cx + p.x * r, cy + p.y * r);
          pen = true;
        } else pen = false;
      }
      ctx.stroke();
    }
    dots.forEach((d) => {
      const p = project(d.lon, d.lat);
      if (p.z < 0) return;
      ctx.beginPath();
      ctx.arc(
        cx + p.x * r,
        cy + p.y * r,
        (d.peru ? 1.3 : 1.05) * (size / 600),
        0,
        TAU,
      );
      ctx.fillStyle = d.peru
        ? "#a52b1f"
        : `rgba(61,68,49,${0.22 + p.z * 0.54})`;
      ctx.fill();
    });
    ctx.restore();
    // Elliptical orbital arcs convey connectivity; they are not measured routes.
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.6 + i * 0.63);
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        r * (1.24 + i * 0.04),
        r * (0.36 + i * 0.12),
        0,
        0,
        TAU,
      );
      ctx.strokeStyle = i === 1 ? "#a52b1f9a" : "#7e80694a";
      ctx.lineWidth = i === 1 ? 1.0 : 0.7;
      ctx.stroke();
      const t = angle * 1.5 + i * 2;
      const x = Math.cos(t) * r * (1.24 + i * 0.04),
        y = Math.sin(t) * r * (0.36 + i * 0.12);
      ctx.beginPath();
      ctx.arc(x, y, i === 1 ? 4 : 2.5, 0, TAU);
      ctx.fillStyle = i === 1 ? "#a52b1f" : "#69735e";
      ctx.fill();
      ctx.restore();
    }
    const lima = project(-77, -12);
    if (lima.z > 0) {
      ctx.beginPath();
      ctx.arc(cx + lima.x * r, cy + lima.y * r, 5, 0, TAU);
      ctx.fillStyle = "#a52b1f";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + lima.x * r, cy + lima.y * r, 10, 0, TAU);
      ctx.strokeStyle = "#a52b1f77";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  function tick(time) {
    frame = 0;
    if (!paused && visible && !document.hidden) {
      if (last) angle += Math.min(time - last, 50) * 0.000035;
      last = time;
      draw();
      frame = requestAnimationFrame(tick);
    }
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused ? "Resume motion ↻" : "Pause motion Ⅱ";
    draw();
    if (!paused && visible && !document.hidden)
      frame = requestAnimationFrame(tick);
  }
  button.addEventListener("click", () => {
    paused = !paused;
    sync();
  });
  motion.addEventListener("change", () => {
    paused = motion.matches;
    sync();
  });
  document.addEventListener("visibilitychange", sync);
  new ResizeObserver(draw).observe(canvas);
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      sync();
    },
    { threshold: 0.05 },
  ).observe(canvas);
  sync();
}
