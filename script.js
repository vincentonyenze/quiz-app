// ===== DOM elements =====
const questionTotalEl = document.getElementById("question-total");
const startBtn = document.getElementById("start-btn");
const questionTextEl = document.getElementById("question-text");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const questionCounterEl = document.getElementById("question-counter");
const progressEl = document.querySelector(".progress");
const progressBarEl = document.getElementById("progress-bar");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

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

function getAnsweredCount() {
  return state.answers.filter((answer) => answer !== undefined).length;
}

function renderProgress() {
  const total = questions.length;
  const answered = getAnsweredCount();
  const percent = Math.round((answered / total) * 100);

  questionCounterEl.textContent = `Question ${state.currentIndex + 1} of ${total}`;

  progressBarEl.style.width = `${percent}%`;
  progressEl.setAttribute("aria-valuenow", percent);
  progressEl.setAttribute("aria-valuetext", `${answered} of ${total} answered`);
}

function renderNav(selectedIndex) {
  const isFirst = state.currentIndex === 0;
  const isLast = state.currentIndex === questions.length - 1;

  prevBtn.disabled = isFirst;
  // You must answer before moving on
  nextBtn.disabled = selectedIndex === undefined;
  nextBtn.textContent = isLast ? "See results" : "Next";
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
  renderProgress();
  renderNav(selectedIndex);
}

// ===== Navigation =====
function goToQuestion(index) {
  state.currentIndex = index;
  renderQuestion();
  // Start keyboard and screen-reader users at the new question
  questionTextEl.focus();
}

function finishQuiz() {
  showScreen("result");
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
  // The clicked button was replaced, so move focus to the next step
  nextBtn.focus();
}

function handlePrev() {
  if (state.currentIndex > 0) {
    goToQuestion(state.currentIndex - 1);
  }
}

function handleNext() {
  const isLast = state.currentIndex === questions.length - 1;
  if (isLast) {
    finishQuiz();
  } else {
    goToQuestion(state.currentIndex + 1);
  }
}

// ===== Init =====
startBtn.addEventListener("click", handleStart);
answersEl.addEventListener("click", handleAnswerClick);
prevBtn.addEventListener("click", handlePrev);
nextBtn.addEventListener("click", handleNext);
questionTotalEl.textContent = questions.length;
