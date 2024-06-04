let isEnabled = false;

browser.storage.sync.get("isEnabled").then((result) => {
  isEnabled = result.isEnabled !== undefined ? result.isEnabled : false;
  updateIcon();
});

function updateIcon() {
  const iconPath = !isEnabled ? "icons/f.svg" : "icons/f-green.svg";
  browser.browserAction.setIcon({ path: iconPath });
}

browser.browserAction.onClicked.addListener(() => {
  isEnabled = !isEnabled;
  browser.storage.sync.set({ isEnabled: isEnabled });
  updateIcon();
  notifyContentScript();
});

function notifyContentScript() {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0]) {
      browser.tabs.sendMessage(tabs[0].id, { isEnabled: isEnabled });
    }
  });
}
