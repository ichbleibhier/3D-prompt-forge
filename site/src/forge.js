// Hero scene: an anvil, a hammer, a glowing bar and sparks, drawn as pixel art.
// The 3D scene renders into a small target (1 art pixel = PIXEL css px), then one
// shader pass tone-maps, dithers, outlines and snaps every pixel to PALETTE, which
// is built from the page's own colors so the canvas melts into the background.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const PIXEL = 4; // css px per art pixel
// Soot and ash from the page, steel grays, wood, and the heat ramp.
const PALETTE = [
  '#15120e', '#1e1914', '#28211a', '#3a3128', '#4a4036', '#6a5f53', '#a89c8a', '#f1e9dc',
  '#2b2d30', '#45484c', '#6d7075', '#9aa0a6',
  '#3a2216', '#5e331b', '#8e2b1b', '#c4321c', '#ff6a1a', '#ffb347', '#ffe9a8',
];
const OUTLINE = '#0c0a08';

const COLORS = {
  bg: 0x15120e, steel: 0x3b3a39, steelFace: 0x6d6c69, wood: 0x6b4428,
  hot: 0xff6a1a, ember: 0xffb347, glow: 0xff7a2a, cool: 0x8fb3d9,
};

function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function anvilGeometry() {
  // Side profile in metres: horn to the left, heel to the right, waist, base.
  const s = new THREE.Shape();
  s.moveTo(-0.34, 0.30);
  s.quadraticCurveTo(-0.22, 0.345, -0.12, 0.36);
  s.lineTo(0.30, 0.36);
  s.lineTo(0.30, 0.28);
  s.quadraticCurveTo(0.14, 0.26, 0.10, 0.17);
  s.lineTo(0.10, 0.08);
  s.quadraticCurveTo(0.12, 0.04, 0.22, 0.03);
  s.lineTo(0.22, 0.0);
  s.lineTo(-0.20, 0.0);
  s.lineTo(-0.20, 0.03);
  s.quadraticCurveTo(-0.10, 0.04, -0.08, 0.08);
  s.lineTo(-0.08, 0.17);
  s.quadraticCurveTo(-0.11, 0.25, -0.20, 0.28);
  s.quadraticCurveTo(-0.28, 0.285, -0.34, 0.30);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.13, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008,
    bevelSegments: 3, curveSegments: 24,
  });
  g.translate(0, 0, -0.065);
  return g;
}

