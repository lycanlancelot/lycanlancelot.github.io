/**
 * Shared motion helpers for the homepage and the projects dashboard.
 *
 * No front matter, so Jekyll copies this file verbatim — there is no Liquid
 * risk here regardless of what the code contains.
 *
 * Everything degrades to "content is simply visible":
 *   • prefers-reduced-motion  → reveals resolve instantly, no count-up, no tilt
 *   • JS never runs           → the .no-js rule in _sass/lance-motion.scss shows
 *                               .reveal content, and real numbers are already in
 *                               the HTML because countUp reads them from there
 *   • touch devices           → tilt is skipped, so a card cannot stick tilted
 */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var COARSE = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var BOUND = "data-motion-bound";

  /** Mark an element handled. Returns false if it already was. */
  function claim(el, key) {
    var attr = BOUND + "-" + key;
    if (el.hasAttribute(attr)) return false;
    el.setAttribute(attr, "");
    return true;
  }

  // ── Count-up ───────────────────────────────────────────────────────────────
  // Animates the first number found in the element's text, preserving whatever
  // sits around it: "+10%" → prefix "+", 10, suffix "%"; "100M+" → 100 "M+".
  // Values with no number at all ("Reduced") are left exactly as written.
  var NUM = /-?\d[\d,]*\.?\d*/;

  function countUp(el) {
    if (REDUCED || !claim(el, "count")) return;

    var raw = el.getAttribute("data-count") || el.textContent;
    var match = raw.match(NUM);
    if (!match) return;

    var target = parseFloat(match[0].replace(/,/g, ""));
    if (!isFinite(target)) return;

    var prefix = raw.slice(0, match.index);
    var suffix = raw.slice(match.index + match[0].length);
    var decimals = (match[0].split(".")[1] || "").length;
    var start = null;
    var DURATION = 900;

    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / DURATION, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = raw;
    }
    requestAnimationFrame(frame);
  }

  // ── Scroll reveal ──────────────────────────────────────────────────────────
  var observer = null;
  var pending = new Set(); // observed but not yet revealed
  var sweepQueued = false;

  function show(el) {
    if (!pending.has(el)) return;
    pending.delete(el);
    if (observer) observer.unobserve(el);
    el.classList.add("is-in");
    el.querySelectorAll("[data-count]").forEach(countUp);
    if (el.hasAttribute("data-count")) countUp(el);
    var strong = el.querySelector("strong");
    if (strong && el.classList.contains("stat-pill")) countUp(strong);
  }

  /**
   * Safety net for everything IntersectionObserver structurally cannot catch.
   *
   * IO only fires when the intersection ratio CROSSES a threshold. A jump —
   * an #anchor link, the End key, dragging the scrollbar, restoring scroll on
   * back-navigation, a fast trackpad fling — can move an element from "below
   * the fold" to "above the fold" without ever sampling it in between, so the
   * callback never runs and the element stays at opacity 0 forever.
   *
   * On a portfolio, silently invisible content is the worst possible failure,
   * so we also sweep anything already at or past the trigger line.
   */
  function sweep() {
    sweepQueued = false;
    if (!pending.size) return;
    var line = window.innerHeight * 0.9; // matches the IO rootMargin below
    // Array.from, not [].slice.call — a Set has no `length`, so slice yields [].
    Array.from(pending).forEach(function (el) {
      if (el.getBoundingClientRect().top < line) show(el);
    });
  }

  function queueSweep() {
    if (sweepQueued) return;
    sweepQueued = true;
    requestAnimationFrame(sweep);
  }

  function getObserver() {
    if (observer || !("IntersectionObserver" in window)) return observer;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) show(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

    addEventListener("scroll", queueSweep, { passive: true });
    addEventListener("resize", queueSweep, { passive: true });
    return observer;
  }

  function reveal(root) {
    var targets = root.querySelectorAll(".reveal");
    var obs = getObserver();

    targets.forEach(function (el, i) {
      if (!claim(el, "reveal")) return;
      // Stagger by position within the parent unless the markup set --i already.
      if (!el.style.getPropertyValue("--i")) {
        var siblings = el.parentNode ? [].indexOf.call(el.parentNode.children, el) : i;
        el.style.setProperty("--i", siblings);
      }
      if (!obs) { el.classList.add("is-in"); return; }
      pending.add(el);
      obs.observe(el);
    });

    queueSweep();
  }

  // ── Pointer tilt ───────────────────────────────────────────────────────────
  var MAX_TILT = 6;

  function tilt(root) {
    if (REDUCED || COARSE) return;

    root.querySelectorAll("[data-tilt]").forEach(function (el) {
      if (!claim(el, "tilt")) return;

      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (px * MAX_TILT).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * MAX_TILT).toFixed(2) + "deg");
      });

      var reset = function () {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      };
      el.addEventListener("pointerleave", reset);
      el.addEventListener("blur", reset);
    });
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  // Idempotent: the dashboard re-renders its grid on every filter click and
  // calls this again on the fresh nodes.
  function initAll(root) {
    root = root || document;
    reveal(root);
    tilt(root);
    root.querySelectorAll("[data-count]").forEach(function (el) {
      // Elements outside any .reveal still need a trigger.
      if (!el.closest(".reveal")) countUp(el);
    });
  }

  window.Motion = { reveal: reveal, countUp: countUp, tilt: tilt, initAll: initAll };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { initAll(document); });
  } else {
    initAll(document);
  }
})();
