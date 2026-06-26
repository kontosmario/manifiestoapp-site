/* ─────────────────────────────────────────────────────────
   Manifiesto · site motion
   Aurora + fireflies + wordmark entrance. Emil-grade easings,
   spring-damped cursor parallax on the fern.
   Fallbacks: no-JS shows content; reduced-motion keeps opacity.
   ───────────────────────────────────────────────────────── */

document.documentElement.classList.remove('no-js')

const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const $  = (sel, ctx = document) => ctx.querySelector(sel)
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel))

// If the user turns ON "reduce motion" with the page already open, the hero
// elements pre-staged at opacity:0 (for the entrance) would stay hidden forever
// and the GSAP timeline won't run. Force everything visible on that change.
if (window.matchMedia) {
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (!e.matches) return
    $$('.hero__eyebrow, .hero__fern, .fern-silhouette, .fern-leaf, .hero__wordmark .letter, .hero__wordmark .dot, .hero__tagline, .hero__cta-row > *, .hero__cue, .reveal, .garden-cell')
      .forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; el.style.filter = 'none' })
  })
}

// ─── Firefly field ─────────────────────────────────────────
// Mirrors the app's auth-launch-splash.tsx pattern:
//   left = (i*13 + 8) % 90, top = (i*19 + 15) % 80
//   duration = 8 + (i%5)*1.8 s, delay = i*0.45 s
//   1/3 peach (warm), 2/3 soft-green (mint)
// We add per-particle motion amplitudes (mx, my) so the drift
// keyframe in CSS produces non-identical paths.
function spawnFireflies(host, count, opts = {}) {
  if (!host) return
  const warm = opts.warm || '#F2B58A'
  const cool = opts.cool || '#A9C98E'   // muted mint — an unlit fly isn't a neon-green pixel
  const frag = document.createDocumentFragment()
  for (let i = 0; i < count; i++) {
    const fly = document.createElement('i')
    fly.className = 'firefly' + (i % 9 === 0 ? ' firefly--bright' : '')
    const leftPct = (i * 13 + 8) % 90
    const topPct  = (i * 19 + 15) % 80
    const dur     = 8 + (i % 5) * 1.8
    const delay   = i * 0.45
    const color   = i % 3 === 0 ? warm : cool
    // Motion amplitudes — tiny variance per fly so the field
    // looks asynchronous even with a shared keyframe.
    const mx = 32 + ((i * 7) % 28)   // 32–60 px
    const my = 40 + ((i * 11) % 36)  // 40–76 px
    fly.style.setProperty('--fx',     leftPct + '%')
    fly.style.setProperty('--fy',     topPct + '%')
    fly.style.setProperty('--fdur',   dur + 's')
    fly.style.setProperty('--fdelay', '-' + delay.toFixed(2) + 's')
    fly.style.setProperty('--fc',     color)
    fly.style.setProperty('--fmx',    mx + 'px')
    fly.style.setProperty('--fmy',    my + 'px')
    // Base position (numeric %) cached for the cursor-follow swarm.
    fly.dataset.fx = leftPct
    fly.dataset.fy = topPct
    frag.appendChild(fly)
  }
  host.appendChild(frag)
}

// Mobile gets fewer particles — smaller GPU budget, smaller viewport,
// and the field reads "busy" if the same count fits in less space.
// The breakpoint matches our `min-width: 720px` layout shift.
const isCompactViewport =
  window.matchMedia &&
  (window.matchMedia('(max-width: 720px)').matches ||
    window.matchMedia('(pointer: coarse)').matches)

spawnFireflies($('#hero-fireflies'),   isCompactViewport ? 22 : 44)
spawnFireflies($('#policy-fireflies'), isCompactViewport ?  9 : 14)
// Celebration field (cream + coral) behind the Floración medallion,
// and a tiny mint field inside the annual plan tile.
spawnFireflies($('#floracion-fireflies'), isCompactViewport ? 7 : 10, { warm: '#F0B488', cool: '#FFFBF2' })
spawnFireflies($('#plan-fireflies'),      isCompactViewport ? 3 :  4, { warm: '#FFFBF2', cool: '#A6EF8F' })

