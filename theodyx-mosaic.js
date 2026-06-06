/* theodyx-mosaic.js — "Media Mosaic THEODYX" animation for the .fx-hero section.
 * Replaces the hero image (.fx-hero img) with a dark rounded panel where the site's
 * real media (faces, culture, media stills) drift in and assemble into the THEODYX
 * wordmark, with the brand ring-and-dot "O" roaming through it — conveying a vast
 * media/tech conglomerate. Hosted on GitHub, loaded site-wide by a tiny loader.
 *
 * Robust: keeps the original <img> as an instant placeholder and crossfades the WebGL
 * panel in once it's ready (retries on a fresh canvas to beat Chrome's sticky WebGL
 * context-creation failure during page-load GPU contention). Honours reduced-motion.
 */
(function () {
  "use strict";
  if (window.__thxMosaic) return;
  window.__thxMosaic = true;

  var BASE = "https://cdn.prod.website-files.com/69fe0aaad9f3034241913693/";
  var FALLBACK_MEDIA = [
    "6a1d584afc200fa8e15b06f1_AdobeStock_603645965.jpeg",
    "6a209ceec4a0446392ef83d5_AdobeStock_1391992461%20Medium.jpeg",
    "6a20995f97f0b440566d03fd_AdobeStock_580943943%20Medium.jpeg",
    "6a2099d5172cb531c44b4c20_AdobeStock_420593323.jpeg",
    "6a209a43345784419e48ebd7_culture%202%20Medium.jpeg",
    "6a1d584adc0c568f48088e8d_AdobeStock_638229017.jpeg",
    "6a230e0362e19a25b85acafe_web_asset_.JPG",
    "6a1d5b84982236e3c6eb9b30_29BIZ-OPENAI-FUNDING-1-fqlm-superJumbo.webp"
  ].map(function (n) { return BASE + n; });
  var WORD = "THEODYX";
  function dpr() { return Math.min(window.devicePixelRatio || 1, 2); }

  var CSS = [
    '.thx-hero-panel{position:relative;width:100%;max-width:1098px;margin-left:auto;margin-right:auto;aspect-ratio:1098/769;border-radius:20px;overflow:hidden;background:#0a0a0c}',
    '.thx-hero-panel>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:20px;transition:opacity .8s ease;z-index:1}',
    '.thx-hero-panel>canvas{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .9s ease;z-index:2}',
    '@media(max-width:600px){.thx-hero-panel{aspect-ratio:1098/640;border-radius:16px}.thx-hero-panel>img,.thx-hero-panel>canvas{border-radius:16px}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('thx-mosaic-css')) return;
    var s = document.createElement('style'); s.id = 'thx-mosaic-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  // ---- gather the site's real media (Webflow CDN images are CORS-clean) ----
  function gatherMedia() {
    var set = {}, order = [];
    function add(u) { if (!u) return; u = u.split('?')[0]; if (!/website-files\.com/.test(u)) return; if (/\.svg/i.test(u)) return; if (set[u]) return; set[u] = 1; order.push(u); }
    [].forEach.call(document.images, function (im) { add(im.currentSrc || im.src); });
    [].forEach.call(document.querySelectorAll('*'), function (e) { var bg = getComputedStyle(e).backgroundImage; if (bg && bg.indexOf('website-files') > -1) { var m = bg.match(/url\(["']?([^"')]+)/); if (m) add(m[1]); } });
    if (order.length < 4) order = FALLBACK_MEDIA.slice();
    return order.slice(0, 18);
  }

  function loadImg(u) { return new Promise(function (res) { var im = new Image(); im.crossOrigin = "anonymous"; im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = u; }); }

  function buildAtlas(imgs) {
    imgs = imgs.filter(Boolean); if (!imgs.length) return null;
    var N = imgs.length, cols = Math.ceil(Math.sqrt(N)), rows = Math.ceil(N / cols), CELL = 512;
    var c = document.createElement("canvas"); c.width = cols * CELL; c.height = rows * CELL; var x = c.getContext("2d");
    x.fillStyle = "#111"; x.fillRect(0, 0, c.width, c.height);
    var cells = [];
    for (var i = 0; i < N; i++) {
      var cx = (i % cols) * CELL, cy = Math.floor(i / cols) * CELL, im = imgs[i];
      var s = Math.max(CELL / im.width, CELL / im.height), sw = CELL / s, sh = CELL / s;
      try { x.drawImage(im, (im.width - sw) / 2, (im.height - sh) / 2, sw, sh, cx, cy, CELL, CELL); } catch (e) {}
      cells.push({ u0: cx / c.width, v0: cy / c.height, u1: (cx + CELL) / c.width, v1: (cy + CELL) / c.height });
    }
    return { canvas: c, cells: cells };
  }

  function tilePositions(cssW, cssH, spacingPx) {
    var sc = 2, w = Math.floor(cssW * sc), h = Math.floor(cssH * sc);
    var c = document.createElement("canvas"); c.width = w; c.height = h; var x = c.getContext("2d");
    var target = w * 0.95, fs = h * 0.86, i = 0; x.textAlign = "center"; x.textBaseline = "middle";
    do { x.font = "900 " + fs + "px 'Arial Black',Arial,system-ui,sans-serif"; var mw = x.measureText(WORD).width; if (mw <= target || fs < 8) break; fs *= target / mw; i++; } while (i < 10);
    x.clearRect(0, 0, w, h); x.fillStyle = "#fff"; x.font = "900 " + fs + "px 'Arial Black',Arial,system-ui,sans-serif";
    x.fillText(WORD, w / 2, h / 2);
    var d; try { d = x.getImageData(0, 0, w, h).data; } catch (e) { return []; }
    var step = Math.max(4, Math.floor(spacingPx * sc)), pts = [];
    for (var yy = Math.floor(step / 2); yy < h; yy += step) { for (var xx = Math.floor(step / 2); xx < w; xx += step) { if (d[(yy * w + xx) * 4 + 3] > 130) pts.push([(xx / w) * 2 - 1, (1 - yy / h) * 2 - 1]); } }
    return pts;
  }

  function makeHero(stage, atlas) {
    var gl = null;
    try { gl = stage.getContext("webgl", { premultipliedAlpha: false, alpha: true, antialias: true }) || stage.getContext("experimental-webgl", { alpha: true }); } catch (e) {}
    if (!gl || !atlas) return null;

    var VS = [
      "precision highp float;",
      "attribute vec2 aHome; attribute float aSeed; attribute vec2 aCorner; attribute vec2 aUV; attribute float aKind;",
      "uniform float uT,uAsp,uTile,uAsm,uPtrOn,uOr;",
      "uniform vec2 uPtr,uOc;",
      "varying vec2 vUV; varying vec2 vLocal; varying float vBright;",
      "float hsh(float n){return fract(sin(n)*43758.5453);}",
      "void main(){",
      "  float s=aSeed; float t=uT;",
      "  float ang=hsh(s*12.9)*6.2831; float dist=1.3+hsh(s*7.7)*1.4;",
      "  vec2 scatter=aHome+vec2(cos(ang),sin(ang))*dist;",
      "  vec2 pos=mix(scatter,aHome,uAsm);",
      "  pos+=vec2(sin(t*0.5+s*30.0),cos(t*0.45+s*21.0))*0.006*uAsm;",
      "  float wave=sin(aHome.x*3.0 - t*1.1 + s*1.5);",
      "  float lift=smoothstep(0.6,1.0,wave)*0.5*uAsm;",
      "  vec2 dO=(aHome-uOc)*vec2(uAsp,1.0); float dOr=length(dO);",
      "  lift+=smoothstep(uOr*1.6,0.0,dOr)*0.9;",
      "  vec2 dP=(aHome-uPtr)*vec2(uAsp,1.0);",
      "  lift+=uPtrOn*smoothstep(0.34,0.0,length(dP))*1.0;",
      "  float scale=(0.94+0.12*sin(t*0.6+s*40.0))*(1.0+lift*0.55);",
      "  vBright=0.9+lift*1.1;",
      "  float amb=aKind;",
      "  vec2 ambPos=aHome+vec2(sin(t*0.16+s*30.0),cos(t*0.13+s*19.0))*0.12;",
      "  pos=mix(pos, ambPos, amb);",
      "  scale=mix(scale, 0.46+0.08*sin(t*0.5+s*20.0), amb);",
      "  vBright=mix(vBright, 0.26, amb);",
      "  vec2 off=aCorner*uTile*scale*vec2(1.0/uAsp,1.0);",
      "  pos+=off;",
      "  gl_Position=vec4(pos,0.0,1.0);",
      "  vUV=aUV; vLocal=aCorner;",
      "}"].join("\n");

    var FS = [
      "precision highp float;",
      "uniform sampler2D uTex;",
      "varying vec2 vUV; varying vec2 vLocal; varying float vBright;",
      "void main(){",
      "  vec2 q=abs(vLocal); float edge=max(q.x,q.y);",
      "  if(edge>0.99) discard;",
      "  float frame=smoothstep(0.99,0.93,edge);",
      "  vec3 col=texture2D(uTex,vUV).rgb;",
      "  col=clamp(col*1.22+0.02,0.0,1.0); col*=vBright;",
      "  gl_FragColor=vec4(col, frame);",
      "}"].join("\n");

    function sh(tp, src) { var o = gl.createShader(tp); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { return null; } return o; }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) return null;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);

    var aHome = gl.getAttribLocation(pr, "aHome"), aSeed = gl.getAttribLocation(pr, "aSeed"), aCorner = gl.getAttribLocation(pr, "aCorner"), aUV = gl.getAttribLocation(pr, "aUV"), aKind = gl.getAttribLocation(pr, "aKind");
    var U = {};["uT", "uAsp", "uTile", "uAsm", "uPtrOn", "uOr", "uPtr", "uOc", "uTex"].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });

    var tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, atlas.canvas); } catch (e) { return null; }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(U.uTex, 0);
    gl.enable(gl.BLEND);

    var bufH, bufS, bufC, bufU, bufK, COUNT = 0, tileClip = 0.05;
    var CORN = [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]];
    function build() {
      var r = stage.getBoundingClientRect(), d = dpr();
      var cssW = r.width || 1, cssH = r.height || 1;
      stage.width = Math.max(1, Math.floor(cssW * d)); stage.height = Math.max(1, Math.floor(cssH * d));
      gl.viewport(0, 0, stage.width, stage.height);
      var small = cssW < 560, spacing = small ? 12 : 15;
      var pts = tilePositions(cssW, cssH, spacing);
      var WORDN = pts.length, AMB = small ? 44 : 110, TOTAL = WORDN + AMB;
      COUNT = TOTAL;
      tileClip = (spacing / cssH) * 2.0 * 0.78;
      var H = new Float32Array(TOTAL * 12), S = new Float32Array(TOTAL * 6), C = new Float32Array(TOTAL * 12), UV = new Float32Array(TOTAL * 12), K = new Float32Array(TOTAL * 6);
      var hi = 0, si = 0, ci = 0, ui = 0, ki = 0;
      function emit(px, py, kind) {
        var seed = Math.random(), cell = atlas.cells[(Math.random() * atlas.cells.length) | 0];
        var cw = cell.u1 - cell.u0, ch = cell.v1 - cell.v0, crop = 0.55 + Math.random() * 0.35;
        var ou = cell.u0 + Math.random() * cw * (1 - crop), ov = cell.v0 + Math.random() * ch * (1 - crop);
        var u0 = ou, v0 = ov, u1 = ou + cw * crop, v1 = ov + ch * crop;
        for (var k = 0; k < 6; k++) { var cn = CORN[k]; H[hi++] = px; H[hi++] = py; S[si++] = seed; C[ci++] = cn[0]; C[ci++] = cn[1]; UV[ui++] = cn[0] < 0 ? u0 : u1; UV[ui++] = cn[1] < 0 ? v0 : v1; K[ki++] = kind; }
      }
      for (var a = 0; a < AMB; a++) emit(Math.random() * 2.1 - 1.05, Math.random() * 2.0 - 1.0, 1);
      for (var i = 0; i < WORDN; i++) emit(pts[i][0], pts[i][1], 0);
      function mk(arr) { var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW); return b; }
      bufH = mk(H); bufS = mk(S); bufC = mk(C); bufU = mk(UV); bufK = mk(K);
    }
    build();
    if (COUNT === 0) return null;

    var oVS = ["precision highp float;", "attribute vec2 aP; attribute float aS;", "uniform float uT,uAsp,uOr,uPx; uniform vec2 uOc;", "varying float vG;", "void main(){vec2 p=uOc+aP*uOr*vec2(1.0/uAsp,1.0); p.y+=sin(uT*1.5+aS*6.2831)*0.0016; gl_Position=vec4(p,0.0,1.0); gl_PointSize=uPx*(0.8+aS*0.7); vG=0.5+0.55*aS;}"].join("\n");
    var oFS = ["precision highp float;", "varying float vG;", "void main(){vec2 c=gl_PointCoord-0.5;float r=dot(c,c);if(r>0.25)discard;float a=1.0-r*4.0;a*=a;gl_FragColor=vec4(1.0,0.96,0.88,a*vG);}"].join("\n");
    var oV = sh(gl.VERTEX_SHADER, oVS), oF = sh(gl.FRAGMENT_SHADER, oFS); if (!oV || !oF) return null;
    var oPr = gl.createProgram(); gl.attachShader(oPr, oV); gl.attachShader(oPr, oF); gl.linkProgram(oPr);
    var oAP = gl.getAttribLocation(oPr, "aP"), oAS = gl.getAttribLocation(oPr, "aS");
    var oU = {};["uT", "uAsp", "uOr", "uPx", "uOc"].forEach(function (n) { oU[n] = gl.getUniformLocation(oPr, n); });
    var oBuf = gl.createBuffer(), oN = 0;
    (function () { var RING = 2600, DOT = 520, n = RING + DOT, arr = new Float32Array(n * 3), idx = 0, i;
      for (i = 0; i < RING; i++) { var th = (i / RING) * 6.2831, rr = 1.0 + (Math.random() * 2 - 1) * 0.12; arr[idx++] = Math.cos(th) * rr; arr[idx++] = Math.sin(th) * rr; arr[idx++] = Math.random(); }
      var dox = 1.40, doy = -1.133, ddr = 0.30;
      for (i = 0; i < DOT; i++) { var t2 = Math.random() * 6.2831, r2 = Math.sqrt(Math.random()) * ddr; arr[idx++] = dox + Math.cos(t2) * r2; arr[idx++] = doy + Math.sin(t2) * r2; arr[idx++] = Math.random(); }
      oN = n; gl.bindBuffer(gl.ARRAY_BUFFER, oBuf); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW); })();

    var target = [0, 0], hasInput = false, ptr = [0, 0];
    stage.addEventListener("pointermove", function (e) { var r = stage.getBoundingClientRect(); if (!r.width) return; target = [(e.clientX - r.left) / r.width * 2 - 1, (1 - (e.clientY - r.top) / r.height) * 2 - 1]; hasInput = true; });
    stage.addEventListener("pointerleave", function () { hasInput = false; });

    var t0 = performance.now();
    function frame(now) {
      var tt = (now - t0) / 1000;
      var asm = Math.min(1, Math.max(0, (tt - 0.2) / 2.4)); asm = asm * asm * (3 - 2 * asm);
      var asp = stage.width / Math.max(1, stage.height);
      var oc = [0.62 * Math.sin(tt * 0.23), 0.34 * Math.sin(tt * 0.31 + 1.0)], orr = 0.17;
      if (!hasInput) target = [0, 0];
      ptr[0] += (target[0] - ptr[0]) * 0.1; ptr[1] += (target[1] - ptr[1]) * 0.1;
      gl.clearColor(0.039, 0.039, 0.047, 1.0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(pr); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1f(U.uT, tt); gl.uniform1f(U.uAsp, asp); gl.uniform1f(U.uTile, tileClip); gl.uniform1f(U.uAsm, asm);
      gl.uniform1f(U.uPtrOn, hasInput ? 1.0 : 0.0); gl.uniform1f(U.uOr, orr);
      gl.uniform2f(U.uPtr, ptr[0], ptr[1]); gl.uniform2f(U.uOc, oc[0], oc[1]);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(U.uTex, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufH); gl.enableVertexAttribArray(aHome); gl.vertexAttribPointer(aHome, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufS); gl.enableVertexAttribArray(aSeed); gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufC); gl.enableVertexAttribArray(aCorner); gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufU); gl.enableVertexAttribArray(aUV); gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufK); gl.enableVertexAttribArray(aKind); gl.vertexAttribPointer(aKind, 1, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, COUNT * 6);
      gl.useProgram(oPr); gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.uniform1f(oU.uT, tt); gl.uniform1f(oU.uAsp, asp); gl.uniform1f(oU.uOr, orr * asm); gl.uniform1f(oU.uPx, stage.height / 360); gl.uniform2f(oU.uOc, oc[0], oc[1]);
      gl.bindBuffer(gl.ARRAY_BUFFER, oBuf);
      gl.enableVertexAttribArray(oAP); gl.vertexAttribPointer(oAP, 2, gl.FLOAT, false, 12, 0);
      gl.enableVertexAttribArray(oAS); gl.vertexAttribPointer(oAS, 1, gl.FLOAT, false, 12, 8);
      gl.drawArrays(gl.POINTS, 0, oN);
    }
    return { frame: frame, resize: build };
  }

  function mount(img, atlas) {
    var reduce = false; try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    var panel = document.createElement('div'); panel.className = 'thx-hero-panel';
    img.parentNode.insertBefore(panel, img);
    panel.appendChild(img); img.style.opacity = '1';
    if (reduce) { panel.__thxMode = 'static'; return; }

    var canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true'); panel.appendChild(canvas);
    var inst = null, running = false, raf = 0, tries = 0, started = false, inView = false, shown = false;
    panel.__thxMode = 'init';
    function loop(now) { if (!running) return; try { inst && inst.frame(now || performance.now()); } catch (e) {} raf = requestAnimationFrame(loop); }
    function reveal() { if (shown) return; shown = true; canvas.style.opacity = '1'; img.style.opacity = '0'; }
    function go() { if (!inst || !inView) return; if (!running) { running = true; raf = requestAnimationFrame(loop); } reveal(); }
    function swap() { try { var f = canvas.cloneNode(false); panel.replaceChild(f, canvas); canvas = f; } catch (e) {} }
    function build() {
      if (inst) { go(); return; }
      try { inst = makeHero(canvas, atlas); } catch (e) { inst = null; }
      if (inst) { panel.__thxMode = 'webgl'; go(); return; }
      if (tries < 14) { tries++; swap(); setTimeout(build, 500); return; }
      panel.__thxMode = 'static';
    }
    function start() { inView = true; if (inst) { go(); return; } if (started) return; started = true; build(); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }
    try {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) start(); else { inView = false; stop(); } }); }, { threshold: 0.05 });
      io.observe(panel);
    } catch (e) { inView = true; start(); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (inst && inView) go(); });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (inst && inst.resize) try { inst.resize(); } catch (e) {} }, 220); }, { passive: true });
  }

  function findImg() {
    var hero = document.querySelector('.fx-hero'); if (!hero) return null;
    return hero.querySelector('img.image-12') || (hero.querySelector('.fx-hero-text') || hero).querySelector('img') || hero.querySelector('img');
  }

  var done = false;
  function run() {
    if (done) return true;
    var img = findImg(); if (!img) return false;
    if (img.closest('.thx-hero-panel')) { done = true; return true; }
    done = true;
    injectCSS();
    Promise.all(gatherMedia().map(loadImg)).then(function (imgs) {
      var atlas = buildAtlas(imgs); if (!atlas) return;
      try { mount(img, atlas); } catch (e) {}
    });
    return true;
  }

  if (document.readyState !== 'loading') run(); else document.addEventListener('DOMContentLoaded', run);
  window.addEventListener('load', run);
  var n = 0, iv = setInterval(function () { if (run() || ++n > 8) clearInterval(iv); }, 500);
})();
