let observer = null;

function removeSplineElements() {
  const allElements = document.querySelectorAll('*');
  allElements.forEach((element) => {
    const tagName = element.tagName.toLowerCase();
    const className = String(element.className || '').toLowerCase();
    const idName = String(element.id || '').toLowerCase();
    const dataSpline = element.getAttribute('data-spline');
    const splineScene = element.getAttribute('spline-scene');

    const isSplineRelated =
      className.includes('spline') ||
      idName.includes('spline') ||
      (element.src && element.src.includes('spline.design')) ||
      dataSpline !== null ||
      splineScene !== null;

    if (isSplineRelated) {
      console.log('Removing spline element:', element);
      element.remove();
    }
  });
}

function initSplineBlocker() {
  chrome.storage.sync.get('blockSpline', (data) => {
    if (data.blockSpline === false) {
      console.log('Spline blocking is disabled.');
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      return;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', removeSplineElements);
    } else {
      removeSplineElements();
    }

    if (!observer) {
      observer = new MutationObserver((mutationsList) => {
        chrome.storage.sync.get('blockSpline', (data) => {
          if (data.blockSpline !== false) {
            for (const mutation of mutationsList) {
              if (mutation.type === 'childList') {
                removeSplineElements();
              }
            }
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "refreshBlocking") {
    chrome.storage.sync.get('blockSpline', (data) => {
      if (data.blockSpline === false) {
        console.log('Spline blocking is disabled.');
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      } else {
        if (!observer) {
          initSplineBlocker();
        } else {
          removeSplineElements();
        }
      }
    });
  }
});

initSplineBlocker();