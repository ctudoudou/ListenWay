// Background script for ListenWay browser extension

// Extension installation handler
chrome.runtime.onInstalled.addListener(() => {
  console.log('ListenWay extension installed');
});

// Message handler for communication with content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getData') {
    // Handle data requests
    sendResponse({ success: true, data: 'Hello from background!' });
  }
  return true;
});

// Tab update handler
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
  }
});