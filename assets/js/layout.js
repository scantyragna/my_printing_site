document.addEventListener('DOMContentLoaded', () => {
  const headerPlaceholder = document.getElementById('main-header');
  const footerPlaceholder = document.getElementById('main-footer');

  if (headerPlaceholder) {
    fetch('components/header.html')
      .then(response => response.text())
      .then(html => {
        headerPlaceholder.innerHTML = html;
        
        // Initialize header functionality
        initHeader();

        try {
          window.dispatchEvent(new CustomEvent('pw-header-loaded'));
        } catch {}
        if (!window.PW_SEARCH) {
          const s = document.createElement('script');
          s.src = 'assets/search.js';
          s.defer = true;
          document.head.appendChild(s);
        }
        if (typeof initLazyLoading === 'function') {
          initLazyLoading();
        }
      })
      .catch(err => console.error('Failed to load header:', err));
  }

  function initHeader() {
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');

    if (hamburgerToggle && mobileMenu) {
      hamburgerToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('active');
        mobileMenu.classList.toggle('active');
        hamburgerToggle.setAttribute('aria-expanded', !isOpen);
        if (hamburgerIcon) {
          hamburgerIcon.textContent = isOpen ? '☰' : '✕';
        }
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? '' : 'hidden';
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !hamburgerToggle.contains(e.target) && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          hamburgerToggle.setAttribute('aria-expanded', 'false');
          if (hamburgerIcon) {
            hamburgerIcon.textContent = '☰';
          }
          document.body.style.overflow = '';
        }
      });
    }

    // Expose submenu toggle globally
    window.toggleMobileSubmenu = (id, button) => {
      const submenu = document.getElementById(id);
      if (submenu) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        submenu.classList.toggle('hidden');
        // Add rotate arrow if present
        const arrow = button.querySelector('.submenu-arrow') || button;
        if (isExpanded) {
          button.innerHTML = button.innerHTML.replace('▴', '▾');
        } else {
          button.innerHTML = button.innerHTML.replace('▾', '▴');
        }
      }
    };
  }

  if (footerPlaceholder) {
    fetch('components/footer.html')
      .then(response => response.text())
      .then(html => {
        footerPlaceholder.innerHTML = html;
      })
      .catch(err => console.error('Failed to load footer:', err));
  }
});
