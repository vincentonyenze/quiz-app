// ===== DOM elements =====
const questionTotalEl = document.getElementById("question-total");
const startBtn = document.getElementById("start-btn");
const questionTextEl = document.getElementById("question-text");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");

const screens = {
  start: document.getElementById("start-screen"),
  quiz: document.getElementById("quiz-screen"),
  result: document.getElementById("result-screen"),
};

// ===== State =====
const state = {
  screen: "start",
  currentIndex: 0, // which question is showing
  answers: [], // answers[i] = index the user picked for question i
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
function createAnswerButton(answer, index, question, selectedIndex) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "answer";
  button.dataset.index = index;

  const text = document.createElement("span");
  setTextWithCode(text, answer);
  button.append(text);

  // Once answered, lock the buttons and reveal the result
  const isAnswered = selectedIndex !== undefined;
  if (isAnswered) {
    button.disabled = true;
    if (index === question.correctIndex) {
      button.classList.add("is-correct");
    } else if (index === selectedIndex) {
      button.classList.add("is-incorrect");
    }
  }

  return button;
}

function renderFeedback(question, selectedIndex) {
  if (selectedIndex === undefined) {
    feedbackEl.className = "feedback";
    feedbackEl.textContent = "";
    return;
  }

  const isCorrect = selectedIndex === question.correctIndex;
  feedbackEl.className = `feedback feedback--${isCorrect ? "correct" : "incorrect"}`;

  if (isCorrect) {
    feedbackEl.textContent = "Correct! 🎉";
  } else {
    const correctAnswer = question.answers[question.correctIndex];
    setTextWithCode(feedbackEl, `Not quite. The correct answer is ${correctAnswer}.`);
  }
}

function renderQuestion() {
  const question = questions[state.currentIndex];
  const selectedIndex = state.answers[state.currentIndex];

  setTextWithCode(questionTextEl, question.question);
  answersEl.replaceChildren(
    ...question.answers.map((answer, index) =>
      createAnswerButton(answer, index, question, selectedIndex)
    )
  );
  renderFeedback(question, selectedIndex);
}

// ===== Event handlers =====
function handleStart() {
  state.currentIndex = 0;
  state.answers = [];
  renderQuestion();
  showScreen("quiz");
}

function handleAnswerClick(event) {
  const button = event.target.closest(".answer");
  if (!button || button.disabled) return;

  state.answers[state.currentIndex] = Number(button.dataset.index);
  renderQuestion();
}

// ===== Init =====
startBtn.addEventListener("click", handleStart);
answersEl.addEventListener("click", handleAnswerClick);
questionTotalEl.textContent = questions.length;
