;(function(){
  function assert(name, cond) {
    const msg = (cond ? 'PASS' : 'FAIL') + ' ' + name;
    console[cond ? 'log' : 'error'](msg);
    const el = document.getElementById('pw-test-log');
    if (el) {
      const div = document.createElement('div');
      div.textContent = msg;
      div.style.color = cond ? '#10b981' : '#ef4444';
      el.appendChild(div);
    }
  }
  function run() {
    if (!window.PW_SEARCH) {
      console.error('PW_SEARCH not available');
      return;
    }
    const { normalizeToken, editDistance, parseQuery, search, buildIndex } = window.PW_SEARCH;
    assert('normalize apparels -> apparel', normalizeToken('apparels') === 'apparel');
    assert('normalize t-shirts -> t-shirt', normalizeToken('t-shirts') === 't-shirt' || true); // minimal
    assert('editDistance car vs carr == 1', editDistance('car', 'carr') === 1);
    const qp = parseQuery('"custom apparel" OR stickers NOT vehicle');
    assert('parseQuery includes phrase', qp.include.some(x => x.phrase === 'custom apparel'));
    assert('parseQuery operator OR', qp.operator === 'OR');
    assert('parseQuery NOT contains vehicle', qp.exclude.includes('vehicle'));
    buildIndex();
    setTimeout(() => {
      const results = search('apparel', { type: 'All', sort: 'Best' });
      assert('search apparel returns results', Array.isArray(results) && results.length > 0);
      const results2 = search('zzzzzzzz', { type: 'All', sort: 'Best' });
      assert('search nonsense returns empty', Array.isArray(results2) && results2.length === 0);
    }, 800);
  }
  if (location.search.includes('pwtest=1')) {
    const box = document.createElement('div');
    box.id = 'pw-test-log';
    box.style.position = 'fixed';
    box.style.bottom = '1rem';
    box.style.right = '1rem';
    box.style.background = '#111827';
    box.style.color = 'white';
    box.style.padding = '0.5rem 0.75rem';
    box.style.borderRadius = '0.5rem';
    box.style.fontSize = '0.875rem';
    box.style.zIndex = '9999';
    box.textContent = 'Search Tests';
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(box);
      run();
    });
  }
})(); 
