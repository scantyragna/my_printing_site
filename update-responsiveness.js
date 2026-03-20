const fs = require('fs');
const path = require('path');

const directory = '.';
const files = fs.readdirSync(directory).filter(f => f.endsWith('.html') && f !== 'header.html' && f !== 'footer.html' && f !== 'external_site.html');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace px-15 with content-section
    content = content.replace(/class="max-w-7xl mx-auto px-15 py-0 bg-white\/70 rounded-2xl shadow-sm"/g, 'class="content-section shadow-sm"');
    content = content.replace(/class="max-w-7xl mx-auto px-15 py-8 bg-white\/70 rounded-2xl shadow-sm mt-4"/g, 'class="content-section shadow-sm mt-4"');
    
    // Replace old title bar
    const oldTitleBarRegex = /<div class="w-full flex items-center justify-center text-\[var\(--title-text\)\] text-3xl font-extrabold tracking-wide" style="height: 110px; background: var\(--title-bg\); border-bottom: 2px solid var\(--accent\);">/g;
    content = content.replace(oldTitleBarRegex, '<div class="page-title-bar">');

    // Replace other px-15 instances
    content = content.replace(/\bpx-15\b/g, 'px-4 md:px-8');

    // Update favicon to use original logo.png
    if (content.includes('logo-light.svg')) {
        content = content.replace('type="image/svg+xml" href="assets/images/logo-light.svg"', 'type="image/png" href="assets/images/logo.png"');
    }

    // Replace hardcoded footer with dynamic loader
    if (content.includes('<footer')) {
        const footerRegex = /<footer[\s\S]*?<\/footer>/g;
        content = content.replace(footerRegex, '<div id="main-footer"></div>');
    }

    // Ensure header uses dynamic loader if it has a hardcoded header
    if (content.includes('<header')) {
        const headerRegex = /<header[\s\S]*?<\/header>/g;
        content = content.replace(headerRegex, '<div id="main-header"></div>');
    }

    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
});
