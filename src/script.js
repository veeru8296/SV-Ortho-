document.addEventListener("DOMContentLoaded", () => {
  const allTracks = document.querySelectorAll(".carousel-track");

  allTracks.forEach((track, i) => {
    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    const totalReal = slides.length;
    const direction =
      track.dataset.direction === "vertical" ? "vertical" : "horizontal";

    // Skip vertical tracks — handled purely by CSS animation
    if (direction === "vertical") return;

    // 1. Clone based on perView
    const perView = parseInt(track.dataset.perView) || 1;

    for (let c = 0; c < perView; c++) {
      track.appendChild(slides[c].cloneNode(true));
    }
    for (let c = slides.length - 1; c >= slides.length - perView; c--) {
      track.prepend(slides[c].cloneNode(true));
    }

    let index = perView;
    let isTransitioning = false;
    let isPaused = false;

    // 2. Slide size
    const getSlideSize = () => {
      if (perView === 1) return track.parentElement.offsetWidth;
      const gap = 30;
      return (track.parentElement.offsetWidth + gap) / perView;
    };

    const getTransform = (idx) => `translateX(${-idx * getSlideSize()}px)`;

    // 3. Initial position
    track.style.transition = "none";
    track.style.transform = getTransform(index);

    // 4. Generate dots
    const dotsContainer =
      track.parentElement.parentElement.querySelector(".carousel-dots");
    if (dotsContainer) {
      for (let d = 0; d < totalReal; d++) {
        const dot = document.createElement("button");
        dot.classList.add("carousel-dot");
        if (d === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToIndex(d + perView));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll(".carousel-dot");
      dots.forEach((dot, d) => {
        dot.classList.toggle("active", d === index - perView);
      });
    }

    // 5. Go to specific index
    function goToIndex(newIndex) {
      if (isTransitioning) return;
      isTransitioning = true;
      index = newIndex;
      track.style.transition = "transform 0.5s ease-in-out";
      track.style.transform = getTransform(index);
    }

    function goToNext() {
      if (isTransitioning || isPaused) return;
      goToIndex(index + 1);
    }

    function goToPrev() {
      if (isTransitioning || isPaused) return;
      goToIndex(index - 1);
    }

    // 6. Infinite teleport
    track.addEventListener("transitionend", () => {
      const totalSlides = track.children.length;

      if (index >= totalSlides - perView) {
        track.style.transition = "none";
        index = perView;
        track.style.transform = getTransform(index);
      }

      if (index <= perView - 1) {
        track.style.transition = "none";
        index = totalSlides - perView * 2;
        track.style.transform = getTransform(index);
      }

      updateDots();
      isTransitioning = false;
    });

    // 7. Arrow buttons
    const prevBtn =
      track.parentElement.parentElement.querySelector(".carousel-prev");
    const nextBtn =
      track.parentElement.parentElement.querySelector(".carousel-next");
    if (prevBtn) prevBtn.addEventListener("click", goToPrev);
    if (nextBtn) nextBtn.addEventListener("click", goToNext);

    // 8. Auto-play check — no autoplay for testimonials or youtube
    const disableAutoPlay = track.closest(".testimonial-carousel") || track.closest(".youtube-carousel");
    if (!disableAutoPlay) {
      track.addEventListener("click", () => {
        isPaused = !isPaused;
      });

      const interval = 3000 + i * 500;
      setInterval(goToNext, interval);
    }

    // 9. Resize fix
    window.addEventListener("resize", () => {
      track.style.transition = "none";
      track.style.transform = getTransform(index);
    });
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".aboutUs-slider");
  if (!slider) return;
  const slidesContainer = document.querySelector(".aboutUs-slides");
  const slideElements = Array.from(document.querySelectorAll(".aboutUs-container-slide"));
  const totalOriginalSlides = slideElements.length;

  if (totalOriginalSlides === 0) return;

  // Clone first and last slides for seamless infinite loop
  const firstClone = slideElements[0].cloneNode(true);
  const lastClone = slideElements[totalOriginalSlides - 1].cloneNode(true);

  slidesContainer.appendChild(firstClone);
  slidesContainer.insertBefore(lastClone, slideElements[0]);

  let currentIndex = 1;
  let isTransitioning = false;
  let isPaused = false;

  function updateTransform() {
    const percent = currentIndex * 100;
    slidesContainer.style.transform = `translateX(-${percent}vw)`;
  }

  // Initial position
  slidesContainer.style.transition = "none";
  updateTransform();

  // Create pagination dots
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "aboutUs-dots";
  for (let i = 0; i < totalOriginalSlides; i++) {
    const dot = document.createElement("div");
    dot.className = `aboutUs-dot ${i === 0 ? "active" : ""}`;
    dot.addEventListener("click", () => {
      if (isTransitioning) return;
      currentIndex = i + 1;
      applyTransition();
    });
    dotsContainer.appendChild(dot);
  }
  slider.appendChild(dotsContainer);

  const dots = dotsContainer.querySelectorAll(".aboutUs-dot");

  function updateDots() {
    let activeIndex = currentIndex - 1;
    if (activeIndex === totalOriginalSlides) activeIndex = 0;
    if (activeIndex < 0) activeIndex = totalOriginalSlides - 1;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });
  }

  function applyTransition() {
    isTransitioning = true;
    slidesContainer.style.transition = "transform 0.6s ease-in-out";
    updateTransform();
    updateDots();
  }

  function nextSlide() {
    if (isTransitioning || isPaused) return;
    currentIndex++;
    applyTransition();
  }

  slider.addEventListener("click", (e) => {
    // Do not toggle pause if clicking on pagination dots
    if (e.target.classList.contains("aboutUs-dot")) return;
    isPaused = !isPaused;
  });

  slidesContainer.addEventListener("transitionend", () => {
    isTransitioning = false;
    // Seamless teleport
    if (currentIndex === 0) {
      slidesContainer.style.transition = "none";
      currentIndex = totalOriginalSlides;
      updateTransform();
    }
    if (currentIndex === totalOriginalSlides + 1) {
      slidesContainer.style.transition = "none";
      currentIndex = 1;
      updateTransform();
    }
  });

  // Automatic transition
  setInterval(nextSlide, 4000);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  // console.log(entries);
  // const [entry] = entries;
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// ///////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////
// DYNAMIC NAVIGATION DROPDOWN COLLISION DETECTION & CLICK INTERACTION
// Ensures dropdowns deploy on click and deep nested dropdowns don't visually overflow right side of screen
document.addEventListener("DOMContentLoaded", () => {
  const nestedMenus = document.querySelectorAll('.main-nav-list .has-submenu');

  // Close all active submenus globally when clicking completely outside the navigation block
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-nav-list')) {
      nestedMenus.forEach(m => m.classList.remove('menu-open'));
    }
  });
  
  nestedMenus.forEach(menu => {
    const toggleBtn = menu.querySelector(':scope > a.submenu-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent jump to top for empty anchor tags
      
      const submenu = menu.querySelector(':scope > .submenu');
      if (!submenu) return;

      const wasOpen = menu.classList.contains('menu-open');

      // Close all sibling menus positioned at the exact same depth level
      const siblings = menu.parentElement.querySelectorAll(':scope > .has-submenu');
      siblings.forEach(sib => {
        sib.classList.remove('menu-open');
        // Collapse all deeper cascading children beneath the discarded siblings cleanly
        const deepChildren = sib.querySelectorAll('.has-submenu');
        deepChildren.forEach(dc => dc.classList.remove('menu-open'));
      });

      // Toggle current menu state natively
      if (!wasOpen) {
        menu.classList.add('menu-open');

        // Reset dynamic bounding box layouts for fresh positional calculation
        submenu.style.left = '';
        submenu.style.right = '';
        menu.classList.remove('flyout-left');

        const isTopLevel = !menu.parentElement.classList.contains('submenu');
        const parentRect = menu.getBoundingClientRect();
        const menuWidth = 260; // Geometric maximum visual projection expectation
        
        // Calculate theoretical right boundary line on full physical deployment
        const anticipatedRightEdge = isTopLevel ? (parentRect.left + menuWidth) : (parentRect.right + menuWidth);

        if (anticipatedRightEdge > window.innerWidth) {
          if (isTopLevel) {
            // First tier drops down safely hinged against the right-most edge
            submenu.style.left = 'auto';
            submenu.style.right = '0';
          } else {
            // Unsafe deeper tiers cascade entirely inverse to the left, triggering leftward CSS caret maps
            submenu.style.left = 'auto';
            submenu.style.right = '100%';
            menu.classList.add('flyout-left');
          }
        }
      }
    });
  });
});