// ─── Garden grid ───────────────────────────────────────────
// Data-driven like spawnFireflies: a 5-week pattern (L→D) of real
// streak stages, each rendered with the app's exact glyph SVG.
// Tells one engaged user's story: seeds → ferns, a slip with no
// guilt, a perfect week that blooms, a recovered day, and the
// current week in progress.
const GARDEN_GLYPHS = {
  seed:
    '<svg viewBox="0 0 40 44" aria-hidden="true"><ellipse cx="20" cy="26" rx="6.5" ry="9" transform="rotate(20 20 26)" fill="#C29A5E"/><path d="M16 24 Q20 18 25 21" stroke="#8FA86A" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  germ:
    '<svg viewBox="0 0 40 44" aria-hidden="true"><path d="M20 40 V21" stroke="#3C7D34" stroke-width="2.4" stroke-linecap="round" fill="none"/><ellipse cx="12.5" cy="21" rx="7.5" ry="4.6" transform="rotate(-36 12.5 21)" fill="#9FD580"/><ellipse cx="27.5" cy="18.5" rx="8" ry="5" transform="rotate(33 27.5 18.5)" fill="#A9D57F"/></svg>',
  fern:
    '<svg viewBox="0 0 841 742" aria-hidden="true"><g>' +
    '<path transform="scale(0.725 0.725318)" fill="#FDFEF9" d="M930.253 161.648C952.922 159.917 1062.65 162.321 1076.44 174.946C1079.49 177.73 1079.97 182.367 1080.01 186.271C1080.2 205.99 1073.97 226.042 1069.75 245.157C1050.77 331.198 1019.52 419.339 967.311 491.088C958.351 503.402 949.002 515.375 938.355 526.29C892.277 573.533 835.21 606.984 767.766 607.738C704.872 608.441 663.17 580.618 619.808 538.225C612.042 551.619 604.976 565.241 599.394 579.713C562.824 674.534 577.135 784.414 575.226 884.105C575.094 891.017 574.839 899.088 569.313 904.098C566.753 906.419 563.54 907.347 560.122 907.064C553.915 906.55 549.809 902.664 545.937 898.219C544.903 850.17 546.229 802.453 545.856 754.442C545.687 732.639 546.482 705.849 543.286 684.587C538.997 656.056 525.326 615.996 505.998 594.098C471.757 641.839 423.33 665.422 364.287 656.958C361.934 656.532 359.589 656.063 357.252 655.552C292.47 641.763 247.364 597.198 212.432 543.25C202.547 527.751 193.559 511.698 185.511 495.17C176.231 476.329 139.547 392.415 143.742 375.865C144.27 373.78 145.452 372.567 147.286 371.505C155.165 366.941 176.958 362.948 186.794 361.124C251.798 349.071 338.872 343.373 403.143 360.107C449.172 372.091 487.461 397.644 511.7 439.119C538.02 484.154 532.767 522.432 520.174 570.237C529.873 584.248 539.612 597.775 547.484 612.911C549.8 617.364 552.056 622.19 554.717 626.383C562.515 596.662 570.598 571.293 584.369 543.61C589.503 533.291 595.151 523.284 600.587 513.116C597.622 506.214 593.352 497.641 590.117 490.746C578.915 466.869 574.123 446.843 572.474 420.558C569.457 364.126 588.941 308.8 626.655 266.71C699.915 183.799 826.22 168.029 930.253 161.648Z"/>' +
    '<path transform="scale(0.725 0.725318)" fill="#A9D57F" d="M940.001 190.008C976.452 189.436 1012.9 191.405 1049.08 195.901C1047.96 206.133 1046.52 216.328 1044.75 226.468C1039.09 258.278 1028.32 293.779 1017.85 324.454C990.198 405.487 949.024 493.189 876.722 543.311C840.482 568.434 786.505 586.1 742.513 577.238C698.365 568.346 662.384 548.669 636.588 511.375C651.629 486.891 667.932 470.004 688.321 449.745C700.69 437.455 710.432 427.807 724.066 416.835C740.014 403.518 756.623 391.011 773.828 379.362C778.29 376.362 782.793 373.335 787.494 370.523C795.451 365.757 804.841 362.059 811.563 355.592C814.02 353.139 814.386 349.645 812.82 346.623C807.626 336.598 797.538 342.155 790.071 345.557C782.881 348.832 776.098 352.422 769.25 356.208C724.897 380.222 684.913 411.546 650.981 448.86C639.941 460.912 629.717 473.591 619.353 486.222C607.842 463.542 601.504 438.592 600.793 413.168C599.721 364.873 617.657 318.089 650.74 282.886C701.833 229.232 768.24 210.12 839.336 199.1C872.689 194.145 906.299 191.11 940.001 190.008Z"/>' +
    '<path transform="scale(0.725 0.725318)" fill="#A9D57F" d="M299.425 371.216C325.942 368.849 368.616 375.554 394.913 381.185C431.308 388.979 467.255 411.085 487.374 442.889C509.898 478.492 511.072 511.978 502.224 551.543C466.873 522.344 431.932 496.886 387.985 482.014C381.25 479.735 358.193 468.482 352.419 475.503C344.307 485.366 373.887 494.667 379.659 497.195C386.443 500.186 393.14 503.367 399.744 506.736C426.763 520.381 446.339 534.016 469.306 553.437C477.807 560.605 483.531 567.102 491.042 575.382C476.584 600.7 453.484 619.958 425.978 629.626C395.077 640.598 358.147 637.769 328.735 623.233C253.52 586.058 210.161 502.676 181.261 427.685C176.412 415.103 172.678 401.625 168.179 388.882C202.606 377.39 262.485 373.148 299.425 371.216Z"/>' +
    '</g></svg>',
  bloom:
    '<svg viewBox="0 0 40 44" aria-hidden="true"><path d="M20 40 V19" stroke="#3C7D34" stroke-width="2.4" stroke-linecap="round" fill="none"/><ellipse cx="13" cy="26" rx="6" ry="3.4" transform="rotate(-32 13 26)" fill="#9FD580"/><ellipse cx="27" cy="24" rx="6" ry="3.4" transform="rotate(32 27 24)" fill="#A9D57F"/><circle cx="20" cy="8" r="3.8" fill="#E2935E"/><circle cx="14.5" cy="11.5" r="3.8" fill="#E2935E"/><circle cx="25.5" cy="11.5" r="3.8" fill="#E2935E"/><circle cx="16.3" cy="17" r="3.8" fill="#E2935E"/><circle cx="23.7" cy="17" r="3.8" fill="#E2935E"/><circle cx="20" cy="13" r="3.4" fill="#F4D58A"/></svg>',
  recovered:
    '<svg viewBox="0 0 40 44" aria-hidden="true"><path d="M20 40 V24" stroke="#3C7D34" stroke-width="2.2" stroke-linecap="round" fill="none"/><ellipse cx="13.5" cy="28" rx="5.5" ry="3.2" transform="rotate(-34 13.5 28)" fill="#9FD580"/><ellipse cx="26.5" cy="26.5" rx="5.5" ry="3.2" transform="rotate(34 26.5 26.5)" fill="#A9D57F"/><circle cx="20" cy="18" r="3" fill="#E2935E"/></svg>',
  missed:
    '<svg viewBox="0 0 40 44" opacity="0.62" aria-hidden="true"><path d="M20 40 Q19 30 24 26" stroke="#B7B2A2" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="27" cy="25" rx="6.5" ry="3.6" transform="rotate(58 27 25)" fill="#CBC6B6"/></svg>',
  pending:
    '<svg viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="#7FC56A" stroke-width="2" stroke-dasharray="3 3" fill="none"/></svg>',
  pre: '',
}
// 35 cells, weeks top→bottom (oldest→current), days L→D.
const GARDEN_PATTERN = [
  'seed', 'germ', 'germ', 'fern', 'fern', 'fern', 'fern',
  'fern', 'fern', 'fern', 'fern', 'missed', 'fern', 'fern',
  'bloom', 'bloom', 'bloom', 'bloom', 'bloom', 'bloom', 'bloom',
  'fern', 'fern', 'fern', 'recovered', 'fern', 'fern', 'fern',
  'fern', 'fern', 'fern', 'fern', 'pending', 'pre', 'pre',
]
function buildGarden(host) {
  if (!host) return []
  const frag = document.createDocumentFragment()
  const cells = []
  for (const stage of GARDEN_PATTERN) {
    const cell = document.createElement('div')
    cell.className = 'garden-cell garden-cell--' + stage
    cell.innerHTML = GARDEN_GLYPHS[stage] || ''
    frag.appendChild(cell)
    cells.push(cell)
  }
  host.appendChild(frag)
  return cells
}
const gardenCells = buildGarden($('#garden-grid'))

