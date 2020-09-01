# JavaScript Quiz

A multiple-choice quiz app that tests your JavaScript knowledge, built with plain HTML, CSS and JavaScript. No frameworks or libraries.

This is **Project 4** in my beginner-to-expert web development roadmap.

<!-- Add a screenshot: save one as screenshot.png in this folder and uncomment the line below -->
<!-- ![JavaScript Quiz screenshot](screenshot.png) -->

## Features

- Start, quiz and results screens in a single page
- 10 multiple-choice questions about JavaScript fundamentals
- Instant feedback: the correct answer turns green, a wrong pick turns red (with ✓ / ✗ icons, not just color)
- Next and Previous navigation; answered questions stay locked and keep their result
- Progress bar and "Question X of Y" counter
- Final score, correct and incorrect counts, and a message based on your result
- Review every question with your answer, the correct answer and an explanation
- Questions and answers are shuffled on every attempt
- Restart without reloading the page
- Keyboard and screen-reader friendly (focus management, ARIA roles)
- Responsive layout for desktop and phone

## Built with

- HTML5 (semantic sections, `hidden` screens, ARIA attributes)
- CSS3 (custom properties, Flexbox, Grid, `::after` and `::marker`, media queries)
- Vanilla JavaScript (ES6+)

## What I learned

- **Application state:** keeping everything (current screen, current question, answers) in one `state` object
- **Rendering from state:** the UI is rebuilt from state, so going back to a question just works
- **Derived values:** the score, progress and answered count are calculated, never stored separately
- **Separating data from logic:** questions live in their own file, `questions.js`
- **Array methods:** `map()`, `filter()`, `reduce()` (with the index), `find()` and `indexOf()`
- **The Fisher–Yates shuffle,** and why `sort(() => Math.random() - 0.5)` is biased
- **Immutability:** shuffling copies and never changes the original questions
- **Safe rendering:** turning `` `backticks` `` into `<code>` with `split()` and text nodes instead of `innerHTML`
- **Accessibility:** moving focus when screens change, `role="status"`, `aria-valuenow` and not relying on color alone
- **Event delegation** for dynamically created answer buttons

## How to run

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Open `index.html` in your browser.

No installation or build step is needed.

## Adding your own questions

Add an object to the array in `questions.js`:

```js
{
  question: "Which method adds an item to the end of an array?",
  answers: ["push()", "pop()", "shift()", "unshift()"],
  correctIndex: 0, // position of the correct answer, starting at 0
  explanation: "`push()` adds to the end; `unshift()` adds to the start.",
},
```

Wrap code in backticks to show it as code. Each question's answers must be different from each other.

## Project structure

```
quiz-app/
├── index.html     # The three screens
├── style.css      # Styles, answer states and responsive layout
├── questions.js   # Quiz data
├── script.js      # App logic: state, rendering, navigation, scoring
└── README.md
```

## Possible improvements

- A countdown timer for each question
- Keyboard shortcuts (1–4 to answer, arrow keys to navigate)
- Save the best score in localStorage
- Several categories (HTML, CSS, JavaScript) to choose from
- Load questions from an API
- Rebuild in React (planned for a later project in my roadmap)
