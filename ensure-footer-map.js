const fs = require('fs');
const path = require('path');

const root = __dirname;
const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));

const MAP_SNIPPET_MARKER = 'google.com/maps/embed';
const FOOTER_PLACEHOLDER = '<div id="main-footer"></div>';
const LAYOUT_LOADER = '<script src="assets/js/layout.js">';

function hasMap(content) {
  return content.includes(MAP_SNIPPET_MARKER);
}

function hasFooterPlaceholder(content) {
  return content.includes('id="main-footer"');
}

function hasLayoutLoader(content) {
  return content.includes(LAYOUT_LOADER);
}

function ensureFooter(file) {
  let content = fs.readFileSync(file, 'utf8');
  const bodyOpen = content.match(/<body[^>]*>/i);
  const bodyCloseIndex = content.lastIndexOf('</body>');

  if (!bodyOpen || bodyCloseIndex === -1) {
    console.log(`Skipping ${file}: missing <body> or </body>.`);
    return;
  }

  const alreadyHasMap = hasMap(content);
  const hasPlaceholder = hasFooterPlaceholder(content);
  const hasLoader = hasLayoutLoader(content);

  let changed = false;

  if (!alreadyHasMap && !hasPlaceholder) {
    // Insert placeholder just before closing body
    content = content.slice(0, bodyCloseIndex) + '\n' + FOOTER_PLACEHOLDER + '\n' + content.slice(bodyCloseIndex);
    changed = true;
    console.log(`Inserted footer placeholder in ${file}`);
  }

  if (!hasLoader) {
    // Insert layout loader after placeholder or before closing body
    const insertIndex = content.indexOf(FOOTER_PLACEHOLDER) !== -1
      ? content.indexOf(FOOTER_PLACEHOLDER) + FOOTER_PLACEHOLDER.length
      : bodyCloseIndex;
    content = content.slice(0, insertIndex) + '\n<script src="assets/js/layout.js"></script>\n' + content.slice(insertIndex);
    changed = true;
    console.log(`Inserted layout loader in ${file}`);
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  } else {
    console.log(`No changes needed for ${file}`);
  }
}

for (const f of files) {
  if (f.startsWith('components') || f === 'admin.html' || f === 'external_site.html') continue;
  ensureFooter(path.join(root, f));
}

console.log('Footer map ensure completed.');
