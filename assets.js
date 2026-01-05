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
  imgs.forEach(function(img){
    if(!img.hasAttribute("loading")) img.setAttribute("loading","lazy");
    if(!img.hasAttribute("decoding")) img.setAttribute("decoding","async");
  });
});
