// DIAGNOSTIC SCRIPT - Created at exact timestamp: 1743700003
window.addEventListener('DOMContentLoaded', function() {
  console.log('💡 DIAGNOSTIC SCRIPT RUNNING 💡');
  console.log('This will tell exactly what version you are seeing');
  
  try {
    // Create diagnostic overlay
    const diag = document.createElement('div');
    diag.style.position = 'fixed';
    diag.style.top = '10px';
    diag.style.right = '10px';
    diag.style.backgroundColor = 'red';
    diag.style.color = 'white';
    diag.style.padding = '15px';
    diag.style.borderRadius = '5px';
    diag.style.zIndex = '99999';
    diag.style.maxWidth = '80%';
    diag.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    diag.style.fontSize = '14px';
    diag.style.opacity = '0.9';
    diag.style.pointerEvents = 'none';
    
    // Get information about the page
    const html = document.documentElement.outerHTML.substring(0, 1000);
    const title = document.title || 'No title';
    const timestamp = new Date().toISOString();
    
    // Count resources
    const resourceCards = document.querySelectorAll('.card').length;
    const scripts = document.querySelectorAll('script').length;
    
    // Create diagnostic info
    diag.innerHTML = `
      <h3>DIAGNOSTIC RESULTS</h3>
      <p>Timestamp: ${timestamp}</p>
      <p>Page Title: ${title}</p>
      <p>Script Version: 1743700003</p>
      <p>Resource Cards: ${resourceCards}</p>
      <p>Scripts: ${scripts}</p>
      <p>User Agent: ${navigator.userAgent}</p>
    `;
    
    // Add to body when it's available
    if (document.body) {
      document.body.appendChild(diag);
    } else {
      // If body isn't available yet, wait for it
      const bodyCheckInterval = setInterval(function() {
        if (document.body) {
          document.body.appendChild(diag);
          clearInterval(bodyCheckInterval);
        }
      }, 100);
    }
    
    // Also add click handlers to all resource cards
    document.querySelectorAll('.card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        console.log('📢 DIAGNOSTIC: Card clicked', card);
        
        // Find the heading
        const heading = card.querySelector('h6');
        if (heading) {
          console.log('📢 DIAGNOSTIC: Card title:', heading.textContent);
          
          // Create a diagnostic panel
          const panel = document.createElement('div');
          panel.style.position = 'fixed';
          panel.style.top = '50%';
          panel.style.left = '50%';
          panel.style.transform = 'translate(-50%, -50%)';
          panel.style.backgroundColor = '#333';
          panel.style.color = 'white';
          panel.style.padding = '20px';
          panel.style.borderRadius = '5px';
          panel.style.zIndex = '999999';
          panel.style.maxWidth = '80%';
          panel.style.boxShadow = '0 0 20px rgba(0,0,0,0.7)';
          
          panel.innerHTML = `
            <h3>CARD DIAGNOSTIC</h3>
            <p>Card Title: ${heading.textContent}</p>
            <p>Event Target: ${e.target.tagName}.${e.target.className}</p>
            <p>Card Classes: ${card.className}</p>
            <div style="margin-top: 20px; text-align: center;">
              <button id="diag-close" style="padding: 5px 10px;">Close</button>
            </div>
          `;
          
          document.body.appendChild(panel);
          
          // Add close button handler
          document.getElementById('diag-close').addEventListener('click', function() {
            panel.remove();
          });
          
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    });
    
    console.log('💡 DIAGNOSTIC COMPLETE: If you see this in console, the script is running');
  } catch (err) {
    console.error('💡 DIAGNOSTIC ERROR:', err);
  }
}); 