document.getElementById("start-btn").addEventListener("click", () => {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { action: "startHiding" });
  });
});

document.getElementById("stop-btn").addEventListener("click", () => {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, { action: "stopHiding" });
  });
});
