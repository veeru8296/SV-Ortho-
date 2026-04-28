document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".specialists-section-container");
  if (!container) return;

  const viewport = container.querySelector(".carousel-viewport");
  const track = container.querySelector(".ortho-coverflow-track");

  if (!viewport || !track) return;

  // Layout enhancements
  viewport.style.transformStyle = "preserve-3d";
  viewport.style.padding = "30px 0";
  viewport.style.overflow = "hidden"; // Clip to container bounds
  
  track.style.display = "flex";
  track.style.transition = "transform 0.6s ease-out";
  track.style.willChange = "transform";
  track.style.width = "100%";

  const style = document.createElement("style");
  style.innerHTML = `
    .specialists-section-container .carousel-slide .orthopaedic {
      transition: transform 0.6s ease-out, opacity 0.6s ease-out, box-shadow 0.6s ease-out !important;
      transform-style: preserve-3d;
      border: none !important;
      transform: scale(0.75) rotateY(0deg) translateX(0);
      opacity: 0.5;
      position: relative; 
      z-index: 1;
      cursor: pointer;
    }

    .specialists-section-container .carousel-slide .orthopaedic::before,
    .specialists-section-container .carousel-slide .orthopaedic::after {
      content: "";
      position: absolute;
      border-radius: 20px;
      box-sizing: border-box;
      pointer-events: none;
      width: 0;
      height: 0;
      opacity: 0;
    }

    .specialists-section-container .carousel-slide .orthopaedic::before {
      top: 0; right: 0;
      border-radius: inherit;
      border-top: 2px solid transparent; border-right: 2px solid transparent;
      transition: width 0.3s ease-out, height 0.3s ease-out 0.3s, opacity 0.2s;
      pointer-events: none;
    }

    .specialists-section-container .carousel-slide .orthopaedic::after {
      bottom: 0; left: 0;
      border-radius: inherit;
      border-bottom: 2px solid transparent; border-left: 2px solid transparent;
      transition: width 0.3s ease-out, height 0.3s ease-out 0.3s, opacity 0.2s;
      pointer-events: none;
    }

    /* CENTER CARD */
    .specialists-section-container .carousel-slide.center-slide .orthopaedic {
      transform: perspective(1000px) scale(0.9) rotateY(0deg) translateX(0) translateZ(20px) !important;
      opacity: 1 !important;
      z-index: 10 !important;
      box-shadow: 0 20px 40px rgba(0, 37, 112, 0.15) !important;
    }

    /* Animated Drawing Border for Center */
    .specialists-section-container .carousel-slide.center-slide .orthopaedic::before,
    .specialists-section-container .carousel-slide.center-slide .orthopaedic::after {
      opacity: 1;
      width: 100%;
      height: 100%;
    }
    
    .specialists-section-container .carousel-slide.center-slide .orthopaedic::before {
      border-top-color: #007efe; border-right-color: #007efe;
      transition: width 0.35s ease-out 0.15s, height 0.35s ease-out 0.5s, opacity 0.1s 0.1s !important;
    }
    
    .specialists-section-container .carousel-slide.center-slide .orthopaedic::after {
      border-bottom-color: #007efe; border-left-color: #007efe;
      transition: width 0.35s ease-out 0.15s, height 0.35s ease-out 0.5s, opacity 0.1s 0.1s !important;
    }

    /* Card Geometry Refinements */
    .specialists-section-container .orthopaedic {
      padding: 32px !important;
      border-radius: 12px !important;
    }

    /* Active Card Image Gradient Overlay - Animated Slide Up */
    .specialists-section-container .orthopaedic-img-container,
    .specialists-section-container .orthopaedic-img-container img {
      overflow: hidden !important;
      border-radius: 12px !important;
    }

    .specialists-section-container .carousel-slide .orthopaedic-img-container::after {
      content: "";
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 0%;
      background: linear-gradient(to top, rgba(0, 126, 254, 0.95) 0%, rgba(0, 126, 254, 0) 100%);
      transition: height 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
      pointer-events: none;
      z-index: 2;
    }

    .specialists-section-container .carousel-slide.center-slide .orthopaedic-img-container::after {
      height: 50%;
      transition-delay: 0.45s;
    }

    /* Content Layout Adjustments (Force Center) */
    .specialists-section-container .orthopaedic-content {
      align-items: center !important;
      text-align: center !important;
      position: relative !important;
      z-index: 20 !important;
    }

    /* Tri-Icon Menu Styling (Always visible) */
    .specialists-section-container .carousel-slide .orthopaedic-location {
      background: transparent !important;
      padding: 0 !important;
      position: absolute !important;
      bottom: 20px !important;
      left: 0; right: 0;
      display: flex !important;
      justify-content: center !important;
      gap: 15px;
      opacity: 1;
      z-index: 3;
      border: none !important;
      height: auto !important;
      pointer-events: auto;
      transform: translateZ(30px) !important;
    }

    .specialists-section-container .single-loc-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: white;
      color: #007efe;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22px;
      text-decoration: none;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s ease-out;
      position: relative;
      z-index: 9999;
      transform: translateZ(30px);
    }

    .specialists-section-container .single-loc-btn:hover {
      transform: scale(1.15) translateZ(30px);
    }

    .specialists-section-container .single-loc-btn .btn-tooltip-text {
      visibility: hidden;
      opacity: 0;
      position: absolute;
      bottom: 130%;
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      background-color: #002570;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      transition: all 0.3s ease;
      z-index: 10000;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .specialists-section-container .single-loc-btn .btn-tooltip-text::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -6px;
      border-width: 6px;
      border-style: solid;
      border-color: #002570 transparent transparent transparent;
    }

    .specialists-section-container .single-loc-btn:hover .btn-tooltip-text,
    .specialists-section-container .single-loc-btn:active .btn-tooltip-text {
      visibility: visible;
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* Tooltip Styling */
    .specialists-section-container .tooltip-container {
      position: relative;
      display: inline-block;
      cursor: help;
      color: #007efe;
      font-weight: 600;
      font-size: 18px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    .specialists-section-container .tooltip-container .tooltip-text {
      visibility: hidden;
      width: 260px;
      background-color: #002570;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 10px;
      position: absolute;
      z-index: 9999;
      bottom: 150%; 
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
      font-size: 13px;
      text-transform: none;
      font-weight: 400;
      line-height: 1.4;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .specialists-section-container .tooltip-container .tooltip-text::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -6px;
      border-width: 6px;
      border-style: solid;
      border-color: #002570 transparent transparent transparent;
    }

    .specialists-section-container .tooltip-container:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }

    /* PERIPHERAL CARDS */
    .specialists-section-container .carousel-slide.left-slide .orthopaedic {
      transform: perspective(1000px) scale(0.8) rotateY(45deg) translateX(35%) translateZ(0px) !important;
      opacity: 0.8 !important;
      z-index: 5 !important;
    }

    .specialists-section-container .carousel-slide.right-slide .orthopaedic {
      transform: perspective(1000px) scale(0.8) rotateY(-45deg) translateX(-35%) translateZ(0px) !important;
      opacity: 0.8 !important;
      z-index: 5 !important;
    }
  `;
  document.head.appendChild(style);

  const slides = Array.from(track.querySelectorAll(".carousel-slide"));
  if (slides.length === 0) return;

  const dotsContainer = container.querySelector(".carousel-dots");
  let currentIndex = 0;

  // Initialize dots manually since script.js will no longer see this track
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToIndex(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function apply3DClasses() {
    slides.forEach((s, idx) => {
      s.classList.remove("center-slide", "left-slide", "right-slide");
      if (idx === currentIndex) s.classList.add("center-slide");
      else if (idx < currentIndex) s.classList.add("left-slide");
      else if (idx > currentIndex) s.classList.add("right-slide");
    });
  }

  function goToIndex(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentIndex = index;

    updateDots();
    apply3DClasses();

    // Dynamically calculate bounded coverflow scroll translation
    const viewportWidth = viewport.offsetWidth;
    const slide = slides[currentIndex];
    
    // Position the track so the target slide is precisely in the middle of the viewport
    const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
    const targetTx = (viewportWidth / 2) - slideCenter;

    track.style.transform = `translateX(${targetTx}px)`;
  }

  // Handle clicking slides to navigate
  slides.forEach((slide, idx) => {
    slide.addEventListener("click", () => {
      if (currentIndex !== idx) goToIndex(idx);
    });
  });

  // Enable interactive click-to-pause coverflow auto-rotation loop
  let autoLoop;
  let isPaused = false;
  
  // Toggle the paused state whenever the container is clicked
  container.addEventListener("click", () => {
    isPaused = !isPaused;
  });

  function startAutoPlay() {
    if (autoLoop) clearInterval(autoLoop);
    autoLoop = setInterval(() => {
      if (isPaused) return; // Prevent rotation if the user has clicked to pause
      let next = currentIndex + 1;
      if (next >= slides.length) next = 0; // Rewind back to 1st smoothly
      goToIndex(next);
    }, 3500);
  }

  startAutoPlay();

  // Initialize layout tracking
  window.addEventListener("resize", () => goToIndex(currentIndex));
  setTimeout(() => goToIndex(0), 100);
});