// =======================================================================================================================
// VENETIAN BLIND FLIP CARD GENERATOR
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".yt-vt-card");
  cards.forEach(card => {
    const template = card.querySelector(".yt-vt-front-template");
    const frontContainer = card.querySelector(".yt-vt-front");
    if (!template || !frontContainer) return;
    
    // Generate 4 vertical strips dynamically
    for (let i = 1; i <= 4; i++) {
        const strip = document.createElement("div");
        strip.className = `vt-strip vt-strip-${i}`;
        
        const content = document.createElement("div");
        content.className = "vt-front-content";
        content.innerHTML = template.innerHTML;
        
        strip.appendChild(content);
        frontContainer.appendChild(strip);
    }
  });
});

// =======================================================================================================================
// OFFCANVAS SIDEBAR LOGIC
document.addEventListener("DOMContentLoaded", () => {
  const gridBtns = document.querySelectorAll(".btn-grid");
  const overlay = document.querySelector(".offcanvas-overlay");
  const sidebar = document.querySelector(".offcanvas-sidebar");
  const closeBtn = document.querySelector(".offcanvas-close");

  if (gridBtns.length === 0 || !overlay || !sidebar || !closeBtn) return;

  function openOffcanvas() {
    overlay.classList.add("active");
    sidebar.classList.add("active");
  }

  function closeOffcanvas() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }

  gridBtns.forEach(btn => {
    btn.addEventListener("click", openOffcanvas);
  });
  
  closeBtn.addEventListener("click", closeOffcanvas);
    overlay.addEventListener("click", closeOffcanvas);
});

