// Resource extractor to get direct URLs
// Copy and paste this into your browser console

(function() {
  console.log('Extracting resources from page...');
  
  // Find all resource cards or elements
  const cards = document.querySelectorAll('.card');
  const resources = [];
  
  cards.forEach((card, index) => {
    // Try to find resource ID
    const resourceId = card.getAttribute('data-resource-id') || 
                      card.getAttribute('id') ||
                      card.querySelector('[data-resource-id]')?.getAttribute('data-resource-id');
    
    // Look for a title element
    const titleElement = card.querySelector('h6') || card.querySelector('h5') || card.querySelector('h4');
    const title = titleElement ? titleElement.textContent.trim() : `Resource ${index + 1}`;
    
    resources.push({
      index,
      title,
      element: card,
      resourceId
    });
  });
  
  console.log(`Found ${resources.length} resources on page:`);
  resources.forEach(r => {
    console.log(`${r.index}: ${r.title}${r.resourceId ? ' (ID: ' + r.resourceId + ')' : ' (No ID found)'}`);
  });
  
  // If no resource IDs were found, try to extract all IDs from the page
  if (!resources.some(r => r.resourceId)) {
    console.log('No resource IDs found in cards, trying alternative extraction...');
    
    // Try to extract resource IDs from the page HTML
    const pageHtml = document.documentElement.outerHTML;
    const resourceMatches = pageHtml.match(/resource(Id)?=['"]([a-zA-Z0-9-_]+)['"]/g) || [];
    const resourceIds = [...new Set(resourceMatches.map(m => {
      const match = m.match(/resource(Id)?=['"]([a-zA-Z0-9-_]+)['"]/);
      return match ? match[2] : null;
    }).filter(Boolean))];
    
    console.log(`Extracted ${resourceIds.length} potential resource IDs:`, resourceIds);
    
    // Create direct links to these resources
    console.log('Direct access URLs:');
    resourceIds.forEach(id => {
      console.log(`${window.location.origin}#resource=${id}`);
    });
  }
  
  // Build direct manual URL updater
  console.log('\nManual URL update function - copy and use this:');
  console.log('function openResource(id) { history.pushState({resourceId: id}, "", `#resource=${id}`); console.log(`URL updated to: ${window.location.href}`); }');
  
  // Special fix attempt for title elements
  const titleElements = document.querySelectorAll('h5, h6, .card-title');
  console.log(`\nFound ${titleElements.length} title elements that might be clickable`);
  titleElements.forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.style.color = '#007bff';
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = el.closest('.card');
      console.log(`Title #${i} clicked:`, el.textContent.trim());
      console.log('Parent card:', card);
    });
  });
  
  console.log('\nResource extraction complete.');
})(); 