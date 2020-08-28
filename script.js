// ===== DOM elements =====
const questionTotalEl = document.getElementById("question-total");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const questionTextEl = document.getElementById("question-text");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const questionCounterEl = document.getElementById("question-counter");
const progressEl = document.querySelector(".progress");
const progressBarEl = document.getElementById("progress-bar");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");
const scoreTotalEl = document.getElementById("score-total");
const resultMessageEl = document.getElementById("result-message");
const correctCountEl = document.getElementById("correct-count");
const incorrectCountEl = document.getElementById("incorrect-count");

const screens = {
  start: document.getElementById("start-screen"),
  quiz: document.getElementById("quiz-screen"),
  result: document.getElementById("result-screen"),
};

// ===== State =====
const state = {
  screen: "start",
  questions: [], // this attempt's shuffled copy of the questions
  currentIndex: 0, // which question is showing
  answers: [], // answers[i] = index the user picked for question i
};

// Ordered from highest to lowest so find() picks the best match
const resultMessages = [
  { minPercent: 100, text: "Perfect score! You really know your JavaScript. 🏆" },
  { minPercent: 80, text: "Great job! Just a few to review." },
  { minPercent: 50, text: "Good effort. Review the ones you missed and try again." },
  { minPercent: 0, text: "Keep practising. Every expert started here." },
];

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

// Fisher–Yates shuffle: returns a shuffled copy, the original is unchanged
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Shuffle a question's answers and work out where the correct one ended up.
// (This relies on each question's answers being different from each other.)
function shuffleAnswers(question) {
  const correctAnswer = question.answers[question.correctIndex];
  const answers = shuffle(question.answers);
  return {
    ...question,
    answers,
    correctIndex: answers.indexOf(correctAnswer),
  };
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
  const total = state.questions.length;
  const answered = getAnsweredCount();
  const percent = Math.round((answered / total) * 100);

  questionCounterEl.textContent = `Question ${state.currentIndex + 1} of ${total}`;

  progressBarEl.style.width = `${percent}%`;
  progressEl.setAttribute("aria-valuenow", percent);
  progressEl.setAttribute("aria-valuetext", `${answered} of ${total} answered`);
}

function renderNav(selectedIndex) {
  const isFirst = state.currentIndex === 0;
  const isLast = state.currentIndex === state.questions.length - 1;

  prevBtn.disabled = isFirst;
  // You must answer before moving on
  nextBtn.disabled = selectedIndex === undefined;
  nextBtn.textContent = isLast ? "See results" : "Next";
}

function renderQuestion() {
  const question = state.questions[state.currentIndex];
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

// ===== Score and results =====
function calculateScore() {
  return state.questions.reduce(
    (score, question, index) =>
      state.answers[index] === question.correctIndex ? score + 1 : score,
    0
  );
}

function getResultMessage(percent) {
  return resultMessages.find((message) => percent >= message.minPercent).text;
}

function renderResults() {
  const total = state.questions.length;
  const score = calculateScore();
  const percent = Math.round((score / total) * 100);

  scoreEl.textContent = score;
  scoreTotalEl.textContent = total;
  correctCountEl.textContent = score;
  incorrectCountEl.textContent = total - score;
  resultMessageEl.textContent = getResultMessage(percent);
}

// ===== Navigation =====
function goToQuestion(index) {
  state.currentIndex = index;
  renderQuestion();
  // Start keyboard and screen-reader users at the new question
  questionTextEl.focus();
}

function finishQuiz() {
  renderResults();
  showScreen("result");
}

// ===== Quiz lifecycle =====
function resetQuiz() {
  state.questions = shuffle(questions).map(shuffleAnswers);
  state.currentIndex = 0;
  state.answers = [];
}

// Used by both Start and Restart, so a new attempt always begins the same way
function startQuiz() {
  resetQuiz();
  renderQuestion();
  showScreen("quiz");
}

// ===== Event handlers =====
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
  const isLast = state.currentIndex === state.questions.length - 1;
  if (isLast) {
    finishQuiz();
  } else {
    goToQuestion(state.currentIndex + 1);
  }
}

// ===== Init =====
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);
answersEl.addEventListener("click", handleAnswerClick);
prevBtn.addEventListener("click", handlePrev);
nextBtn.addEventListener("click", handleNext);
questionTotalEl.textContent = questions.length;