// =======================================================================================================================
// DIAGNOSTIC SERVICES MODAL LOGIC
document.addEventListener("DOMContentLoaded", () => {
  const servicesData = {
    "MRI & CT Scan": {
      title: "MRI & CT Scan",
      subtitle: "",
      imgSrc: "src/img/mri.jpg",
      desc: "Our advanced 3T MRI and multi-slice CT imaging provide high-definition visualization of musculoskeletal structures. These tools are essential for accurately diagnosing ligament tears, spinal disc herniations, and complex bone fractures, ensuring a precise foundation for your orthopedic treatment plan."
    },
    "X-Ray": {
      title: "X-Ray",
      subtitle: "High-Precision Digital Radiography",
      imgSrc: "src/img/x-ray.jpg",
      desc: "Equipped with low-dose digital imaging technology, our X-ray suite provides instant, high-contrast visualization of skeletal structures. This is the primary diagnostic tool for identifying bone alignment, acute fractures, and degenerative joint changes, allowing our orthopedic specialists to make immediate and informed clinical decisions."
    },
    "Diagnostic Lab": {
      title: "Diagnostic Lab",
      subtitle: "Comprehensive Musculoskeletal Pathology",
      imgSrc: "src/img/diagnostic_lab.jpg",
      desc: "Our fully automated diagnostic laboratory conducts specialized biochemical and hematological analyses essential for orthopedic health. From monitoring inflammatory markers and bone metabolism to screening for rheumatoid factors, we provide the critical laboratory data required to manage bone health and systemic orthopedic conditions effectively."
    },
    "Home Physiotherapy": {
      title: "Home Physiotherapy",
      subtitle: "Personalized Rehabilitation at Your Doorstep",
      imgSrc: "src/img/physiotherapy.jpg",
      desc: "Our Home Physiotherapy service brings expert orthopedic rehabilitation directly to your residence, ensuring continuity of care for post-operative recovery or mobility-restricted patients. Our licensed therapists utilize evidence-based protocols to restore range of motion, strengthen musculoskeletal support, and accelerate your journey back to functional independence."
    }
  };

  const modalOverlay = document.getElementById("diagnosticModal");
  if (!modalOverlay) return;
  
  const modalClose = document.getElementById("diagnosticModalClose");
  const modalImg = document.getElementById("diagnosticModalImg");
  const modalTitle = document.getElementById("diagnosticModalTitle");
  const modalSubtitle = document.getElementById("diagnosticModalSubtitle");
  const modalDesc = document.getElementById("diagnosticModalDesc");

  function openModal(serviceKey) {
    const data = servicesData[serviceKey];
    if (!data) return;

    modalTitle.textContent = data.title;
    if (data.subtitle) {
      modalSubtitle.textContent = data.subtitle;
      modalSubtitle.className = "subtitle";
      modalSubtitle.style.display = "block";
    } else {
      modalSubtitle.style.display = "none";
    }
    modalDesc.textContent = data.desc;
    modalImg.src = data.imgSrc;
    modalImg.alt = data.title;

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Scroll Lock
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = ""; // Remove Scroll Lock
  }

  // Event delegation for opening modal
  document.body.addEventListener("click", (e) => {
    // Check if clicked element or its parent is the trigger
    const item = e.target.closest(".facility-thumbs .img-item");
    if (item) {
      e.preventDefault(); // Prevent default link behavior
      const titleEl = item.querySelector(".overlay-text");
      if (titleEl) {
        const serviceKey = titleEl.textContent.trim();
        openModal(serviceKey);
      }
    }
  });

  // Close events
  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }
  
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });
});

