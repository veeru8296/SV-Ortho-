/**
 * megamenu.js — Page Renderer for SV Ortho Care
 *
 * Reads ?slug=X&cat=Y from the URL.
 *   cat=condition → uses page.html's built-in layout
 *   cat=surgery   → fetches templates/specific_surgical_treatments.html,
 *                   replaces #page-content, then injects JSON data
 *
 * Does NOT touch the navigation dropdown.
 */

(function () {
  'use strict';

  if (!window.location.pathname.endsWith('page.html')) return;

  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('slug');
  const cat    = params.get('cat'); // 'condition' or 'surgery'

  if (!slug) return;

  // ── HELPERS ──────────────────────────────────────────────────────────────
  function titleCase(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
  }
  function setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  function setAttr(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }
  function setInject(key, value, root) {
    const r = root || document;
    r.querySelectorAll(`[data-inject="${key}"]`).forEach(el => {
      el.textContent = value;
    });
  }

  // ── MAIN ─────────────────────────────────────────────────────────────────
  async function run() {
    // 1. Load JSON
    let page;
    try {
      const res  = await fetch('medical-data.json');
      const data = await res.json();
      page = (data.pages || []).find(p => p.slug === slug);
    } catch (e) {
      console.error('[megamenu.js] Failed to load medical-data.json', e);
    }

    if (!page) {
      const loading = document.getElementById('page-loading');
      const error   = document.getElementById('page-error');
      if (loading) loading.style.display = 'none';
      if (error)   error.style.display   = 'flex';
      return;
    }

    document.title = page.title + ' | SV Ortho Care';

    if (cat === 'surgery') {
      await renderSurgical(page);
    } else {
      renderCondition(page);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // A.  SURGICAL TEMPLATE  (templates/specific_surgical_treatments.html)
  // ══════════════════════════════════════════════════════════════════════════
  async function renderSurgical(page) {
    // 1. Fetch the surgical template
    let templateHTML;
    try {
      const res  = await fetch('templates/specific_surgical_treatments.html');
      templateHTML = await res.text();
    } catch (e) {
      console.error('[megamenu.js] Cannot load surgical template', e);
      renderCondition(page); // fallback
      return;
    }

    // 2. Parse template into a fragment so we can manipulate it
    const parser  = new DOMParser();
    const doc     = parser.parseFromString(templateHTML, 'text/html');

    // ── CRITICAL: inject the template's <style> tags into the live <head> ──
    // Without this, only the body HTML is copied in and all CSS is lost.
    const styleId = 'surgical-template-styles';
    if (!document.getElementById(styleId)) {
      doc.querySelectorAll('head style').forEach(styleTag => {
        const liveStyle = document.createElement('style');
        liveStyle.id          = styleId;
        liveStyle.textContent = styleTag.textContent;
        document.head.appendChild(liveStyle);
      });
    }

    // Remove the top-band (site uses shared header instead)
    const topBand = doc.querySelector('.top-band');
    if (topBand) topBand.remove();

    // 3. Inject all text fields via data-inject attributes
    setInject('title',      page.title + ' | SV Ortho Care', doc);
    setInject('bodyPart',   titleCase(page.bodyPart.replace(/-/g, ' ')), doc);
    setInject('bodyPartLabel', `${titleCase(page.bodyPart.replace(/-/g, ' '))} · Surgical`, doc);
    setInject('description',  page.description, doc);
    setInject('description2', page.description, doc);
    setInject('what-title',   'About ' + page.title, doc);

    // Hero H1 — split title into two lines with italic second line
    const words = page.title.split(' ');
    const mid   = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(' ');
    const line2 = words.slice(mid).join(' ');
    const h1    = doc.querySelector('[data-inject="title-h1"]');
    if (h1) {
      h1.innerHTML = line2
        ? `${line1}<br><em>${line2}</em>`
        : line1;
    }

    // 4. Hero image
    const heroImg = doc.getElementById('heroImg');
    const heroPH  = doc.getElementById('heroImgPlaceholder');
    if (heroImg) {
      heroImg.src = encodeURI(page.imagePath);
      heroImg.alt = page.title;
    }
    // imagePath text in placeholder
    setInject('imagePath', page.imagePath, doc);

    // 5. Stats bar — replace placeholder cards
    const statCards = doc.querySelector('.stat-cards[data-inject="stats"], .stat-cards');
    if (statCards && page.stats) {
      statCards.innerHTML = page.stats.map(s =>
        `<div class="stat-card">
           <div class="stat-num">${s.val}</div>
           <div class="stat-label">${s.lbl}</div>
         </div>`
      ).join('');
    }

    // 6. Symptoms / indications list
    const symList = doc.querySelector('.symptom-list[data-inject="symptoms"], .symptom-list');
    if (symList && page.symptoms) {
      symList.innerHTML = page.symptoms.map(s => `<li>${s}</li>`).join('');
    }

    // 7. Procedure step cards (treatment-steps grid)
    const stepGrid = doc.querySelector('.treatment-steps[data-inject="procedure"], .treatment-steps');
    if (stepGrid && page.procedure) {
      const icons = ['🔬', '⚕️', '🏋️', '💉', '📋'];
      const isRich = typeof page.procedure[0] === 'object';
      stepGrid.innerHTML = page.procedure.map((step, i) => {
        const title = isRich ? step.title   : step.split(' — ')[0];
        const desc  = isRich ? step.summary : (step.split(' — ')[1] || step);
        return `<div class="step-card">
          <div class="step-num">${String(i + 1).padStart(2, '0')}</div>
          <div class="step-icon">${icons[i % icons.length]}</div>
          <h4>${title}</h4>
          <p>${desc}</p>
        </div>`;
      }).join('');
    }

    // 8. Stages grid — use procedure steps as stages (circle view)
    const stagesGrid = doc.querySelector('.stages-grid[data-inject="procedure-stages"], .stages-grid');
    if (stagesGrid && page.procedure) {
      const isRich = typeof page.procedure[0] === 'object';
      stagesGrid.innerHTML = page.procedure.map((step, i) => {
        const title = isRich ? step.title : step.split(' — ')[0];
        const desc  = isRich ? step.summary : (step.split(' — ')[1] || step);
        return `<div class="stage-item">
          <div class="stage-circle"><span class="stage-num">${i + 1}</span></div>
          <div class="stage-title">${title}</div>
          <p class="stage-desc">${desc}</p>
        </div>`;
      }).join('');
      // Adjust grid columns to match number of steps
      stagesGrid.style.gridTemplateColumns = `repeat(${Math.min(page.procedure.length, 5)}, 1fr)`;
    }

    // 9. Replace #page-content with the surgical template's body content
    const pageContent = document.getElementById('page-content');
    const loader      = document.getElementById('page-loading');

    if (pageContent) {
      pageContent.innerHTML = doc.body.innerHTML;
      pageContent.style.display = 'block';

      // Wire up image load/error handlers on the now-live img element
      const liveImg = pageContent.querySelector('#heroImg');
      const livePH  = pageContent.querySelector('#heroImgPlaceholder');
      if (liveImg) {
        liveImg.onload  = () => liveImg.classList.add('loaded');
        liveImg.onerror = () => {
          liveImg.style.display = 'none';
          if (livePH) livePH.classList.add('visible');
        };
        // Trigger if already cached
        if (liveImg.complete && liveImg.naturalWidth === 0 && livePH) {
          liveImg.style.display = 'none';
          livePH.classList.add('visible');
        }
      }
    }
    if (loader) loader.style.display = 'none';
  }

  // ══════════════════════════════════════════════════════════════════════════
  // B.  CONDITION TEMPLATE  (page.html's built-in layout)
  // ══════════════════════════════════════════════════════════════════════════
  function renderCondition(page) {
    // Basic text fields
    setEl('pg-title',       page.title);
    setEl('pg-category',    page.category);
    setEl('pg-description', page.description);
    setEl('pg-image-path',  page.imagePath);

    // Hero H1 — two-line split
    const words = page.title.split(' ');
    const mid   = Math.ceil(words.length / 2);
    const h1El  = document.getElementById('pg-h1');
    if (h1El) {
      const line1 = words.slice(0, mid).join(' ');
      const line2 = words.slice(mid).join(' ');
      h1El.innerHTML = line2
        ? `${line1}<br><span class="outline-text">${line2}</span>`
        : line1;
    }

    // Body part badge(s)
    document.querySelectorAll('.pg-body-part').forEach(el => {
      el.textContent = titleCase(page.bodyPart.replace(/-/g, ' '));
    });

    // Hero image
    const heroImg = document.getElementById('pg-hero-img');
    const heroPH  = document.getElementById('pg-hero-placeholder');
    if (heroImg) {
      heroImg.src = encodeURI(page.imagePath);
      heroImg.alt = page.title;
      heroImg.onload  = () => heroImg.classList.add('loaded');
      heroImg.onerror = () => {
        heroImg.style.display = 'none';
        if (heroPH) heroPH.style.display = 'flex';
      };
    }

    // Stats bar
    const statsBar = document.getElementById('pg-stats');
    if (statsBar && page.stats) {
      statsBar.innerHTML = page.stats.map(s =>
        `<div class="stat-item">
           <div class="stat-val">${s.val}</div>
           <div class="stat-lbl">${s.lbl}</div>
         </div>`
      ).join('');
    }

    // Symptoms list
    const symList = document.getElementById('pg-symptoms');
    if (symList && page.symptoms) {
      symList.innerHTML = page.symptoms.map(s => `<li>${s}</li>`).join('');
    }

    // Procedure steps — rich (clickable) or flat (simple)
    const procList = document.getElementById('pg-procedure');
    if (procList && page.procedure && page.procedure.length) {
      const isRich = typeof page.procedure[0] === 'object';

      if (isRich) {
        procList.innerHTML = page.procedure.map((step, i) =>
          `<div class="proc-step" data-index="${i}" tabindex="0" role="button" aria-label="Step ${i+1}: ${step.title}">
             <div class="proc-num">${String(i + 1).padStart(2, '0')}</div>
             <div class="proc-text">
               <h4>${step.title}</h4>
               <p>${step.summary}</p>
             </div>
           </div>`
        ).join('');

        // Wire up detail panel
        const empty    = document.getElementById('pg-proc-empty');
        const card     = document.getElementById('pg-proc-card');
        const tag      = document.getElementById('pg-proc-tag');
        const titleEl  = document.getElementById('pg-proc-card-title');
        const detailEl = document.getElementById('pg-proc-card-detail');
        const closeBtn = document.getElementById('pg-proc-close');

        function showDetail(index) {
          const step = page.procedure[index];
          if (!step) return;
          if (tag)      tag.textContent      = `Step ${String(index + 1).padStart(2, '0')}`;
          if (titleEl)  titleEl.textContent  = step.title;
          if (detailEl) detailEl.textContent = step.detail;
          if (empty) empty.style.display = 'none';
          if (card) {
            card.classList.remove('visible');
            void card.offsetWidth; // force reflow so animation re-plays
            card.classList.add('visible');
          }
          procList.querySelectorAll('.proc-step').forEach((el, i) => {
            el.classList.toggle('active', i === index);
          });
        }

        function closeDetail() {
          if (card)  card.classList.remove('visible');
          if (empty) empty.style.display = '';
          procList.querySelectorAll('.proc-step').forEach(el => el.classList.remove('active'));
        }

        procList.addEventListener('click', e => {
          const step = e.target.closest('.proc-step');
          if (!step) return;
          const index = parseInt(step.dataset.index, 10);
          step.classList.contains('active') ? closeDetail() : showDetail(index);
        });

        procList.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            const step = e.target.closest('.proc-step');
            if (step) { e.preventDefault(); step.click(); }
          }
        });

        if (closeBtn) closeBtn.addEventListener('click', closeDetail);

        // Show first step by default
        if (page.procedure.length > 0) {
          showDetail(0);
        }

      } else {
        // Flat string steps
        procList.innerHTML = page.procedure.map((step, i) =>
          `<div class="proc-step">
             <div class="proc-num">${String(i + 1).padStart(2, '0')}</div>
             <div class="proc-text">
               <h4>${typeof step === 'string' ? step.split(' — ')[0] : step}</h4>
               <p>${typeof step === 'string' ? (step.split(' — ')[1] || '') : ''}</p>
             </div>
           </div>`
        ).join('');
      }
    }

    // "About" title
    const whatTitle = document.getElementById('pg-what-title');
    if (whatTitle) whatTitle.textContent = 'About ' + page.title;

    // Show content
    const loader  = document.getElementById('page-loading');
    const content = document.getElementById('page-content');
    if (loader)  loader.style.display  = 'none';
    if (content) content.style.display = 'block';
  }

  // ── BOOT ─────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
