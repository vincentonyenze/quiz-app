// Each question has:
// - question:     the text shown to the user
// - answers:      the possible answers
// - correctIndex: position of the correct answer in `answers` (starts at 0)
// - explanation:  shown when reviewing answers at the end
const questions = [
  {
    question: "Which keyword declares a variable that cannot be reassigned?",
    answers: ["let", "var", "const", "static"],
    correctIndex: 2,
    explanation: "`const` creates a binding that can't be reassigned. `let` and `var` can be.",
  },
  {
    question: "What does `typeof []` return?",
    answers: ['"array"', '"object"', '"list"', '"undefined"'],
    correctIndex: 1,
    explanation: "Arrays are a kind of object. Use `Array.isArray()` to check for an array.",
  },
  {
    question: "Which array method returns a new array with only the items that pass a test?",
    answers: ["map()", "filter()", "reduce()", "forEach()"],
    correctIndex: 1,
    explanation: "`filter()` keeps the items where the callback returns true.",
  },
  {
    question: 'What is the result of `"5" + 3`?',
    answers: ['"53"', "8", "NaN", "An error"],
    correctIndex: 0,
    explanation: "When one side of `+` is a string, JavaScript joins them as strings.",
  },
  {
    question: "Which method turns a JavaScript object into a JSON string?",
    answers: ["JSON.parse()", "JSON.stringify()", "JSON.toString()", "Object.toJSON()"],
    correctIndex: 1,
    explanation: "`JSON.stringify()` converts to a string; `JSON.parse()` converts back.",
  },
  {
    question: "What does the `===` operator compare?",
    answers: [
      "Value only, after converting types",
      "Value and type, without converting",
      "Type only",
      "Whether both variables exist",
    ],
    correctIndex: 1,
    explanation: "`===` is strict equality: no type conversion, so `5 === \"5\"` is false.",
  },
  {
    question: "Which call stops a form from reloading the page when it's submitted?",
    answers: [
      "event.stopPropagation()",
      "event.preventDefault()",
      "event.cancel()",
      "form.stop()",
    ],
    correctIndex: 1,
    explanation: "`preventDefault()` cancels the browser's default action, like submitting a form.",
  },
  {
    question: "What does `[1, 2, 3].reduce((sum, n) => sum + n, 0)` return?",
    answers: ["6", "[1, 2, 3]", "0", '"123"'],
    correctIndex: 0,
    explanation: "`reduce()` starts at 0 and adds each number: 0 + 1 + 2 + 3 = 6.",
  },
  {
    question: "Which property sets an element's text without interpreting it as HTML?",
    answers: ["innerHTML", "textContent", "outerHTML", "innerCode"],
    correctIndex: 1,
    explanation: "`textContent` treats everything as plain text, which makes it safe for user input.",
  },
  {
    question: "What type of value does localStorage store?",
    answers: ["Strings only", "Objects", "Numbers only", "Any type"],
    correctIndex: 0,
    explanation: "localStorage only stores strings, so objects need `JSON.stringify()` first.",
  },
];
