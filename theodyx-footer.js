/* theodyx-footer.js — modern, Google Labs-inspired site footer for Theodyx.
 * Loaded site-wide via the registered "nv2footd" loader. Idempotent + self-healing.
 * Restyles the existing <footer class="footer"> markup, injects a CTA band, a LIVE
 * particle-swarm wordmark (Earth edition) with the Theodyx logo O roaming through it,
 * a gradient glow, and circular social buttons. Keeps the link-fix / cleanup behaviour.
 */
(function () {
  "use strict";
  if (window.__thxFooterV2) return;
  window.__thxFooterV2 = true;

  var CSS = [
    '.footer{position:relative!important;overflow:hidden!important;background:#0a0a0c!important;color:#f5f1e8!important;padding:clamp(64px,8vw,116px) clamp(22px,5vw,72px) 34px!important;display:block!important;border-top:1px solid rgba(245,241,232,.08)!important}',
    '.footer .thx-glow{position:absolute;top:-34%;left:50%;transform:translateX(-50%);width:120%;height:74%;background:radial-gradient(50% 62% at 50% 0,rgba(120,148,246,.20),rgba(168,124,255,.10) 46%,transparent 72%);pointer-events:none;z-index:0}',
    '.footer .thx-top{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(120,148,246,.6),rgba(168,124,255,.65),rgba(255,143,177,.5),transparent);z-index:2}',
    '.footer>*:not(.thx-glow):not(.thx-top){position:relative;z-index:1;max-width:1280px;margin-left:auto;margin-right:auto}',
    '.thx-fcta{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:30px;margin-bottom:clamp(44px,6vw,82px)!important}',
    '.thx-fcta .ey{margin:0 0 14px;font:600 13px/1 "Google Sans Flex","Google Sans",system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:rgba(245,241,232,.5)}',
    '.thx-fcta h2{margin:0;font-family:"Google Sans Flex","Google Sans",Georgia,serif;font-weight:500;font-size:clamp(28px,4.6vw,54px);line-height:1.03;letter-spacing:-.02em;max-width:15ch;color:#fff}',
    '.thx-fbtn{flex:0 0 auto;display:inline-flex;align-items:center;gap:.45em;padding:16px 30px;border-radius:999px;background:#f5f1e8;color:#0a0a0c!important;font:600 16px/1 "Google Sans Flex","Google Sans",system-ui,sans-serif;text-decoration:none!important;border:0;cursor:pointer;transition:transform .25s cubic-bezier(.33,1,.68,1),box-shadow .25s,background .25s;box-shadow:0 10px 34px rgba(0,0,0,.4)}',
    '.thx-fbtn:hover{transform:translateY(-2px) scale(1.02);background:#fff;box-shadow:0 16px 44px rgba(120,148,246,.4)}',
    '.thx-fbtn .ar{transition:transform .25s}',
    '.thx-fbtn:hover .ar{transform:translateX(4px)}',
    '.thx-fcols{display:flex;flex-wrap:wrap;gap:clamp(34px,6vw,84px)}',
    '.footer .footer-col{position:static!important;float:none!important;inset:auto!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;min-width:118px;gap:0!important}',
    '.footer .footer-col.thx-hide{display:none!important}',
    '.footer .footer-h{margin:0 0 16px!important;padding:0!important;font:600 12px/1 "Google Sans Flex","Google Sans",system-ui,sans-serif!important;letter-spacing:.18em!important;text-transform:uppercase!important;color:rgba(245,241,232,.42)!important;background:none!important}',
    '.footer .footer-link{position:relative;display:inline-block!important;width:auto!important;padding:7px 0!important;margin:0!important;color:rgba(245,241,232,.62)!important;font:400 15.5px/1.35 "Google Sans Flex","Google Sans",system-ui,sans-serif!important;text-decoration:none!important;background:none!important;transition:color .2s ease,transform .2s ease}',
    '.footer .footer-link:hover{color:#fff!important;transform:translateX(4px)}',
    '.thx-fmark{position:relative;margin:clamp(48px,7vw,96px) auto 0!important;width:100%;max-width:1180px;height:clamp(104px,21vw,250px);user-select:none;overflow:hidden}',
    '.thx-fmark .thx-grad{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:"Google Sans Flex","Google Sans",system-ui,sans-serif;font-weight:800;font-size:clamp(56px,17.4vw,236px);line-height:1;letter-spacing:-.04em;white-space:nowrap;background:linear-gradient(106deg,#b9854a,#ecd6a0 46%,#c79a5e 82%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;opacity:.96;transition:opacity .7s ease;pointer-events:none}',
    '.thx-fmark canvas{position:absolute;inset:0;display:block;width:100%;height:100%;opacity:0;transition:opacity .7s ease}',
    '.footer .footer-bottom-1{margin:clamp(30px,4vw,52px) auto 0!important;padding-top:24px!important;border-top:1px solid rgba(245,241,232,.1)!important;display:flex!important;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px}',
    '.footer .footer-bottom-1 .copyright{margin:0!important;color:rgba(245,241,232,.46)!important;font:400 13px/1.55 "Google Sans Flex","Google Sans",system-ui,sans-serif!important}',
    '.thx-fsoc{display:flex;gap:10px}',
    '.thx-fsoc a{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:999px;border:1px solid rgba(245,241,232,.16);color:rgba(245,241,232,.72)!important;text-decoration:none!important;transition:transform .2s,background .2s,border-color .2s,color .2s}',
    '.thx-fsoc a:hover{transform:translateY(-3px);background:rgba(245,241,232,.08);border-color:rgba(245,241,232,.45);color:#fff!important}',
    '.thx-fsoc svg{width:17px;height:17px;display:block;fill:currentColor}',
    '@media(max-width:600px){.footer{text-align:left}.thx-fcols{gap:30px 40px}.footer .footer-col{min-width:42%}.thx-fbtn{width:100%;justify-content:center}.thx-fcta h2{font-size:clamp(26px,7.5vw,34px)}.thx-fmark{height:clamp(124px,36vw,200px)}.thx-fmark .thx-grad{font-size:clamp(44px,17.6vw,104px)}.footer .footer-bottom-1{justify-content:flex-start}}'
  ].join('');

  var ICONS = {
    X: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>',
    LinkedIn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
    YouTube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.6 15.6V8.4l6.27 3.6-6.27 3.6z"/></svg>',
    Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.36 2.67.94 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.12-1.38c.66-.66 1.08-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.12A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>',
    Facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>'
  };

  function el(t, c) { var e = document.createElement(t); if (c) e.className = c; return e; }

  /* ---------------------------------------------------------------------------
   * SWARM — Earth-edition particle wordmark + Theodyx logo O (verified engine).
   * ~250k stateless GPU points spell THEODYX (90k on phones). The brand ring &
   * dot glide around & through the dots; particles ignite/part as it passes.
   * Single canvas, additive blend, graceful canvas-2D fallback. Runs only while
   * the footer is on-screen; honours prefers-reduced-motion.
   * ------------------------------------------------------------------------- */
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
    function fallback(stage) {
      var ctx = stage.getContext("2d");
      function size() { var r = stage.getBoundingClientRect(), d = dpr(); stage.width = Math.max(2, r.width * d); stage.height = Math.max(2, r.height * d); }
      size();
      return { resize: size, frame: function (now) {
        var w = stage.width, h = stage.height; if (!w) return; ctx.clearRect(0, 0, w, h);
        var g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, "#c9a06a"); g.addColorStop(.5, "#ecd6a0"); g.addColorStop(1, "#c9a06a");
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        var m = textMask(w / dpr(), h / dpr(), dpr());
        ctx.globalCompositeOperation = "destination-in"; ctx.drawImage(m.canvas, 0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      } };
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
        var small = cssW < 760, dens = small ? 2.0 : 1.55;   // dense mask on phones for a rich, desktop-like grain
        var mk = textMask(cssW, cssH, dens), w = mk.w, h = mk.h, data;
        try { data = mk.canvas.getContext("2d").getImageData(0, 0, w, h).data; } catch (e) { COUNT = 0; return; }
        var cap = small ? 95000 : 300000, total = 0;   // richer particle count on phones (modern devices handle it), finer points below
        for (var pp = 3; pp < data.length; pp += 4) { if (data[pp] > 120) total++; }
        var step = total > cap ? Math.ceil(total / cap) : 1, n = Math.min(total, cap);
        var arr = new Float32Array(n * 3), idx = 0, c = 0, seen = 0;
        for (var y = 0; y < h; y++) { for (var x = 0; x < w; x++) { if (data[(y * w + x) * 4 + 3] > 120) { seen++; if (seen % step !== 0) continue; if (c >= n) break;
          arr[idx++] = (x / (w - 1)) * 2.0 - 1.0; arr[idx++] = (1.0 - (y / (h - 1))) * 2.0 - 1.0; arr[idx++] = Math.random(); c++; } } if (c >= n) break; }
        COUNT = c; gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, arr.subarray(0, c * 3), gl.STATIC_DRAW);
        // point size scales with canvas height, but on a short phone canvas that goes ~1px (dim/sparse),
        // so floor it on mobile to ~2px device so particles read as a lush, bright wordmark.
        pxScale = small ? Math.max(stage.height / 300.0, d * 1.05) : stage.height / 300.0;   // finer points (like desktop) now that density is higher, but bright enough
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
    function mount(node, grad) {
      var inst = null, running = false, raf = 0, reduce = false, tries = 0, started = false, inView = false, done = false, shown = false;
      try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
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

  function injectCSS() {
    if (document.getElementById('thx-footer-css')) return;
    var s = el('style'); s.id = 'thx-footer-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function build(f) {
    if (f.__thxV2) return;
    f.__thxV2 = 1;
    var cols = [].slice.call(f.querySelectorAll('.footer-col'));
    if (!cols.length) { f.__thxV2 = 0; return; }
    var bottom = f.querySelector('.footer-bottom-1');

    var glow = el('div', 'thx-glow'); var top = el('div', 'thx-top');
    f.insertBefore(glow, f.firstChild); f.insertBefore(top, f.firstChild);

    var cta = el('div', 'thx-fcta');
    var left = el('div');
    var ey = el('p', 'ey'); ey.textContent = 'Let’s build';
    var h2 = el('h2'); h2.textContent = 'Ready to build what only you can?';
    left.appendChild(ey); left.appendChild(h2);
    var btn = el('a', 'thx-fbtn'); btn.setAttribute('href', '/company/global/contact');
    btn.innerHTML = 'Get in touch <span class="ar">→</span>';
    cta.appendChild(left); cta.appendChild(btn);

    var social = null, keep = [];
    cols.forEach(function (c) {
      var h = c.querySelector('.footer-h');
      if (h && /social/i.test(h.textContent)) social = c; else keep.push(c);
    });
    var wrap = el('div', 'thx-fcols');
    var anchor = cols[0];
    anchor.parentNode.insertBefore(cta, anchor);
    anchor.parentNode.insertBefore(wrap, anchor);
    keep.forEach(function (c) { wrap.appendChild(c); });

    var soc = el('div', 'thx-fsoc');
    var map = { x: 'X', twitter: 'X', linkedin: 'LinkedIn', youtube: 'YouTube', instagram: 'Instagram', facebook: 'Facebook' };
    if (social) {
      [].slice.call(social.querySelectorAll('a')).forEach(function (a) {
        var key = (a.textContent || '').trim().toLowerCase();
        var name = map[key]; var ic = name && ICONS[name]; if (!ic) return;
        var na = el('a'); var href = a.getAttribute('href') || '#';
        na.setAttribute('href', href);
        if (/^https?:/.test(href)) { na.setAttribute('target', '_blank'); na.setAttribute('rel', 'noopener'); }
        na.setAttribute('aria-label', name); na.innerHTML = ic;
        soc.appendChild(na);
      });
      social.className += ' thx-hide';
      social.style.setProperty('display', 'none', 'important');
    }

    var mark = el('div', 'thx-fmark'); mark.setAttribute('role', 'img'); mark.setAttribute('aria-label', 'THEODYX');
    var grad = el('div', 'thx-grad'); grad.setAttribute('aria-hidden', 'true'); grad.textContent = 'THEODYX';
    var cv = el('canvas'); cv.setAttribute('aria-hidden', 'true');
    mark.appendChild(grad); mark.appendChild(cv);
    if (bottom) {
      bottom.parentNode.insertBefore(mark, bottom);
      if (soc.children.length) bottom.appendChild(soc);
    } else {
      f.appendChild(mark); if (soc.children.length) f.appendChild(soc);
    }
    try { SW.mount(cv, grad); } catch (e) {}
  }

  function links() {
    var f = document.querySelector('.footer'); if (!f) return;
    var ov = [
      ['Partners', '/company/global/partners'],
      ['Clients', '/company/global/clients'],
      ['Capabilities', '/company/global/our-capabilities'],
      ['About', '/resources/company-pages/about'],
      ['Our thinking', '/company/global/thinking-overview'],
      ['Connect', '/company/global/contact'],
      ['Privacy', '/resources/company-pages/terms-conditions'],
      ['Terms', '/resources/company-pages/terms-conditions'],
      ['Cookies', '/resources/company-pages/terms-conditions'],
      ['Accessibility', '/resources/company-pages/terms-conditions']
    ];
    [].slice.call(f.querySelectorAll('a.footer-link')).forEach(function (a) {
      var t = (a.textContent || '').replace(/\s+/g, ' ').trim();
      for (var i = 0; i < ov.length; i++) {
        if (t === ov[i][0]) { a.setAttribute('href', ov[i][1]); a.removeAttribute('target'); a.removeAttribute('rel'); return; }
      }
      if (/@theodyx\.com/i.test(t)) { a.setAttribute('href', 'mailto:contact@theodyx.com'); return; }
      if (/^\+?[\d.\s()-]{7,}$/.test(t)) { a.setAttribute('href', 'tel:+19382935290'); return; }
      if (/coastal highway/i.test(t)) { a.setAttribute('href', 'https://www.google.com/maps/search/?api=1&query=16192+Coastal+Highway+Lewes+DE+19958'); a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); return; }
    });
  }

  function cleanup() {
    var lw = 'convallis accumsan placerat faucibus vestibulum ultricies commodo malesuada consectetur'.split(' ');
    [].forEach.call(document.querySelectorAll('span,p,div,li'), function (e) {
      if (e.children.length === 0) {
        var t = (e.textContent || '').trim();
        if (t.length > 0 && t.length < 44 && lw.some(function (w) { return t.indexOf(w) > -1; })) e.textContent = '';
      }
    });
    [].forEach.call(document.images, function (im) {
      if (im.complete && im.naturalWidth === 0 && !im.getAttribute('data-keep')) im.style.opacity = '0';
    });
  }

  var lqRaf = false;
  function lqR() {
    if (lqRaf) return; lqRaf = true;
    requestAnimationFrame(function () {
      lqRaf = false; var r = window.__liquidGLRenderer__; if (!r || !r.lenses) return;
      for (var i = 0; i < r.lenses.length; i++) { try { r.lenses[i].updateMetrics && r.lenses[i].updateMetrics(); } catch (e) {} }
      try { r.render && r.render(); } catch (e) {}
    });
  }
  var lqB = false;
  function lqBind() {
    if (lqB || !window.__liquidGLRenderer__) return; lqB = true;
    window.addEventListener('resize', lqR, { passive: true });
    if (window.visualViewport) {
      visualViewport.addEventListener('resize', lqR, { passive: true });
      visualViewport.addEventListener('scroll', lqR, { passive: true });
    }
  }
  var lqt = setInterval(function () { lqBind(); if (lqB) clearInterval(lqt); }, 500);
  setTimeout(function () { clearInterval(lqt); }, 20000);

  function run() {
    injectCSS();
    var f = document.querySelector('.footer'); if (!f) return false;
    build(f); links(); cleanup();
    return true;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.footer a[href="#"]');
    if (a) e.preventDefault();
  }, false);

  if (document.readyState !== 'loading') run(); else document.addEventListener('DOMContentLoaded', run);
  window.addEventListener('load', run);
  var n = 0, iv = setInterval(function () { if (run() || ++n > 6) clearInterval(iv); }, 600);
})();
