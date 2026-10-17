// AOI — real-time scroll film (three.js core only, custom bloom + planar reflections)
const THREE_URL = './vendor/three.module.min.js'; // three.js r184, hébergé dans le dépôt
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const sm = (t) => t * t * (3 - 2 * t);
const sm5 = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const eOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export async function createFilm({ host, section, overlay, getProps }) {
  const THREE = await import(THREE_URL);
  if (!document.createElement('canvas').getContext('webgl2')) throw new Error('WebGL2 indisponible');
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const PI = Math.PI;
  const ORANGE = new THREE.Color(1.0, 0.36, 0.09);
  const glowCol = (k) => ORANGE.clone().multiplyScalar(k);

  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x050506, 1);
  const canvas = renderer.domElement;
  Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050506);
  scene.fog = new THREE.FogExp2(0x050506, 0.012);
  const world = new THREE.Group();
  scene.add(world);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 520);

  // Studio environment for metal reflections
  {
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: 0x060607, side: THREE.BackSide })));
    const panel = (w, h, col, k, p) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(...p); m.lookAt(0, 0, 0); env.add(m); };
    panel(16, 3, 0xffffff, 2.4, [0, 13, 2]);
    panel(6, 10, 0xc8d2e4, 0.9, [-13, 4, 6]);
    panel(5, 7, 0xff7a30, 1.8, [13, 2, -6]);
    panel(10, 2, 0xffffff, 0.7, [4, 6, -13]);
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(env, 0.03).texture;
    pm.dispose();
    scene.environmentIntensity = 0.8;
  }

  // Lights
  world.add(new THREE.HemisphereLight(0x7d8798, 0x050505, 0.35));
  const key = new THREE.DirectionalLight(0xe6ecff, 1.5);
  key.position.set(-28, 46, 22);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 150 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.bias = -0.0005; key.shadow.normalBias = 0.04; key.shadow.radius = 3;
  world.add(key);
  const rim = new THREE.DirectionalLight(0xff9a5c, 0.7);
  rim.position.set(30, 14, -28);
  world.add(rim);
  const warm = new THREE.PointLight(0xff7428, 0, 40, 2);
  warm.position.set(0, 5, 8);
  world.add(warm);
  const parcelLight = new THREE.PointLight(0xff6a20, 0, 28, 2);
  parcelLight.position.set(0, 1.6, 0);
  world.add(parcelLight);
  const cursorLight = new THREE.PointLight(0xff7a33, 0, 18, 2); world.add(cursorLight);
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hitP = new THREE.Vector3();
  const touch = window.matchMedia('(pointer: coarse)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let moved = false, portrait = false, dynScale = 1, layoutReady = false;

  // Procedural textures
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  function canvasTex(w, h, draw, srgb = true) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = maxAniso; return t;
  }
  const R = rng(7), S = 1024;
  const streaks = Array.from({ length: 3400 }, () => [R() * S, R() * S, 30 + R() * S * 0.5, R() * 0.07, R() < 0.5]);
  const traces = [];
  for (let i = 0; i < 36; i++) {
    let x = Math.round(R() * 32) * 32, y = Math.round(R() * 32) * 32; const pts = [[x, y]]; let hz = R() < 0.5;
    for (let k = 0, n = 2 + Math.floor(R() * 4); k < n; k++) { const L = (1 + Math.floor(R() * 5)) * 32 * (R() < 0.5 ? -1 : 1); if (hz) x += L; else y += L; pts.push([x, y]); hz = !hz; }
    traces.push(pts);
  }
  const drawGround = (mode) => (g, w, h) => {
    const map = mode === 'map';
    g.fillStyle = map ? '#4c4d51' : '#8c8c8c'; g.fillRect(0, 0, w, h);
    for (const [x, y, l, a, light] of streaks) { const k = map ? a : a * 1.7; g.fillStyle = light ? `rgba(255,255,255,${k})` : `rgba(0,0,0,${k})`; g.fillRect(x, y, l, 1); g.fillRect(x - w, y, l, 1); }
    const step = w / 8;
    for (let k = 0; k <= 8; k++) {
      const p = k * step;
      g.fillStyle = map ? 'rgba(0,0,0,.55)' : 'rgba(255,255,255,.35)'; g.fillRect(p - 1.5, 0, 3, h); g.fillRect(0, p - 1.5, w, 3);
      if (map) { g.fillStyle = 'rgba(255,255,255,.09)'; g.fillRect(p + 1.5, 0, 1, h); g.fillRect(0, p + 1.5, w, 1); }
    }
    for (const pts of traces) {
      g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const [x, y] of pts.slice(1)) g.lineTo(x, y);
      g.strokeStyle = map ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.22)'; g.lineWidth = 3; g.stroke();
      if (map) { g.strokeStyle = 'rgba(255,255,255,.05)'; g.lineWidth = 1; g.stroke(); }
      const [ex, ey] = pts[pts.length - 1]; g.fillStyle = map ? 'rgba(0,0,0,.5)' : 'rgba(255,255,255,.25)'; g.fillRect(ex - 5, ey - 5, 10, 10);
    }
  };
  const GSIZE = 440, TILE = 16;
  const gMap = canvasTex(S, S, drawGround('map'));
  const gRough = canvasTex(S, S, drawGround('rough'), false);
  gMap.repeat.set(GSIZE / TILE, GSIZE / TILE); gRough.repeat.copy(gMap.repeat);

  const roomTex = canvasTex(128, 128, (g, w, h) => {
    const gr = g.createRadialGradient(w * 0.5, h * 0.3, 4, w * 0.5, h * 0.45, w * 0.75);
    gr.addColorStop(0, '#ffd9ae'); gr.addColorStop(0.45, '#d0712f'); gr.addColorStop(1, '#2a1205');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  const dotTex = canvasTex(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
  const RF = rng(11);
  const litCells = Array.from({ length: 16 }, () => [RF() < 0.42, 0.55 + RF() * 0.45]);
  const facadeDraw = (emissive) => (g, w, h) => {
    g.fillStyle = emissive ? '#000' : '#2c2d31'; g.fillRect(0, 0, w, h);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const [lit, b] = litCells[r * 4 + c]; const x = c * 64 + 9, y = r * 128 + 20, ww = 46, hh = 92;
      if (emissive) { if (lit) { g.fillStyle = `rgba(255,${150 + b * 50 | 0},${80 + b * 40 | 0},${b})`; g.fillRect(x, y, ww, hh); } }
      else { g.fillStyle = '#121316'; g.fillRect(x, y, ww, hh); g.fillStyle = '#0c0c0e'; g.fillRect(0, r * 128 + 122, w, 6); }
    }
  };
  const facMap = canvasTex(256, 512, facadeDraw(false));
  const facEm = canvasTex(256, 512, facadeDraw(true));

  // Ground with planar reflection injected into the standard material
  const uRefl = { value: null }, uRes = { value: new THREE.Vector2(1, 1) }, uReflK = { value: 1 };
  const groundMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.62, roughness: 1, map: gMap, roughnessMap: gRough });
  groundMat.onBeforeCompile = (sh) => {
    sh.uniforms.tRefl = uRefl; sh.uniforms.uRes = uRes; sh.uniforms.uReflK = uReflK;
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D tRefl; uniform vec2 uRes; uniform float uReflK;')
      .replace('#include <opaque_fragment>', `{
        vec2 suv = gl_FragCoord.xy / uRes;
        float spread = 0.002 + roughnessFactor * 0.008;
        vec3 rc = texture2D(tRefl, suv).rgb * 0.5;
        rc += texture2D(tRefl, suv + vec2(0.0, spread)).rgb * 0.25;
        rc += texture2D(tRefl, suv - vec2(0.0, spread)).rgb * 0.25;
        float fres = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 2.0);
        outgoingLight += rc * uReflK * (0.3 + 0.7 * fres) * max(0.0, 1.2 - roughnessFactor);
      }
      #include <opaque_fragment>`);
  };
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(GSIZE, GSIZE), groundMat);
  ground.rotation.x = -PI / 2; ground.receiveShadow = true;
  scene.add(ground);

  // Materials
  const M = {
    steel: new THREE.MeshStandardMaterial({ color: 0xb8b5ae, metalness: 0.92, roughness: 0.3 }),
    steelDark: new THREE.MeshStandardMaterial({ color: 0x55565b, metalness: 0.9, roughness: 0.4 }),
    graphite: new THREE.MeshStandardMaterial({ color: 0x2a2b2f, metalness: 0.85, roughness: 0.48 }),
    track: new THREE.MeshStandardMaterial({ color: 0x1a1b1e, metalness: 0.9, roughness: 0.3 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x0b0e12, metalness: 0.1, roughness: 0.04, transparent: true, opacity: 0.55, depthWrite: false }),
    rail: new THREE.MeshStandardMaterial({ color: 0x1a2026, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false }),
  };
  const glowMat = (k, additive = false) => new THREE.MeshBasicMaterial(additive ? { color: glowCol(k), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false } : { color: glowCol(k) });
  const box = (w, h, d, mat, bottom = false, shadow = true) => { const g = new THREE.BoxGeometry(w, h, d); if (bottom) g.translate(0, h / 2, 0); const m = new THREE.Mesh(g, mat); m.castShadow = shadow; m.receiveShadow = shadow; return m; };

  function roundedPath(pts, r) {
    const path = new THREE.CurvePath(); let prev = pts[0].clone();
    for (let i = 1; i < pts.length - 1; i++) {
      const a = pts[i - 1], b = pts[i], c = pts[i + 1];
      const d1 = b.clone().sub(a).normalize(), d2 = c.clone().sub(b).normalize();
      const rr = Math.min(r, a.distanceTo(b) / 2, b.distanceTo(c) / 2);
      const p1 = b.clone().addScaledVector(d1, -rr), p2 = b.clone().addScaledVector(d2, rr);
      if (prev.distanceTo(p1) > 1e-3) path.add(new THREE.LineCurve3(prev, p1));
      path.add(new THREE.QuadraticBezierCurve3(p1, b.clone(), p2)); prev = p2;
    }
    path.add(new THREE.LineCurve3(prev, pts[pts.length - 1].clone()));
    return path;
  }
  function tube(path, radius, mat, segPerM = 5, radial = 8) {
    const len = path.getLength(); const segs = Math.max(8, Math.ceil(len * segPerM));
    const m = new THREE.Mesh(new THREE.TubeGeometry(path, segs, radius, radial, false), mat);
    m.userData = { segs, radial }; return m;
  }
  function setDraw(m, t) { const { segs, radial } = m.userData; const n = Math.floor(segs * clamp(t)); m.geometry.setDrawRange(0, n * radial * 6); m.visible = n > 0; }

  // Parcel
  const PW = 15, PD = 11, HX = PW / 2 + 0.7, HZ = PD / 2 + 0.7;
  const plinth = box(PW, 0.24, PD, M.steelDark, true);
  const plinthTop = box(PW - 0.6, 0.02, PD - 0.6, M.graphite, true); plinthTop.position.y = 0.241; plinth.add(plinthTop);
  world.add(plinth);
  const parcelGlow = tube(roundedPath([V(0, .06, -HZ), V(HX, .06, -HZ), V(HX, .06, HZ), V(-HX, .06, HZ), V(-HX, .06, -HZ), V(0, .06, -HZ)], 0.9), 0.055, glowMat(6), 6, 8);
  world.add(parcelGlow);
  const parcelTrack = tube(roundedPath([V(0, 0, -HZ), V(HX, 0, -HZ), V(HX, 0, HZ), V(-HX, 0, HZ), V(-HX, 0, -HZ), V(0, 0, -HZ)], 0.9), 0.16, M.track, 3, 8);
  world.add(parcelTrack);
  const bollards = [];
  for (const [x, z] of [[-HX, -HZ], [HX, -HZ], [HX, HZ], [-HX, HZ]]) {
    const b = box(0.36, 0.5, 0.36, M.steel, true); b.position.set(x * 1.06, 0, z * 1.08);
    const cap = box(0.3, 0.03, 0.3, glowMat(0), true, false); cap.position.y = 0.5; b.add(cap); world.add(b); bollards.push({ b, cap });
  }

  // Network nodes
  const NODES = [
    { id: 'architecte', x: -21, z: -7, r0: 0.15, p0: 0.19 },
    { id: 'notaire', x: -12, z: -21, r0: 0.165, p0: 0.21 },
    { id: 'etudes', x: 9, z: -22, r0: 0.18, p0: 0.23 },
    { id: 'courtier', x: 22, z: -8, r0: 0.195, p0: 0.25 },
    { id: 'agent', x: 23, z: 9, r0: 0.21, p0: 0.27 },
    { id: 'geometre', x: -2, z: -27, r0: 0.225, p0: 0.29 },
    { id: 'coop1', x: -22, z: 11, r0: 0.35, p0: 0.38 },
    { id: 'coop2', x: -9, z: 21, r0: 0.37, p0: 0.40 },
    { id: 'builder', x: 11, z: 21, r0: 0.57, p0: 0.595 },
    { id: 'constructeur', x: 1, z: 25, r0: 0.585, p0: 0.61 },
  ];
  const nodes = [];
  NODES.forEach((N, i) => {
    let pts;
    if (Math.abs(N.x) / HX > Math.abs(N.z) / HZ) { const ez = clamp(N.z * 0.3, -HZ + 1.6, HZ - 1.6), xm = N.x * 0.55; pts = [V(N.x, 0, N.z), V(xm, 0, N.z), V(xm, 0, ez), V(Math.sign(N.x) * HX, 0, ez)]; }
    else { const ex = clamp(N.x * 0.3, -HX + 1.6, HX - 1.6), zm = N.z * 0.55; pts = [V(N.x, 0, N.z), V(N.x, 0, zm), V(ex, 0, zm), V(ex, 0, Math.sign(N.z) * HZ)]; }
    pts[0].add(pts[1].clone().sub(pts[0]).normalize().multiplyScalar(1.5));
    const glowPts = pts.map(p => p.clone().setY(0.09));
    const path = roundedPath(glowPts, 1.4);
    const track = tube(roundedPath(pts, 1.4), 0.17, M.track, 3, 8); world.add(track);
    const glow = tube(path, 0.06, glowMat(6), 6, 8); world.add(glow);
    const g = new THREE.Group(); g.position.set(N.x, 0, N.z);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 0.34, 64), M.steelDark); base.position.y = 0.17; base.castShadow = base.receiveShadow = true; g.add(base);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 0.05, 64), M.graphite); top.position.y = 0.36; g.add(top);
    const ringMat = glowMat(0); const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.035, 8, 96), ringMat); ring.rotation.x = -PI / 2; ring.position.y = 0.345; g.add(ring);
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0x1b1b1e, metalness: 0.7, roughness: 0.3, emissive: ORANGE, emissiveIntensity: 0 });
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.55), cubeMat); cube.position.y = 1.35; cube.castShadow = true; g.add(cube);
    const beamMat = glowMat(0, true); const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.8, 6), beamMat); beam.position.y = 0.75; g.add(beam);
    world.add(g);
    const endMat = glowMat(0); const end = box(0.34, 0.12, 0.34, endMat, true, false); end.position.copy(pts[pts.length - 1]); world.add(end);
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(16, 6.5, 1.8) })); world.add(spark);
    const pulses = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(12, 5, 1.4) })); m.visible = false; world.add(m); return m; });
    nodes.push({ ...N, g, glow, path, pts: path.getSpacedPoints(180), ringMat, cubeMat, cube, beamMat, endMat, spark, pulses, seed: i * 1.7, speed: 0.16 + (i % 3) * 0.04, pd: N.id.startsWith('coop') ? 0.08 : 0.07, anchor: V(N.x, 2.5, N.z) });
  });

  // Building
  const B = { W: 10, D: 7, n: 4, h: 3.2, y0: 0.262 };
  const bldg = new THREE.Group(); world.add(bldg);
  const elems = [], rooms = [], strips = [];
  const colXs = [-4.75, -1.6, 1.6, 4.75], colZs = [-3.25, 3.25];
  const RB = rng(23);
  const mullGeo = new THREE.BoxGeometry(0.07, B.h - 0.3, 0.09); mullGeo.translate(0, (B.h - 0.3) / 2, 0);
  for (let i = 0; i < B.n; i++) {
    const yb = B.y0 + i * B.h, base = (i / B.n) * 0.76;
    for (const x of colXs) for (const z of colZs) { const c = box(0.36, B.h - 0.3, 0.36, M.steel, true); c.position.set(x, yb, z); bldg.add(c); elems.push({ obj: c, t0: base, d: 0.12, kind: 'grow' }); }
    const gl = box(B.W - 0.7, B.h - 0.3, B.D - 0.7, M.glass, true, false); gl.position.y = yb; gl.renderOrder = 2; bldg.add(gl); elems.push({ obj: gl, t0: base + 0.1, d: 0.1, kind: 'grow' });
    const uw = (B.W - 1) / 3;
    for (let k = 0; k < 3; k++) {
      const rm = new THREE.MeshStandardMaterial({ color: 0x0c0c0d, roughness: 0.9, metalness: 0, emissive: new THREE.Color(1, 0.55, 0.24), emissiveMap: roomTex, emissiveIntensity: 0, side: THREE.BackSide });
      const r = box(uw - 0.18, B.h - 0.46, B.D - 1.15, rm, true, false); r.position.set(-B.W / 2 + 0.5 + uw * (k + 0.5), yb + 0.03, 0); bldg.add(r);
      elems.push({ obj: r, t0: base + 0.1, d: 0.1, kind: 'grow' });
      const th = RB() * 0.7; rooms.push({ mat: rm, th, k: RB() < 0.72 ? 2.6 : 0.35 });
    }
    const xs = []; for (let x = -B.W / 2 + 0.6; x <= B.W / 2 - 0.55; x += 1.05) xs.push(x);
    const zs = []; for (let z = -B.D / 2 + 0.7; z <= B.D / 2 - 0.65; z += 1.1) zs.push(z);
    const mull = new THREE.InstancedMesh(mullGeo, M.steelDark, xs.length * 2 + zs.length * 2);
    const mtx = new THREE.Matrix4(); let mi = 0;
    for (const x of xs) for (const s of [-1, 1]) mull.setMatrixAt(mi++, mtx.makeTranslation(x, 0, s * ((B.D - 0.7) / 2 + 0.03)));
    for (const z of zs) for (const s of [-1, 1]) mull.setMatrixAt(mi++, mtx.makeTranslation(s * ((B.W - 0.7) / 2 + 0.03), 0, z));
    mull.instanceMatrix.needsUpdate = true; mull.position.y = yb; mull.castShadow = true; bldg.add(mull);
    elems.push({ obj: mull, t0: base + 0.1, d: 0.1, kind: 'grow' });
    if (i > 0) {
      const rail = box(B.W - 0.3, 1.0, 0.04, M.rail, true, false); rail.position.set(0, yb, B.D / 2 + 0.16); bldg.add(rail); elems.push({ obj: rail, t0: base + 0.12, d: 0.08, kind: 'grow' });
      const top = box(B.W - 0.3, 0.05, 0.08, M.steel, true); top.position.set(0, yb + 1.0, B.D / 2 + 0.16); bldg.add(top); elems.push({ obj: top, t0: base + 0.14, d: 0.06, kind: 'drop', y: yb + 1.0 });
    }
    const slabY = yb + B.h - 0.3;
    const s = box(B.W + 0.5, 0.3, B.D + 0.5, M.steel, true); s.position.y = slabY; bldg.add(s); elems.push({ obj: s, t0: base + 0.05, d: 0.13, kind: 'drop', y: slabY });
    const strip = box(B.W + 0.5, 0.035, 0.035, glowMat(0), false, false); strip.position.set(0, slabY - 0.02, B.D / 2 + 0.27); bldg.add(strip); strips.push({ m: strip, k: 1.6, t0: base + 0.12 });
  }
  const roofY = B.y0 + B.n * B.h;
  const core = box(2.6, B.n * B.h + 1.5, 2.2, M.graphite, true); core.position.set(1.2, B.y0, -B.D / 2 - 1.05); bldg.add(core); elems.push({ obj: core, t0: 0.0, d: 0.9, kind: 'grow' });
  for (const [w, d, x, z] of [[B.W + 0.5, 0.18, 0, (B.D + 0.5) / 2 - 0.09], [B.W + 0.5, 0.18, 0, -(B.D + 0.5) / 2 + 0.09], [0.18, B.D + 0.5, (B.W + 0.5) / 2 - 0.09, 0], [0.18, B.D + 0.5, -(B.W + 0.5) / 2 + 0.09, 0]]) {
    const pp = box(w, 0.7, d, M.steel, true); pp.position.set(x, roofY, z); bldg.add(pp); elems.push({ obj: pp, t0: 0.8, d: 0.1, kind: 'grow' });
  }
  const rtop = box(3.4, 1.3, 2.4, M.steelDark, true); rtop.position.set(-2.4, roofY, -0.6); bldg.add(rtop); elems.push({ obj: rtop, t0: 0.84, d: 0.1, kind: 'grow' });
  const corner = box(0.07, B.n * B.h - 0.3, 0.07, glowMat(0), true, false); corner.position.set(-4.75, B.y0, 3.47); bldg.add(corner); strips.push({ m: corner, k: 5, t0: 0, grow: true });
  const lobby = box(3.0, 0.05, 0.05, glowMat(0), false, false); lobby.position.set(0, B.y0 + 2.6, B.D / 2 - 0.3); bldg.add(lobby); strips.push({ m: lobby, k: 4, t0: 0 });

  // Wireframe
  const wp = []; const L = (a, b) => wp.push(...a, ...b);
  const hw = B.W / 2, hd = B.D / 2;
  for (let i = 0; i <= B.n; i++) { const y = B.y0 + i * B.h; L([-hw, y, -hd], [hw, y, -hd]); L([hw, y, -hd], [hw, y, hd]); L([hw, y, hd], [-hw, y, hd]); L([-hw, y, hd], [-hw, y, -hd]); }
  for (const x of colXs) for (const z of colZs) L([x, B.y0, z], [x, roofY, z]);
  for (let x = -hw + 0.6; x <= hw - 0.55; x += 1.05) for (const z of [-hd, hd]) L([x, B.y0, z], [x, roofY, z]);
  for (let z = -hd + 0.7; z <= hd - 0.65; z += 1.1) for (const x of [-hw, hw]) L([x, B.y0, z], [x, roofY, z]);
  { const y = roofY + 0.7; L([-hw, y, -hd], [hw, y, -hd]); L([hw, y, -hd], [hw, y, hd]); L([hw, y, hd], [-hw, y, hd]); L([-hw, y, hd], [-hw, y, -hd]); }
  const wireGeo = new THREE.BufferGeometry(); wireGeo.setAttribute('position', new THREE.Float32BufferAttribute(wp, 3));
  const wireMat = new THREE.LineBasicMaterial({ color: glowCol(0), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const wire = new THREE.LineSegments(wireGeo, wireMat); world.add(wire);

  // Floor plan traced on the plinth
  const planMat = glowMat(0, true);
  const py = B.y0 + 0.012;
  const planLines = [
    [V(-hw, py, -hd), V(hw, py, -hd), V(hw, py, hd), V(-hw, py, hd), V(-hw, py, -hd)],
    [V(-1.6, py, -hd), V(-1.6, py, hd)], [V(1.6, py, -hd), V(1.6, py, hd)],
    [V(-hw, py, -0.4), V(-1.6, py, -0.4)], [V(1.6, py, 0.6), V(hw, py, 0.6)],
    [V(-1.6, py, 1.2), V(1.6, py, 1.2)], [V(-3.2, py, -0.4), V(-3.2, py, -hd)], [V(3.2, py, 0.6), V(3.2, py, hd)],
  ].map(pts => { const m = tube(roundedPath(pts, 0.01), 0.028, planMat, 8, 6); world.add(m); return m; });

  // Satellite operations (the network reveal)
  const sats = []; const R2 = rng(42); let tries = 0;
  while (sats.length < 34 && tries < 900) {
    tries++;
    const a = R2() * PI * 2, r = 36 + R2() * 72, x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (sats.some(s => Math.hypot(s.x - x, s.z - z) < 10)) continue;
    const w = 4 + R2() * 5, d = 4 + R2() * 5, hh = 3.5 + Math.pow(R2(), 1.6) * 22;
    const g = new THREE.Group(); g.position.set(x, 0, z); g.visible = false;
    const pl = box(w + 2, 0.2, d + 2, M.steelDark, true, false); g.add(pl);
    const fm = facMap.clone(), fe = facEm.clone(); fm.repeat.set(w / 6.4, hh / 12.8); fe.repeat.copy(fm.repeat);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: fm, emissiveMap: fe, emissive: 0xffffff, emissiveIntensity: 0, metalness: 0.55, roughness: 0.42 });
    const body = box(w, hh, d, [mat, mat, M.steelDark, M.steelDark, mat, mat], true, false); body.position.y = 0.2; g.add(body);
    const rimLine = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([V(-w / 2 - 1, 0.22, -d / 2 - 1), V(w / 2 + 1, 0.22, -d / 2 - 1), V(w / 2 + 1, 0.22, d / 2 + 1), V(-w / 2 - 1, 0.22, d / 2 + 1)]), new THREE.LineBasicMaterial({ color: glowCol(0) }));
    g.add(rimLine); world.add(g);
    sats.push({ x, z, r, g, body, mat, rim: rimLine.material, delay: clamp((r - 36) / 72) * 0.45 + R2() * 0.08 });
  }
  const links = []; const linked = new Set();
  const addLink = (a, b, delay) => {
    const pts = [V(a.x, 0.07, a.z), V(b.x, 0.07, a.z), V(b.x, 0.07, b.z)];
    if (Math.abs(b.x - a.x) < 0.5 || Math.abs(b.z - a.z) < 0.5) pts.splice(1, 1);
    const m = tube(roundedPath(pts, 2.5), 0.07, glowMat(4.5), 2, 6); m.visible = false; world.add(m); links.push({ m, delay });
  };
  sats.forEach((s, i) => {
    const near = sats.map((o, j) => ({ j, d: Math.hypot(o.x - s.x, o.z - s.z) })).filter(o => o.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
    near.forEach(({ j }) => { const k = i < j ? `${i}-${j}` : `${j}-${i}`; if (!linked.has(k)) { linked.add(k); addLink(s, sats[j], Math.min(s.delay, sats[j].delay) + 0.12); } });
    if (s.r < 52) { const n = nodes.slice().sort((a, b) => Math.hypot(a.x - s.x, a.z - s.z) - Math.hypot(b.x - s.x, b.z - s.z))[0]; addLink(n, s, s.delay); }
  });

  // Atmospheric dust
  const dustGeo = new THREE.BufferGeometry(); const dp = [];
  const RD = rng(5); for (let i = 0; i < 700; i++) dp.push((RD() - 0.5) * 90, RD() * 22, (RD() - 0.5) * 90);
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dp, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.14, map: dotTex, color: new THREE.Color(1.6, 0.9, 0.55), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.5 }));
  world.add(dust);

  // Post-processing chain
  const sceneRT = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const reflRT = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
  const reflB = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false });
  uRefl.value = reflRT.texture;
  const LV = 5, bA = [], bB = [];
  for (let i = 0; i < LV; i++) { bA.push(new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false })); bB.push(new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false })); }
  const quadScene = new THREE.Scene(), quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quad.frustumCulled = false; quadScene.add(quad);
  const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  const shader = (fs, uniforms) => new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: fs, uniforms, depthTest: false, depthWrite: false });
  const TAP4 = 'vec3 c = texture2D(tDiffuse, vUv + uTexel*vec2(-.5,-.5)).rgb + texture2D(tDiffuse, vUv + uTexel*vec2(.5,-.5)).rgb + texture2D(tDiffuse, vUv + uTexel*vec2(-.5,.5)).rgb + texture2D(tDiffuse, vUv + uTexel*vec2(.5,.5)).rgb; c *= 0.25;';
  const brightMat = shader(`uniform sampler2D tDiffuse; uniform vec2 uTexel; uniform float uThreshold; varying vec2 vUv;
    void main(){ ${TAP4} float l = max(c.r, max(c.g, c.b)); c *= smoothstep(uThreshold, uThreshold + 1.2, l); gl_FragColor = vec4(min(c, vec3(40.0)), 1.0); }`,
    { tDiffuse: { value: null }, uTexel: { value: new THREE.Vector2() }, uThreshold: { value: 0.85 } });
  const downMat = shader(`uniform sampler2D tDiffuse; uniform vec2 uTexel; varying vec2 vUv; void main(){ ${TAP4} gl_FragColor = vec4(c, 1.0); }`,
    { tDiffuse: { value: null }, uTexel: { value: new THREE.Vector2() } });
  const blurMat = shader(`uniform sampler2D tDiffuse; uniform vec2 uDir; varying vec2 vUv;
    void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb * 0.227027;
      c += (texture2D(tDiffuse, vUv + uDir * 1.3846).rgb + texture2D(tDiffuse, vUv - uDir * 1.3846).rgb) * 0.316216;
      c += (texture2D(tDiffuse, vUv + uDir * 3.2308).rgb + texture2D(tDiffuse, vUv - uDir * 3.2308).rgb) * 0.070270;
      gl_FragColor = vec4(c, 1.0); }`, { tDiffuse: { value: null }, uDir: { value: new THREE.Vector2() } });
  const compMat = shader(`uniform sampler2D tScene; uniform sampler2D tB0; uniform sampler2D tB1; uniform sampler2D tB2; uniform sampler2D tB3; uniform sampler2D tB4;
    uniform float uBloom; uniform float uTime; uniform float uExposure; uniform vec2 uRes; varying vec2 vUv;
    vec3 aces(vec3 x){ return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      vec2 q = vUv - 0.5;
      vec3 col;
      col.r = texture2D(tScene, vUv + q * 0.0016).r; col.g = texture2D(tScene, vUv).g; col.b = texture2D(tScene, vUv - q * 0.0016).b;
      vec3 bl = texture2D(tB0, vUv).rgb * 0.55 + texture2D(tB1, vUv).rgb * 0.75 + texture2D(tB2, vUv).rgb * 0.9 + texture2D(tB3, vUv).rgb * 1.0 + texture2D(tB4, vUv).rgb * 1.1;
      col += bl * uBloom;
      float v = smoothstep(0.95, 0.25, length(q * vec2(1.0, 1.2)));
      col *= mix(0.5, 1.0, v);
      col = aces(col * uExposure);
      col = pow(col, vec3(1.0 / 2.2));
      col += (hash(vUv * uRes + fract(uTime * 7.0) * 91.0) - 0.5) * 0.028;
      gl_FragColor = vec4(col, 1.0);
    }`, { tScene: { value: sceneRT.texture }, tB0: { value: bA[0].texture }, tB1: { value: bA[1].texture }, tB2: { value: bA[2].texture }, tB3: { value: bA[3].texture }, tB4: { value: bA[4].texture }, uBloom: { value: 0.9 }, uTime: { value: 0 }, uExposure: { value: 1.05 }, uRes: { value: new THREE.Vector2(1, 1) } });
  const pass = (mat, target) => { quad.material = mat; renderer.setRenderTarget(target); renderer.render(quadScene, quadCam); };

  // Sizing
  let W = 1, H = 1, quality = null;
  function resize() {
    const q = (getProps() || {}).quality || 'Haute'; quality = q;
    const w = Math.max(1, host.clientWidth), h = Math.max(1, host.clientHeight);
    portrait = w / h < 0.85;
    camera.fov = portrait ? 52 : 34;
    const cap = q === 'Haute' ? (touch ? 1.4 : 1.75) : 1.1;
    const dpr = Math.max(0.6, Math.min(window.devicePixelRatio || 1, cap) * dynScale);
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
    W = Math.floor(w * dpr); H = Math.floor(h * dpr);
    sceneRT.setSize(W, H);
    const rs = q === 'Haute' ? 0.5 : 0.33; reflRT.setSize(Math.max(1, W * rs | 0), Math.max(1, H * rs | 0)); reflB.setSize(reflRT.width, reflRT.height);
    for (let i = 0; i < LV; i++) { const d = Math.pow(2, i + 1); const bw = Math.max(1, W / d | 0), bh = Math.max(1, H / d | 0); bA[i].setSize(bw, bh); bB[i].setSize(bw, bh); }
    uRes.value.set(W, H); compMat.uniforms.uRes.value.set(W, H);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (layoutReady) applyLayout();
  }
  const ro = new ResizeObserver(resize); ro.observe(host); resize();

  // Camera choreography
  const KEYS = [
    { t: 0.00, pos: [10, 2.6, 25], tgt: [0, 0.7, 0] },
    { t: 0.10, pos: [-3, 21, 25], tgt: [0, 0, 0] },
    { t: 0.26, pos: [5, 50, 44], tgt: [0, 0, -1] },
    { t: 0.42, pos: [-36, 30, 27], tgt: [0, 0, 1] },
    { t: 0.55, pos: [-19, 15, 23], tgt: [0, 3.5, 0] },
    { t: 0.70, pos: [21, 11, 23], tgt: [0, 6, 0] },
    { t: 0.84, pos: [25, 5.2, 9.5], tgt: [0, 6.8, 0] },
    { t: 1.00, pos: [4, 92, 96], tgt: [0, 0, -6] },
  ];
  const posCurve = new THREE.CatmullRomCurve3(KEYS.map(k => V(...k.pos)), false, 'centripetal');
  const tgtCurve = new THREE.CatmullRomCurve3(KEYS.map(k => V(...k.tgt)), false, 'centripetal');
  const camU = (p) => { let i = 0; while (i < KEYS.length - 2 && p > KEYS[i + 1].t) i++; const l = clamp((p - KEYS[i].t) / (KEYS[i + 1].t - KEYS[i].t)); return (i + l * 0.3 + sm5(l) * 0.7) / (KEYS.length - 1); };

  // Overlay bindings
  const chapters = [...overlay.querySelectorAll('[data-chapter]')].map(el => ({ el, zone: el.querySelector('[data-zone]') || el, a: +el.dataset.a, b: +el.dataset.b, last: -1 }));
  const labelEls = () => [...overlay.querySelectorAll('[data-label]')];
  const counters = [...overlay.querySelectorAll('[data-count]')].map(el => ({ el, v: +el.dataset.count, a: +el.dataset.a, b: +el.dataset.b, last: -1 }));
  const bars = [...overlay.querySelectorAll('[data-bar]')].map(el => ({ el, a: +el.dataset.a, b: +el.dataset.b }));
  const rail = overlay.querySelector('[data-rail]'), num = overlay.querySelector('[data-chapter-num]');
  const dots = [...overlay.querySelectorAll('[data-goto]')];
  dots.forEach(el => el.addEventListener('click', () => { const rect = section.getBoundingClientRect(); window.scrollTo({ top: window.scrollY + rect.top + (+el.dataset.goto) * Math.max(1, rect.height - window.innerHeight), behavior: reduce ? 'auto' : 'smooth' }); }));
  const scrim = overlay.parentElement.querySelector('[data-scrim]');
  const ch6 = overlay.querySelector('[data-chapter="6"]'), zone6 = ch6 && ch6.querySelector('[data-zone]'), hud = overlay.querySelector('[data-hud]');
  const orig = { scrimH: scrim && scrim.style.height, pad: ch6 && ch6.style.padding, cols: ch6 && ch6.style.gridTemplateColumns, hudW: hud && hud.style.width };
  function applyLayout() {
    if (scrim) scrim.style.height = portrait ? '62vh' : orig.scrimH;
    if (ch6) { ch6.style.gridTemplateColumns = portrait ? 'minmax(0,1fr)' : orig.cols; ch6.style.padding = portrait ? '96px 20px 8vh' : orig.pad; }
    if (zone6) zone6.style.display = portrait ? 'none' : '';
    if (hud) hud.style.width = portrait ? '100%' : orig.hudW;
  }
  layoutReady = true; applyLayout();
  overlay.querySelectorAll('[data-label]').forEach(el => { el.style.transformOrigin = '0 0'; });
  const fade = (p, a, b, f = 0.03) => (a <= 0 ? 1 : sm(seg(p, a, a + f))) * (b >= 1 ? 1 : 1 - sm(seg(p, b - f, b)));
  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
  let plinthP = 0;
  const LABELS = {
    operateur: { pos: V(HX + 0.4, 0.6, -HZ - 0.4), a: 0.07, b: 0.5, phase: () => plinthP },
  };
  nodes.forEach(n => { const win = (n.id === 'builder' || n.id === 'constructeur') ? [0.585, 0.8] : n.id.startsWith('coop') ? [0.355, 0.56] : [0.165, 0.5]; LABELS[n.id] = { pos: n.anchor, a: win[0], b: win[1], phase: () => eOut(seg(prog, n.r0, n.r0 + 0.04)) }; });
  const fmt = (n) => Math.round(n).toLocaleString('fr-FR');

  // Loop
  let forced = null, perfN = 0, perfT = 0, goodWin = 0;
  let prog = 0, target = 0, last = performance.now(), time = 0, raf = 0, readyAt = -1, mx = 0, my = 0, smx = 0, smy = 0;
  const onMove = (e) => { mx = (e.clientX / window.innerWidth) * 2 - 1; my = (e.clientY / window.innerHeight) * 2 - 1; if (e.pointerType === 'mouse') moved = true; };
  window.addEventListener('pointermove', onMove, { passive: true });
  const tmp = new THREE.Vector3(), camPos = new THREE.Vector3(), camTgt = new THREE.Vector3(), right = new THREE.Vector3(), upv = new THREE.Vector3();

  function update(p, t) {
    const intro = readyAt < 0 ? 0 : sm(clamp((t - readyAt - 0.3) / 2.6));
    setDraw(parcelGlow, intro);
    parcelLight.intensity = 70 * intro;
    bollards.forEach(({ cap }, i) => cap.material.color.copy(ORANGE).multiplyScalar(6 * sm(clamp(intro * 4 - i * 0.6))));
    plinthP = eOut(seg(p, 0.05, 0.14));
    plinth.visible = plinthP > 0; plinth.scale.y = Math.max(0.001, plinthP);

    for (const N of nodes) {
      const rise = eOut(seg(p, N.r0, N.r0 + 0.05));
      N.g.visible = rise > 0; N.g.position.y = -0.8 * (1 - rise); N.g.scale.setScalar(0.6 + 0.4 * rise);
      const pp = seg(p, N.p0, N.p0 + N.pd);
      setDraw(N.glow, pp);
      N.spark.visible = pp > 0 && pp < 1; if (N.spark.visible) N.spark.position.copy(N.path.getPointAt(pp));
      const on = pp >= 1 ? 1 : pp * 0.4;
      N.ringMat.color.copy(ORANGE).multiplyScalar(5.5 * on * rise + 0.25 * rise);
      N.beamMat.color.copy(ORANGE).multiplyScalar(3 * on);
      N.cubeMat.emissiveIntensity = 3.2 * on;
      N.endMat.color.copy(ORANGE).multiplyScalar(7 * (pp >= 1 ? 1 : 0));
      N.cube.rotation.y = t * 0.5 + N.seed; N.cube.rotation.x = Math.sin(t * 0.4 + N.seed) * 0.25; N.cube.position.y = 1.35 + Math.sin(t * 1.2 + N.seed) * 0.08;
      const connected = pp >= 1;
      N.pulses.forEach((pu, k) => { pu.visible = connected; if (connected) { const u = (((t * N.speed + k / 3 + N.seed) % 1) + 1) % 1; pu.position.copy(N.pts[Math.floor(u * (N.pts.length - 1))]); } });
    }

    const planP = seg(p, 0.47, 0.55), planK = 4 * (1 - 0.8 * seg(p, 0.72, 0.8));
    planMat.color.copy(ORANGE).multiplyScalar(planK);
    planLines.forEach(m => setDraw(m, planP));

    const wireP = seg(p, 0.5, 0.6), wireFade = 1 - seg(p, 0.71, 0.79);
    wire.visible = wireP > 0 && wireFade > 0; wire.scale.y = Math.max(0.001, eOut(wireP));
    wireMat.color.copy(ORANGE).multiplyScalar(2.3 * wireFade);

    const buildP = seg(p, 0.58, 0.78);
    for (const e of elems) {
      const l = seg(buildP, e.t0, e.t0 + e.d); e.obj.visible = l > 0; if (!e.obj.visible) continue;
      const k = eOut(l); if (e.kind === 'grow') e.obj.scale.y = Math.max(0.001, k); else e.obj.position.y = e.y + (1 - k) * 5;
    }
    const lightsP = seg(p, 0.73, 0.86);
    rooms.forEach(r => { r.mat.emissiveIntensity = r.k * sm(seg(lightsP, r.th * 0.7, r.th * 0.7 + 0.3)) * (0.92 + 0.08 * Math.sin(t * 3 + r.th * 20)); });
    strips.forEach(s => { s.m.material.color.copy(ORANGE).multiplyScalar(s.k * sm(seg(lightsP, s.t0 * 0.5, s.t0 * 0.5 + 0.4))); if (s.grow) s.m.scale.y = Math.max(0.001, buildP); });
    warm.intensity = 520 * lightsP;

    const satP = seg(p, 0.88, 0.995);
    scene.fog.density = lerp(0.012, 0.0042, sm(satP));
    for (const s of sats) {
      const l = seg(satP, s.delay, s.delay + 0.35); s.g.visible = l > 0; if (!s.g.visible) continue;
      s.body.scale.y = Math.max(0.001, eOut(l)); s.mat.emissiveIntensity = 2.4 * seg(l, 0.45, 1); s.rim.color.copy(ORANGE).multiplyScalar(4 * seg(l, 0.6, 1));
    }
    for (const lk of links) setDraw(lk.m, seg(satP, lk.delay, lk.delay + 0.35));

    dust.rotation.y = t * 0.012; dust.position.y = Math.sin(t * 0.2) * 0.4;

    ndc.set(mx, -my); ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(groundPlane, hitP)) { if (hitP.length() > 60) hitP.setLength(60); hitP.y = 1.8; cursorLight.position.lerp(hitP, 0.12); }
    cursorLight.intensity = moved ? 95 * (1 - seg(p, 0.88, 0.95)) : 0;

    // Camera
    const u = camU(p);
    posCurve.getPoint(u, camPos); tgtCurve.getPoint(u, camTgt);
    if (portrait) { camPos.sub(camTgt).multiplyScalar(1.18).add(camTgt); camTgt.y -= camPos.distanceTo(camTgt) * 0.13; }
    const heroDrift = reduce ? 0 : 1 - seg(p, 0, 0.08);
    camPos.x += Math.sin(t * 0.18) * 1.2 * heroDrift; camPos.y += Math.sin(t * 0.23) * 0.25 * heroDrift;
    if (satP > 0) { const a = t * 0.02 * satP; const cx = camPos.x, cz = camPos.z; camPos.x = cx * Math.cos(a) - cz * Math.sin(a); camPos.z = cx * Math.sin(a) + cz * Math.cos(a); }
    smx += (mx - smx) * 0.05; smy += (my - smy) * 0.05;
    const dist = camPos.distanceTo(camTgt);
    camera.position.copy(camPos); camera.lookAt(camTgt);
    right.setFromMatrixColumn(camera.matrixWorld, 0); upv.setFromMatrixColumn(camera.matrixWorld, 1);
    camera.position.addScaledVector(right, smx * dist * 0.025).addScaledVector(upv, -smy * dist * 0.015);
    camera.lookAt(camTgt);
    camera.filmOffset = portrait ? 0 : lerp(-2.5, -6.5, sm(seg(p, 0.03, 0.09))) * (1 - sm(seg(p, 0.88, 0.93)));
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }

  function updateOverlay(p) {
    for (const c of chapters) {
      const o = fade(p, c.a, c.b); if (Math.abs(o - c.last) < 0.002) continue; c.last = o;
      const dir = p < (c.a + c.b) / 2 ? 1 : -1;
      c.el.style.opacity = o.toFixed(3); c.el.style.transform = `translate3d(0, ${((1 - o) * 26 * dir).toFixed(1)}px, 0)`;
      c.el.style.visibility = o < 0.01 ? 'hidden' : 'visible'; c.el.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
    }
    const w = host.clientWidth, h = host.clientHeight;
    const hb = host.getBoundingClientRect();
    const zones = chapters.filter(c => c.last > 0.3 && c.zone !== c.el).map(c => c.zone.getBoundingClientRect())
      .concat(chapters.filter(c => c.last > 0.3 && c.zone === c.el).map(c => c.el.getBoundingClientRect()));
    for (const el of labelEls()) {
      const d = LABELS[el.dataset.label]; if (!d) continue;
      let o = fade(p, d.a, d.b, 0.02) * d.phase();
      tmp.copy(d.pos).project(camera); if (tmp.z > 1) o = 0;
      const lx = (tmp.x * 0.5 + 0.5) * w, ly = (-tmp.y * 0.5 + 0.5) * h;
      for (const z of zones) { const zx0 = z.left - hb.left - 120, zx1 = z.right - hb.left + 120, zy0 = z.top - hb.top - 10, zy1 = z.bottom - hb.top + 70; if (lx > zx0 && lx < zx1 && ly > zy0 && ly < zy1) { o *= 0.08; break; } }
      el.style.opacity = o.toFixed(3);
      if (o > 0) el.style.transform = `translate3d(${((tmp.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-tmp.y * 0.5 + 0.5) * h).toFixed(1)}px, 0) scale(${portrait ? 0.78 : 1}) translate(-50%, -100%)`;
    }
    for (const c of counters) { const v = c.v * eOut(seg(p, c.a, c.b)); if (v === c.last) continue; c.last = v; c.el.textContent = fmt(v); }
    for (const b of bars) b.el.style.transform = `scaleX(${eOut(seg(p, b.a, b.b)).toFixed(3)})`;
    if (rail) rail.style.transform = `scaleY(${p.toFixed(4)})`;
    let idx = 0; chapters.forEach((c, i) => { if (p >= c.a - 0.005) idx = i; });
    if (num) { const s = String(idx).padStart(2, '0'); if (num.textContent !== s) num.textContent = s; }
    dots.forEach((d, i) => { const on = i <= idx ? '1' : '0'; if (d.dataset.on !== on) { d.dataset.on = on; const c = d.firstElementChild; c.style.background = on === '1' ? '#f0703a' : '#050506'; c.style.borderColor = on === '1' ? '#f0703a' : 'rgba(255,255,255,.5)'; } });
  }

  function render() {
    const props = getProps() || {};
    if ((props.quality || 'Haute') !== quality) resize();
    compMat.uniforms.uBloom.value = 0.9 * (props.glow ?? 1);
    compMat.uniforms.uTime.value = time;
    // planar reflection: mirror the world, render from the same camera
    ground.visible = false; world.scale.y = -1; world.updateMatrixWorld(true);
    renderer.setRenderTarget(reflRT); renderer.render(scene, camera);
    world.scale.y = 1; world.updateMatrixWorld(true); ground.visible = true;
    blurMat.uniforms.tDiffuse.value = reflRT.texture; blurMat.uniforms.uDir.value.set(0, 1.6 / reflRT.height); pass(blurMat, reflB);
    blurMat.uniforms.tDiffuse.value = reflB.texture; blurMat.uniforms.uDir.value.set(0.6 / reflRT.width, 3.6 / reflRT.height); pass(blurMat, reflRT);
    renderer.setRenderTarget(sceneRT); renderer.render(scene, camera);
    brightMat.uniforms.tDiffuse.value = sceneRT.texture; brightMat.uniforms.uTexel.value.set(1 / W, 1 / H); pass(brightMat, bA[0]);
    for (let i = 0; i < LV; i++) {
      if (i > 0) { downMat.uniforms.tDiffuse.value = bA[i - 1].texture; downMat.uniforms.uTexel.value.set(1 / bA[i - 1].width, 1 / bA[i - 1].height); pass(downMat, bA[i]); }
      blurMat.uniforms.tDiffuse.value = bA[i].texture; blurMat.uniforms.uDir.value.set(1 / bA[i].width, 0); pass(blurMat, bB[i]);
      blurMat.uniforms.tDiffuse.value = bB[i].texture; blurMat.uniforms.uDir.value.set(0, 1 / bA[i].height); pass(blurMat, bA[i]);
    }
    pass(compMat, null);
  }

  function readProgress() {
    const rect = section.getBoundingClientRect();
    const total = Math.max(1, rect.height - window.innerHeight);
    return { rect, p: clamp(-rect.top / total) };
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now; time += dt; // jamais négatif : le premier horodatage rAF peut précéder `last`
    const { rect, p } = readProgress(); target = forced ?? p;
    if (forced == null && (rect.bottom < -40 || rect.top > window.innerHeight + 40)) return;
    prog = reduce ? target : prog + (target - prog) * (1 - Math.exp(-dt * 3.4));
    if (Math.abs(target - prog) < 1e-5) prog = target;
    update(prog, time);
    updateOverlay(prog);
    render();
    if (readyAt < 0) { readyAt = time; host.style.opacity = '1'; }
    perfN++; perfT += dt;
    if (time - readyAt > 3 && perfT > 2) {
      const fps = perfN / perfT; perfN = 0; perfT = 0;
      if (fps < 42 && dynScale > 0.55) { dynScale *= 0.8; goodWin = 0; resize(); }
      else if (fps > 58 && dynScale < 1 && ++goodWin >= 3) { dynScale = Math.min(1, dynScale * 1.12); goodWin = 0; resize(); }
    }
  }
  prog = target = readProgress().p;
  raf = requestAnimationFrame(frame);

  const api = {
    force(p) { forced = p; if (p != null) prog = target = p; },
    snapTo(p) { const rect = section.getBoundingClientRect(); const top = window.scrollY + rect.top; window.scrollTo(0, top + p * Math.max(1, rect.height - window.innerHeight)); prog = target = p; },
    destroy() { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('pointermove', onMove); renderer.dispose(); canvas.remove(); },
  };
  window.__aoiFilm = api;
  return api;
}

window.AOIFilm = { createFilm };