export function createForge(canvas, { reducedMotion }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: new URLSearchParams(location.search).has('capture') });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.bg);
  scene.fog = new THREE.Fog(COLORS.bg, 1.9, 3.4);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.25;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 20);
  const camBase = new THREE.Vector3(0.25, 0.86, 2.3);
  const target = new THREE.Vector3(0.08, 0.46, 0);

  // Lights: forge glow from the left, cool rim from the back right, dim key.
  const forgeLight = new THREE.PointLight(COLORS.glow, 3, 4, 1.6);
  forgeLight.position.set(-0.9, 0.35, 0.5);
  scene.add(forgeLight);
  const key = new THREE.DirectionalLight(0xffe2c4, 0.6);
  key.position.set(0.6, 1.6, 0.9);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  Object.assign(key.shadow.camera, { left: -0.8, right: 0.8, top: 0.8, bottom: -0.8, near: 0.1, far: 4 });
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.01;
  scene.add(key);
  const rim = new THREE.DirectionalLight(COLORS.cool, 1.4);
  rim.position.set(1.2, 0.9, -1.4);
  scene.add(rim);

  // Floor and stump.
  // Floor shows only shadows, so the page color runs right under the stump.
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(8, 64),
    new THREE.ShadowMaterial({ opacity: 0.55, color: 0x000000 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const stump = new THREE.Mesh(
    new THREE.CylinderGeometry(0.21, 0.24, 0.2, 40),
    new THREE.MeshStandardMaterial({ color: 0x3a2414, roughness: 0.95, envMapIntensity: 0.15 })
  );
  stump.position.y = 0.1;
  stump.castShadow = stump.receiveShadow = true;
  scene.add(stump);

  const anvil = new THREE.Mesh(
    anvilGeometry(),
    new THREE.MeshStandardMaterial({ color: COLORS.steel, metalness: 0.85, roughness: 0.42 })
  );
  anvil.position.y = 0.2;
  anvil.castShadow = anvil.receiveShadow = true;
  scene.add(anvil);
  // Polished working face.
  const face = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.004, 0.13),
    new THREE.MeshStandardMaterial({ color: COLORS.steelFace, metalness: 1, roughness: 0.22 })
  );
  face.position.set(0.095, 0.2 + 0.36 + 0.009, 0);
  scene.add(face);

  // The bar being worked.
  const barMat = new THREE.MeshStandardMaterial({
    color: 0x2a1a12, roughness: 0.5, metalness: 0.3,
    emissive: new THREE.Color(COLORS.hot), emissiveIntensity: 1.6,
  });
  const bar = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.018, 0.04, 3, 0.006), barMat);
  bar.position.set(0.06, face.position.y + 0.011, 0.0);
  bar.rotation.y = -0.12;
  bar.castShadow = true;
  scene.add(bar);
  const barGlow = new THREE.PointLight(COLORS.hot, 1.2, 0.8, 2);
  barGlow.position.set(0.06, face.position.y + 0.06, 0.05);
  scene.add(barGlow);

  // Hammer: pivots at the end of the handle.
  const hammer = new THREE.Group();
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.024, 0.36, 12),
    new THREE.MeshStandardMaterial({ color: COLORS.wood, roughness: 0.7 })
  );
  handle.rotation.z = Math.PI / 2;
  handle.position.x = -0.18;
  const head = new THREE.Mesh(
    new RoundedBoxGeometry(0.065, 0.13, 0.06, 2, 0.008),
    new THREE.MeshStandardMaterial({ color: 0x55534f, metalness: 0.95, roughness: 0.3 })
  );
  head.position.x = -0.36;
  handle.castShadow = head.castShadow = true;
  hammer.add(handle, head);
  const pivot = new THREE.Group();
  // Head bottom meets the bar's top at the contact angle (-0.02 rad).
  pivot.position.set(0.42, face.position.y + 0.092, 0.02);
  pivot.add(hammer);
  scene.add(pivot);

  // Sparks: a pool of points, each with a seeded velocity.
  const MAX = 260;
  const rand = mulberry32(7);
  const pos = new Float32Array(MAX * 3);
  const col = new Float32Array(MAX * 3);
  const vel = new Float32Array(MAX * 3);
  const life = new Float32Array(MAX).fill(0);
  const ttl = new Float32Array(MAX).fill(1);
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  sparkGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  // One art pixel per spark.
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({
    size: 1.5, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
  }));
  sparks.frustumCulled = false; // bounds were computed while every spark sat at 0,0,0
  scene.add(sparks);
  const hotC = new THREE.Color(0xffc04a), coolC = new THREE.Color(0xb3200c);

  function burst(count) {
    let n = 0;
    for (let i = 0; i < MAX && n < count; i++) {
      if (life[i] > 0) continue;
      const a = rand() * Math.PI * 2, up = 0.6 + rand() * 1.4, sp = 0.4 + rand() * 1.3;
      pos.set([bar.position.x - 0.06 + rand() * 0.06, bar.position.y + 0.01, rand() * 0.04 - 0.02], i * 3);
      vel.set([Math.cos(a) * sp, up, Math.sin(a) * sp * 0.6], i * 3);
      ttl[i] = 0.5 + rand() * 0.7;
      life[i] = ttl[i];
      n++;
    }
  }

  // Pixel pass: linear HDR + depth in, palette pixels out.
  const rt = new THREE.WebGLRenderTarget(2, 2, {
    type: THREE.HalfFloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter,
    depthTexture: new THREE.DepthTexture(2, 2),
  });
  // Shader works in display (sRGB) values, so pass the hex values through unconverted.
  const raw = (h) => new THREE.Vector3(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
  const pixelMat = new THREE.ShaderMaterial({
    uniforms: {
      tColor: { value: rt.texture }, tDepth: { value: rt.depthTexture },
      texel: { value: new THREE.Vector2() }, near: { value: camera.near }, far: { value: camera.far },
      palette: { value: PALETTE.map(raw) },
      outline: { value: raw(OUTLINE) },
      bg: { value: raw(PALETTE[0]) },
      exposure: { value: 1.25 },
    },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: `
      uniform sampler2D tColor, tDepth; uniform vec2 texel; uniform float near, far, exposure;
      uniform vec3 palette[${PALETTE.length}]; uniform vec3 outline, bg; varying vec2 vUv;
      float lin(vec2 uv){ float z = texture2D(tDepth, uv).x * 2.0 - 1.0; return 2.0 * near * far / (far + near - z * (far - near)); }
      float bayer(vec2 p){ int x = int(mod(p.x, 4.0)), y = int(mod(p.y, 4.0)); int i = x + y * 4;
        int m[16]; m[0]=0;m[1]=8;m[2]=2;m[3]=10;m[4]=12;m[5]=4;m[6]=14;m[7]=6;m[8]=3;m[9]=11;m[10]=1;m[11]=9;m[12]=15;m[13]=7;m[14]=13;m[15]=5;
        for (int k = 0; k < 16; k++) if (k == i) return float(m[k]) / 16.0; return 0.0; }
      void main(){
        vec3 c = texture2D(tColor, vUv).rgb * exposure;
        c = clamp((c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14), 0.0, 1.0); // ACES fit
        c = pow(c, vec3(1.0 / 2.2));
        vec2 q = (vUv - 0.5) * vec2(1.0, 1.25);
        c = mix(bg, c, smoothstep(0.62, 0.36, length(q)));            // edges fall to the page color
        c += (bayer(gl_FragCoord.xy) - 0.47) * 0.075 * smoothstep(0.025, 0.09, distance(c, bg)); // dither, but never on the page color
        float d = lin(vUv);
        float dn = max(max(lin(vUv + vec2(texel.x, 0.0)), lin(vUv - vec2(texel.x, 0.0))),
                       max(lin(vUv + vec2(0.0, texel.y)), lin(vUv - vec2(0.0, texel.y))));
        bool edge = d < 2.9 && dn - d > 0.06 * d;                     // 1-pixel silhouette line
        vec3 best = palette[0]; float bd = 1e9;
        for (int i = 0; i < ${PALETTE.length}; i++) {
          vec3 e = (c - palette[i]) * vec3(0.9, 1.2, 0.7); float dd = dot(e, e);
          if (dd < bd) { bd = dd; best = palette[i]; }
        }
        if (edge) best = outline;
        gl_FragColor = vec4(best, 1.0);
      }`,
    depthTest: false, depthWrite: false,
  });
  const quadScene = new THREE.Scene();
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  quadScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), pixelMat));

  // Strike timing (seconds since strike started).
  const RAISE = 0.32, DROP = 0.09, RECOVER = 0.5;
  let strikeT = -1, heat = 0.55, onImpact = null;
  const pointer = new THREE.Vector2();

  function strike(cb) {
    if (strikeT >= 0) return false;
    strikeT = 0;
    onImpact = cb || null;
    return true;
  }
  function setHeat(h) { heat = h; }

  function hammerAngle(t) {
    // Rest angle 0.35 rad up, raise to 0.95, drop to -0.02 (contact), settle back.
    if (t < 0) return 0.35;
    if (t < RAISE) { const k = t / RAISE; return 0.35 + 0.6 * (1 - (1 - k) ** 3); }
    if (t < RAISE + DROP) { const k = (t - RAISE) / DROP; return 0.95 - 0.97 * k * k; }
    const k = Math.min(1, (t - RAISE - DROP) / RECOVER);
    return -0.02 + 0.37 * (1 - (1 - k) ** 2) + Math.sin(k * Math.PI) * 0.06;
  }

  let impactGlow = 0, last = performance.now(), visible = true, running = true;
  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (!visible) { last = now; return; }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (strikeT >= 0) {
      const before = strikeT;
      strikeT += dt;
      if (before < RAISE + DROP && strikeT >= RAISE + DROP) {
        burst(reducedMotion ? 40 : 150);
        impactGlow = 1;
        if (onImpact) onImpact();
      }
      if (strikeT > RAISE + DROP + RECOVER) strikeT = -1;
    }
    hammer.rotation.z = -hammerAngle(strikeT);

    impactGlow = Math.max(0, impactGlow - dt * 2.2);
    const glowLevel = 0.4 + heat * 1.6 + impactGlow * 1.4;
    barMat.emissiveIntensity = glowLevel;
    barMat.emissive.setRGB(1, 0.32 + heat * 0.35 + impactGlow * 0.2, 0.08 + heat * 0.18);
    barGlow.intensity = 0.6 + glowLevel * 0.9;
    forgeLight.intensity = 2.2 + heat * 2 + Math.sin(now * 0.004) * 0.25 + Math.sin(now * 0.011) * 0.15;

    for (let i = 0; i < MAX; i++) {
      if (life[i] <= 0) { pos[i * 3 + 1] = -10; continue; }
      life[i] -= dt;
      vel[i * 3 + 1] -= 3.2 * dt;
      pos[i * 3] += vel[i * 3] * dt;
      pos[i * 3 + 1] += vel[i * 3 + 1] * dt;
      pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
      if (pos[i * 3 + 1] < 0.002) { pos[i * 3 + 1] = 0.002; vel[i * 3 + 1] *= -0.3; vel[i * 3] *= 0.6; }
      const k = Math.max(0, life[i] / ttl[i]);
      // Yellow when fresh, cooling through orange to red; brightness held so the palette keeps the hue.
      const c = coolC.clone().lerp(hotC, k);
      col.set([c.r * 1.3, c.g * 1.3, c.b * 1.3], i * 3);
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkGeo.attributes.color.needsUpdate = true;

    const px = reducedMotion ? 0 : pointer.x * 0.12, py = reducedMotion ? 0 : pointer.y * 0.05;
    camera.position.set(camBase.x + px, camBase.y + py, camBase.z);
    camera.lookAt(target);
    renderer.setRenderTarget(rt);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(quadScene, quadCam);
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const lw = Math.max(32, Math.round(w / PIXEL)), lh = Math.max(24, Math.round(h / PIXEL));
    renderer.setSize(lw, lh, false);
    rt.setSize(lw, lh);
    pixelMat.uniforms.texel.value.set(1 / lw, 1 / lh);
    camera.aspect = w / h;
    // Keep the anvil framed on narrow screens.
    camBase.z = w / h < 1.3 ? 2.3 * 1.3 / Math.max(0.75, w / h) : 2.3;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  });
  requestAnimationFrame(frame);

  return { strike, setHeat, stop() { running = false; }, get striking() { return strikeT; }, get liveSparks() { let n = 0; for (const l of life) if (l > 0) n++; return n; } };
}
