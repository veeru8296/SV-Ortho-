document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll('.testimonial-stacked-card'));
  const stackContainer = document.querySelector('.testimonial-stack');

  if (!cards.length) return;

  let autoCycleInterval;
  const cycleTimeMs = 4500;

  function updateStack() {
    cards.forEach((card, index) => {
      card.classList.remove('stack-pos-1', 'stack-pos-2', 'stack-pos-3', 'stack-sweepwards');
      card.style.zIndex = '';
      
      if (index === 0) {
        card.classList.add('stack-pos-1');
      } else if (index === 1) {
        card.classList.add('stack-pos-2');
      } else if (index === 2) {
        card.classList.add('stack-pos-3');
      }
    });
  }

  function nextCard() {
    if (cards[0].classList.contains('stack-sweepwards')) return;

    const topCard = cards[0];
    topCard.classList.add('stack-sweepwards');

    setTimeout(() => {
      cards.push(cards.shift());
      stackContainer.appendChild(topCard);
      updateStack();
    }, 350); 
  }

  // --- Auto-play Engine ---
  function startAutoCycle() {
    if (!autoCycleInterval) {
      autoCycleInterval = setInterval(nextCard, cycleTimeMs);
    }
  }

  function stopAutoCycle() {
    if (autoCycleInterval) {
      clearInterval(autoCycleInterval);
      autoCycleInterval = null;
    }
  }

  // Pause cycling on hover or click so users can comfortably read
  stackContainer.addEventListener('mouseenter', stopAutoCycle);
  stackContainer.addEventListener('mouseleave', startAutoCycle);
  stackContainer.addEventListener('touchstart', stopAutoCycle, {passive: true});

  // Keep manual clicking feature alive if they want to speed through it
  stackContainer.addEventListener('click', (e) => {
    const clickedCard = e.target.closest('.testimonial-stacked-card');
    if (clickedCard) {
      if (clickedCard.classList.contains('stack-pos-1')) {
        nextCard();
      } else if (clickedCard.classList.contains('stack-pos-2')) {
        nextCard(); setTimeout(nextCard, 350); 
      }
    }
  });

  // Bootcamp the engine
  updateStack();
  startAutoCycle();
});
