// ===== DOM elements =====
const questionTotalEl = document.getElementById("question-total");
const startBtn = document.getElementById("start-btn");

const screens = {
  start: document.getElementById("start-screen"),
  quiz: document.getElementById("quiz-screen"),
  result: document.getElementById("result-screen"),
};

// ===== State =====
const state = {
  screen: "start",
};

// ===== Screens =====
function showScreen(name) {
  state.screen = name;

  Object.entries(screens).forEach(([screenName, screenEl]) => {
    screenEl.hidden = screenName !== name;
  });

  // Move focus to the new screen's heading so keyboard and
  // screen-reader users start at the top of what changed
  const heading = screens[name].querySelector("h1, h2");
  heading.setAttribute("tabindex", "-1");
  heading.focus();
}

// ===== Event handlers =====
function handleStart() {
  showScreen("quiz");
}

// ===== Init =====
startBtn.addEventListener("click", handleStart);
questionTotalEl.textContent = questions.length;
