// src/profile.js
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  if(tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Remove active class from all panes
        panes.forEach(p => p.classList.remove('active'));

        // Add active class to the clicked tab
        tab.classList.add('active');

        // Show the corresponding pane
        const targetId = tab.getAttribute('data-tab');
        const targetPane = document.getElementById(targetId);
        if(targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }
  
  // Modal Logic
  const contactBtn = document.querySelector('.contact-doctor-btn');
  const modal = document.getElementById('contactModal');
  const closeBtn = document.getElementById('closeModalBtn');

  if (contactBtn && modal && closeBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent scrolling
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = ''; 
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});
