/* theodyx-mosaic.js — "Media Mosaic THEODYX" animation for the .fx-hero section.
 * Replaces the hero image with a TRANSPARENT canvas (blends into the page's cream
 * background) where a dense field of varied media tiles assemble into a crisp THEODYX
 * wordmark, with the brand ring-and-dot "O" roaming through it. The media is a curated,
 * CDN-hosted set (loaded from the same commit as this file) — not the site's stock photos.
 *
 * Robust: hidden <img> fallback revealed only if WebGL never comes up (retries on a fresh
 * canvas for Chrome's sticky context-fail); honours reduced-motion; IntersectionObserver-gated.
 */
(function () {
  "use strict";
  if (window.__thxMosaic) return;
  window.__thxMosaic = true;

  // self-locate: media lives at <base>/media/mNN.jpg, same commit as this script
  function selfBase() {
    var s = document.currentScript, src = s && s.src;
    if (!src) { var ss = document.getElementsByTagName('script'); for (var i = ss.length - 1; i >= 0; i--) { if (/theodyx-mosaic\.js/.test(ss[i].src || '')) { src = ss[i].src; break; } } }
    if (src && /theodyx-mosaic\.js/.test(src)) return src.replace(/theodyx-mosaic\.js.*$/, '');
    return 'https://cdn.jsdelivr.net/gh/GrantSikes/liquidgl-theodyx@main/';
  }
  var BASE = selfBase();
  var MEDIA = []; for (var mi = 1; mi <= 24; mi++) MEDIA.push(BASE + 'media/m' + (mi < 10 ? '0' : '') + mi + '.jpg');
  var WORD = "THEODYX";
  function dpr() { return Math.min(window.devicePixelRatio || 1, 2); }

  var CSS = [
    '.thx-hero-panel{position:relative;width:100%;max-width:1120px;margin-left:auto;margin-right:auto;aspect-ratio:1120/440;background:transparent}',
    '.thx-hero-panel>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:20px;opacity:0;transition:opacity .6s ease;z-index:1}',
    '.thx-hero-panel>canvas{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 1s ease;z-index:2}',
    '@media(max-width:600px){.thx-hero-panel{aspect-ratio:1120/520}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('thx-mosaic-css')) return;
    var s = document.createElement('style'); s.id = 'thx-mosaic-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function loadImg(u) { return new Promise(function (res) { var im = new Image(); im.crossOrigin = "anonymous"; im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = u; }); }

  function buildAtlas(imgs) {
    imgs = imgs.filter(Boolean); if (!imgs.length) return null;
    var N = imgs.length, cols = Math.ceil(Math.sqrt(N)), rows = Math.ceil(N / cols), CELL = 256;
    var c = document.createElement("canvas"); c.width = cols * CELL; c.height = rows * CELL; var x = c.getContext("2d");
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
    var target = w * 0.94, fs = h * 0.92, i = 0; x.textAlign = "center"; x.textBaseline = "middle";
    do { x.font = "900 " + fs + "px 'Arial Black',Arial,system-ui,sans-serif"; var mw = x.measureText(WORD).width; if (mw <= target || fs < 8) break; fs *= target / mw; i++; } while (i < 12);
    x.clearRect(0, 0, w, h); x.fillStyle = "#fff"; x.font = "900 " + fs + "px 'Arial Black',Arial,system-ui,sans-serif";
    x.fillText(WORD, w / 2, h / 2);
    var d; try { d = x.getImageData(0, 0, w, h).data; } catch (e) { return []; }
    var step = Math.max(3, Math.floor(spacingPx * sc)), pts = [];
    for (var yy = Math.floor(step / 2); yy < h; yy += step) { for (var xx = Math.floor(step / 2); xx < w; xx += step) { if (d[(yy * w + xx) * 4 + 3] > 130) pts.push([(xx / w) * 2 - 1, (1 - yy / h) * 2 - 1]); } }
    return pts;
  }

  function makeHero(stage, atlas) {
    var gl = null;
    try { gl = stage.getContext("webgl", { premultipliedAlpha: false, alpha: true, antialias: true }) || stage.getContext("experimental-webgl", { alpha: true }); } catch (e) {}
    if (!gl || !atlas) return null;

    var VS = [
      "precision highp float;",
      "attribute vec2 aHome; attribute float aSeed; attribute vec2 aCorner; attribute vec2 aUV;",
      "uniform float uT,uAsp,uTile,uAsm,uPtrOn,uOr;",
      "uniform vec2 uPtr,uOc;",
      "varying vec2 vUV; varying vec2 vLocal; varying float vBright; varying float vFade;",
      "float hsh(float n){return fract(sin(n)*43758.5453);}",
      "void main(){",
      "  float s=aSeed; float t=uT;",
      "  float ang=hsh(s*12.9)*6.2831; float dist=1.2+hsh(s*7.7)*1.3;",
      "  vec2 scatter=aHome+vec2(cos(ang),sin(ang))*dist;",
      "  vec2 pos=mix(scatter,aHome,uAsm);",
      "  pos+=vec2(sin(t*0.5+s*30.0),cos(t*0.45+s*21.0))*0.004*uAsm;",
      "  float wave=sin(aHome.x*3.0 - t*1.0 + s*1.5);",
      "  float lift=smoothstep(0.65,1.0,wave)*0.4*uAsm;",
      "  vec2 dO=(aHome-uOc)*vec2(uAsp,1.0); float dOr=length(dO);",
      "  lift+=smoothstep(uOr*1.5,0.0,dOr)*0.8;",
      "  vec2 dP=(aHome-uPtr)*vec2(uAsp,1.0);",
      "  lift+=uPtrOn*smoothstep(0.3,0.0,length(dP))*0.9;",
      "  float scale=(0.96+0.08*sin(t*0.6+s*40.0))*(1.0+lift*0.45);",
      "  vBright=1.0+lift*0.9;",
      "  vec2 off=aCorner*uTile*scale*vec2(1.0/uAsp,1.0);",
      "  pos+=off;",
      "  gl_Position=vec4(pos,0.0,1.0);",
      "  vUV=aUV; vLocal=aCorner;",
      "  vFade=smoothstep(1.04,0.86,abs(pos.x))*smoothstep(1.04,0.80,abs(pos.y));", // dissolve into the page near edges
      "}"].join("\n");

    var FS = [
      "precision highp float;",
      "uniform sampler2D uTex;",
      "varying vec2 vUV; varying vec2 vLocal; varying float vBright; varying float vFade;",
      "void main(){",
      "  vec2 q=abs(vLocal); float edge=max(q.x,q.y);",
      "  if(edge>0.995) discard;",
      "  float frame=smoothstep(0.995,0.965,edge);",
      "  vec3 col=texture2D(uTex,vUV).rgb;",
      "  col=clamp(col*1.18+0.015,0.0,1.0); col*=vBright;",
      "  gl_FragColor=vec4(col, frame*vFade);",
      "}"].join("\n");

    function sh(tp, src) { var o = gl.createShader(tp); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { return null; } return o; }
    var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) return null;
    var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);

    var aHome = gl.getAttribLocation(pr, "aHome"), aSeed = gl.getAttribLocation(pr, "aSeed"), aCorner = gl.getAttribLocation(pr, "aCorner"), aUV = gl.getAttribLocation(pr, "aUV");
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

    var bufH, bufS, bufC, bufU, COUNT = 0, tileClip = 0.05;
    var CORN = [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]];
    function build() {
      var r = stage.getBoundingClientRect(), d = dpr();
      var cssW = r.width || 1, cssH = r.height || 1;
      stage.width = Math.max(1, Math.floor(cssW * d)); stage.height = Math.max(1, Math.floor(cssH * d));
      gl.viewport(0, 0, stage.width, stage.height);
      var small = cssW < 560, spacing = small ? 5 : 8;
      var pts = tilePositions(cssW, cssH, spacing);
      COUNT = pts.length;
      tileClip = (spacing / cssH) * 2.0 * 0.92;   // tightly packed -> crisp letterforms
      var H = new Float32Array(COUNT * 12), S = new Float32Array(COUNT * 6), C = new Float32Array(COUNT * 12), UV = new Float32Array(COUNT * 12);
      var hi = 0, si = 0, ci = 0, ui = 0;
      for (var i = 0; i < COUNT; i++) {
        var p = pts[i], seed = Math.random(), cell = atlas.cells[(Math.random() * atlas.cells.length) | 0];
        var cw = cell.u1 - cell.u0, ch = cell.v1 - cell.v0, crop = 0.5 + Math.random() * 0.4;
        var ou = cell.u0 + Math.random() * cw * (1 - crop), ov = cell.v0 + Math.random() * ch * (1 - crop);
        var u0 = ou, v0 = ov, u1 = ou + cw * crop, v1 = ov + ch * crop;
        for (var k = 0; k < 6; k++) { var cn = CORN[k]; H[hi++] = p[0]; H[hi++] = p[1]; S[si++] = seed; C[ci++] = cn[0]; C[ci++] = cn[1]; UV[ui++] = cn[0] < 0 ? u0 : u1; UV[ui++] = cn[1] < 0 ? v0 : v1; }
      }
      function mk(arr) { var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW); return b; }
      bufH = mk(H); bufS = mk(S); bufC = mk(C); bufU = mk(UV);
    }
    build();
    if (COUNT === 0) return null;

    // brand ring + dot "O" — colored (reads on cream AND over dark media), normal alpha
    var oVS = ["precision highp float;", "attribute vec2 aP; attribute float aS;", "uniform float uT,uAsp,uOr,uPx; uniform vec2 uOc;", "varying float vG;", "void main(){vec2 p=uOc+aP*uOr*vec2(1.0/uAsp,1.0); p.y+=sin(uT*1.4+aS*6.2831)*0.0014; gl_Position=vec4(p,0.0,1.0); gl_PointSize=uPx*(0.8+aS*0.6); vG=0.85+0.15*aS;}"].join("\n");
    var oFS = ["precision highp float;", "varying float vG;", "void main(){vec2 c=gl_PointCoord-0.5;float r=dot(c,c);if(r>0.25)discard;float a=1.0-r*4.0;a*=a;gl_FragColor=vec4(0.62*vG,0.44*vG,1.0*vG,a*0.95);}"].join("\n");
    var oV = sh(gl.VERTEX_SHADER, oVS), oF = sh(gl.FRAGMENT_SHADER, oFS); if (!oV || !oF) return null;
    var oPr = gl.createProgram(); gl.attachShader(oPr, oV); gl.attachShader(oPr, oF); gl.linkProgram(oPr);
    var oAP = gl.getAttribLocation(oPr, "aP"), oAS = gl.getAttribLocation(oPr, "aS");
    var oU = {};["uT", "uAsp", "uOr", "uPx", "uOc"].forEach(function (n) { oU[n] = gl.getUniformLocation(oPr, n); });
    var oBuf = gl.createBuffer(), oN = 0;
    (function () { var RING = 3000, DOT = 560, n = RING + DOT, arr = new Float32Array(n * 3), idx = 0, i;
      for (i = 0; i < RING; i++) { var th = (i / RING) * 6.2831, rr = 1.0 + (Math.random() * 2 - 1) * 0.10; arr[idx++] = Math.cos(th) * rr; arr[idx++] = Math.sin(th) * rr; arr[idx++] = Math.random(); }
      var dox = 1.40, doy = -1.133, ddr = 0.28;
      for (i = 0; i < DOT; i++) { var t2 = Math.random() * 6.2831, r2 = Math.sqrt(Math.random()) * ddr; arr[idx++] = dox + Math.cos(t2) * r2; arr[idx++] = doy + Math.sin(t2) * r2; arr[idx++] = Math.random(); }
      oN = n; gl.bindBuffer(gl.ARRAY_BUFFER, oBuf); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW); })();

    var target = [0, 0], hasInput = false, ptr = [0, 0];
    stage.addEventListener("pointermove", function (e) { var r = stage.getBoundingClientRect(); if (!r.width) return; target = [(e.clientX - r.left) / r.width * 2 - 1, (1 - (e.clientY - r.top) / r.height) * 2 - 1]; hasInput = true; });
    stage.addEventListener("pointerleave", function () { hasInput = false; });

    var t0 = performance.now();
    function frame(now) {
      var tt = (now - t0) / 1000;
      var asm = Math.min(1, Math.max(0, (tt - 0.2) / 2.6)); asm = asm * asm * (3 - 2 * asm);
      var asp = stage.width / Math.max(1, stage.height);
      var oc = [0.78 * Math.sin(tt * 0.21), 0.62 * Math.sin(tt * 0.29 + 1.0)], orr = 0.12;
      if (!hasInput) target = [0, 0];
      ptr[0] += (target[0] - ptr[0]) * 0.1; ptr[1] += (target[1] - ptr[1]) * 0.1;
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(pr); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1f(U.uT, tt); gl.uniform1f(U.uAsp, asp); gl.uniform1f(U.uTile, tileClip); gl.uniform1f(U.uAsm, asm);
      gl.uniform1f(U.uPtrOn, hasInput ? 1.0 : 0.0); gl.uniform1f(U.uOr, orr);
      gl.uniform2f(U.uPtr, ptr[0], ptr[1]); gl.uniform2f(U.uOc, oc[0], oc[1]);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(U.uTex, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufH); gl.enableVertexAttribArray(aHome); gl.vertexAttribPointer(aHome, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufS); gl.enableVertexAttribArray(aSeed); gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufC); gl.enableVertexAttribArray(aCorner); gl.vertexAttribPointer(aCorner, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufU); gl.enableVertexAttribArray(aUV); gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, COUNT * 6);
      gl.useProgram(oPr); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1f(oU.uT, tt); gl.uniform1f(oU.uAsp, asp); gl.uniform1f(oU.uOr, orr * asm); gl.uniform1f(oU.uPx, stage.height / 420); gl.uniform2f(oU.uOc, oc[0], oc[1]);
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
    panel.appendChild(img);
    if (reduce) { img.style.opacity = '1'; panel.__thxMode = 'static'; return; }

    var canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true'); panel.appendChild(canvas);
    var inst = null, running = false, raf = 0, tries = 0, started = false, inView = false, shown = false;
    panel.__thxMode = 'init';
    function loop(now) { if (!running) return; try { inst && inst.frame(now || performance.now()); } catch (e) {} raf = requestAnimationFrame(loop); }
    function reveal() { if (shown) return; shown = true; canvas.style.opacity = '1'; }
    function go() { if (!inst || !inView) return; if (!running) { running = true; raf = requestAnimationFrame(loop); } reveal(); }
    function swap() { try { var f = canvas.cloneNode(false); panel.replaceChild(f, canvas); canvas = f; } catch (e) {} }
    function build() {
      if (inst) { go(); return; }
      try { inst = makeHero(canvas, atlas); } catch (e) { inst = null; }
      if (inst) { panel.__thxMode = 'webgl'; go(); return; }
      if (tries < 14) { tries++; swap(); setTimeout(build, 500); return; }
      img.style.opacity = '1'; panel.__thxMode = 'static';   // WebGL never came up -> show the still image
    }
    function start() { inView = true; if (inst) { go(); return; } if (started) return; started = true; build(); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }
    try {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) start(); else { inView = false; stop(); } }); }, { threshold: 0.04 });
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
    Promise.all(MEDIA.map(loadImg)).then(function (imgs) {
      var atlas = buildAtlas(imgs); if (!atlas) { img.style.opacity = '1'; return; }
      try { mount(img, atlas); } catch (e) {}
    });
    return true;
  }

  if (document.readyState !== 'loading') run(); else document.addEventListener('DOMContentLoaded', run);
  window.addEventListener('load', run);
  var n = 0, iv = setInterval(function () { if (run() || ++n > 8) clearInterval(iv); }, 500);
})();
