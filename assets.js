const assetBaseMap = {
  header: "/assets/images/header/",
  content: "/assets/images/content/",
  products: "/assets/images/products/",
  backgrounds: "/assets/images/backgrounds/",
  icons: "/assets/images/icons/"
};

function assetPath(type, filename) {
  const base = assetBaseMap[type];
  if (!base) return filename;
  return base + filename;
}

document.addEventListener("DOMContentLoaded", function () {
  const nodes = document.querySelectorAll("[data-asset-type][data-asset-file]");
  nodes.forEach(function (node) {
    const type = node.getAttribute("data-asset-type");
    const file = node.getAttribute("data-asset-file");
    const resolved = assetPath(type, file);
    if (resolved) {
      node.setAttribute("src", resolved);
    }
  });
  const imgs = document.querySelectorAll("img");
  const svgFallback='data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="%23e5e7eb"/><stop offset="1" stop-color="%23d1d5db"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><text x="50%" y="50%" text-anchor="middle" fill="%236b7280" font-family="Arial, sans-serif" font-size="48">Image unavailable</text></svg>';
  imgs.forEach(function(img){
    if(!img.hasAttribute("loading")) img.setAttribute("loading","lazy");
    if(!img.hasAttribute("decoding")) img.setAttribute("decoding","async");
    img.classList.add("transition","duration-300","ease-out");
    if (!img.complete){
      img.classList.add("opacity-0","scale-[0.98]");
    }
    img.addEventListener("load", function(){
      img.classList.remove("opacity-0","scale-[0.98]");
    }, { once:true });
    img.addEventListener("error", function(){
      img.src = svgFallback;
      img.classList.remove("object-cover");
      img.classList.add("object-contain");
      img.classList.remove("opacity-0");
    }, { once:true });
  });
  const groups = document.querySelectorAll("a.group, div.group, section.group");
  groups.forEach(function(group){
    const gImgs = group.querySelectorAll("img");
    gImgs.forEach(function(img){
      img.classList.add("group-hover:scale-105","group-hover:brightness-90");
    });
  });
});
