let isFuriganaHidden = false;
let furiganas = null;

// https://app.nativshark.com/learn/vocabulary
// When I mouse over any of the words it triggers a mutation and I can't
// narrow down which class I need to target for the ignore.

function handleMutations(mutationsList) {
  for (let mutation of mutationsList) {
    console.log(mutation);
    if (shouldIgnoreMutation(mutation)) {
      continue;
    }

    if (mutation.type === "childList" || mutation.type === "subtree") {
      browser.storage.sync.get("isEnabled").then((result) => {
        if (result.isEnabled) {
          startHiding();
        }
      });
    }
  }
}

function shouldIgnoreMutation(mutation) {
  if (
    mutation.target.classList &&
    (mutation.target.classList.contains("sc-pjstK") ||
      mutation.target.classList.contains("sc-fzoydu") ||
      mutation.target.classList.contains("sc-fzoLag"))
  ) {
    return true;
  }
}

const observer = new MutationObserver(handleMutations);

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

document.addEventListener("DOMContentLoaded", () => {
  browser.storage.sync.get("isEnabled").then((result) => {
    if (result.isEnabled) {
      startHiding();
    }
  });
});

/* Event listeners */

// keyboard shortcut for starting/stopping TF
document.addEventListener("keydown", (e) => {
  if (e.isComposing) return;

  if (e.shiftKey && e.key.toLowerCase() === "f" && isFuriganaHidden)
    stopHiding();
  if (e.key === "f") startHiding();
});

/* show/reveal furigana logic */

const startHiding = () => {
  isFuriganaHidden = true;
  hideFurigana();
};

const revealClickedFurigana = (e) => {
  const element = e.target;
  if (element) {
    element.setAttribute("style", "");
  }
};

const hideFurigana = () => {
  furiganas = document.getElementsByTagName("rt");
  for (let element of furiganas) {
    element.style.backgroundColor = "#A6A6BF";
    element.style.color = "rgba(255, 255, 255, 0)";
    element.style.cursor = "pointer";
    element.addEventListener("click", revealClickedFurigana);
  }
};

const stopHiding = () => {
  isFuriganaHidden = false;

  for (let element of furiganas) {
    element.removeEventListener("click", revealClickedFurigana);
    element.setAttribute("style", "");
  }
};

/* link popup button clicks to function calls. */

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.isEnabled) {
    startHiding();
  } else {
    stopHiding();
  }
});

browser.storage.sync.get("isEnabled").then((result) => {
  if (result.isEnabled) {
    startHiding();
  }
});
