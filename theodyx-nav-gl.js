/*! theodyx-nav-gl.js v1.1.0 (2026-09-04) — Theodyx liquid-glass nav: the WebGL lens for WebKit (every iPhone/iPad browser and
 * desktop Safari). WebKit's backdrop-filter cannot reference an SVG filter, a transformed backdrop-filter does not magnify and an
 * element-level SVG filter does not touch the backdrop (all three probed), so the glass is rendered here instead: the page behind
 * the bar is rasterised with html2canvas into a strip around the scroll position (one viewport above, two below), uploaded as a
 * texture, and a fragment shader bends it with the SAME profile as the Chromium SVG lens in theodyx-nav.js — rounded-rect SDF,
 * bevel + body displacement, per-channel dispersion, saturation, colour bleed, specular rim, gloss, scrim. Videos are drawn live
 * from the <video> element (through a CORS shadow copy when the original is tainted). Self-gating: never runs where the SVG lens
 * runs, never under reduced transparency/motion or forced colours, and turns itself off for the session if it cannot keep up. */
(function () {
  'use strict';
  if (window.__thxNavGL) return;
  var nav = document.querySelector('.thx-nav');
  var glass = nav && nav.querySelector('.thx-nav-glass');
  if (!nav || !glass) return;
  var doc = document.documentElement, ua = navigator.userAgent;
  var API = window.__thxNavGL = { v: '1.1.0', on: false, why: '', state: function () { return { on: API.on, why: API.why }; } };
  var mq = function (q) { try { return window.matchMedia(q); } catch (e) { return { matches: false, addEventListener: function () {} }; } };
  var isBlink = !!(navigator.userAgentData && navigator.userAgentData.brands && navigator.userAgentData.brands.some(function (b) { return /Chromium/i.test(b.brand); })) || (/Chrome\/|Chromium\//.test(ua) && !/\bCriOS\b|\bEdgiOS\b|\bFxiOS\b/.test(ua));
  var isWebKit = /AppleWebKit\//.test(ua) && !isBlink;
  function bail(why) { API.why = why; nav.setAttribute('data-gl', why); return false; }
  if (!isWebKit && !nav.hasAttribute('data-gl-force')) return bail('not-webkit');
  if (nav.classList.contains('is-refract') || nav.getAttribute('data-lens') === 'svg') return bail('svg-lens');
  if (mq('(prefers-reduced-transparency:reduce)').matches) return bail('reduced-transparency');
  if (mq('(prefers-reduced-motion:reduce)').matches) return bail('reduced-motion');
  if (mq('(forced-colors:active)').matches) return bail('forced-colors');
  try { if (sessionStorage.getItem('thx-nav-nogl') === '1') return bail('session-off'); } catch (e) {}

  var H2C = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  var H2C_SRI = 'sha384-ZZ1pncU3bQe8y31yfZdMFdSpttDoPmOZg2wguVK9almUodir1PghgT0eY7Mrty8H';
  var now = function () { return (window.performance && performance.now) ? performance.now() : Date.now(); };
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
  var TAG = 'data-thxgl';
  var DEF = { scale: 112, rim: 0.9, rimW: 0.58, rimK: 1.25, body: -0.6, bodyK: 1.5, disp: 0.34, dispW: 0.4, dispBody: 0.05, sat: 1.9, blur: 0.45, spec: 0.5, specW: 0.24, bleed: 0.9, bleedBlur: 40, light: [-0.55, -0.83], light2: [0.55, 0.83] };
  function lensParams() { try { var l = window.__thxNav && window.__thxNav.lens && window.__thxNav.lens(); if (l && l.params) return l.params; } catch (e) {} return null; }
  var LENS = lensParams() || DEF; if (LENS.dispBody == null) LENS.dispBody = DEF.dispBody; if (LENS.dispW == null) LENS.dispW = DEF.dispW;

  /* the layer's own CSS (mirrors the is-gl block in theodyx-nav.css, so the head block does not have to change with this script) */
  if (!document.getElementById('thx-nav-gl-css')) { var st = document.createElement('style'); st.id = 'thx-nav-gl-css'; st.textContent = '.thx-nav.is-gl-stale .thx-nav-gl{opacity:0;transition-duration:140ms}.thx-nav.is-gl.is-gl-stale .thx-nav-glass{visibility:visible!important}' + ".thx-nav-gl{position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;z-index:0;display:block;pointer-events:none;opacity:0;transition:opacity 480ms var(--thx-nav-ease)} /* a replaced element keeps its intrinsic (backing-store) size under inset:0 unless width/height are set */.thx-nav.is-gl .thx-nav-gl{opacity:1}.thx-nav.is-gl-solid:not([data-open=\"true\"]) .thx-nav-glass{visibility:hidden}.thx-nav.is-gl .thx-nav-tint{display:none}.thx-nav.is-gl[data-open=\"true\"] .thx-nav-gl{display:none}.thx-nav.is-gl .thx-nav-rim{background-image:none;overflow:hidden;box-shadow:inset 0 1px 0 0 rgba(255,255,255,.62),inset 0 -1px 0 0 rgba(255,255,255,.16),inset 0 0 0 1px rgba(255,255,255,.22),inset 0 0 0 1.5px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.10),0 14px 44px rgba(0,0,0,.16)}.thx-nav.is-gl[data-open=\"true\"] .thx-nav-rim{box-shadow:none}.thx-nav.is-gl .thx-nav-rim::after{content:\"\";position:absolute;inset:-40%;border-radius:inherit;background:radial-gradient(28% 60% at var(--thx-mx,50%) var(--thx-my,50%),rgba(255,255,255,.20),transparent 70%);opacity:0;transition:opacity 320ms var(--thx-nav-ease);pointer-events:none}.thx-nav.is-gl.is-lens .thx-nav-rim::after{opacity:1}"; (document.head || doc).appendChild(st); }

  /* ---------- 1. WebGL ---------- */
  var canvas = document.createElement('canvas');
  canvas.className = 'thx-nav-gl'; canvas.setAttribute('aria-hidden', 'true'); canvas.setAttribute(TAG, 'x');
  var glOpts = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true };
  var gl = null;
  try { gl = canvas.getContext('webgl', glOpts) || canvas.getContext('experimental-webgl', glOpts); } catch (e) { gl = null; }
  if (!gl) return bail('no-webgl');
  var VS = 'attribute vec2 aPos;varying vec2 vUv;void main(){vUv=vec2(aPos.x*0.5+0.5,0.5-aPos.y*0.5);gl_Position=vec4(aPos,0.0,1.0);}';
  var FS = [
    'precision highp float;varying vec2 vUv;',
    'uniform sampler2D uTex,uBlurTex;uniform vec2 uSize,uOrigin,uStrip,uStripSize,uL1,uL2;uniform vec3 uBg,uScrim;',
    'uniform float uR,uScale,uDisp,uDispW,uDispB,uRim,uRimW,uRimK,uBody,uBodyK,uSat,uBlur,uSpec,uSpecW,uBleed,uDocH,uScrimA;',
    'const vec3 LW=vec3(0.2126,0.7152,0.0722);',
    'vec3 samp(sampler2D t,vec2 s){vec2 uv=(s-uStrip)/uStripSize;vec3 c=texture2D(t,clamp(uv,0.0,1.0)).rgb;float off=step(s.y,0.0)+step(uDocH,s.y);return mix(c,uBg,clamp(off,0.0,1.0));}',
    'vec3 sampB(vec2 s){if(uBlur<0.2)return samp(uTex,s);vec2 o=vec2(uBlur);return (samp(uTex,s+o)+samp(uTex,s+vec2(-o.x,o.y))+samp(uTex,s+vec2(o.x,-o.y))+samp(uTex,s-o))*0.25;}',
    'float sm(float t){return t*t*(3.0-2.0*t);}',
    'void main(){',
    ' vec2 p=vUv*uSize;vec2 c=p-uSize*0.5;vec2 q=abs(c)-(uSize*0.5-vec2(uR));vec2 o=max(q,0.0);',
    ' float outside=length(o),inside=min(max(q.x,q.y),0.0);float dist=uR-(outside+inside);',
    ' vec2 sg=vec2(c.x<0.0?-1.0:1.0,c.y<0.0?-1.0:1.0);',
    ' vec2 n=(q.x>0.0||q.y>0.0)?(o/max(outside,1e-4))*sg:(q.x>q.y?vec2(sg.x,0.0):vec2(0.0,sg.y));',
    ' float a=clamp(dist+0.5,0.0,1.0);if(a<=0.0){gl_FragColor=vec4(0.0);return;}',
    ' float Rb=max(12.0,uSize.y*uRimW),H=uSize.y*0.5;float tr=0.0,tb=0.0,dw=0.0;',
    ' if(dist>0.0){tr=pow(max(sm(clamp(1.0-dist/Rb,0.0,1.0)),1e-5),uRimK)*uRim;tb=pow(max(clamp(1.0-dist/H,0.0,1.0),1e-5),uBodyK)*uBody;dw=sm(clamp(1.0-dist/(Rb*uDispW),0.0,1.0));}',
    ' vec2 base=uOrigin+p;vec2 nS=n*uScale*0.5;',
    ' float dd=uDisp*dw;vec2 dR=nS*clamp(tr*(1.0-dd)+tb*(1.0-uDispB),-1.0,1.0);vec2 dG=nS*clamp(tr+tb,-1.0,1.0);vec2 dB=nS*clamp(tr*(1.0+dd)+tb*(1.0+uDispB),-1.0,1.0);',
    ' vec3 col;col.r=sampB(base+dR).r;col.g=sampB(base+dG).g;col.b=sampB(base+dB).b;',
    ' float l=dot(col,LW);col=mix(vec3(l),col,uSat);col=(col-0.5)*1.03+0.5;col*=1.02;col=clamp(col,0.0,1.0);',
    ' vec3 bl=samp(uBlurTex,base);float lb=dot(bl,LW);bl=clamp(mix(vec3(lb),bl,2.2)*1.04,0.0,1.0);',
    ' float m=clamp((length(c/vec2(0.7*uSize.x,1.4*uSize.y))-0.26)/0.62,0.0,1.0);col=mix(col,bl,m*uBleed);',
    ' float g1=0.07*(1.0-clamp(length((p-vec2(0.18*uSize.x,-0.30*uSize.y))/vec2(1.2*uSize.x,0.9*uSize.y))/0.55,0.0,1.0));',
    ' float g2=0.05*(1.0-clamp(length((p-vec2(0.92*uSize.x,1.20*uSize.y))/vec2(0.6*uSize.x,1.2*uSize.y))/0.60,0.0,1.0));',
    ' col+=(g1+g2)*0.9*(1.0-col);',
    ' col=mix(col,vec3(1.0),0.035);',
    ' col=mix(col,uScrim,uScrimA);',
    ' float d2=max(dist,0.0);float t2=pow(max(sm(clamp(1.0-d2/max(8.0,uSize.y*uSpecW),0.0,1.0)),1e-5),uRimK);',
    ' float s1=max(0.0,dot(n,uL1)),s2=max(0.0,dot(n,uL2));',
    ' float spec=(pow(max(s1,1e-5),2.4)+0.42*pow(max(s2,1e-5),2.4))*pow(max(t2,1e-5),0.85)*uSpec;',
    ' float edge=d2<1.2?0.40:0.0;float sa=min(1.0,spec*0.92+edge)*0.95;',
    ' col=mix(col,vec3(1.0),sa);',
    ' gl_FragColor=vec4(col*a,a);',
    '}'
  ].join('\n');
  function shader(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { API.err = gl.getShaderInfoLog(s); gl.deleteShader(s); return null; } return s; }
  var vs = shader(gl.VERTEX_SHADER, VS), fs = shader(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return bail('shader');
  var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { API.err = gl.getProgramInfoLog(prog); return bail('link'); }
  gl.useProgram(prog);
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, 'aPos'); gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  var U = {}; ['uTex', 'uBlurTex', 'uSize', 'uOrigin', 'uStrip', 'uStripSize', 'uL1', 'uL2', 'uBg', 'uScrim', 'uR', 'uScale', 'uDisp', 'uDispW', 'uDispB', 'uRim', 'uRimW', 'uRimK', 'uBody', 'uBodyK', 'uSat', 'uBlur', 'uSpec', 'uSpecW', 'uBleed', 'uDocH', 'uScrimA'].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });
  function mkTex(unit) { var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return t; }
  var tex = mkTex(0), btex = mkTex(1);
  gl.uniform1i(U.uTex, 0); gl.uniform1i(U.uBlurTex, 1);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  var MAXTEX = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;
  function upload(t, unit, src) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src); }
  function pushLens() {
    gl.uniform1f(U.uScale, LENS.scale); gl.uniform1f(U.uDisp, LENS.disp); gl.uniform1f(U.uDispW, LENS.dispW || 0.4); gl.uniform1f(U.uDispB, LENS.dispBody || 0); gl.uniform1f(U.uRim, LENS.rim); gl.uniform1f(U.uRimW, LENS.rimW); gl.uniform1f(U.uRimK, LENS.rimK);
    gl.uniform1f(U.uBody, LENS.body); gl.uniform1f(U.uBodyK, LENS.bodyK); gl.uniform1f(U.uSat, LENS.sat); gl.uniform1f(U.uBlur, LENS.blur); gl.uniform1f(U.uSpec, LENS.spec); gl.uniform1f(U.uSpecW, LENS.specW); gl.uniform1f(U.uBleed, LENS.bleed);
    gl.uniform2f(U.uL1, LENS.light[0], LENS.light[1]); gl.uniform2f(U.uL2, LENS.light2[0], LENS.light2[1]);
  }
  pushLens();
  glass.parentNode.insertBefore(canvas, glass.nextSibling); /* above the glass, below the rim and the bar */
  var lost = 0;
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); lost++; nav.classList.remove('is-gl', 'is-gl-solid'); if (lost > 1) disable('context-lost'); }, false);
  canvas.addEventListener('webglcontextrestored', function () { try { gl.useProgram(prog); pushLens(); strip.ready = false; capture('restored'); } catch (e) { disable('restore-failed'); } }, false);

  /* ---------- 2. geometry ---------- */
  var vw = 0, vh = 0, dpr = 1, docH = 0, pill = { x: 0, y: 0, w: 0, h: 0, r: 0 }, bg = [1, 1, 1];
  function scrollY() { return window.pageYOffset || doc.scrollTop || 0; }
  function scrollX() { return window.pageXOffset || doc.scrollLeft || 0; }
  function parseRGB(s) { var m = /rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[,/ ]+([\d.]+))?\)/.exec(s || ''); if (!m || (m[4] !== undefined && parseFloat(m[4]) === 0)) return null; return [m[1] / 255, m[2] / 255, m[3] / 255]; }
  function measure() {
    vw = doc.clientWidth || window.innerWidth; vh = window.innerHeight; dpr = Math.min(2, window.devicePixelRatio || 1);
    docH = Math.max(doc.scrollHeight, document.body ? document.body.scrollHeight : 0, vh);
    var r = nav.getBoundingClientRect();
    pill.x = r.left + scrollX(); pill.y = r.top + scrollY(); pill.w = r.width; pill.h = r.height;
    var br = parseFloat(getComputedStyle(nav).borderTopLeftRadius) || r.height / 2; pill.r = Math.min(r.height / 2, br);
    bg = parseRGB(getComputedStyle(document.body).backgroundColor) || parseRGB(getComputedStyle(doc).backgroundColor) || [1, 1, 1];
    var cw = Math.max(1, Math.round(r.width * dpr)), ch = Math.max(1, Math.round(r.height * dpr));
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; gl.viewport(0, 0, cw, ch); }
  }

  /* ---------- 3. the strip (html2canvas) ---------- */
  var strip = { top: 0, h: 0, s: 1, w: 0, comp: null, ctx: null, small: null, sctx: null, div: 16, ready: false, at: 0 };
  var lastY = 0, vel = 0; /* px/s, signed */
  var h2c = null, capturing = false, pending = false, fails = 0, captures = 0, capT = 0, scaleCut = 1, MAXCAP = 40;
  function plan() {
    /* 4.5 viewports, biased the way the reader is moving: a fast flick down keeps most of the strip ahead of the bar */
    var y = scrollY(), above = vel > 900 ? 0.75 : (vel < -900 ? 2.5 : 1.5), H = Math.round(4.5 * vh);
    var top = Math.max(0, Math.min(Math.round(y - above * vh), Math.max(0, docH - H)));
    var h = Math.max(1, Math.min(H, docH - top));
    var budget = vw < 900 ? 4.5e6 : 6.5e6;
    var s = Math.min(dpr, 2, (MAXTEX - 2) / h, (MAXTEX - 2) / vw, Math.sqrt(budget / (vw * h))) * scaleCut;
    s = Math.max(0.5, Math.floor(s * 100) / 100);
    return { top: top, h: h, s: s };
  }
  function needsCapture() {
    if (!strip.ready) return true;
    var y = scrollY(), top = strip.top, bot = strip.top + strip.h;
    if (top > 0 && y < top + vh * 1.0) return true;
    if (bot < docH - 2 && y + vh > bot - vh * 1.5) return true;
    return false;
  }
  /* is the bar's whole sample band (pill + lens reach) inside the current strip? if not the lens would stretch the strip's edge row — step aside instead */
  function bandCovered() {
    if (!strip.ready) return false;
    var pad = LENS.scale / 2 + 4, t = pill.y - pad, b = pill.y + pill.h + pad;
    var top = strip.top, bot = strip.top + strip.h;
    return (t >= top - 1 || top <= 0) && (b <= bot + 1 || bot >= docH - 2);
  }
  /* tag the live DOM: 'i' (in range, height pinned in the clone), 'o' (out of range: pinned, hidden and emptied so it costs nothing), 'x' (ignored) */
  function tagRange(p) {
    var y0 = p.top - 240, y1 = p.top + p.h + 240, sy = scrollY(), list = [], i = 0;
    /* every canvas/video/iframe/embed in the document is skipped by the rasteriser, wherever it sits: WebKit hangs inside html2canvas while cloning a <canvas> (probed), and a cloned <video> would start a second download */
    var skip = document.querySelectorAll('canvas,video,iframe,embed,object');
    for (var q = 0; q < skip.length; q++) { if (skip[q] !== canvas && !nav.contains(skip[q])) { skip[q].setAttribute(TAG, 'x'); list.push({ el: skip[q], kind: 'x' }); } }
    /* lazy images: a cloned <img loading=lazy> keeps WebKit's clone iframe at readyState 'interactive' forever (probed) — in range they become eager (they are about to be needed anyway), out of range they are skipped */
    var lazy = document.querySelectorAll('img[loading="lazy"]');
    for (var z = 0; z < lazy.length; z++) { var li = lazy[z], lr = li.getBoundingClientRect(), lt = lr.top + sy, lb = lr.bottom + sy; if (lb >= y0 && lt <= y1 && (lr.width || lr.height)) { li.setAttribute('loading', 'eager'); } else if (!li.hasAttribute(TAG)) { li.setAttribute(TAG, 'x'); list.push({ el: li, kind: 'x' }); } }
    function walk(el) {
      var ch = el.children;
      for (var k = 0; k < ch.length; k++) {
        var c = ch[k], tn = c.tagName;
        if (c === nav || tn === 'SCRIPT' || tn === 'STYLE' || tn === 'LINK' || tn === 'TEMPLATE' || tn === 'NOSCRIPT') continue;
        if (c.hasAttribute(TAG) && c.getAttribute(TAG) === 'x') { continue; }
        var r = c.getBoundingClientRect(), t = r.top + sy, b = r.bottom + sy;
        if (r.height <= 0 && r.width <= 0) { walk(c); continue; }
        if (b < y0 || t > y1) {
          if (r.height >= 40) { c.setAttribute(TAG, 'o' + i); list.push({ el: c, kind: 'o', i: i++, h: r.height }); }
          continue;
        }
        if (getComputedStyle(c).position === 'fixed') { c.setAttribute(TAG, 'x'); list.push({ el: c, kind: 'x' }); continue; }
        c.setAttribute(TAG, 'i' + i); list.push({ el: c, kind: 'i', i: i++, h: r.height, top: t }); walk(c);
      }
    }
    walk(document.body);
    return list;
  }
  function untag(list) { for (var k = 0; k < list.length; k++) { var e = list[k]; if (e.kind !== 'x' || /^(VIDEO|IFRAME|EMBED|OBJECT|CANVAS|IMG)$/.test(e.el.tagName)) e.el.removeAttribute(TAG); } }
  function fixClone(cdoc, list) {
    var byI = {}; for (var k = 0; k < list.length; k++) if (list[k].kind !== 'x') byI[list[k].i] = list[k];
    var els = cdoc.querySelectorAll('[' + TAG + ']'), ins = [];
    for (var j = 0; j < els.length; j++) {
      var ce = els[j], v = ce.getAttribute(TAG), kind = v.charAt(0), e = byI[parseInt(v.slice(1), 10)];
      if (!e) continue;
      var st = ce.style;
      if (e.h > 0) { st.setProperty('height', e.h + 'px', 'important'); st.setProperty('min-height', e.h + 'px', 'important'); st.setProperty('max-height', e.h + 'px', 'important'); st.setProperty('box-sizing', 'border-box', 'important'); }
      if (kind === 'o') { st.setProperty('visibility', 'hidden', 'important'); st.setProperty('overflow', 'hidden', 'important'); while (ce.firstChild) ce.removeChild(ce.firstChild); }
      else { st.setProperty('animation', 'none', 'important'); st.setProperty('transition', 'none', 'important'); ins.push({ ce: ce, e: e }); }
    }
    /* drift check: the clone must place every in-range box where the live page has it (iOS sizes the clone iframe to its content, so vh units drift) */
    var reads = [];
    for (var q = 0; q < ins.length; q++) reads.push(ins[q].ce.getBoundingClientRect().top);
    var fixed = [];
    for (var z = 0; z < ins.length; z++) {
      var drift = reads[z] - ins[z].e.top;
      if (Math.abs(drift) < 1.5) continue;
      var anc = false; for (var f = 0; f < fixed.length; f++) if (fixed[f].contains(ins[z].ce)) { anc = true; break; }
      if (anc) continue;
      var pos = cdoc.defaultView.getComputedStyle(ins[z].ce).position;
      if (pos === 'static' || pos === 'relative') { ins[z].ce.style.setProperty('position', 'relative', 'important'); ins[z].ce.style.setProperty('top', (-drift) + 'px', 'important'); fixed.push(ins[z].ce); }
    }
    API.drift = fixed.length;
  }
  function ignoreEl(el) {
    if (!el || !el.getAttribute) return false;
    if (el === canvas || el === nav) return true;
    var v = el.getAttribute(TAG); return v === 'x';
  }
  function sweepContainers() { try { var l = document.querySelectorAll('iframe.html2canvas-container'); for (var k = 0; k < l.length; k++) l[k].parentNode.removeChild(l[k]); } catch (e) {} }
  function loadH2C(cb) {
    if (window.html2canvas) return cb(window.html2canvas);
    var s = document.createElement('script'); s.src = H2C; s.integrity = H2C_SRI; s.crossOrigin = 'anonymous'; s.async = true;
    s.onload = function () { cb(window.html2canvas || null); }; s.onerror = function () { cb(null); };
    (document.head || doc).appendChild(s);
  }
  var capTimer = 0;
  function scheduleCapture(delay, why, urgent) { clearTimeout(capTimer); capTimer = setTimeout(function () { capture(why || 'scheduled', urgent); }, delay == null ? 120 : delay); }
  function capture(why, urgent) {
    if (!API.on && API.why) return;
    if (!h2c) { pending = true; return; }
    if (capturing) { pending = true; return; }
    if (captures >= MAXCAP) return;
    if (document.hidden) { pending = true; return; }
    if (!urgent && now() - lastScrollT < 160 && strip.ready) { scheduleCapture(180, why); return; } /* never rasterise mid-gesture unless the bar has run off the strip */
    measure();
    var p = plan(); capturing = true; captures++; var t0 = now(); var list = tagRange(p); API.lastWhy = why;
    var opts = {
      scale: p.s, x: 0, y: p.top, width: vw, height: p.h, windowWidth: vw, windowHeight: vh, scrollX: 0, scrollY: 0,
      useCORS: true, allowTaint: false, backgroundColor: 'rgb(' + Math.round(bg[0] * 255) + ',' + Math.round(bg[1] * 255) + ',' + Math.round(bg[2] * 255) + ')',
      logging: !!(window.__thxGLTest && window.__thxGLTest.log), removeContainer: true, imageTimeout: 2500, ignoreElements: ignoreEl,
      onclone: function (cdoc) { try { fixClone(cdoc, list); } catch (e) { API.cloneErr = String(e); } }
    };
    var settled = false, dog = setTimeout(function () { if (settled) return; settled = true; untag(list); capturing = false; fails++; API.h2cErr = 'watchdog'; sweepContainers(); if (fails >= 3) disable('capture-hung'); else scheduleCapture(1200, 'after-hang'); }, 12000);
    var done = function () { if (settled) return; settled = true; clearTimeout(dog); untag(list); capturing = false; capT = now() - t0; API.captureMs = Math.round(capT); if (capT > 4000) { scaleCut = Math.max(0.5, scaleCut * 0.7); } if (pending) { pending = false; scheduleCapture(300, 'pending'); } };
    try {
      h2c(document.body, opts).then(function (c) { done(); adopt(c, p); fails = 0; }, function (e) { done(); fails++; API.h2cErr = String(e && e.message || e); if (fails >= 3) disable('capture-failed'); else scheduleCapture(1500, 'retry'); });
    } catch (e) { done(); fails++; API.h2cErr = String(e && e.message || e); if (fails >= 3) disable('capture-threw'); }
  }
  function halve(c, targetW, targetH) {
    var cur = c, w = c.width, h = c.height;
    while (w / 2 >= targetW * 1.5 && h / 2 >= targetH * 1.5) { var t = document.createElement('canvas'); t.width = Math.max(1, Math.round(w / 2)); t.height = Math.max(1, Math.round(h / 2)); t.getContext('2d').drawImage(cur, 0, 0, t.width, t.height); if (cur !== c) { cur.width = cur.height = 0; } cur = t; w = t.width; h = t.height; }
    var sm = document.createElement('canvas'); sm.width = targetW; sm.height = targetH; sm.getContext('2d').drawImage(cur, 0, 0, targetW, targetH); if (cur !== c) { cur.width = cur.height = 0; }
    return sm;
  }
  function adopt(c, p) {
    if (!c || !c.width || !c.height) return;
    if (strip.comp) { strip.comp.width = strip.comp.height = 0; } if (strip.small) { strip.small.width = strip.small.height = 0; }
    strip.top = p.top; strip.h = p.h; strip.s = p.s; strip.w = vw; strip.comp = c; strip.ctx = c.getContext('2d'); strip.at = now();
    pasteCanvases();
    var div = Math.max(8, Math.round(LENS.bleedBlur * p.s / 2.5)); strip.div = div;
    strip.small = halve(c, Math.max(1, Math.round(c.width / div)), Math.max(1, Math.round(c.height / div))); strip.sctx = strip.small.getContext('2d');
    try { upload(tex, 0, c); upload(btex, 1, strip.small); } catch (e) { API.err = String(e); fails++; if (fails >= 3) disable('upload-failed'); return; }
    strip.ready = true; API.on = true; API.strips = (API.strips || 0) + 1;
    scanVideos(); dirty = true; tick();
    if (!nav.classList.contains('is-gl')) { nav.classList.add('is-gl'); nav.setAttribute('data-gl', 'on'); setTimeout(function () { if (nav.classList.contains('is-gl')) nav.classList.add('is-gl-solid'); }, 560); }
  }

  /* page canvases (footer particle wordmark, media mosaic): html2canvas skips them; paste one frame of each in-range canvas ourselves */
  function pasteCanvases() {
    var sy = scrollY(), sx = scrollX(), s = strip.s, list = document.querySelectorAll('canvas');
    for (var k = 0; k < list.length; k++) {
      var c = list[k]; if (c === canvas || nav.contains(c) || !c.width || !c.height) continue;
      var r = c.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) continue;
      var t = r.top + sy, b = r.bottom + sy; if (b < strip.top || t > strip.top + strip.h) continue;
      if (!probe(c)) continue;
      try { strip.ctx.drawImage(c, (r.left + sx) * s, (t - strip.top) * s, r.width * s, r.height * s); } catch (e) {}
    }
  }

  /* ---------- 4. live video ---------- */
  var vids = [], probeC = null, scratch = document.createElement('canvas'), sctx2 = scratch.getContext('2d');
  scratch.setAttribute(TAG, 'x');
  function probe(el) {
    if (window.__thxGLTest && window.__thxGLTest.taint && el.tagName === 'VIDEO' && !el.__thxGLShadow) return false; /* test hook: behave as if the page video were tainted */
    try { if (!probeC) probeC = document.createElement('canvas'); probeC.width = 2; probeC.height = 2; var x = probeC.getContext('2d'); x.drawImage(el, 0, 0, 2, 2); x.getImageData(0, 0, 1, 1); return true; } catch (e) { probeC = null; return false; }
  }
  function scanVideos() {
    var all = [].slice.call(document.querySelectorAll('video')).filter(function (v) { return !nav.contains(v) && !v.__thxGLShadow; });
    vids = all.map(function (v) { for (var k = 0; k < vids.length; k++) if (vids[k].v === v) return vids[k]; return { v: v, state: 'new', shadow: null, poster: null, fit: null }; });
  }
  function frameSource(e) {
    var v = e.v;
    if (e.state === 'new' && v.readyState >= 2) { e.state = probe(v) ? 'direct' : 'tainted'; }
    if (e.state === 'direct') return v.readyState >= 2 ? { el: v, w: v.videoWidth, h: v.videoHeight, live: true } : null;
    if (e.state === 'tainted') {
      var src = v.currentSrc || v.src;
      if (src && !e.shadow) {
        var s = document.createElement('video'); s.__thxGLShadow = true; s.crossOrigin = 'anonymous'; s.muted = true; s.defaultMuted = true; s.playsInline = true; s.setAttribute('playsinline', ''); s.setAttribute('muted', ''); s.preload = 'auto'; s.loop = v.loop; s.setAttribute('aria-hidden', 'true'); s.setAttribute(TAG, 'x'); s.tabIndex = -1;
        s.style.cssText = 'position:fixed;left:0;top:0;width:2px;height:2px;opacity:.01;pointer-events:none;z-index:-1';
        s.src = src; document.body.appendChild(s); e.shadow = s; e.shadowAt = now();
        s.addEventListener('loadeddata', function () { e.state = probe(s) ? 'shadow' : 'poster'; if (e.state === 'poster') { s.pause(); s.removeAttribute('src'); try { s.load(); } catch (x) {} s.parentNode && s.parentNode.removeChild(s); e.shadow = null; } }, { once: true });
        s.addEventListener('error', function () { e.state = 'poster'; }, { once: true });
        try { var pr = s.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (x) {}
      }
      if (!src) e.state = 'poster';
      if (now() - (e.shadowAt || 0) > 4000 && e.state === 'tainted') e.state = 'poster';
      return null;
    }
    if (e.state === 'shadow' && e.shadow) {
      var s2 = e.shadow;
      if (Math.abs(s2.currentTime - v.currentTime) > 0.25 && v.readyState >= 2) { try { s2.currentTime = v.currentTime; } catch (x) {} }
      if (v.paused && !s2.paused) s2.pause(); else if (!v.paused && s2.paused) { try { var pr2 = s2.play(); if (pr2 && pr2.catch) pr2.catch(function () {}); } catch (x) {} }
      return s2.readyState >= 2 ? { el: s2, w: s2.videoWidth, h: s2.videoHeight, live: true } : null;
    }
    if (e.state === 'poster') {
      var ps = v.poster || v.getAttribute('poster'); if (!ps) return null;
      if (!e.poster) { var im = new Image(); im.crossOrigin = 'anonymous'; im.decoding = 'async'; im.src = ps; e.poster = im; im.onerror = function () { e.state = 'none'; }; }
      return (e.poster.complete && e.poster.naturalWidth) ? { el: e.poster, w: e.poster.naturalWidth, h: e.poster.naturalHeight, live: false } : null;
    }
    return null;
  }
  var videoLive = false;
  function drawVideos() {
    if (!strip.ready || !vids.length) { videoLive = false; return; }
    var sy = scrollY(), sx = scrollX(), pad = LENS.scale / 2 + 4, bandT = pill.y - pad, bandB = pill.y + pill.h + pad, any = false, live = false, s = strip.s;
    for (var k = 0; k < vids.length; k++) {
      var e = vids[k], v = e.v;
      if (!v.isConnected) continue;
      var r = v.getBoundingClientRect(); if (r.width <= 0 || r.height <= 0) continue;
      var t = r.top + sy, b = r.bottom + sy;
      if (b < bandT || t > bandB) continue;
      var src = frameSource(e); if (!src || !src.w || !src.h) continue;
      if (!e.fit) e.fit = getComputedStyle(v).objectFit || 'fill';
      var y0 = Math.max(t, bandT, strip.top), y1 = Math.min(b, bandB, strip.top + strip.h); if (y1 - y0 < 1) continue;
      var x0 = Math.max(r.left + sx, 0), x1 = Math.min(r.right + sx, strip.w); if (x1 - x0 < 1) continue;
      var sc = e.fit === 'contain' ? Math.min(r.width / src.w, r.height / src.h) : (e.fit === 'fill' ? 0 : Math.max(r.width / src.w, r.height / src.h));
      var dw = sc ? src.w * sc : r.width, dh = sc ? src.h * sc : r.height, ox = (r.width - dw) / 2, oy = (r.height - dh) / 2;
      var fx = dw / src.w, fy = dh / src.h;
      var sxs = ((x0 - (r.left + sx)) - ox) / fx, sys = ((y0 - t) - oy) / fy, sws = (x1 - x0) / fx, shs = (y1 - y0) / fy;
      var dx = Math.round(x0 * s), dy = Math.round((y0 - strip.top) * s), dW = Math.max(1, Math.round((x1 - x0) * s)), dH = Math.max(1, Math.round((y1 - y0) * s));
      if (scratch.width !== dW || scratch.height !== dH) { scratch.width = dW; scratch.height = dH; }
      try {
        sctx2.fillStyle = '#000'; sctx2.fillRect(0, 0, dW, dH);
        sctx2.drawImage(src.el, Math.max(0, sxs), Math.max(0, sys), Math.min(src.w, sws), Math.min(src.h, shs), 0, 0, dW, dH);
        strip.ctx.drawImage(scratch, dx, dy);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.texSubImage2D(gl.TEXTURE_2D, 0, dx, dy, gl.RGBA, gl.UNSIGNED_BYTE, scratch);
        strip.sctx.drawImage(scratch, dx / strip.div, dy / strip.div, dW / strip.div, dH / strip.div);
        any = true; if (src.live && !v.paused && !v.ended) live = true;
      } catch (err) { e.state = e.state === 'direct' ? 'tainted' : 'none'; API.vidErr = String(err && err.message || err); }
    }
    if (any) { try { upload(btex, 1, strip.small); } catch (err) {} }
    videoLive = live;
  }

  /* ---------- 5. render loop ---------- */
  var dirty = true, running = false, lastScrollT = 0, frames = [], lastVideoT = 0, scrimCur = 0, scrimT = 0, lastRenderT = 0, animating = false;
  function render() {
    if (!strip.ready) return;
    var t0 = now();
    measure();
    var covered = bandCovered();
    if (nav.classList.contains('is-gl-stale') === covered) nav.classList.toggle('is-gl-stale', !covered);
    if (!covered && !capturing) capture('stale', true);
    /* the legibility scrim eases in and out (the CSS glass transitions it over 360 ms; a hard switch flickers over video) */
    var scrimAttr = nav.getAttribute('data-scrim'), target = 0, scrim = [0, 0, 0];
    if (scrimAttr === 'dark') { target = 0.20; } else if (scrimAttr === 'light') { target = 0.26; scrim = [1, 1, 1]; }
    if (scrimAttr === 'light') scrimT = 1; else if (scrimAttr === 'dark') scrimT = 0;
    var dt = Math.min(0.05, (t0 - (lastRenderT || t0)) / 1000); lastRenderT = t0;
    scrimCur += (target - scrimCur) * Math.min(1, dt / 0.36 * 2.2);
    if (Math.abs(target - scrimCur) < 0.003) scrimCur = target;
    animating = scrimCur !== target;
    var scrimA = scrimCur; if (scrimT === 1) scrim = [1, 1, 1];
    gl.uniform2f(U.uSize, pill.w, pill.h); gl.uniform2f(U.uOrigin, pill.x, pill.y); gl.uniform1f(U.uR, pill.r);
    gl.uniform2f(U.uStrip, 0, strip.top); gl.uniform2f(U.uStripSize, strip.w, strip.h); gl.uniform1f(U.uDocH, docH);
    gl.uniform3f(U.uBg, bg[0], bg[1], bg[2]); gl.uniform3f(U.uScrim, scrim[0], scrim[1], scrim[2]); gl.uniform1f(U.uScrimA, scrimA);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    var ms = now() - t0; frames.push(ms); if (frames.length > 40) frames.shift();
    if (frames.length === 40) { var avg = frames.reduce(function (a, b) { return a + b; }, 0) / 40; API.avgMs = +avg.toFixed(2); if (avg > 14) { if (dpr > 1 && !API.lowRes) { API.lowRes = true; dpr = 1; canvas.width = 0; frames = []; } else disable('frame-budget'); } }
  }
  function tick() {
    if (running) return; running = true;
    raf(function loop(t) {
      running = false;
      if (!strip.ready || document.hidden) return;
      var open = nav.getAttribute('data-open') === 'true';
      if (!open) {
        if (vids.length && t - lastVideoT >= 30) { lastVideoT = t; drawVideos(); if (videoLive) dirty = true; }
        if (dirty) { dirty = false; render(); }
      }
      if ((videoLive || animating) && !open) { running = true; if (animating) dirty = true; raf(loop); }
    });
  }
  function onScroll() { var t = now(), y = scrollY(); if (lastScrollT) { var v = (y - lastY) / Math.max(1, t - lastScrollT) * 1000; vel = Math.abs(v) < 20000 ? v : vel; } lastY = y; lastScrollT = t; dirty = true; tick(); if (needsCapture()) scheduleCapture(bandCovered() ? 140 : 0, 'scroll', !bandCovered()); }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('scroll', function () { dirty = true; tick(); }, { passive: true });
  var rsT = 0;
  window.addEventListener('resize', function () { dirty = true; tick(); clearTimeout(rsT); rsT = setTimeout(function () { strip.ready && capture('resize'); }, 260); }, { passive: true });
  window.addEventListener('orientationchange', function () { clearTimeout(rsT); rsT = setTimeout(function () { capture('orientation'); }, 400); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { dirty = true; tick(); if (pending) scheduleCapture(200, 'visible'); } });
  window.addEventListener('pageshow', function (e) { if (e.persisted) scheduleCapture(200, 'bfcache'); });
  /* the page changes under the bar (reveals, lazy images, carousels): re-rasterise, rate-limited, never mid-scroll */
  var moT = 0, lastCapReq = 0;
  function requestRecapture(why) { var t = now(); clearTimeout(moT); var wait = Math.max(700, 2000 - (t - lastCapReq)); moT = setTimeout(function () { lastCapReq = now(); capture(why); }, wait); }
  function inBand(el) { if (!el || !el.getBoundingClientRect || !strip.ready) return true; var r = el.getBoundingClientRect(); if (r.width === 0 && r.height === 0) return false; var t = r.top + scrollY(), b = r.bottom + scrollY(); return b >= pill.y - vh * 1.2 && t <= pill.y + pill.h + vh * 1.2; }
  function ours(n) { return !n || n === canvas || n === scratch || n.__thxGLShadow || (n.nodeType === 1 && (n.classList.contains('html2canvas-container') || n.getAttribute(TAG) === 'x' || n.id === 'thx-nav-gl-css')); }
  function styleDelta(m) { /* true when a style write changed anything other than transform/opacity/translate (scroll animations rewrite those every frame) */
    if (m.attributeName !== 'style') return true; var a = String(m.oldValue || ''), b = m.target.getAttribute('style') || ''; if (a === b) return false;
    var strip2 = function (s) { return s.replace(/(?:^|;)\s*(?:-webkit-)?(?:transform|opacity|translate|will-change|transition)\s*:[^;]*/g, '').replace(/\s+/g, ''); };
    return strip2(a) !== strip2(b);
  }
  try {
    new MutationObserver(function (recs) {
      if (capturing) return;
      for (var k = 0; k < recs.length; k++) {
        var m = recs[k], tg = m.target;
        if (!(tg instanceof Element)) tg = tg.parentElement;
        if (!tg || nav.contains(tg) || ours(tg)) continue;
        if (m.type === 'childList') { var only = true; var all = [].slice.call(m.addedNodes).concat([].slice.call(m.removedNodes)); for (var q = 0; q < all.length; q++) if (!ours(all[q]) && all[q].nodeType === 1) { only = false; break; } if (only) continue; }
        if (m.type === 'attributes' && (m.attributeName === TAG || m.attributeName === 'loading')) continue;
        if (m.type === 'attributes' && !styleDelta(m)) continue;
        if (inBand(tg)) { requestRecapture('mutation'); return; }
      }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class', 'style', 'src', 'srcset', 'hidden', 'open', 'poster'] });
  } catch (e) {}
  document.addEventListener('load', function (e) { var t = e.target; if (t && (t.tagName === 'IMG' || t.tagName === 'PICTURE') && inBand(t)) requestRecapture('img'); }, true);
  try { new MutationObserver(function () { dirty = true; tick(); }).observe(nav, { attributes: true, attributeFilter: ['data-scrim', 'data-open', 'data-ink'] }); } catch (e) {}

  function disable(why) {
    API.on = false; API.why = why; nav.setAttribute('data-gl', 'off:' + why);
    nav.classList.remove('is-gl', 'is-gl-solid');
    try { sessionStorage.setItem('thx-nav-nogl', '1'); } catch (e) {}
    try { canvas.parentNode && canvas.parentNode.removeChild(canvas); } catch (e) {}
    vids.forEach(function (e) { if (e.shadow && e.shadow.parentNode) { e.shadow.pause(); e.shadow.parentNode.removeChild(e.shadow); } });
    strip.ready = false;
  }
  API.capture = function () { capture('api'); return API; };
  API.lens = function (opts) { if (opts && typeof opts === 'object') { for (var k in opts) if (k in LENS) LENS[k] = opts[k]; pushLens(); dirty = true; tick(); } return { on: API.on, params: JSON.parse(JSON.stringify(LENS)), strip: { top: strip.top, h: strip.h, s: strip.s, w: strip.w }, captureMs: API.captureMs, avgMs: API.avgMs }; };
  API.disable = function () { disable("api"); };
  API.dump = function () { return strip.comp ? strip.comp.toDataURL("image/jpeg", 0.72) : null; };
  API.state = function () { return { on: API.on, why: API.why, stale: nav.classList.contains('is-gl-stale'), vel: Math.round(vel), scrim: +scrimCur.toFixed(3), captures: captures, strips: API.strips || 0, captureMs: API.captureMs, avgMs: API.avgMs, drift: API.drift, videos: vids.map(function (e) { return e.state; }), h2c: !!h2c, canvas: [canvas.width, canvas.height], strip: { top: strip.top, h: strip.h, s: strip.s, w: strip.w } }; };

  /* ---------- 6. go ---------- */
  nav.setAttribute('data-gl', 'loading');
  function start() {
    loadH2C(function (lib) {
      if (!lib) { bail('no-html2canvas'); return; }
      h2c = lib; API.on = true;
      var go = function () { capture('first'); };
      if (document.readyState === 'complete') { setTimeout(go, 60); } else { window.addEventListener('load', function () { setTimeout(go, 120); }, { once: true }); }
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (strip.ready) requestRecapture('fonts'); });
      setTimeout(function () { if (strip.ready) requestRecapture('settle'); }, 2600);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
