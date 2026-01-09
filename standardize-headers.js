const fs = require('fs');
const path = require('path');

// The exact header structure from index.html
const exactHeader = `<div id="main-header"></div>

<!-- HERO CAROUSEL -->
<!-- Include Swiper CSS -->
<link
  rel="stylesheet"
  href="assets/vendor/swiper-bundle.min.css"
/>

<section class="max-w-9xl mx-auto px-16 py-4">
  <div class="swiper mySwiper rounded-2xl overflow-hidden shadow-lg">
    <div class="swiper-wrapper">

      <!-- Slide 1 -->
      <div class="swiper-slide relative">
        <img src="images/hero/stickers-slide.jpg" alt="Custom Stickers" class="w-full h-96 object-cover">
        <div class="absolute inset-0 bg-black/70 flex flex-col justify-center items-start p-8 space-y-4">
          <h2 class="text-3xl md:text-4xl font-extrabold text-white">Order High Quality Custom Printed Stickers</h2>
          <p class="text-white max-w-xl">Join the growing number of small businesses telling their own stories with affordable custom vehicle wraps and graphics today!</p>
          <div class="flex gap-4">
            <a href="stickers.html"  class="bg-[var(--pw-mid)] hover:bg-[var(--pw-dark)] text-white font-bold px-6 py-3 rounded uppercase tracking-wider transition-colors border-2 border-[var(--pw-mid)] hover:border-[var(--pw-dark)]">STICKERS</a>
            <a href="contact.html" class="bg-transparent hover:bg-[var(--pw-mid)] text-white font-bold px-6 py-3 rounded border-2 border-white hover:border-[var(--pw-mid)] uppercase tracking-wider transition-colors">REQUEST A QUOTE</a>
          </div>
        </div>
      </div>
       

      <!-- Slide 2 -->
      <div class="swiper-slide relative">
        <img src="images/hero/vehicle-wraps.jpg" alt="Vehicle Wraps" class="w-full h-96 object-cover">
        <div class="absolute inset-0 bg-black/70 flex flex-col justify-center items-start p-8 space-y-4">
          <h2 class="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wide">Premium Vehicle Wraps & Graphics</h2>
          <p class="text-white max-w-xl text-lg">Stand out on the road with our high-quality custom vehicle wraps for advertising and branding.</p>
          <a href="vehicle_wraps.html" class="bg-[var(--pw-mid)] hover:bg-[var(--pw-dark)] text-white font-bold px-6 py-3 rounded uppercase tracking-wider transition-colors border-2 border-[var(--pw-mid)] hover:border-[var(--pw-dark)]">LEARN MORE</a>
        </div>
      </div>

      <!-- Slide 3 -->
      <div class="swiper-slide relative">
        <img src="images/hero/apparel-slide.jpg" alt="Branded Apparel" class="w-full h-96 object-cover">
        <div class="absolute inset-0 bg-black/70 flex flex-col justify-center items-start p-8 space-y-4">
          <h2 class="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wide">Branded Apparel for Your Business</h2>
          <p class="text-white max-w-xl text-lg">Elevate your brand with high-quality custom apparel and direct-to-film printing services.</p>
          <a href="apparel.html" class="bg-[var(--pw-mid)] hover:bg-[var(--pw-dark)] text-white font-bold px-6 py-3 rounded uppercase tracking-wider transition-colors border-2 border-[var(--pw-mid)] hover:border-[var(--pw-dark)]">SHOP APPAREL</a>
        </div>
      </div>

      <!-- Add more slides similarly -->

    </div>
    <!-- Navigation -->
    <div class="swiper-button-next text-white"></div>
    <div class="swiper-button-prev text-white"></div>
    <!-- Pagination -->
    <div class="swiper-pagination"></div>
  </div>
</section>

<!-- Include Swiper JS -->
<script src="assets/vendor/swiper-bundle.min.js"></script>
<script>
  const swiper = new Swiper('.mySwiper', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
</script>`;

// All HTML files to update (excluding index.html and component files)
const filesToUpdate = [
  'about.html', 'contact.html', 'services.html', 'faqs.html', 'portfolio.html',
  'workwear.html', 'womens.html', 'windowgraphics.html', 'vehicle_wraps.html',
  'unisex-tshirts.html', 'sweatshirts.html', 'youth.html', 'decals.html', 'dtf.html',
  'embroidery.html', 'hats.html', 'patches.html', 'jackets.html', 'posters.html',
  'polos.html', 'souvenirs.html', 'stationary.html', 'banners.html', 'promo-printing.html',
  'menus.html', 'digitalmenus.html', 'bestsellers.html', 'apparel.html'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the header section and replace it completely
    const headerStartRegex = /<div id="main-header"><\/div>/;
    const headerEndRegex = /<\/section>\s*(?:<!-- HERO|<!-- [A-Z])/;
    
    if (headerStartRegex.test(content)) {
      // Find where the header section ends
      const headerStart = content.indexOf('<div id="main-header"></div>');
      let headerEnd = content.indexOf('</section>', headerStart);
      
      if (headerEnd > -1) {
        // Find the next section start
        const nextSection = content.indexOf('<!--', headerEnd);
        if (nextSection > -1) {
          headerEnd = nextSection;
        } else {
          headerEnd = content.indexOf('<main', headerEnd);
          if (headerEnd === -1) {
            headerEnd = content.indexOf('<section', headerEnd + 10);
          }
        }
        
        // Replace the entire header section
        const beforeHeader = content.substring(0, headerStart);
        const afterHeader = content.substring(headerEnd);
        
        content = beforeHeader + exactHeader + afterHeader;
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated header in: ${file}`);
      }
    } else {
      console.log(`No main-header found in: ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('Header standardization complete!');