// =======================================================================================================================
// ANIMATED NUMBER COUNTER
document.addEventListener("DOMContentLoaded", () => {
  class NumberCounter {
    constructor(el) {
      this.el = el;
      this.target = parseFloat(el.getAttribute("data-target")) || 0;
      this.suffix = el.getAttribute("data-suffix") || "";
      this.startVal = parseFloat(el.getAttribute("data-start")) || 0;
      this.stepVal = parseFloat(el.getAttribute("data-step")) || 1;
      this.current = this.startVal;
      
      this.el.innerHTML = "";
      
      this.numContainer = document.createElement("span");
      this.numContainer.className = "counter-number";
      this.el.appendChild(this.numContainer);
      
      if (this.suffix) {
        this.suffixEl = document.createElement("span");
        this.suffixEl.className = "counter-suffix";
        this.suffixEl.innerText = this.suffix;
        this.el.appendChild(this.suffixEl);
      }
      
      this.render(this.current, true);
    }
    
    render(num, isInitial = false) {
      let numStr;
      if (this.target % 1 !== 0) {
        numStr = num.toFixed(1);
      } else {
        numStr = num.toLocaleString('en-IN');
      }
      const currentDigits = Array.from(this.numContainer.children);
      
      const diff = numStr.length - currentDigits.length;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          const wrap = document.createElement("span");
          wrap.className = "digit-wrapper";
          this.numContainer.insertBefore(wrap, this.numContainer.firstChild);
        }
      }
      
      const wrappers = Array.from(this.numContainer.children);
      
      for (let i = 0; i < numStr.length; i++) {
        const digitChar = numStr[i];
        const wrap = wrappers[i];
        
        const currentDigitEl = wrap.querySelector(".digit.current");
        const currentVal = currentDigitEl ? currentDigitEl.innerText : null;
        
        if (currentVal !== digitChar) {
          if (isInitial) {
            wrap.innerHTML = `<span class="digit current">${digitChar}</span>`;
          } else {
            if (currentDigitEl) {
              currentDigitEl.classList.remove("current");
              currentDigitEl.classList.add("old");
            }
            
            const newDigit = document.createElement("span");
            newDigit.className = "digit new";
            newDigit.innerText = digitChar;
            wrap.appendChild(newDigit);
            
            // Force reflow
            void newDigit.offsetWidth;
            
            newDigit.classList.remove("new");
            newDigit.classList.add("current");
            
            setTimeout(() => {
              if (currentDigitEl && currentDigitEl.parentNode) {
                currentDigitEl.parentNode.removeChild(currentDigitEl);
              }
            }, 300);
          }
        }
      }
    }
    
    startAnimation() {
      if (this.isAnimating || this.current >= this.target) return;
      this.isAnimating = true;
      
      const duration = 2000;
      const steps = Math.ceil((this.target - this.startVal) / this.stepVal);
      const intervalTime = duration / (steps || 1);
      
      const timer = setInterval(() => {
        this.current += this.stepVal;
        // Fix floating point math issues
        if (this.target % 1 !== 0) {
          this.current = Math.round(this.current * 10) / 10;
        }
        if (this.current > this.target) this.current = this.target;
        
        this.render(this.current);
        
        if (this.current >= this.target) {
          clearInterval(timer);
        }
      }, Math.max(50, intervalTime));
    }
  }

  const counters = document.querySelectorAll(".animated-counter");
  const counterInstances = [];
  
  counters.forEach(el => {
    counterInstances.push({
      el: el,
      instance: new NumberCounter(el)
    });
  });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const instanceObj = counterInstances.find(item => item.el === entry.target);
        if (instanceObj) {
          instanceObj.instance.startAnimation();
          observer.unobserve(entry.target); 
        }
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(el => observer.observe(el));
});

