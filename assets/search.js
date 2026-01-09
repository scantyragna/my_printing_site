// Enhanced client-side search (debounced suggestions, history, fuzzy)
;(function() {
  const PAGES = [
    { title: "Home", url: "index.html", tags: ["home","landing","printwell"] },
    { title: "Services", url: "services.html", tags: ["services","design","printing","brand","vehicle","graphics"] },
    { title: "Portfolio", url: "portfolio.html", tags: ["portfolio","work","examples","gallery"] },
    { title: "Contact", url: "contact.html", tags: ["contact","phone","email","whatsapp","reach","support"] },
    { title: "About", url: "about.html", tags: ["about","company","team","story"] },
    { title: "FAQ’s", url: "faqs.html", tags: ["faq","questions","answers","help","support"] },
    { title: "Stickers", url: "stickers.html", tags: ["stickers","labels","decals","vinyl","branding"] },
    { title: "Decals", url: "decals.html", tags: ["decals","stickers","vinyl"] },
    { title: "DTF Transfers", url: "dtf.html", tags: ["dtf","transfers","apparel","prints"] },
    { title: "Custom Apparel", url: "apparel.html", tags: ["apparel","shirts","tshirts","garments","clothing"] },
    { title: "Unisex T-Shirts", url: "unisex-tshirts.html", tags: ["tshirts","shirts","unisex","apparel"] },
    { title: "Sweatshirts", url: "sweatshirts.html", tags: ["sweatshirts","hoodies","crewneck","apparel"] },
    { title: "Women", url: "womens.html", tags: ["women","ladies","apparel"] },
    { title: "Youth", url: "youth.html", tags: ["youth","kids","children","apparel"] },
    { title: "Polos", url: "polos.html", tags: ["polos","shirts","collared","apparel"] },
    { title: "Workwear", url: "workwear.html", tags: ["workwear","uniform","safety","apparel"] },
    { title: "Hats", url: "hats.html", tags: ["hats","caps","headwear"] },
    { title: "Jackets", url: "jackets.html", tags: ["jackets","outerwear","coat","apparel"] },
    { title: "Embroidery", url: "embroidery.html", tags: ["embroidery","stitch","thread","patches"] },
    { title: "Patches", url: "patches.html", tags: ["patches","embroidered","sew","iron"] },
    { title: "Vehicle Wraps", url: "vehicle_wraps.html", tags: ["vehicle","wraps","car","truck","graphics"] },
    { title: "Window Graphics", url: "windowgraphics.html", tags: ["window","graphics","storefront","vinyl"] },
    { title: "Signs & Banners", url: "banners.html", tags: ["signs","banners","large","format","outdoor"] },
    { title: "Posters", url: "posters.html", tags: ["posters","prints","large","format"] },
    { title: "Stationary", url: "stationary.html", tags: ["stationary","business cards","letterhead","envelopes"] },
    { title: "Souvenirs", url: "souvenirs.html", tags: ["souvenirs","gifts","promo","items"] },
    { title: "Promotional Printing", url: "promo-printing.html", tags: ["promo","printing","merch","giveaways"] },
    { title: "Menus", url: "menus.html", tags: ["menus","restaurant","food","drink"] },
    { title: "Digital Menus", url: "digitalmenus.html", tags: ["digital","menus","screens","tv"] },
    { title: "Bestsellers", url: "bestsellers.html", tags: ["best","sellers","popular","top"] },
  ];

  const STORAGE_KEY = 'pw_recent_searches';
  const SUGGESTION_LIMIT = 8;
  const DEBOUNCE_MS = 300;
  const POP_KEY = 'pw_search_popularity';
  const IDX_KEY = 'pw_content_index_v1';
  const QRY_KEY = 'pw_search_analytics';
  let INDEX = [];
  let INDEX_READY = false;
  let INDEX_BUILDING = false;
  const TYPE_MAP = {
    apparel: 'Apparel',
    'unisex-tshirts': 'Apparel',
    sweatshirts: 'Apparel',
    womens: 'Apparel',
    youth: 'Apparel',
    jackets: 'Apparel',
    hats: 'Apparel',
    polos: 'Apparel',
    workwear: 'Apparel',
    vehicle_wraps: 'Vehicle',
    windowgraphics: 'Vehicle',
    banners: 'Signs',
    posters: 'Signs',
    stationary: 'Signs',
    menus: 'Signs',
    digitalmenus: 'Signs',
    'promo-printing': 'Signs',
    dtf: 'DTF',
    stickers: 'Stickers',
    decals: 'Stickers',
    services: 'Info',
    portfolio: 'Info',
    about: 'Info',
    contact: 'Info',
    faqs: 'Info',
    index: 'Home',
    frames: 'Signs'
  };

  function tokenize(str) {
    return str.toLowerCase().trim().split(/\s+/).filter(Boolean).map(normalizeToken);
  }

  function editDistance(a, b) {
    a = a.toLowerCase(); b = b.toLowerCase();
    const m = a.length, n = b.length;
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  }

  function normalizeToken(t) {
    if (!t) return t;
    let s = t.toLowerCase();
    if (s.endsWith('ies')) s = s.slice(0, -3) + 'y';
    else if (s.endsWith('es')) s = s.slice(0, -2);
    else if (s.endsWith('s')) s = s.slice(0, -1);
    return s;
  }

  function scoreEntry(entry, tokens) {
    const source = (entry.title + " " + entry.tags.join(" ")).toLowerCase();
    let score = 0;
    tokens.forEach(t => {
      if (source.includes(t)) score += 2;
      // basic fuzzy: allow prefix matches
      if ([entry.title.toLowerCase(), ...entry.tags.map(x=>x.toLowerCase())].some(s => s.startsWith(t))) {
        score += 1;
      }
      // typo tolerance using edit distance
      const fields = [entry.title.toLowerCase(), ...entry.tags.map(x=>x.toLowerCase())];
      const bestDist = Math.min(...fields.map(f => editDistance(f, t)));
      if (bestDist <= 2) score += (2 - bestDist); // 2->0 bonus
    });
    return score;
  }

  function parseQuery(q) {
    const parts = [];
    let i = 0;
    while (i < q.length) {
      if (q[i] === '"') {
        let j = i + 1;
        while (j < q.length && q[j] !== '"') j++;
        parts.push({ type: 'phrase', value: normalizeToken(q.slice(i + 1, j)) });
        i = j + 1;
      } else {
        let j = i;
        while (j < q.length && !/\s/.test(q[j])) j++;
        parts.push({ type: 'word', value: normalizeToken(q.slice(i, j)) });
        i = j + 1;
      }
    }
    const include = [];
    const exclude = [];
    let operator = 'AND';
    parts.forEach(p => {
      const v = p.value.trim();
      if (!v) return;
      const up = v.toUpperCase();
      if (up === 'AND' || up === 'OR') operator = up;
      else if (up === 'NOT') operator = 'NOT';
      else if (p.type === 'phrase') include.push({ phrase: v.toLowerCase() });
      else if (operator === 'NOT') exclude.push(v.toLowerCase());
      else include.push(v.toLowerCase());
    });
    return { include, exclude, operator };
  }

  function strip(html) {
    const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
    const text = withoutScripts.replace(/<[^>]+>/g, ' ');
    return text.replace(/\s+/g, ' ').trim();
  }

  function mapType(url) {
    const name = url.replace('.html','').split('/').pop();
    return TYPE_MAP[name] || 'Info';
  }

  function loadPopularity() {
    try {
      const raw = localStorage.getItem(POP_KEY);
      const obj = JSON.parse(raw || '{}');
      return obj && typeof obj === 'object' ? obj : {};
    } catch { return {}; }
  }
  function bumpPopularity(url) {
    try {
      const pop = loadPopularity();
      pop[url] = (pop[url] || 0) + 1;
      localStorage.setItem(POP_KEY, JSON.stringify(pop));
    } catch {}
  }
  function logQuery(q) {
    try {
      const raw = localStorage.getItem(QRY_KEY);
      const obj = JSON.parse(raw || '{}');
      obj[q] = (obj[q] || 0) + 1;
      localStorage.setItem(QRY_KEY, JSON.stringify(obj));
    } catch {}
  }

  async function buildIndex() {
    if (INDEX_READY || INDEX_BUILDING) return;
    INDEX_BUILDING = true;
    try {
      const cached = localStorage.getItem(IDX_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          INDEX = parsed;
          INDEX_READY = true;
          INDEX_BUILDING = false;
          return;
        }
      }
    } catch {}
    const results = [];
    for (const p of PAGES) {
      try {
        const res = await fetch(p.url, { cache: 'no-cache' });
        const html = await res.text();
        const text = strip(html);
        let title = p.title;
        const m = html.match(/<title>([^<]+)<\/title>/i);
        if (m && m[1]) title = m[1];
        results.push({
          url: p.url,
          title,
          tags: p.tags || [],
          type: mapType(p.url),
          content: text,
          updated: Date.now()
        });
      } catch {}
    }
    INDEX = results;
    INDEX_READY = true;
    INDEX_BUILDING = false;
    try { localStorage.setItem(IDX_KEY, JSON.stringify(INDEX)); } catch {}
  }

  function rank(entry, queryParsed, pop) {
    let score = 0;
    const title = entry.title.toLowerCase();
    const tags = entry.tags.map(t => t.toLowerCase());
    const content = entry.content.toLowerCase();
    queryParsed.include.forEach(tok => {
      if (typeof tok === 'string') {
        if (title.includes(tok)) score += 6;
        if (tags.some(t => t.includes(tok))) score += 4;
        if (content.includes(tok)) score += 3;
        const fields = [title, ...tags, content.slice(0, 2000)];
        const d = Math.min(...fields.map(f => editDistance(f.slice(0, 64), tok)));
        if (d <= 2) score += (3 - d);
        if ([title, ...tags].some(s => s.startsWith(tok))) score += 2;
      } else if (tok.phrase) {
        if (content.includes(tok.phrase)) score += 5;
        if (title.includes(tok.phrase)) score += 7;
      }
    });
    queryParsed.exclude.forEach(tok => {
      if (title.includes(tok) || content.includes(tok)) score -= 5;
    });
    if (queryParsed.operator === 'OR') score += 1;
    const quality = Math.min(1, entry.content.length / 2000);
    score += quality;
    const popularity = (pop[entry.url] || 0);
    score += Math.min(5, popularity * 0.5);
    return score;
  }

  function snippet(entry, q) {
    const text = entry.content;
    const lower = text.toLowerCase();
    let idx = -1;
    for (const s of q.include) {
      const token = typeof s === 'string' ? s : s.phrase;
      if (!token) continue;
      const i = lower.indexOf(token.toLowerCase());
      if (i >= 0) { idx = i; break; }
    }
    if (idx < 0) idx = 0;
    const start = Math.max(0, idx - 80);
    const end = Math.min(text.length, idx + 160);
    const chunk = text.slice(start, end);
    return (start > 0 ? '…' : '') + chunk + (end < text.length ? '…' : '');
  }

  function search(query, filters) {
    const tokens = tokenize(query);
    if (tokens.length === 0 && !INDEX_READY) return [];
    const pop = loadPopularity();
    if (!INDEX_READY) {
      const results = PAGES
        .map(p => ({ ...p, _score: scoreEntry(p, tokens) }))
        .filter(p => p._score > 0)
        .sort((a,b) => b._score - a._score || a.title.localeCompare(b.title));
      return results.map(r => ({ url: r.url, title: r.title, tags: r.tags, type: mapType(r.url), excerpt: r.tags.slice(0,3).join(' • ') }));
    }
    const qp = parseQuery(query);
    const res = INDEX.map(e => {
      const s = rank(e, qp, pop);
      return { ...e, _score: s };
    }).filter(e => e._score > 0);
    let filtered = res;
    if (filters && filters.type && filters.type !== 'All') {
      filtered = filtered.filter(e => e.type === filters.type);
    }
    if (filters && filters.sort === 'Newest') {
      filtered = filtered.sort((a,b) => (b.updated || 0) - (a.updated || 0));
    } else if (filters && filters.sort === 'Popular') {
      filtered = filtered.sort((a,b) => (pop[b.url] || 0) - (pop[a.url] || 0));
    } else {
      filtered = filtered.sort((a,b) => b._score - a._score || a.title.localeCompare(b.title));
    }
    return filtered.map(e => ({
      url: e.url,
      title: e.title,
      type: e.type,
      excerpt: snippet(e, qp),
      _score: e._score
    }));
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = JSON.parse(raw || '[]');
      if (!Array.isArray(arr)) return [];
      return arr.slice(0, 10);
    } catch { return []; }
  }
  function saveHistory(q) {
    if (!q) return;
    const arr = loadHistory().filter(x => x !== q);
    arr.unshift(q);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, 10)));
    } catch {}
  }

  function createOverlay(anchorEl, results, query, opts = {}) {
    const old = document.getElementById("pw-search-overlay");
    if (old) old.remove();
    const rect = anchorEl.getBoundingClientRect();
    const overlay = document.createElement("div");
    overlay.id = "pw-search-overlay";
    overlay.style.position = "fixed";
    overlay.style.left = (rect.left) + "px";
    overlay.style.top = (rect.bottom + 6) + "px";
    overlay.style.width = (rect.width) + "px";
    overlay.style.maxWidth = "40rem";
    overlay.style.zIndex = "1000";
    overlay.style.background = "#ffffff";
    overlay.style.border = "1px solid #e5e7eb";
    overlay.style.borderRadius = "0.75rem";
    overlay.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
    overlay.style.padding = "0.5rem";

    overlay.setAttribute("role", "listbox");
    overlay.setAttribute("aria-label", "Search suggestions");

    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.gap = "0.5rem";
    controls.style.padding = "0.25rem 0.5rem";
    const typeSel = document.createElement("select");
    typeSel.setAttribute("aria-label", "Filter by type");
    ['All','Apparel','Vehicle','Signs','DTF','Stickers','Info','Home'].forEach(t => {
      const o = document.createElement("option");
      o.value = t; o.textContent = t;
      typeSel.appendChild(o);
    });
    typeSel.value = (opts.filters && opts.filters.type) || 'All';
    const sortSel = document.createElement("select");
    sortSel.setAttribute("aria-label", "Sort");
    ['Best match','Popular','Newest'].forEach(t => {
      const o = document.createElement("option");
      o.value = t === 'Best match' ? 'Best' : t;
      o.textContent = t;
      sortSel.appendChild(o);
    });
    sortSel.value = (opts.filters && opts.filters.sort) || 'Best';
    controls.appendChild(typeSel);
    controls.appendChild(sortSel);
    overlay.appendChild(controls);

    const list = document.createElement("div");
    list.setAttribute("role", "presentation");
    list.style.maxHeight = "18rem";
    list.style.overflowY = "auto";

    const spinner = document.createElement("div");
    spinner.style.display = opts.loading ? "flex" : "none";
    spinner.style.alignItems = "center";
    spinner.style.justifyContent = "center";
    spinner.style.padding = "0.75rem";
    spinner.innerHTML = '<div style="width:20px;height:20px;border:2px solid #e5e7eb;border-top-color:#FF4500;border-radius:9999px;animation: pwspin 1s linear infinite"></div>';
    overlay.appendChild(spinner);

    const style = document.createElement("style");
    style.textContent = '@keyframes pwspin{to{transform:rotate(360deg)}}';
    overlay.appendChild(style);

    const items = results.length > 0 ? results.slice(0, SUGGESTION_LIMIT) : [];
    if (!opts.loading) {
      if (items.length === 0 && !query) {
        const hist = loadHistory();
        const title = document.createElement("div");
        title.textContent = "Recent searches";
        title.style.fontSize = "0.75rem";
        title.style.color = "#6b7280";
        title.style.padding = "0.5rem 0.75rem";
        list.appendChild(title);
        hist.forEach(h => {
          const item = document.createElement("button");
          item.type = "button";
          item.textContent = h;
          item.setAttribute("role", "option");
          item.style.display = "block";
          item.style.width = "100%";
          item.style.textAlign = "left";
          item.style.padding = "0.5rem 0.75rem";
          item.style.borderRadius = "0.5rem";
          item.style.color = "#111827";
          item.addEventListener("mouseover", () => item.style.background = "#f3f4f6");
          item.addEventListener("mouseout", () => item.style.background = "transparent");
          item.addEventListener("click", () => {
            anchorEl.value = h;
            const res = search(h, { type: typeSel.value, sort: sortSel.value });
            createOverlay(anchorEl, res, h, { filters: { type: typeSel.value, sort: sortSel.value } });
          });
          list.appendChild(item);
        });
      } else if (items.length === 0 && query) {
        const empty = document.createElement("div");
        empty.textContent = `No results for "${query}"`;
        empty.style.padding = "0.5rem 0.75rem";
        empty.style.color = "#6b7280";
        list.appendChild(empty);
      } else {
        let index = -1;
        items.forEach((r, i) => {
          const item = document.createElement("a");
          item.href = r.url;
          const top = document.createElement("div");
          top.style.display = "flex";
          top.style.alignItems = "center";
          top.style.justifyContent = "space-between";
          const title = document.createElement("div");
          title.textContent = r.title;
          const chip = document.createElement("span");
          chip.textContent = r.type || '';
          chip.style.fontSize = "0.75rem";
          chip.style.color = "#6b7280";
          top.appendChild(title);
          top.appendChild(chip);
          const urlEl = document.createElement("div");
          urlEl.textContent = r.url;
          urlEl.style.fontSize = "0.75rem";
          urlEl.style.color = "#6b7280";
          const excerpt = document.createElement("div");
          excerpt.textContent = r.excerpt || '';
          item.setAttribute("role", "option");
          item.setAttribute("aria-selected", "false");
          item.style.display = "block";
          item.style.padding = "0.5rem 0.75rem";
          item.style.borderRadius = "0.5rem";
          item.style.color = "#111827";
          item.style.textDecoration = "none";
          item.addEventListener("mouseover", () => item.style.background = "#f3f4f6");
          item.addEventListener("mouseout", () => item.style.background = "transparent");
          item.appendChild(top);
          item.appendChild(urlEl);
          item.appendChild(excerpt);
          item.addEventListener("click", () => bumpPopularity(r.url));
          list.appendChild(item);
        });
        function updateSelection(newIndex) {
          const children = Array.from(list.querySelectorAll('[role="option"]'));
          children.forEach((el, idx) => {
            el.setAttribute("aria-selected", idx === newIndex ? "true" : "false");
            el.style.background = idx === newIndex ? "#f3f4f6" : "transparent";
          });
        }
        anchorEl.addEventListener("keydown", function onKey(e) {
          const children = Array.from(list.querySelectorAll('[role="option"]'));
          if (e.key === "ArrowDown") {
            e.preventDefault();
            index = Math.min(index + 1, children.length - 1);
            updateSelection(index);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            index = Math.max(index - 1, 0);
            updateSelection(index);
          } else if (e.key === "Enter" && index >= 0) {
            e.preventDefault();
            const target = children[index];
            if (target && target.tagName === 'A') window.location.href = target.href;
          } else if (e.key === "Escape") {
            overlay.remove();
          }
        }, { once: true });
      }
    }

    overlay.appendChild(list);
    document.body.appendChild(overlay);

    typeSel.addEventListener('change', () => {
      const res = search(query, { type: typeSel.value, sort: sortSel.value });
      createOverlay(anchorEl, res, query, { filters: { type: typeSel.value, sort: sortSel.value } });
    });
    sortSel.addEventListener('change', () => {
      const res = search(query, { type: typeSel.value, sort: sortSel.value });
      createOverlay(anchorEl, res, query, { filters: { type: typeSel.value, sort: sortSel.value } });
    });

    function closeOverlayOnOutside(e) {
      if (!overlay.contains(e.target) && e.target !== anchorEl) {
        overlay.remove();
        document.removeEventListener("click", closeOverlayOnOutside);
      }
    }
    setTimeout(() => {
      document.addEventListener("click", closeOverlayOnOutside);
    }, 0);
  }

  function attachSearch(input, button) {
    const anchor = input.closest("div") || input;
    let debounceTimer = null;
    let currentFilters = { type: 'All', sort: 'Best' };

    async function fetchBackend(q) {
      try {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 4500);
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error('Search API error ' + res.status);
        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : (data.results || []))
          .map(r => ({
            url: r.url || '#',
            title: r.title || 'Untitled',
            type: r.type || mapType(r.url || ''),
            excerpt: r.excerpt || ''
          }));
        return mapped;
      } catch (e) {
        return null;
      }
    }

    function showLoading() {
      const container = anchor.classList;
      if (container) container.add('pw-loading');
      createOverlay(anchor, [], input.value.trim(), { loading: true });
      const sp = anchor.querySelector('[aria-hidden="true"]');
      if (sp) sp.style.display = 'block';
    }
    async function runSearch() {
      const t0 = performance.now();
      const q = input.value.trim();
      logQuery(q);
      if (!q) {
        const container = anchor.classList;
        if (container) container.remove('pw-loading');
        createOverlay(anchor, [], q, { loading: false });
        const sp = anchor.querySelector('[aria-hidden="true"]');
        if (sp) sp.style.display = 'none';
        return;
      }
      let results = await fetchBackend(q);
      if (!results || results.length === 0) {
        results = search(q, currentFilters);
      }
      const t1 = performance.now();
      try { console.debug('[search] latency(ms)=', Math.round(t1 - t0)); } catch {}
      saveHistory(q);
      const container = anchor.classList;
      if (container) container.remove('pw-loading');
      createOverlay(anchor, results, q, { loading: false, filters: currentFilters });
      const sp = anchor.querySelector('[aria-hidden="true"]');
      if (sp) sp.style.display = 'none';
      if (results.length === 1) {
      }
    }
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
      } else if (e.key === "Escape") {
        const old = document.getElementById("pw-search-overlay");
        if (old) old.remove();
        input.blur();
      }
    });
    input.addEventListener("input", function() {
      clearTimeout(debounceTimer);
      showLoading();
      debounceTimer = setTimeout(runSearch, DEBOUNCE_MS);
    });
    if (button) {
      button.addEventListener("click", function(e) {
        e.preventDefault();
        input.focus();
        showLoading();
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(runSearch, DEBOUNCE_MS);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    const inputs = Array.from(document.querySelectorAll('input[placeholder="Search"]'));
    buildIndex();
    inputs.forEach(input => {
      // find sibling button
      const wrapper = input.parentElement;
      let button = null;
      if (wrapper) {
        button = wrapper.querySelector("button");
      }
      attachSearch(input, button);
    });
    // Expose for unit tests
    try {
      window.PW_SEARCH = {
        buildIndex,
        search: (q, f) => search(q, f || { type: 'All', sort: 'Best' }),
        parseQuery,
        normalizeToken,
        editDistance
      };
    } catch {}
  });
  window.addEventListener('pw-header-loaded', function() {
    const inputs = Array.from(document.querySelectorAll('input[placeholder="Search"]'));
    inputs.forEach(input => {
      const wrapper = input.parentElement;
      let button = null;
      if (wrapper) {
        button = wrapper.querySelector("button");
      }
      attachSearch(input, button);
    });
  });
})();
