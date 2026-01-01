// Simple client-side search for pages and keywords
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

  function tokenize(str) {
    return str.toLowerCase().trim().split(/\s+/).filter(Boolean);
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
    });
    return score;
  }

  function search(query) {
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];
    const results = PAGES
      .map(p => ({ ...p, _score: scoreEntry(p, tokens) }))
      .filter(p => p._score > 0)
      .sort((a,b) => b._score - a._score || a.title.localeCompare(b.title));
    return results;
  }

  function createOverlay(anchorEl, results, query) {
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

    const list = document.createElement("div");
    list.setAttribute("role", "listbox");
    list.style.maxHeight = "18rem";
    list.style.overflowY = "auto";

    if (results.length === 0) {
      const empty = document.createElement("div");
      empty.textContent = `No results for "${query}"`;
      empty.style.padding = "0.5rem 0.75rem";
      empty.style.color = "#6b7280";
      list.appendChild(empty);
    } else {
      results.slice(0, 8).forEach(r => {
        const item = document.createElement("a");
        item.href = r.url;
        item.textContent = r.title;
        item.style.display = "block";
        item.style.padding = "0.5rem 0.75rem";
        item.style.borderRadius = "0.5rem";
        item.style.color = "#111827";
        item.style.textDecoration = "none";
        item.addEventListener("mouseover", () => {
          item.style.background = "#f3f4f6";
        });
        item.addEventListener("mouseout", () => {
          item.style.background = "transparent";
        });
        const sub = document.createElement("div");
        sub.textContent = r.tags.slice(0,3).join(" • ");
        sub.style.fontSize = "0.75rem";
        sub.style.color = "#6b7280";
        item.appendChild(sub);
        list.appendChild(item);
      });
    }

    overlay.appendChild(list);
    document.body.appendChild(overlay);

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
    function runSearch() {
      const q = input.value.trim();
      const results = search(q);
      if (results.length === 1) {
        window.location.href = results[0].url;
        return;
      }
      if (results.length > 0) {
        createOverlay(input.closest("div") || input, results, q);
      } else {
        createOverlay(input.closest("div") || input, [], q);
      }
    }
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
      }
    });
    if (button) {
      button.addEventListener("click", function(e) {
        e.preventDefault();
        runSearch();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    const inputs = Array.from(document.querySelectorAll('input[placeholder="Search"]'));
    inputs.forEach(input => {
      // find sibling button
      const wrapper = input.parentElement;
      let button = null;
      if (wrapper) {
        button = wrapper.querySelector("button");
      }
      attachSearch(input, button);
    });
  });
})();
