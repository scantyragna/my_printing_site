document.addEventListener('DOMContentLoaded', () => {
  const headerPlaceholder = document.getElementById('main-header');
  const footerPlaceholder = document.getElementById('main-footer');

  if (headerPlaceholder) {
    fetch('components/header.html')
      .then(response => response.text())
      .then(html => {
        headerPlaceholder.innerHTML = html;
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

  if (footerPlaceholder) {
    fetch('components/footer.html')
      .then(response => response.text())
      .then(html => {
        footerPlaceholder.innerHTML = html;
      })
      .catch(err => console.error('Failed to load footer:', err));
  }
});
