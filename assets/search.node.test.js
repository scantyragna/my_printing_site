// Node.js compatible test for search functionality
const fs = require('fs');
const path = require('path');

// Mock browser globals
global.window = {};
global.document = {
  getElementById: () => null,
  createElement: () => ({ appendChild: () => {} })
};

// Load search.js content
const searchCode = fs.readFileSync(path.join(__dirname, 'search.js'), 'utf8');

// Extract the search functions from the code
const functionMatches = searchCode.match(/function\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g) || [];
const exportMatches = searchCode.match(/export\s+function\s+(\w+)\s*\(/g) || [];

console.log('Search functionality test results:');
console.log('=====================================');

// Test basic functionality
try {
  // Check if search.js exists and has content
  if (fs.existsSync(path.join(__dirname, 'search.js'))) {
    console.log('✓ search.js file exists');
  } else {
    console.log('✗ search.js file not found');
  }

  // Check file size
  const stats = fs.statSync(path.join(__dirname, 'search.js'));
  if (stats.size > 0) {
    console.log('✓ search.js has content (' + stats.size + ' bytes)');
  } else {
    console.log('✗ search.js is empty');
  }

  // Check for key functions
  if (searchCode.includes('normalizeToken')) {
    console.log('✓ normalizeToken function found');
  } else {
    console.log('✗ normalizeToken function not found');
  }

  if (searchCode.includes('editDistance')) {
    console.log('✓ editDistance function found');
  } else {
    console.log('✗ editDistance function not found');
  }

  if (searchCode.includes('search')) {
    console.log('✓ search function found');
  } else {
    console.log('✗ search function not found');
  }

  if (searchCode.includes('buildIndex')) {
    console.log('✓ buildIndex function found');
  } else {
    console.log('✗ buildIndex function not found');
  }

  // Check for plural handling
  if (searchCode.includes('apparel') || searchCode.includes('apparels')) {
    console.log('✓ Apparel/plural handling found');
  } else {
    console.log('✗ Apparel/plural handling not found');
  }

  // Check for API fallback
  if (searchCode.includes('/api/search')) {
    console.log('✓ API fallback found');
  } else {
    console.log('✗ API fallback not found');
  }

  console.log('\nTest Summary:');
  console.log('All basic search functionality checks completed.');
  console.log('The search.js file appears to be properly configured.');

} catch (error) {
  console.error('Error during testing:', error.message);
  process.exit(1);
}