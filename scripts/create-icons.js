// Simple Node.js script to create placeholder PNG icons
// Run with: node scripts/create-icons.js

const fs = require('fs');
const path = require('path');

// Create a simple SVG that we'll save as PNG placeholder
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1A73E8"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.5}" 
        fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
    G
  </text>
</svg>
`;

const iconsDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create SVG files (as placeholders until you create proper PNGs)
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.svg'), createSVGIcon(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.svg'), createSVGIcon(512));

console.log('✅ Placeholder icon files created!');
console.log('📝 Note: These are SVG placeholders. For production, create proper PNG icons using:');
console.log('   - https://www.pwabuilder.com/imageGenerator');
console.log('   - Or open scripts/generate-icons.html in your browser');
