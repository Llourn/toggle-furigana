let isFuriganaHidden = false;
let furiganas = null;
let kanjiCheckChar;

// smiley face ranking buttons, seen during flashcard/reviews.
const smileyFaceSelectors = ["div.tzvGz", "div.tzvGz *"];
// show answer button, seen during flashcard/reviews.
const showAnswerButtonSelectors = [
  ".kEKrUb > button.hhryVX",
  ".kEKrUb > button.hhryVX *",
];
// Ok/got it button seen during lessons.
const okLessonBtnSelectors = ["div.efvvTD *"];

/* Event listeners */

// keyboard shortcut for starting/stopping TF
document.addEventListener("keydown", (e) => {
  if (e.isComposing) return;

  if (e.key === "r" && isFuriganaHidden) stopHiding();
  if (e.key === "f") startHiding();
});

document.addEventListener("click", (e) => {
  const target = e.target;

  if (isFuriganaHidden) {
    if (iClickedOn(target, okLessonBtnSelectors)) {
      let okLessonBtn = document.getElementsByClassName(
        "LearnCard__CircleButtonSubtext-ygbxsd-11"
      )[0];

      if (okLessonBtn.innerHTML == "Play") hideFurigana();
    }

    if (iClickedOn(target, showAnswerButtonSelectors)) {
      hideFurigana();
      handleKanjiReviewCard();
    }

    if (iClickedOn(target, smileyFaceSelectors)) {
      hideFurigana();
    }
  }
});

/* State logic */

// Check what was clicked on by comparing by matching the provided selectors against the target.
const iClickedOn = (target, selectors) => {
  for (const selector of selectors) {
    if (target.matches(selector)) return true;
  }
  return false;
};

const handleKanjiReviewCard = () => {
  // check if the current card is a kanji card and get the kanji character.
  kanjiCheckChar =
    document?.getElementsByClassName("eHwwGg")[0]?.textContent || "";

  if (kanjiCheckChar) {
    let i = 0;

    let finishedlooping = false;

    function myloop() {
      setTimeout(function () {
        i++;

        const bodyText = document.body.innerText || document.body.textContent;
        let kanjiCount = bodyText.match(
          new RegExp(kanjiCheckChar, "g") || []
        ).length;

        if (kanjiCount > 1) {
          hideFurigana();
          finishedlooping = true;

          return;
        }

        if (i < 20 && !finishedlooping) {
          myloop();
        }
      }, 500);
    }

    myloop();
  }
};

/* show/reveal furigana logic */

const startHiding = () => {
  console.log("START HIDING");
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
  if (message.action === "startHiding") {
    startHiding();
  }
  if (message.action === "stopHiding") {
    stopHiding();
  }
});

// browser.webNavigation.onCompleted.addListener(function () {
// });

// browser.tabs.onUpdated.addListener(function (tabId, changeInfo) {
//   if (changeInfo.status == "complete") {
//   }
// });

/* 
Next steps
I want to create a toggle so the scripts execute on page load
Also keep the keyboard shortcuts so it can be enabled/disabled on the fly.
*/
