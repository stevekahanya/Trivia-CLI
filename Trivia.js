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
      // Validate answer (must be a, b, c, or d)
      if (!['a', 'b', 'c', 'd'].includes(normalizedAnswer)) {
        console.log('Invalid answer! Please choose a, b, c, or d.');
        userAnswers.push(null); // Invalid counts as wrong
        console.log(`The correct answer was: ${q.correctOption} - ${q.options[q.correctOption]}\n`);
        continue;
      }

      userAnswers.push(normalizedAnswer);

      if (normalizedAnswer === q.correctOption) {
        console.log('Correct!\n');
        score++;
      } else {
        console.log('Incorrect!');
        console.log(`The correct answer was: ${q.correctOption} - ${q.options[q.correctOption]}\n`);
      }
    } catch (error) {
      console.error(error.message);
      console.log(`The correct answer was: ${q.correctOption} - ${q.options[q.correctOption]}\n`);
      userAnswers.push(null); // Timeout counts as wrong
    }
  }
  // Use array iteration method (filter) to calculate correct answers (as required)
  const correctAnswers = questions.filter((q, i) => userAnswers[i] === q.correctOption).length;

  // Display final feedback
  console.log('Game Over!');
  console.log(`Your score: ${correctAnswers} out of ${questions.length}`);

  // Optional: Detailed results using map for formatting
  const detailedResults = questions.map((q, i) => {
    const userAnswer = userAnswers[i] ? `${userAnswers[i].toUpperCase()}: ${q.options[userAnswers[i]]}` : 'No answer (timeout/invalid)';
    return `Question ${i + 1}: ${userAnswer} (Correct: ${q.correctOption.toUpperCase()}: ${q.options[q.correctOption]})`;
  });
  console.log('Detailed Results:');
  detailedResults.forEach(result => console.log(result));

  rl.close();
}
// Handle errors and close interface properly
rl.on('close', () => {
  console.log('Thanks for playing!');
  process.exit(0);
});

// Start the game
startGame().catch(error => {
  console.error('An error occurred:', error);
  rl.close();
});