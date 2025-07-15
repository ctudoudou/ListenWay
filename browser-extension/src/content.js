// Content script for ListenWay browser extension

// Initialize content script
console.log('ListenWay content script loaded');

// Function to communicate with background script
function sendMessageToBackground(action, data) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action, data }, (response) => {
      resolve(response);
    });
  });
}

// Example: Listen for specific events on the page
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded, ListenWay extension is active');
  
  // Example: Add a floating button or modify page content
  const button = document.createElement('button');
  button.textContent = 'ListenWay';
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 10px;
    background: #007cba;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  `;
  
  button.addEventListener('click', async () => {
    const response = await sendMessageToBackground('getData');
    alert(response.data);
  });
  
  document.body.appendChild(button);
});