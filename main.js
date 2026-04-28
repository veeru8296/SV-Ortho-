/**
 * =============================================================================
 * main.js  —  Component Loader for SV Ortho Care
 * =============================================================================
 * Loads header.html, footer.html, and sidebar.html into their placeholder <div>s
 * using the Fetch API with async/await, then re-initialises all UI scripts
 * (nav dropdowns, offcanvas sidebar) so interactive elements work after injection.
 *
 * SCRIPT TAG PLACEMENT (copy into every .html page, just before </body>):
 *   <div id="footer-placeholder"></div>
 *   <div id="sidebar-placeholder"></div>
 *   <script src="main.js"></script>
 * =============================================================================
 */

// ---------------------------------------------------------------------------
// 1.  FETCH HELPER
//     Fetches an HTML file and returns its text content.
//     Logs a clear error if the file cannot be loaded.
// ---------------------------------------------------------------------------
async function loadComponent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} – Could not load "${url}"`);
    }
    return await response.text();
  } catch (err) {
    console.error(`[Component Loader] Failed to fetch "${url}":`, err);
    return ""; // Return empty string so the rest of the page still works
  }
}

// ---------------------------------------------------------------------------
// 2.  ACTIVE NAV LINK HIGHLIGHTER
//     Reads the current page filename from window.location and adds the
//     "active" class to the matching <a> tag inside the injected header.
// ---------------------------------------------------------------------------
function setActiveNavLink() {
  // Extract just the filename, e.g. "aboutUs.html" or "" for root/index
  const currentPath = window.location.pathname;
  const currentFile = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

  // Target every top-level nav link inside the injected header
  const navLinks = document.querySelectorAll("#header-placeholder .main-nav-link");

  navLinks.forEach((link) => {
    const linkFile = link.getAttribute("href") || "";
    // Normalise: treat "" and "index.html" as the same page
    const normLink = linkFile === "" ? "index.html" : linkFile;
    const normCurrent = currentFile === "" ? "index.html" : currentFile;

    if (normLink === normCurrent) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ---------------------------------------------------------------------------
// 3.  UI RE-INITIALISERS
//     Called after HTML components are injected so all interactive elements
//     that were registered via DOMContentLoaded in script.js get a second
//     chance to bind their event listeners to the freshly-added DOM nodes.
// ---------------------------------------------------------------------------

/** 3a. Offcanvas Sidebar
 *  Binds the grid button(s) in the injected header to open/close the
 *  offcanvas overlay and sidebar panel that were injected via sidebar.html.
 */
function initOffcanvas() {
  const gridBtns = document.querySelectorAll(".btn-grid");
  const overlay  = document.querySelector(".offcanvas-overlay");
  const sidebar  = document.querySelector(".offcanvas-sidebar");
  const closeBtn = document.querySelector(".offcanvas-close");

  // Guard: all four elements must exist before binding
  if (!gridBtns.length || !overlay || !sidebar || !closeBtn) return;

  function openOffcanvas() {
    overlay.classList.add("active");
    sidebar.classList.add("active");
  }

  function closeOffcanvas() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }

  gridBtns.forEach((btn) => btn.addEventListener("click", openOffcanvas));
  closeBtn.addEventListener("click", closeOffcanvas);
  overlay.addEventListener("click", closeOffcanvas);
}

/** 3b. Navigation Dropdown Menus
 *  Re-runs the click-based submenu toggle logic from script.js so that the
 *  injected nav items respond correctly to user interactions.
 */
function initNavDropdowns() {
  const nestedMenus = document.querySelectorAll(".main-nav-list .has-submenu");

  // Close all open menus when clicking outside the nav
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".main-nav-list")) {
      nestedMenus.forEach((m) => m.classList.remove("menu-open"));
    }
  });

  nestedMenus.forEach((menu) => {
    const toggleBtn = menu.querySelector(":scope > a.submenu-toggle");
    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const submenu = menu.querySelector(":scope > .submenu");
      if (!submenu) return;

      const wasOpen = menu.classList.contains("menu-open");

      // Collapse all sibling menus at the same depth
      const siblings = menu.parentElement.querySelectorAll(":scope > .has-submenu");
      siblings.forEach((sib) => {
        sib.classList.remove("menu-open");
        sib.querySelectorAll(".has-submenu").forEach((dc) => dc.classList.remove("menu-open"));
      });

      if (!wasOpen) {
        menu.classList.add("menu-open");

        // Reset previous collision-detection overrides
        submenu.style.left  = "";
        submenu.style.right = "";
        menu.classList.remove("flyout-left");

        const isTopLevel    = !menu.parentElement.classList.contains("submenu");
        const parentRect    = menu.getBoundingClientRect();
        const menuWidth     = 260; // Expected max pixel width of a deployed dropdown

        const anticipatedRightEdge = isTopLevel
          ? parentRect.left + menuWidth
          : parentRect.right + menuWidth;

        if (anticipatedRightEdge > window.innerWidth) {
          if (isTopLevel) {
            submenu.style.left  = "auto";
            submenu.style.right = "0";
          } else {
            submenu.style.left  = "auto";
            submenu.style.right = "100%";
            menu.classList.add("flyout-left");
          }
        }
      }
    });
  });
}

// ---------------------------------------------------------------------------
// 3c. FAB Widget (Floating Action Buttons + Gene AI chat popup)
//     Injects the FAB HTML into the body and wires all event listeners.
//     Runs on every page that includes main.js.
// ---------------------------------------------------------------------------
function initFAB() {
  // Avoid double-injection if main.js is somehow called twice
  if (document.getElementById('fabGroup')) return;

  // ── Inject Font Awesome if not already present ──────────────────────────
  if (!document.querySelector('link[href*="font-awesome"]')) {
    var fa = document.createElement('link');
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
    document.head.appendChild(fa);
  }

  // ── Inject FAB HTML ──────────────────────────────────────────────────────
  var fabHTML = `
    <div class="fab-group" id="fabGroup">
      <button class="fab-btn" id="fabGeneBtn"><i class="fas fa-robot"></i> Ask Gene</button>
      <a class="fab-btn" href="contact.html"><i class="fas fa-phone-alt"></i> Contact Us</a>
      <a class="fab-btn" href="https://web.docterz.in/#/clinics/5033/book_online_appointment" rel="noopener"><i class="fas fa-calendar-check"></i> Book Appointment</a>
    </div>
    <div class="gp-overlay" id="gpOverlay"></div>
    <div class="gp-popup" id="gpPopup" role="dialog" aria-label="Gene AI Chat">
      <div class="gp-hdr">
        <div class="gp-hdr-av">🧬</div>
        <div class="gp-hdr-info"><h3>Gene AI</h3><p>Orthopedic care assistant</p></div>
        <button class="gp-x-btn" id="gpCloseBtn" aria-label="Close">✕</button>
      </div>
      <div class="gp-msgs" id="gpMsgs">
        <div class="gp-welcome" id="gpWelcome">
          <div class="gp-wel-av">🧬</div>
          <h4>Hey! 👋 I'm Gene</h4>
          <p>Ask me about treatments, doctors, or how to book an appointment at SV Ortho Care!</p>
        </div>
        <div class="gp-chips" id="gpChips">
          <button class="gp-chip" data-q="What treatments do you offer?">🏥 Treatments</button>
          <button class="gp-chip" data-q="How do I book an appointment?">📅 Booking</button>
          <button class="gp-chip" data-q="I have knee pain, what should I do?">🦵 Knee Pain</button>
          <button class="gp-chip" data-q="Tell me about Dr. Vijaykumar">👨‍⚕️ Doctor</button>
        </div>
      </div>
      <div class="gp-inp-row">
        <input class="gp-inp" id="gpInput" type="text" placeholder="Type your message…" autocomplete="off" maxlength="500">
        <button class="gp-snd-btn" id="gpSndBtn" aria-label="Send"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>`;

  var wrapper = document.createElement('div');
  wrapper.innerHTML = fabHTML;
  while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);

  // ── AI Response Map ──────────────────────────────────────────────────────
  var R = {
    'treatments': 'SV Ortho Care offers <strong>knee &amp; hip replacement</strong>, <strong>robotic surgery</strong>, <strong>arthroscopy</strong>, <strong>spine care</strong>, <strong>sports injury</strong>, and <strong>fracture treatment</strong>. What would you like to know more about?',
    'dr. vijaykumar': 'Dr. Vijaykumar is our senior orthopedic surgeon with <strong>16+ years of experience</strong> in joint replacement and robotic-assisted surgery (AIIMS, Delhi).',
    'doctor': 'Our lead specialist is <strong>Dr. Vijaykumar</strong>, senior orthopedic surgeon specializing in joint replacement and robotic surgery.',
    'book': 'Booking is easy! <a href="https://web.docterz.in/#/clinics/5033/book_online_appointment" style="color:#007eff">Book online here</a>, or call <strong>+91 8204954498</strong>.',
    'appointment': 'To book, use our <a href="https://web.docterz.in/#/clinics/5033/book_online_appointment" style="color:#007eff">online portal</a> or call <strong>+91 8204954498</strong>. Available Mon–Sat.',
    'robotic': 'Robotic knee surgery at SV Ortho Care offers <strong>sub-millimeter precision</strong>, faster recovery, less pain, and better long-term results.',
    'knee pain': 'Knee pain may be caused by <strong>arthritis, ligament tears, or meniscus injuries</strong>. Our specialists can help — <a href="contact.html" style="color:#007eff">book a consultation</a>.',
    'knee': 'We specialise in <strong>knee pain, sports injuries, arthritis</strong>, and <strong>knee replacement surgeries</strong>.',
    'hip': 'We offer advanced <strong>hip replacement</strong> and <strong>hip resurfacing</strong> with minimally invasive techniques.',
    'spine': 'Our spine care handles <strong>slipped discs, sciatica, spinal stenosis</strong>, and <strong>scoliosis</strong>.',
    'sports': 'We provide <strong>sports injury management</strong> for ligament tears, muscle injuries, tendon issues, and fractures.',
    'fracture': 'Expert <strong>fracture management</strong> including casting, surgical fixation, and rehabilitation.',
    'arthritis': 'Arthritis treatment ranges from <strong>physiotherapy</strong> to <strong>joint replacement surgery</strong> depending on severity.',
    'contact': 'Reach us at <strong>+91 8204954498</strong> or visit our <a href="contact.html" style="color:#007eff">Contact Page</a>. Open Mon–Sat 9AM–6PM.',
    'location': 'We are at <strong>962, 12th Main Rd, Indiranagar, Bengaluru 560008</strong>. <a href="https://maps.app.goo.gl/b9SeFGT1ndmxsk2G6" style="color:#007eff">View on Maps →</a>',
    'timing': 'Clinic hours: <strong>Mon–Sat 9AM–6PM</strong>, <strong>Sunday 10AM–2PM</strong>.',
    'hello': 'Hello! 👋 I am Gene, SV Ortho Care\'s AI assistant. How can I help you today?',
    'hi': 'Hi! 👋 I am Gene. Ask me anything about SV Ortho Care!',
    'hey': 'Hey! 👋 What can I help you with today?',
    'help': 'Ask me about <strong>treatments, doctors, booking, robotic surgery, knee/hip care</strong>, and more!',
    'thank': 'You are welcome! 😊 Take care and stay healthy!',
    'bye': 'Goodbye! 👋 Thank you for reaching out to SV Ortho Care.'
  };
  var FALLBACK = 'I\'m not sure about that. Please <a href="contact.html" style="color:#007eff">contact us</a> or call <strong>+91 8204954498</strong> for direct assistance.';
  var busy = false;

  function gpReply(text) {
    var l = text.toLowerCase(), keys = Object.keys(R);
    for (var i = 0; i < keys.length; i++) if (l.indexOf(keys[i]) !== -1) return R[keys[i]];
    return FALLBACK;
  }

  function gpAddMsg(role, html) {
    var box = document.getElementById('gpMsgs');
    var w = document.getElementById('gpWelcome'), c = document.getElementById('gpChips');
    if (w) w.remove(); if (c) c.remove();
    var wrap = document.createElement('div'); wrap.className = 'gp-msg ' + role;
    var av = document.createElement('div'); av.className = 'gp-m-av ' + (role === 'ai' ? 'ai' : 'usr');
    av.innerHTML = role === 'ai' ? '🧬' : '<i class="fas fa-user"></i>';
    var bbl = document.createElement('div'); bbl.className = 'gp-bbl'; bbl.innerHTML = html;
    wrap.appendChild(av); wrap.appendChild(bbl);
    box.appendChild(wrap); box.scrollTop = box.scrollHeight;
  }

  function gpShowTyping() {
    var box = document.getElementById('gpMsgs');
    var wrap = document.createElement('div'); wrap.className = 'gp-msg ai'; wrap.id = 'gpTyping';
    var av = document.createElement('div'); av.className = 'gp-m-av ai'; av.innerHTML = '🧬';
    var bbl = document.createElement('div'); bbl.className = 'gp-bbl';
    bbl.innerHTML = '<div class="gp-dots"><span></span><span></span><span></span></div>';
    wrap.appendChild(av); wrap.appendChild(bbl);
    box.appendChild(wrap); box.scrollTop = box.scrollHeight;
  }

  function gpSend() {
    var inp = document.getElementById('gpInput');
    var btn = document.getElementById('gpSndBtn');
    var text = inp.value.trim();
    if (!text || busy) return;
    inp.value = ''; busy = true; btn.disabled = true;
    gpAddMsg('user', text);
    gpShowTyping();
    setTimeout(function () {
      var t = document.getElementById('gpTyping'); if (t) t.remove();
      gpAddMsg('ai', gpReply(text));
      busy = false; btn.disabled = false; inp.focus();
    }, 700 + Math.floor(Math.random() * 400));
  }

  function gpOpen() {
    document.getElementById('gpPopup').classList.add('open');
    document.getElementById('gpOverlay').classList.add('open');
    document.getElementById('fabGeneBtn').classList.add('fab-active');
    setTimeout(function () { document.getElementById('gpInput').focus(); }, 280);
  }

  function gpClose() {
    document.getElementById('gpPopup').classList.remove('open');
    document.getElementById('gpOverlay').classList.remove('open');
    document.getElementById('fabGeneBtn').classList.remove('fab-active');
  }

  // ── Wire events ──────────────────────────────────────────────────────────
  document.getElementById('fabGeneBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    document.getElementById('gpPopup').classList.contains('open') ? gpClose() : gpOpen();
  });
  document.getElementById('gpCloseBtn').addEventListener('click', gpClose);
  document.getElementById('gpOverlay').addEventListener('click', gpClose);
  document.getElementById('gpPopup').addEventListener('click', function (e) { e.stopPropagation(); });
  document.getElementById('gpSndBtn').addEventListener('click', gpSend);
  document.getElementById('gpInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') gpSend(); });
  document.querySelectorAll('.gp-chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.getElementById('gpInput').value = this.dataset.q;
      gpSend();
    });
  });
}

// ---------------------------------------------------------------------------
// 4.  MAIN ORCHESTRATOR
//     Loads all three components in parallel (Promise.all), injects the HTML,
//     then fires all re-initialisers and the active-link highlighter.
// ---------------------------------------------------------------------------
async function initComponents() {
  // Resolve all three fetches concurrently for best performance
  const [headerHTML, footerHTML, sidebarHTML] = await Promise.all([
    loadComponent("header.html"),
    loadComponent("footer.html"),
    loadComponent("sidebar.html"),
  ]);

  // --- Inject HTML into placeholders ---
  const headerPlaceholder  = document.getElementById("header-placeholder");
  const footerPlaceholder  = document.getElementById("footer-placeholder");
  const sidebarPlaceholder = document.getElementById("sidebar-placeholder");

  if (headerPlaceholder  && headerHTML)  headerPlaceholder.innerHTML  = headerHTML;
  if (footerPlaceholder  && footerHTML)  footerPlaceholder.innerHTML  = footerHTML;
  if (sidebarPlaceholder && sidebarHTML) sidebarPlaceholder.innerHTML = sidebarHTML;

  // --- Run UI re-initialisers AFTER HTML is in the DOM ---
  // Order matters: sidebar HTML must be injected before initOffcanvas() tries to
  // find .offcanvas-overlay, and header HTML must exist before initNavDropdowns().
  initOffcanvas();
  initNavDropdowns();
  initFAB();

  // --- Highlight the current page in the nav ---
  setActiveNavLink();
}

// ---------------------------------------------------------------------------
// 5.  ENTRY POINT
//     Start as soon as the DOM is ready. Because this <script> tag is placed
//     just before </body>, the DOM is almost certainly already parsed — but
//     wrapping in DOMContentLoaded makes it bulletproof for any placement.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// 6.  EXPOSE GLOBALS
//     megamenu.js (and the router) need to call these after dynamically
//     rebuilding nav nodes so event listeners are re-bound correctly.
// ---------------------------------------------------------------------------
window.initNavDropdowns = initNavDropdowns;
window.initOffcanvas    = initOffcanvas;
window.initComponents   = initComponents;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initComponents);
} else {
  // DOM already ready (script placed at end of body, most common case)
  initComponents();
}
