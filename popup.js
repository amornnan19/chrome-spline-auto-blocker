document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('blockSplineToggle');
  
  chrome.storage.sync.get('blockSpline', function(data) {
    toggle.checked = data.blockSpline !== false;
  });

  toggle.addEventListener('change', function() {
    chrome.storage.sync.set({ blockSpline: toggle.checked }, function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "refreshBlocking"});
      });
    });
  });
}); 