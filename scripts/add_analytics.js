const fs = require('fs');
const path = require('path');

// Path to the Next.js server HTML file
const serverHtmlPath = path.join(__dirname, '../.next/server/pages');
const staticHtmlPath = path.join(__dirname, '../.next/static/chunks');

// Google Analytics code
const googleAnalyticsCode = `
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-RPHM2B4SNB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-RPHM2B4SNB');
</script>
`;

// Function to recursively find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to inject Google Analytics into HTML files
function injectGoogleAnalytics(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has Google Analytics
    if (content.includes('G-RPHM2B4SNB')) {
      console.log(`${filePath} already has Google Analytics code.`);
      return;
    }
    
    // Insert Google Analytics code before </head>
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${googleAnalyticsCode}\n</head>`);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Added Google Analytics to ${filePath}`);
    } else {
      console.log(`❌ No </head> tag found in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Main function
async function main() {
  try {
    // Check if the directories exist
    if (fs.existsSync(serverHtmlPath)) {
      const htmlFiles = findHtmlFiles(serverHtmlPath);
      htmlFiles.forEach(file => injectGoogleAnalytics(file));
    } else {
      console.log(`Directory not found: ${serverHtmlPath}`);
    }
    
    if (fs.existsSync(staticHtmlPath)) {
      const staticFiles = findHtmlFiles(staticHtmlPath);
      staticFiles.forEach(file => injectGoogleAnalytics(file));
    } else {
      console.log(`Directory not found: ${staticHtmlPath}`);
    }
    
    console.log('Google Analytics injection completed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 