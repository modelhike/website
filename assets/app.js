/* =============================================================
 * ModelHike — site behaviors
 *
 * Progressive enhancement contract:
 *   - All meaningful content is in HTML (visible to crawlers/AI/screen readers).
 *   - This script ENHANCES with motion. If it never runs, the page is complete.
 *   - When JS does run, we first reset elements to a "start" state, then animate
 *     them to the state already present in HTML.
 *
 * Vanilla JS. Zero deps. Honors prefers-reduced-motion.
 * ============================================================= */

(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  /* ---------- year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav scrolled state ---------- */
  const nav = $('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* If reduced motion, leave the HTML as-is and only wire interactivity below. */
  if (reduceMotion) {
    setupCopyButton();
    setupShortcut();
    return;
  }

  /* =====================================================================
   * Pre-paint reset: snapshot the final state from the DOM, then reset
   * elements to a "start" state so animations have somewhere to begin.
   *
   * This runs BEFORE any animation observer, ideally before the user can
   * see anything (script is loaded with `defer`, runs after DOM parse).
   * ===================================================================== */

  // Counters: textContent currently holds the final value. Snapshot it
  // (data-counter attr already has it), then reset to "0" / "0h".
  const counters = $$('[data-counter]');
  counters.forEach(el => {
    const isHours = el.classList.contains('receipt__hours');
    el.textContent = isHours ? '0h' : '0';
  });

  // File count + compile timer: snapshot via data-final, reset visible text.
  const fileCount = $('#file-count');
  if (fileCount) {
    fileCount.dataset.final = fileCount.textContent.trim();
    fileCount.textContent = '0';
  }
  const compileTimer = $('#compile-timer');
  if (compileTimer) {
    compileTimer.dataset.final = compileTimer.textContent.trim();
    compileTimer.textContent = '0.00s';
  }

  // File tree: mark as animating so CSS hides the lis. We'll add `.in`
  // to each one in sequence when the section enters view.
  const tree = $('#file-tree');
  if (tree) tree.classList.add('is-animating');

  // Hero terminal: snapshot final HTML, replace with a typing prompt.
  const stream = $('#terminal-stream');
  let terminalFinalHTML = '';
  if (stream) {
    terminalFinalHTML = stream.innerHTML;
    stream.innerHTML = '$ <span class="t-cmd"></span><span class="t-cursor" aria-hidden="true">▍</span>';
  }

  /* =====================================================================
   * Reveal-on-scroll
   * ===================================================================== */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parent = entry.target.parentElement;
          const siblings = parent
            ? Array.from(parent.children).filter(c => c.hasAttribute('data-reveal'))
            : [];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx, 6) * 60}ms`;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* =====================================================================
   * Counter animation
   * ===================================================================== */
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.counter);
    const isHours = el.classList.contains('receipt__hours');
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(target * eased);
      el.textContent = isHours ? `${v}h` : v.toString();
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(c => {
      const v = parseFloat(c.dataset.counter);
      c.textContent = c.classList.contains('receipt__hours') ? `${v}h` : v;
    });
  }

  /* =====================================================================
   * Hero terminal — type the command, then reveal pre-rendered output
   * ===================================================================== */
  const typeInto = (el, text, speed = 38) =>
    new Promise(resolve => {
      let i = 0;
      const step = () => {
        if (i <= text.length) {
          el.textContent = text.slice(0, i++);
          setTimeout(step, speed + Math.random() * 30);
        } else resolve();
      };
      step();
    });

  const runHeroTerminal = async () => {
    if (!stream) return;
    const cmdEl = $('.t-cmd', stream);
    const cursor = $('.t-cursor', stream);
    if (!cmdEl) return;

    await wait(700);
    await typeInto(cmdEl, 'npx modelhike demo', 42);
    await wait(450);
    if (cursor) cursor.remove();

    // Restore the pre-rendered final HTML, then animate each line in.
    stream.innerHTML = terminalFinalHTML;
    const lines = $$('.t-line', stream);
    lines.forEach((line, i) => {
      if (i === 0) return; // first line is the command we just typed
      line.style.opacity = '0';
      line.style.transform = 'translateY(2px)';
      line.style.transition = 'opacity 220ms ease, transform 220ms ease';
    });
    for (let i = 1; i < lines.length; i++) {
      await wait(i === 1 ? 80 : 220);
      lines[i].style.opacity = '1';
      lines[i].style.transform = 'none';
    }
  };
  runHeroTerminal();

  /* =====================================================================
   * File-tree compile animation — reveal pre-rendered <li>s in sequence
   * ===================================================================== */
  const animateTree = async () => {
    if (!tree) return;
    const items = Array.from(tree.children);
    const total = items.length;
    const finalCount = parseInt(fileCount?.dataset.final || '142', 10);
    const finalTimer = parseFloat(compileTimer?.dataset.final || '0.84');

    // Animate the timer in parallel.
    const timerDur = total * 38 + 220;
    const t0 = performance.now();
    const tickTimer = (now) => {
      const t = Math.min(1, (now - t0) / timerDur);
      const v = (t * finalTimer).toFixed(2);
      if (compileTimer) compileTimer.textContent = `${v}s`;
      if (t < 1) requestAnimationFrame(tickTimer);
      else if (compileTimer) compileTimer.textContent = `${finalTimer.toFixed(2)}s`;
    };
    requestAnimationFrame(tickTimer);

    for (let i = 0; i < total; i++) {
      items[i].classList.add('in');
      const climb = Math.round(((i + 1) / total) * finalCount);
      if (fileCount) fileCount.textContent = String(climb);
      await wait(38);
    }
    if (fileCount) fileCount.textContent = String(finalCount);
  };

  if ('IntersectionObserver' in window) {
    const moveSection = $('#move');
    if (moveSection) {
      const mio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateTree();
            mio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });
      mio.observe(moveSection);
    } else {
      // Fallback: run immediately
      animateTree();
    }
  } else {
    // No IO support: just reveal all instantly
    if (tree) tree.classList.remove('is-animating');
    if (fileCount) fileCount.textContent = fileCount.dataset.final || '142';
    if (compileTimer) compileTimer.textContent = compileTimer.dataset.final || '0.84s';
  }

  /* =====================================================================
   * Interactive bits
   * ===================================================================== */
  setupCopyButton();
  setupShortcut();

  function setupCopyButton() {
    const copyBtn = $('.install__copy');
    if (!copyBtn) return;
    copyBtn.addEventListener('click', async () => {
      const text = copyBtn.dataset.copy || copyBtn.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch {}
        ta.remove();
      }
      copyBtn.classList.add('is-copied');
      setTimeout(() => copyBtn.classList.remove('is-copied'), 1600);
    });
  }

  function setupFaq() {
    const list   = $('#faq-list');
    const toggle = $('#faq-toggle');
    if (!list || !toggle) return;

    const items = () => Array.from(list.querySelectorAll('details'));

    const setAll = (open) => {
      items().forEach(d => { d.open = open; });
      toggle.textContent = open ? 'Collapse all' : 'Expand all';
    };

    // Intercept summary clicks — prevent the browser from toggling just
    // one item; instead open/close all together.
    list.addEventListener('click', (e) => {
      const summary = e.target.closest('summary');
      if (!summary) return;
      e.preventDefault();
      const wasOpen = summary.closest('details').open;
      setAll(!wasOpen);
    });

    // Button toggles all.
    toggle.addEventListener('click', () => {
      setAll(!items().every(d => d.open));
    });
  }
  setupFaq();

  function setupShortcut() {
    let lastKey = '';
    let lastKeyTime = 0;
    addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea')) return;
      const now = performance.now();
      if (lastKey === 'g' && e.key === 'i' && now - lastKeyTime < 800) {
        const start = $('#start');
        if (start) start.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      lastKey = e.key;
      lastKeyTime = now;
    });
  }
})();
