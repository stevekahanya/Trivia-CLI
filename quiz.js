const readline = require('readline');
// Import the File System module (Promise version)
const fs = require('fs/promises');

// Configuration
const TIME_LIMIT_PER_QUESTION = 10000; // 10 seconds
const DATA_FILE = './questions.json';

// Initialize Readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// HELPER FUNCTIONS


/**
 * Loads questions from a JSON file.
 * returns {Promise<Array>}
 */
const loadQuestions = async () => {
  try {
    // Read the file contents as a string
    const data = await fs.readFile(DATA_FILE, 'utf8');
    // Parse the string into a JavaScript Array/Object
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading questions:", error.message);
    console.error("Make sure 'questions.json' exists and is valid JSON.");
    process.exit(1); // Exit the program if we have no data
  }
};

const ask = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const timer = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("TIMEOUT")), ms);
  });
};

const validateInput = (input, optionsLength) => {
    const num = parseInt(input);
    return !isNaN(num) && num > 0 && num <= optionsLength;
};


// MAIN GAME LOGIC


const runQuiz = async () => {
  // Load data dynamically before starting
  console.log("Loading questions...");
  const questions = await loadQuestions();

  console.log("\n===========================================");
  console.log("Welcome to the JS CLI Trivia Game!");
  console.log(`Loaded ${questions.length} questions.`);
  console.log(`You have ${TIME_LIMIT_PER_QUESTION / 1000} seconds per question.`);
  console.log("===========================================\n");

  let score = 0;
  let userHistory = []; 

  for (let i = 0; i < questions.length; i++) {
    const currentQ = questions[i];
    
    console.log(`Question ${i + 1}: ${currentQ.text}`);
    currentQ.options.forEach((opt, index) => {
      console.log(`  ${index + 1}. ${opt}`);
    });

    let answerIndex = -1;
    let timeOutOccurred = false;

    try {
      const input = await Promise.race([
        ask(`\nEnter choice (1-${currentQ.options.length}): `),
        timer(TIME_LIMIT_PER_QUESTION)
      ]);

      if (validateInput(input, currentQ.options.length)) {
        answerIndex = parseInt(input) - 1;
      } else {
        console.log("Invalid input treated as incorrect.");
      }

    } catch (error) {
      if (error.message === "TIMEOUT") {
        console.log("\n⏰ TIME'S UP! Moving to next question.");
        timeOutOccurred = true;
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }

    const selectedOption = answerIndex >= 0 ? currentQ.options[answerIndex] : "No Answer";
    const isCorrect = !timeOutOccurred && selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      console.log("✅ Correct!");
      score++;
    } else if (!timeOutOccurred) {
      console.log(`❌ Wrong! The correct answer was: ${currentQ.correctAnswer}`);
    } else {
        console.log(`The correct answer was: ${currentQ.correctAnswer}`);
    }
    
    userHistory.push({
      question: currentQ.text,
      isCorrect: isCorrect,
      userAnswer: selectedOption,
      correctAnswer: currentQ.correctAnswer
    });

    console.log("-------------------------------------------\n");
  }

  displayResults(score, userHistory, questions.length);
  rl.close();
};


// REPORTING


const displayResults = (score, history, totalQuestions) => {
  console.log("================ GAME OVER ================");
  console.log(`Final Score: ${score} / ${totalQuestions}`);
  
  const percentage = (score / totalQuestions) * 100;
  console.log(`Percentage: ${percentage.toFixed(2)}%`); // Added .toFixed(2) for clean decimals

  const wrongAnswers = history.filter(item => !item.isCorrect);

  if (wrongAnswers.length > 0) {
    console.log("\n--- Review Area (Questions you missed) ---");
    wrongAnswers.forEach((item, index) => {
      console.log(`${index + 1}. ${item.question}`);
      console.log(`   You answered: ${item.userAnswer}`);
      console.log(`   Correct:      ${item.correctAnswer}`);
    });
  } else {
    console.log("\nPerfect score! You are a JavaScript wizard! 🧙‍♂️");
  }
  console.log("===========================================");
};

runQuiz();