// ─── Nav glass on scroll ────────────────────────────────────
const nav = $('.site-nav')
if (nav) {
  const isPolicyPage = document.body.classList.contains('is-policy')
  // On policy pages the dark hero is shorter, so switch to paper-glass
  // sooner; on the landing wait until the user has cleared the hero.
  const update = () => {
    const y = window.scrollY
    const threshold = isPolicyPage ? 220 : window.innerHeight * 0.62
    nav.classList.toggle('is-glass', y > 24)
    nav.classList.toggle('is-glass--paper', y > threshold)
  }
  update()
  window.addEventListener('scroll', update, { passive: true })
}

// ─── Theme toggle ───────────────────────────────────────────
// The pre-paint inline script in <head> already set data-theme from
// localStorage (or the system preference). This just flips + persists.
const themeBtn = $('.site-nav__theme')
if (themeBtn) {
  // aria-pressed = "is dark on?" so a screen reader announces the current state.
  const syncPressed = () =>
    themeBtn.setAttribute('aria-pressed', String(document.documentElement.getAttribute('data-theme') === 'dark'))
  syncPressed()
  const applyTheme = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('manifiesto-theme', next) } catch (e) {}
    syncPressed()
  }
  themeBtn.addEventListener('click', () => {
    // Crossfade the whole page between themes instead of a hard flash.
    if (document.startViewTransition && !prefersReducedMotion) {
      document.startViewTransition(applyTheme)
    } else {
      applyTheme()
    }
  })
}

