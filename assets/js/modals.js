// ================================
// MODAL OPEN / CLOSE — REFINED
// ================================

document.addEventListener('DOMContentLoaded', () => {

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.add('active'); 
    document.body.style.overflow = 'hidden'; 

    // Focus on close button for accessibility
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Handle OPEN buttons
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-modal]');
    if (btn) {
      const id = btn.getAttribute('data-modal');
      openModal(id);
    }
  });

  // Handle CLOSE (X button or clicking backdrop)
  document.addEventListener('click', (ev) => {
    const closeBtn = ev.target.closest('[data-close]');
    if (closeBtn) {
      const parent = closeBtn.closest('.modal');
      closeModal(parent);
      return;
    }

    // 2. Clicked outside modal-container (on the backdrop)?
    if (ev.target.classList.contains('modal')) {
      closeModal(ev.target);
    }
  });

  // ESC key closes all open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll('.modal.active')
        .forEach(modal => closeModal(modal));
    }
  });

});