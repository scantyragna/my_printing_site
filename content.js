document.addEventListener("DOMContentLoaded", function () {
  var keyAttr = "data-edit-key";
  var storageKey = "pw_content_blocks";
  var map = {};

  function loadAll() {
    try {
      var stored = localStorage.getItem(storageKey);
      if (stored) {
        map = JSON.parse(stored);
      } else {
        map = {};
      }
    } catch (e) {
      map = {};
    }
  }

  function saveAll() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(map));
    } catch (e) {}
  }

  function getQueryFlag(name) {
    var params = new URLSearchParams(window.location.search || "");
    return params.get(name) === "1";
  }

  loadAll();

  var nodes = document.querySelectorAll("[" + keyAttr + "]");
  nodes.forEach(function (node) {
    var key = node.getAttribute(keyAttr);
    if (!key) return;
    if (map[key]) {
      node.textContent = map[key];
    }
  });

  if (!getQueryFlag("edit")) {
    return;
  }

  nodes.forEach(function (node) {
    var key = node.getAttribute(keyAttr);
    if (!key) return;
    node.setAttribute("contenteditable", "true");
    node.addEventListener("blur", function () {
      var value = node.textContent;
      map[key] = value;
      saveAll();
    });
  });
});