// ─── GSAP setup ─────────────────────────────────────────────
const hasGSAP = typeof gsap !== 'undefined'

if (hasGSAP) {
  gsap.registerPlugin(ScrollTrigger)

  // Pre-stage hero elements off-screen so the page never flashes
  // a "finished" state before the entrance plays.
  if (!prefersReducedMotion) {
    gsap.set('.hero__eyebrow', { opacity: 0, y: 12 })
    gsap.set('.hero__fern', { opacity: 0 })
    gsap.set('.fern-silhouette', { opacity: 0 })
    gsap.set('.fern-leaf', { opacity: 0 })
    gsap.set('.fern-stem-trace', { opacity: 1, strokeDashoffset: 175 })
    gsap.set('.hero__wordmark .letter', { opacity: 0, y: 18, filter: 'blur(6px)' })
    gsap.set('.hero__wordmark .dot', { opacity: 0, y: 18, filter: 'blur(6px)', scale: 0.5, transformOrigin: '50% 75%' })
    gsap.set('.hero__tagline', { opacity: 0, y: 14 })
    gsap.set('.hero__cta-row > *', { opacity: 0, y: 12 })
    gsap.set('.hero__cue', { opacity: 0, y: 8 })
  }

  // 1. Hero entrance ────────────────────────────────────────
  if (!prefersReducedMotion) {
    const expoOut = 'expo.out'
    const tl = gsap.timeline({ defaults: { ease: expoOut } })

    tl
      .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.7 }, 0.05)
      // ── "Brote creciendo" entrance (mirrors the welcome screen) ──
      // Container appears, the white stem draws bottom→top (sap rising) and
      // stays, the cream silhouette fills in, then the two green leaves bloom
      // (small first, then big) — their inner slit reveals the white midrib.
      .to('.hero__fern', { opacity: 1, duration: 0.55, ease: 'power2.out' }, 0.0)
      .to('.fern-stem-trace', { strokeDashoffset: 0, duration: 0.9, ease: 'expo.out' }, 0.1)
      .to('.fern-silhouette', { opacity: 1, duration: 0.55, ease: 'power2.out' }, 0.78)
      .to('.fern-leaf-2', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.0)
      .to('.fern-leaf-1', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.14)
      // Wordmark rises after the fern has bloomed.
      .to('.hero__wordmark .letter', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.85,
        stagger: 0.05,
      }, 1.2)
      // The dot lands last with a real scale-in (prestaged at 0.5) — the brand
      // seal settles, no bounce (expo.out), per the motion law.
      .to('.hero__wordmark .dot', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.7,
        ease: 'expo.out',
      }, '-=0.05')
      .to('.hero__tagline', { opacity: 1, y: 0, duration: 0.9 }, '-=0.45')
      .to('.hero__cta-row > *', { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, '-=0.25')
      .to('.hero__cue', { opacity: 1, y: 0, duration: 0.6 }, '-=0.1')
  }

  // 2. Fern idle motion — slow, breath-like. Float the whole SVG as one unit
  //    so silhouette, leaves and the white midrib stay perfectly registered.
  //    (Rotating each leaf on its own here desynced them from the silhouette,
  //    which read as "misplaced leaves" — the baked scale transform shifts the
  //    pivot, so even ~1.8° swung the green fill off its cream outline.)
  if (!prefersReducedMotion && document.querySelector('.hero__fern svg')) {
    gsap.to('.hero__fern svg', {
      y: 6,
      duration: 4.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.6, // start after the entrance has settled
    })
  }

  // 3. Cursor parallax on the fern (desktop, fine pointer only).
  //    Spring-damped via lerp so it feels alive, not snappy.
  //    Disabled on coarse-pointer (touch) — there's no cursor to track.
  const fineHover =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !isCompactViewport
  const fern = document.querySelector('.hero__fern')
  if (fern && fineHover && !prefersReducedMotion) {
    let targetX = 0, targetY = 0
    let currX = 0, currY = 0
    const onMove = (e) => {
      const rect = fern.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      targetX = (e.clientX - cx) * 0.020   // max ~12px at the viewport edge
      targetY = (e.clientY - cy) * 0.020
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    // Lerp with 0.08 — feels like a soft spring without a physics lib.
    // Early-return once converged so we don't repaint the fern every frame for nothing.
    gsap.ticker.add(() => {
      const dx = targetX - currX, dy = targetY - currY
      if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return
      currX += dx * 0.08
      currY += dy * 0.08
      fern.style.transform = `translate3d(${currX.toFixed(2)}px, ${currY.toFixed(2)}px, 0)`
    })
  }

  // 3b. "Cazar luciérnagas" — flies whose home falls within a radius of the
  //     cursor are drawn in and pile up near the pointer (brightening as they
  //     gather); everything outside the radius keeps drifting freely. Move the
  //     cursor away and a caught fly springs back home and resumes its flight.
  //     Per emil: this is a decorative mouse-tracking interaction, so it wants
  //     SPRING physics, not a linear lerp — the spring keeps velocity when the
  //     pointer changes mid-gather, so the catch/release reads alive and a touch
  //     overshooting. We drive the CSS `translate`/`scale` props (separate from
  //     `transform`, which the firefly-drift keyframe owns) so they compose.
  const heroFlies = document.querySelector('#hero-fireflies')
  if (heroFlies && fineHover && !prefersReducedMotion) {
    const R = 150                       // catch radius (px)
    const STIFF = 0.10, DAMP = 0.80     // spring: lively, gently overshooting
    const flies = Array.from(heroFlies.children).map((el) => ({
      el,
      fx: (parseFloat(el.dataset.fx) || 50) / 100,
      fy: (parseFloat(el.dataset.fy) || 50) / 100,
      cx: 0, cy: 0, vx: 0, vy: 0, lit: false,
    }))
    let mx = null, my = null, active = false
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; active = true }, { passive: true })
    gsap.ticker.add(() => {
      if (!active || mx === null) return
      const rect = heroFlies.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) { active = false; return }
      const px = mx - rect.left, py = my - rect.top
      let energy = 0
      for (const f of flies) {
        const dx0 = px - f.fx * rect.width
        const dy0 = py - f.fy * rect.height
        const dist = Math.sqrt(dx0 * dx0 + dy0 * dy0)
        let s = 0, tx = 0, ty = 0
        if (dist < R) {
          const t = 1 - dist / R
          s = t * t * (3 - 2 * t)       // smoothstep → tightest pile-up at the cursor
          tx = dx0 * s; ty = dy0 * s
        }
        // Spring integrate toward the target offset (0 = home).
        f.vx = (f.vx + (tx - f.cx) * STIFF) * DAMP
        f.vy = (f.vy + (ty - f.cy) * STIFF) * DAMP
        f.cx += f.vx; f.cy += f.vy
        energy += Math.abs(f.vx) + Math.abs(f.vy)
        f.el.style.translate = f.cx.toFixed(1) + 'px ' + f.cy.toFixed(1) + 'px'
        // Caught flies grow + glow; only touch `scale` when the state flips.
        if (s > 0.01) { f.el.style.scale = (1 + s * 0.6).toFixed(2); f.lit = true }
        else if (f.lit) { f.el.style.scale = '1'; f.lit = false }
      }
      if (energy < 0.4) active = false   // all settled — idle until the next move
    })
  }

  // 4. Reveal-on-scroll
  const reveals = $$('.reveal')
  if (reveals.length && !prefersReducedMotion) {
    gsap.set(reveals, { opacity: 0, y: 22 })
    ScrollTrigger.batch(reveals, {
      start: 'top 85%',
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.06,
          ease: 'expo.out',
          overwrite: 'auto',
        }),
      onLeaveBack: (batch) =>
        gsap.to(batch, {
          opacity: 0,
          y: 22,
          duration: 0.35,
          ease: 'power2.in',
          overwrite: 'auto',
        }),
    })
  }

  // 4b. Garden grow-in — the brotes sprout in reading order when the
  //     card enters view. Base state is visible (no-JS / reduced-motion
  //     safe); this only adds the staggered pop on top.
  const gardenGrid = $('#garden-grid')
  if (gardenGrid && gardenCells.length && !prefersReducedMotion) {
    ScrollTrigger.create({
      trigger: gardenGrid,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gardenCells.forEach((cell, i) => {
          cell.style.setProperty('--cell-delay', i * 22 + 'ms')
          cell.classList.add('is-growing')
        })
      },
    })
  }

  // 5. Policy ToC active section tracking
  const tocLinks = $$('.policy-toc a[href^="#"]')
  if (tocLinks.length) {
    tocLinks.forEach((link) => {
      const id = link.getAttribute('href').slice(1)
      const target = document.getElementById(id)
      if (!target) return
      ScrollTrigger.create({
        trigger: target,
        start: 'top 30%',
        end: 'bottom 30%',
        onToggle: (self) => {
          if (self.isActive) {
            tocLinks.forEach((l) => l.classList.remove('is-active'))
            link.classList.add('is-active')
          }
        },
      })
    })
  }

  // 6. Refresh once fonts have settled (Fraunces variable axes
  //    change measured metrics — without refresh, the last-section
  //    triggers fire ~30px off).
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }
}
