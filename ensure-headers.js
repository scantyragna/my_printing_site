const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(file => file.endsWith('.html'));

const exclude = ['admin.html', 'external_site.html']; // Maybe exclude these? I'll check them first.
// Actually, let's include everything but be careful.
// Explicitly exclude components folder if I was recursive, but readdirSync('.') is just root.

files.forEach(file => {
  if (file === 'admin.html' || file === 'external_site.html') {
    // Skip for now, or check manually
    return;
  }

  let content = fs.readFileSync(file, 'utf8');
  
  // Check for body
  const bodyMatch = content.match(/<body[^>]*>/i);
  if (!bodyMatch) {
    console.log(`Skipping ${file}: No <body> tag found.`);
    return;
  }

  const headerTag = '<div id="main-header"></div>';
  const hasHeader = content.includes('id="main-header"');

  if (!hasHeader) {
    console.log(`Adding header to ${file}`);
    // Insert after body tag
    const bodyEndIndex = bodyMatch.index + bodyMatch[0].length;
    content = content.slice(0, bodyEndIndex) + '\n\n' + headerTag + content.slice(bodyEndIndex);
    fs.writeFileSync(file, content, 'utf8');
  } else {
    // Check position?
    // If it's already there, we assume it's fine for now, or we can try to move it to the top.
    // The previous script might have left it deep inside if it failed to move.
    // Let's verify if it's "early" in the body.
    
    // Find index of body end
    const bodyEndIndex = bodyMatch.index + bodyMatch[0].length;
    // Find index of header
    const headerIndex = content.indexOf('id="main-header"');
    
    // If header is significantly after body (e.g. > 500 chars), it might be buried.
    // But there could be scripts or comments.
    // A better check is to see if there are visible elements before it.
    
    // Let's just log for now if it's present.
    console.log(`Header already present in ${file}`);
  }
});
