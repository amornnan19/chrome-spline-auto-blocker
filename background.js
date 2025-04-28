function updateBlockingRules(shouldBlock) {
  if (shouldBlock) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          id: 1,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "unpkg.com/@splinetool/viewer",
            resourceTypes: ["script"]
          }
        }
      ],
      removeRuleIds: [1]
    });
  } else {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1]
    });
  }
}

chrome.storage.sync.get('blockSpline', (data) => {
  updateBlockingRules(data.blockSpline !== false);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.blockSpline) {
    updateBlockingRules(changes.blockSpline.newValue !== false);
  }
});