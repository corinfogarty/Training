// URL handling test script
// Copy and paste this into your browser console on the site to check hash changes

console.log('Starting URL handling test...');

// Test 1: Direct hash change
console.log('Test 1: Direct hash change');
console.log('Current hash:', window.location.hash);
window.location.hash = 'resource=test1';
console.log('Hash after setting:', window.location.hash);

// Test 2: State-based URL update
console.log('Test 2: State-based URL update');
const currentUrl = window.location.href.split('#')[0];
history.replaceState(null, '', currentUrl + '#resource=test2');
console.log('URL after history.replaceState:', window.location.href);

// Test 3: Check event listeners
console.log('Test 3: Check hash change events');
const originalAddEventListener = window.addEventListener;
const events = [];

window.addEventListener = function(type, listener, options) {
  if (type === 'hashchange' || type === 'popstate') {
    console.log(`Event listener registered for ${type}`);
    events.push({type, listener});
  }
  return originalAddEventListener.call(this, type, listener, options);
};

console.log('Active event listeners for URL changes:', events.length);

// Test 4: Try to trigger a click on a resource card
console.log('Test 4: Simulate a resource card click');
const resourceCards = document.querySelectorAll('.card');
if (resourceCards.length > 0) {
  console.log(`Found ${resourceCards.length} resource cards`);
  console.log('Clicking the first card...');
  resourceCards[0].click();
} else {
  console.log('No resource cards found on the page');
}

// Test 5: Check for middleware or other script interference
console.log('Test 5: Check for URL rewriting');
const scripts = Array.from(document.getElementsByTagName('script'));
console.log(`Found ${scripts.length} scripts on the page`);
const relevantScripts = scripts.filter(s => 
  s.src && (s.src.includes('router') || s.src.includes('url') || s.src.includes('navigation'))
);
console.log('Scripts that might affect URL handling:', relevantScripts.map(s => s.src));

console.log('URL handling test complete. Copy these results to share with the developer.'); 