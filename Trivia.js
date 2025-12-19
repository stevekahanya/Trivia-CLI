const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

// Array of trivia questions (using an array as required)
const questions = [
  {
    question: 'What is the capital of France?',
    options: { a: 'Paris', b: 'London', c: 'Berlin', d: 'Madrid' },
    correctOption: 'a'
  },
  {
    question: 'Who painted the Mona Lisa?',
    options: { a: 'Vincent van Gogh', b: 'Leonardo da Vinci', c: 'Pablo Picasso', d: 'Claude Monet' },
    correctOption: 'b'
  },
  {
    question: 'What is the largest planet in our solar system?',
    options: { a: 'Earth', b: 'Mars', c: 'Jupiter', d: 'Saturn' },
    correctOption: 'c'
  },
  {
    question: 'What is the chemical symbol for gold?',
    options: { a: 'Au', b: 'Ag', c: 'Fe', d: 'Cu' },
    correctOption: 'a'
  },
  {
    question: 'Who wrote "To Kill a Mockingbird"?',
    options: { a: 'Harper Lee', b: 'J.K. Rowling', c: 'Mark Twain', d: 'Jane Austen' },
    correctOption: 'a'
  }
];
/**
 * Function to ask a question with a timer.
 * @param {string} prompt - The prompt to display to the user.
 * @returns {Promise<string>} - Resolves with user input or rejects on timeout.
 */
function askWithTimeout(prompt, timeoutMs) {
  const questionPromise = rl.question(prompt);
  
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Time\'s up!')), timeoutMs)
  );

  return Promise.race([questionPromise, timeoutPromise]);
}
/**
 * Main function to start and run the trivia game.
 */
async function startGame() {
  console.log('Welcome to the Trivia Quiz Game!');
  console.log('You have 10 seconds to answer each question. Answer with a, b, c, or d.');
  console.log('Let\'s begin!\n');

  const userAnswers = []; // Array to store user answers for later iteration
  let score = 0;
  // Loop through each question (using a loop as required)
  for (const [index, q] of questions.entries()) {
    console.log(`Question ${index + 1}: ${q.question}`);
    Object.entries(q.options).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const answer = await askWithTimeout('Your answer: ', 10000); // 10-second timer per question
      const normalizedAnswer = answer.trim().toLowerCase();