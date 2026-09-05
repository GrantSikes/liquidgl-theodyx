/* theodyx-footer-fx.js — Theodyx footer ANIMATION ONLY.
 * Contract: may only append/read inside [data-thx-anim="footer"].
 * MUST NOT: set hrefs, hide/move/restyle footer links or columns,
 * inject text content, or query anything outside the slot. */
(function () {
  "use strict";
  if (window.__thxFooterFx) return; window.__thxFooterFx = true;

  function init() {
    var slot = document.querySelector('[data-thx-anim="footer"]');
    if (!slot) return;                       // native footer absent → do nothing
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (slot.__thxFxMounted) return; slot.__thxFxMounted = true;

    /* ── visual layers: gradient top hairline + radial glow (overlay slot),
     *    particle-swarm wordmark (in-flow band, word set by data-word) ── */
    var CSS = [
      '[data-thx-anim="footer"]{pointer-events:none}',
      '[data-thx-anim="footer"] .thx-glow{position:absolute;top:-34%;left:50%;transform:translateX(-50%);width:120%;height:74%;background:radial-gradient(50% 62% at 50% 0,rgba(120,148,246,.20),rgba(168,124,255,.10) 46%,transparent 72%);pointer-events:none}',
      '[data-thx-anim="footer"] .thx-top{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(120,148,246,.6),rgba(168,124,255,.65),rgba(255,143,177,.5),transparent)}',
      '[data-thx-anim="footer-wordmark"] .thx-grad{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif;font-weight:800;font-size:clamp(56px,17.4vw,236px);line-height:1;letter-spacing:-.04em;white-space:nowrap;background:linear-gradient(106deg,#b9854a,#ecd6a0 46%,#c79a5e 82%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;opacity:.96;transition:opacity .7s ease;pointer-events:none}',
      '[data-thx-anim="footer-wordmark"] canvas{position:absolute;inset:0;display:block;width:100%;height:100%;opacity:0;transition:opacity .7s var(--thx-ease-ambient,cubic-bezier(.19,1,.22,1))}',
      '@media (forced-colors:active){[data-thx-anim="footer-wordmark"] canvas{display:none!important}[data-thx-anim="footer-wordmark"] .thx-grad{opacity:1!important;background:none;-webkit-text-fill-color:CanvasText;color:CanvasText}}',
      '@media(max-width:600px){[data-thx-anim="footer-wordmark"] .thx-grad{font-size:clamp(44px,17.6vw,104px)}}'
    ].join('');
    if (!document.getElementById('thx-footer-fx-css')) {
      var st = document.createElement('style'); st.id = 'thx-footer-fx-css'; st.textContent = CSS;
      (document.head || document.documentElement).appendChild(st);
    }

  var SW = (function () {
    var WORD = "THEODYX";
    var P = [[0.50, 0.30, 0.17], [0.80, 0.52, 0.29], [0.93, 0.78, 0.48], [1.00, 0.95, 0.82]]; // Earth
    function dpr() { return Math.min(window.devicePixelRatio || 1, 2); }
    function textMask(cssW, cssH, scale) {
      scale = scale || 1;
      var c = document.createElement("canvas");
      var w = Math.max(2, Math.floor(cssW * scale)), h = Math.max(2, Math.floor(cssH * scale));
      c.width = w; c.height = h; var x = c.getContext("2d");
      var target = w * 0.88, fs = h * 0.92, i = 0;
      x.textAlign = "center"; x.textBaseline = "middle";
      do { x.font = "900 " + fs + "px 'Google Sans Flex','Arial Black',Arial,system-ui,sans-serif";
        var mw = x.measureText(WORD).width; if (mw <= target || fs < 8) break; fs *= target / mw; i++; } while (i < 8);
      x.clearRect(0, 0, w, h); x.fillStyle = "#fff";
      x.font = "900 " + fs + "px 'Google Sans Flex','Arial Black',Arial,system-ui,sans-serif";
      x.fillText(WORD, w / 2, h / 2 + fs * 0.02);
      return { canvas: c, w: w, h: h };
    }
    function makeSwarm(stage) {
      var gl = null;
      try { gl = stage.getContext("webgl", { premultipliedAlpha: false, alpha: true, antialias: false })
            || stage.getContext("experimental-webgl", { premultipliedAlpha: false, alpha: true, antialias: false }); }
      catch (e) { gl = null; }
      if (!gl) { return null; }

      var VS = [
       "precision highp float;",
       "attribute vec2 aHome; attribute float aSeed;",
       "uniform float uT,uPx,uAsp,uOr,uMode;",
       "uniform vec2 uOc;",
       "uniform vec3 cA,cB,cC,cD;",
       "varying vec3 vCol; varying float vGlow;",
       "float hsh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}",
       "float nz(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);",
       " return mix(mix(hsh(i),hsh(i+vec2(1.,0.)),u.x),mix(hsh(i+vec2(0.,1.)),hsh(i+vec2(1.,1.)),u.x),u.y);}",
       "vec2 curl(vec2 p){float e=0.1;float a=nz(p+vec2(0.,e)),b=nz(p-vec2(0.,e)),c=nz(p+vec2(e,0.)),d=nz(p-vec2(e,0.));",
       " return vec2(a-b,d-c)/(2.0*e);}",
       "void main(){",
       "  float t=uT; float s=aSeed; vec2 pos; vec3 col; float energy;",
       "  if(uMode<0.5){",
       "    vec2 home=aHome;",
       "    pos=home+curl(home*1.6+vec2(0.0,t*0.13))*0.0016;",
       "    vec2 dc=(home-uOc)*vec2(uAsp,1.0); float drc=length(dc)+1e-4;",
       "    float ringDist=abs(drc-uOr);",
       "    float ringBand=exp(-(ringDist*ringDist)/0.0025);",
       "    vec2 offA=vec2(0.776,-0.628)*(1.8*uOr);",
       "    vec2 dotC=uOc+vec2(offA.x/uAsp, offA.y);",
       "    vec2 dd=(home-dotC)*vec2(uAsp,1.0); float ddl=length(dd)+1e-4;",
       "    float dR=0.34*uOr; float dotBand=exp(-(ddl*ddl)/(dR*dR));",
       "    float mark=clamp(ringBand+dotBand,0.0,1.0);",
       "    float sgn = drc>uOr ? 1.0 : -1.0; vec2 rdir=dc/drc;",
       "    pos+=vec2(rdir.x/uAsp, rdir.y)*ringBand*sgn*0.010;",
       "    energy=clamp(mark*0.95, 0.0, 2.0);",
       "    float cm=clamp(home.x*0.5+0.5,0.0,1.0);",
       "    col = cm<0.5 ? mix(cA,cB,cm*2.0) : mix(cB,cC,(cm-0.5)*2.0);",
       "    col=mix(col,cD,clamp(energy*0.7,0.0,1.0));",
       "    gl_PointSize=clamp(uPx*(0.5+s*1.3+energy*2.4),1.0,16.0);",
       "  } else {",
       "    vec2 posA=aHome*uOr;",
       "    pos=uOc+vec2(posA.x/uAsp, posA.y);",
       "    pos.y+=sin(t*1.4+s*6.2831)*0.0015;",
       "    energy=1.0;",
       "    col=mix(cC,cD,0.55);",
       "    gl_PointSize=clamp(uPx*(1.05+s*0.7),1.5,9.0);",
       "  }",
       "  gl_Position=vec4(pos,0.0,1.0);",
       "  vCol=col; vGlow=0.55+0.6*s+energy;",
       "}"].join("\n");

      var FS = [
       "precision highp float;",
       "varying vec3 vCol; varying float vGlow;",
       "void main(){vec2 c=gl_PointCoord-0.5;float r=dot(c,c);if(r>0.25)discard;float a=1.0-r*4.0;a=a*a;",
       " gl_FragColor=vec4(vCol*vGlow,a*0.85);}"].join("\n");

      function sh(tp, x) { var o = gl.createShader(tp); gl.shaderSource(o, x); gl.compileShader(o);
        if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { return null; } return o; }
      var vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
      if (!vs || !fs) { return null; }
      var pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { return null; }
      gl.useProgram(pr);

      var aHome = gl.getAttribLocation(pr, "aHome"), aSeed = gl.getAttribLocation(pr, "aSeed");
      var U = {};["uT", "uPx", "uAsp", "uOr", "uMode", "uOc", "cA", "cB", "cC", "cD"].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
      gl.uniform3f(U.cA, P[0][0], P[0][1], P[0][2]);
      gl.uniform3f(U.cB, P[1][0], P[1][1], P[1][2]);
      gl.uniform3f(U.cC, P[2][0], P[2][1], P[2][2]);
      gl.uniform3f(U.cD, P[3][0], P[3][1], P[3][2]);

      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      var lbuf = gl.createBuffer(), COUNT_L = 0;
      (function () {
        var RING = 5200, DOTN = 900, n = RING + DOTN, a = new Float32Array(n * 3), idx = 0, i;
        for (i = 0; i < RING; i++) { var th = (i / RING) * 6.2831 + (Math.random() * 2 - 1) * 0.02; var rr = 1.0 + (Math.random() * 2 - 1) * 0.13;
          a[idx++] = Math.cos(th) * rr; a[idx++] = Math.sin(th) * rr; a[idx++] = Math.random(); }
        var dox = 1.40, doy = -1.133, ddr = 0.283;
        for (i = 0; i < DOTN; i++) { var t2 = Math.random() * 6.2831, r2 = Math.sqrt(Math.random()) * ddr;
          a[idx++] = dox + Math.cos(t2) * r2; a[idx++] = doy + Math.sin(t2) * r2; a[idx++] = Math.random(); }
        COUNT_L = n; gl.bindBuffer(gl.ARRAY_BUFFER, lbuf); gl.bufferData(gl.ARRAY_BUFFER, a, gl.STATIC_DRAW);
      })();

      var buf = gl.createBuffer(), COUNT = 0, pxScale = 1.0;
      function build() {
        var r = stage.getBoundingClientRect(), d = dpr();
        var cssW = r.width || 1, cssH = r.height || 1;
        stage.width = Math.max(1, Math.floor(cssW * d)); stage.height = Math.max(1, Math.floor(cssH * d));
        var small = cssW < 760, dens = small ? 1.7 : 1.55;   // denser mask on phones so enough particles get sampled
        var mk = textMask(cssW, cssH, dens), w = mk.w, h = mk.h, data;
        try { data = mk.canvas.getContext("2d").getImageData(0, 0, w, h).data; } catch (e) { COUNT = 0; return; }
        var cap = small ? 64000 : 300000, total = 0;   // lighter on phone GPUs; bigger points (below) keep it lush
        for (var pp = 3; pp < data.length; pp += 4) { if (data[pp] > 120) total++; }
        var step = total > cap ? Math.ceil(total / cap) : 1, n = Math.min(total, cap);
        var arr = new Float32Array(n * 3), idx = 0, c = 0, seen = 0;
        for (var y = 0; y < h; y++) { for (var x = 0; x < w; x++) { if (data[(y * w + x) * 4 + 3] > 120) { seen++; if (seen % step !== 0) continue; if (c >= n) break;
          arr[idx++] = (x / (w - 1)) * 2.0 - 1.0; arr[idx++] = (1.0 - (y / (h - 1))) * 2.0 - 1.0; arr[idx++] = Math.random(); c++; } } if (c >= n) break; }
        COUNT = c; gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, arr.subarray(0, c * 3), gl.STATIC_DRAW);
        // point size scales with canvas height, but on a short phone canvas that goes ~1px (dim/sparse),
        // so floor it on mobile to ~2px device so particles read as a lush, bright wordmark.
        pxScale = small ? Math.max(stage.height / 300.0, d * 1.2) : stage.height / 300.0;
        gl.viewport(0, 0, stage.width, stage.height);
      }
      build();
      if (COUNT === 0) { return null; }

      var target = [0, 0], hasInput = false, oc = [0, 0];
      stage.addEventListener("pointermove", function (e) { var r = stage.getBoundingClientRect(); if (!r.width) return;
        target = [(e.clientX - r.left) / r.width * 2.0 - 1.0, (1.0 - (e.clientY - r.top) / r.height) * 2.0 - 1.0]; hasInput = true; });
      stage.addEventListener("pointerleave", function () { hasInput = false; });

      var t0 = performance.now();
      function frame(now) {
        var tt = (now - t0) / 1000;
        var tx, ty;
        if (hasInput) { tx = target[0]; ty = target[1]; }
        else { tx = 0.95 * Math.sin(tt * 0.16); ty = 0.42 * Math.sin(tt * 0.23 + 1.0); }
        oc[0] += (tx - oc[0]) * 0.10; oc[1] += (ty - oc[1]) * 0.10;
        var orr = 0.22 + 0.02 * Math.sin(tt * 0.8);
        var asp = stage.width / Math.max(1, stage.height);
        gl.useProgram(pr);
        gl.uniform1f(U.uT, tt); gl.uniform1f(U.uPx, pxScale); gl.uniform1f(U.uAsp, asp);
        gl.uniform2f(U.uOc, oc[0], oc[1]); gl.uniform1f(U.uOr, orr);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(U.uMode, 0.0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(aHome); gl.vertexAttribPointer(aHome, 2, gl.FLOAT, false, 12, 0);
        gl.enableVertexAttribArray(aSeed); gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 12, 8);
        gl.drawArrays(gl.POINTS, 0, COUNT);
        gl.uniform1f(U.uMode, 1.0);
        gl.bindBuffer(gl.ARRAY_BUFFER, lbuf);
        gl.enableVertexAttribArray(aHome); gl.vertexAttribPointer(aHome, 2, gl.FLOAT, false, 12, 0);
        gl.enableVertexAttribArray(aSeed); gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 12, 8);
        gl.drawArrays(gl.POINTS, 0, COUNT_L);
      }
      return { frame: frame, resize: build };
    }
    function mount(node, grad, word) { if (word && typeof word === 'string') WORD = word;
      var inst = null, running = false, raf = 0, reduce = false, tries = 0, started = false, inView = false, done = false, shown = false;
      try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
      try { if (window.matchMedia('(forced-colors: active)').matches) reduce = true; } catch (e) {} /* Phase 11 RM-04: forced colours cannot remap canvas pixels; keep the DOM wordmark */
      node.__thxMode = 'init';
      if (reduce) { node.__thxMode = 'reduced'; return; }   // honour reduced-motion: keep the static gradient wordmark, no swarm
      function loop(now) { if (!running) return; try { inst && inst.frame && inst.frame(now || performance.now()); } catch (e) {} raf = requestAnimationFrame(loop); }
      function show() {
        if (!inst || !inView) return;
        if (!running) { running = true; raf = requestAnimationFrame(loop); }
        if (!shown) { shown = true; try { node.style.opacity = '1'; if (grad) grad.style.opacity = '0'; } catch (e) {} }  // crossfade: solid wordmark dissolves into the swarm
      }
      var io = null;
      function swap() {
        // Chrome marks a <canvas> whose WebGL context-creation fails (GPU contended during load)
        // as PERMANENTLY failed, so retrying the same element is futile. Swap in a fresh canvas.
        try { var fresh = node.cloneNode(false); if (node.parentNode) node.parentNode.replaceChild(fresh, node); node = fresh; if (io) try { io.observe(node); } catch (e2) {} } catch (e) {}
      }
      function build() {
        if (done || inst) return;
        // makeSwarm returns null on any WebGL miss WITHOUT tainting the canvas as 2D. The gradient
        // wordmark stays fully visible the whole time (no blank gap); the swarm crossfades in once a
        // fresh canvas wins a context.
        var s = null; try { s = makeSwarm(node); } catch (e) { s = null; }
        if (s) { inst = s; done = true; node.__thxMode = 'swarm'; show(); return; }
        if (tries < 60) { tries++; swap(); setTimeout(build, 500); return; }   // ~30s of retries on fresh canvases while the page settles
        node.__thxMode = 'gradient';                                           // WebGL never came up; the static gradient remains
      }
      function start() { inView = true; if (inst) { show(); return; } if (started) return; started = true; build(); }
      function stop() { running = false; if (raf) cancelAnimationFrame(raf); }
      try {
        io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) start(); else { inView = false; stop(); } }); }, { threshold: 0.04 });
        io.observe(node);
      } catch (e) { inView = true; start(); }
      // kick: if the footer is already on-screen once laid out, start without waiting on an IO change event
      function kick() { try { var r = node.getBoundingClientRect(); if (r.height > 0 && r.top < (window.innerHeight || 0) && r.bottom > 0) start(); } catch (e) {} }
      if (document.readyState === 'complete') setTimeout(kick, 80); else window.addEventListener('load', function () { setTimeout(kick, 80); });
      document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (inst && inView) show(); });
      var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (inst && inst.resize) try { inst.resize(); } catch (e) {} }, 220); }, { passive: true });
    }
    return { mount: mount };
  })();

    var glow = document.createElement('div'); glow.className = 'thx-glow';
    var topline = document.createElement('div'); topline.className = 'thx-top';
    slot.appendChild(glow); slot.appendChild(topline);

    var wm = document.querySelector('[data-thx-anim="footer-wordmark"]');
    if (wm && !wm.__thxFxMounted) {
      wm.__thxFxMounted = true;
      var word = (wm.getAttribute('data-word') || 'THEODYX').trim() || 'THEODYX';
      wm.setAttribute('role', 'img'); wm.setAttribute('aria-label', word);
      var grad = document.createElement('div'); grad.className = 'thx-grad';
      grad.setAttribute('aria-hidden', 'true'); grad.textContent = word;
      var cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true');
      wm.appendChild(grad); wm.appendChild(cv);
      try { SW.mount(cv, grad, word); } catch (e) {}
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
