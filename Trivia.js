const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

// Arrays of trivia questions categorized by difficulty (using arrays as required)
const easyQuestions = [
  {
    question: 'What is the capital of France?',
    options: { a: 'Paris', b: 'London', c: 'Berlin', d: 'Madrid' },
    correctOption: 'a'
  },
  {
    question: 'What color is the sky on a clear day?',
    options: { a: 'Green', b: 'Blue', c: 'Red', d: 'Yellow' },
    correctOption: 'b'
  },
  {
    question: 'How many legs does a dog have?',
    options: { a: 'Two', b: 'Three', c: 'Four', d: 'Five' },
    correctOption: 'c'
  },
  {
    question: 'What is the largest ocean on Earth?',
    options: { a: 'Atlantic', b: 'Indian', c: 'Arctic', d: 'Pacific' },
    correctOption: 'd'
  },
  {
    question: 'What is 2 + 2?',
    options: { a: '3', b: '4', c: '5', d: '6' },
    correctOption: 'b'
  }
];

const mediumQuestions = [
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
  },
  {
    question: 'What year did the Titanic sink?',
    options: { a: '1905', b: '1912', c: '1920', d: '1931' },
    correctOption: 'b'
  }
];

const hardQuestions = [
  {
    question: 'What is the smallest prime number?',
    options: { a: '1', b: '2', c: '3', d: '5' },
    correctOption: 'b'
  },
  {
    question: 'Who discovered penicillin?',
    options: { a: 'Alexander Fleming', b: 'Marie Curie', c: 'Albert Einstein', d: 'Isaac Newton' },
    correctOption: 'a'
  },
  {
    question: 'What is the speed of light in vacuum (km/s)?',
    options: { a: '300,000', b: '150,000', c: '500,000', d: '1,000,000' },
    correctOption: 'a'
  },
  {
    question: 'Which element has the atomic number 1?',
    options: { a: 'Helium', b: 'Hydrogen', c: 'Carbon', d: 'Oxygen' },
    correctOption: 'b'
  },
  {
    question: 'What is the longest river in the world?',
    options: { a: 'Amazon', b: 'Nile', c: 'Yangtze', d: 'Mississippi' },
    correctOption: 'b'
  }
];

/**
 * Function to get the questions and timeout based on difficulty.
 * @param {string} difficulty - The chosen difficulty level.
 * @returns {{questions: Array, timeout: number}} - Questions array and timeout in ms.
 */
function getQuestionsByDifficulty(difficulty) {
  switch (difficulty) {
    case 'easy':
      return { questions: easyQuestions, timeout: 15000 }; // 15 seconds
    case 'medium':
      return { questions: mediumQuestions, timeout: 10000 }; // 10 seconds
    case 'hard':
      return { questions: hardQuestions, timeout: 5000 }; // 5 seconds
    default:
      throw new Error('Invalid difficulty level');
  }
}

/**
 * Function to ask a question with a timer.
 * @param {string} prompt - The prompt to display to the user.
 * @param {number} timeoutMs - The timeout in milliseconds.
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
  console.log('Choose your difficulty level: easy, medium, or hard.');

  let difficulty;
  while (true) {
    difficulty = (await rl.question('Your choice: ')).trim().toLowerCase();
    if (['easy', 'medium', 'hard'].includes(difficulty)) {
      break;
    }
    console.log('Invalid choice. Please select easy, medium, or hard.');
  }

  const { questions, timeout } = getQuestionsByDifficulty(difficulty);

  console.log(`\nYou chose ${difficulty}. You have ${timeout / 1000} seconds to answer each question.`);
  console.log('Answer with a, b, c, or d.');
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
      const answer = await askWithTimeout('Your answer: ', timeout);
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