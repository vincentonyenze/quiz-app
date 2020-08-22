// ===== DOM elements =====
const questionTotalEl = document.getElementById("question-total");
const startBtn = document.getElementById("start-btn");
const questionTextEl = document.getElementById("question-text");
const answersEl = document.getElementById("answers");

const screens = {
  start: document.getElementById("start-screen"),
  quiz: document.getElementById("quiz-screen"),
  result: document.getElementById("result-screen"),
};

// ===== State =====
const state = {
  screen: "start",
  currentIndex: 0, // which question is showing
};

// ===== Helpers =====
// Show text inside `backticks` as <code>, without using innerHTML.
// "What does `typeof []` return?" splits into
// ["What does ", "typeof []", " return?"], so every odd part is code.
function setTextWithCode(element, text) {
  const nodes = text.split("`").map((part, index) => {
    if (index % 2 === 1) {
      const code = document.createElement("code");
      code.textContent = part;
      return code;
    }
    return document.createTextNode(part);
  });
  element.replaceChildren(...nodes);
}

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

// ===== Rendering =====
function createAnswerButton(answer, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "answer";
  button.dataset.index = index;

  const text = document.createElement("span");
  setTextWithCode(text, answer);
  button.append(text);

  return button;
}

function renderQuestion() {
  const question = questions[state.currentIndex];

  setTextWithCode(questionTextEl, question.question);
  answersEl.replaceChildren(...question.answers.map(createAnswerButton));
}

// ===== Event handlers =====
function handleStart() {
  state.currentIndex = 0;
  renderQuestion();
  showScreen("quiz");
}

// ===== Init =====
startBtn.addEventListener("click", handleStart);
questionTotalEl.textContent = questions.length;
