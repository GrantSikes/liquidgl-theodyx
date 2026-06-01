/* theodyx-hero — homepage hero film (Cloudflare Stream) + side copy + controls
 * Hosted for the Theodyx site; loaded as registered script `nv2hero`.
 */
(function () {
  "use strict";
  var SRC =
    "https://customer-8kmifvqz57kkghbr.cloudflarestream.com/14bda26fa85f184020082b5fb2ed76a7/iframe?autoplay=true&loop=true&muted=true&controls=false&letterboxColor=%23000000&preload=auto";
  var T =
    "At Theodyx, we're not just a global firm — we're a partner in shaping what it means to be human.";
  var I_MUTE =
    '<svg viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 4V5L8 9 4 9z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var I_ON =
    '<svg viewBox="0 0 24 24" fill="none"><path d="M4 9v6h4l5 4V5L8 9 4 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var I_FS =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M16 21h3a2 2 0 002-2v-3M8 21H5a2 2 0 01-2-2v-3"/></svg>';
  var CSS =
    ".hero-row{display:flex;align-items:center;gap:44px;width:100%}" +
    ".hero-aside{flex:1 1 0;min-width:0;max-width:440px;margin:0;font-family:'Google Sans Flex','Google Sans',system-ui,sans-serif;font-size:clamp(18px,1.4vw,23px);line-height:1.5;color:#1b1916;opacity:.9}" +
    ".hero-aside-m{display:none}" +
    ".hero-ctrls{position:absolute;right:12px;bottom:12px;z-index:4;display:inline-flex;gap:8px}" +
    ".hero-ctrls button{width:34px;height:34px;padding:0;border-radius:999px;border:1px solid rgba(255,255,255,.35);background:rgba(18,16,26,.34);-webkit-backdrop-filter:blur(8px) saturate(160%);backdrop-filter:blur(8px) saturate(160%);color:#fff;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .2s ease,background .2s ease;box-shadow:0 4px 12px rgba(0,0,0,.28)}" +
    ".hero-ctrls button:hover{transform:scale(1.08);background:rgba(18,16,26,.55)}" +
    ".hero-ctrls svg{width:16px;height:16px;display:block}" +
    "@media screen and (max-width:991px){.hero-row{display:block}.hero-aside{display:none}.hero-aside-m{display:block;margin:2px 0 0;font-family:'Google Sans Flex','Google Sans',system-ui,sans-serif;font-size:17px;line-height:1.5;color:#1b1916;opacity:.9}}";
  function el(t, c) {
    var e = document.createElement(t);
    if (c) e.className = c;
    return e;
  }
  function boot() {
    var b = document.querySelector(".hero-media");
    if (!b || b.__v) return;
    b.__v = 1;
    var st = el("style");
    st.id = "theodyx-hero-css";
    st.textContent = CSS;
    document.head.appendChild(st);
    /* wrap the video + side copy in a row */
    var fr = b.parentNode,
      row = el("div", "hero-row");
    fr.insertBefore(row, b);
    row.appendChild(b);
    var a = el("p", "hero-aside");
    a.textContent = T;
    row.appendChild(a);
    /* phone: the same copy drops under the headline */
    var h = fr.querySelector(".hero-h1, h1");
    if (h) {
      var am = el("p", "hero-aside-m");
      am.textContent = T;
      h.insertAdjacentElement("afterend", am);
    }
    /* the Cloudflare Stream player */
    var f = el("iframe");
    f.id = "heroStream";
    f.src = SRC;
    f.title = "Theodyx hero film";
    f.setAttribute(
      "allow",
      "autoplay; encrypted-media; picture-in-picture; fullscreen;"
    );
    f.setAttribute("allowfullscreen", "true");
    f.setAttribute("data-liquid-ignore", "");
    b.insertBefore(f, b.firstChild);
    /* fullscreen + mute controls */
    var c = el("div", "hero-ctrls"),
      fs = el("button"),
      mb = el("button");
    fs.type = mb.type = "button";
    fs.innerHTML = I_FS;
    mb.innerHTML = I_MUTE;
    fs.setAttribute("aria-label", "Fullscreen");
    mb.setAttribute("aria-label", "Unmute video");
    c.appendChild(fs);
    c.appendChild(mb);
    b.appendChild(c);
    fs.onclick = function (e) {
      e.preventDefault();
      var rq =
        f.requestFullscreen ||
        f.webkitRequestFullscreen ||
        f.msRequestFullscreen;
      if (rq) rq.call(f);
    };
    var muted = true,
      sdk = el("script");
    sdk.src = "https://embed.cloudflarestream.com/embed/sdk.latest.js";
    sdk.onload = function () {
      try {
        var p = window.Stream(f);
        p.muted = true;
        mb.onclick = function (e) {
          e.preventDefault();
          muted = !muted;
          p.muted = muted;
          if (!muted) p.volume = 1;
          mb.innerHTML = muted ? I_MUTE : I_ON;
          mb.setAttribute("aria-label", muted ? "Unmute video" : "Mute video");
        };
      } catch (e) {}
    };
    document.head.appendChild(sdk);
  }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
  setTimeout(boot, 1500);
})();