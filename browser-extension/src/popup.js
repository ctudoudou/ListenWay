// Popup script for ListenWay browser extension

document.addEventListener('DOMContentLoaded', () => {
  const actionBtn = document.getElementById('actionBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const status = document.getElementById('status');

  // Action button handler
  actionBtn.addEventListener('click', async () => {
    status.textContent = 'Status: Executing action...';
    
    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'executeAction',
        data: { timestamp: Date.now() }
      });
      
      status.textContent = 'Status: Action completed!';
    } catch (error) {
      status.textContent = 'Status: Error occurred';
      console.error('Error:', error);
    }
  });

  // Settings button handler
  settingsBtn.addEventListener('click', () => {
    status.textContent = 'Status: Opening settings...';
    
    // Open options page or handle settings
    chrome.runtime.openOptionsPage?.() || 
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  });

  // Initialize popup
  status.textContent = 'Status: Ready';
});