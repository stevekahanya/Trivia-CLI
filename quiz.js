const readline = require('readline');


// DATA STRUCTURES (Requirements: Arrays, Objects)

const questions = [
  {
    id: 1,
    text: "Which keyword is used to declare a constant in JavaScript?",
    options: ["var", "let", "const", "fixed"],
    correctAnswer: "const"
  },
  {
    id: 2,
    text: "What does DOM stand for?",
    options: ["Data Object Model", "Document Object Model", "Display Object Management", "Digital Ordinance Model"],
    correctAnswer: "Document Object Model"
  },
  {
    id: 3,
    text: "Which method removes the last element from an array?",
    options: ["shift()", "unshift()", "pop()", "push()"],
    correctAnswer: "pop()"
  },
  {
    id: 4,
    text: "How do you start a promise chain?",
    options: ["new Promise()", "Promise.start()", "init Promise", "await new"],
    correctAnswer: "new Promise()"
  }
];

// Configuration
const TIME_LIMIT_PER_QUESTION = 10000; // 10 seconds in milliseconds

// Initialize Readline Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// HELPER FUNCTIONS (Requirements: Functions, Clarity)


/**
 * Wraps readline in a Promise to allow 'await' syntax.
 * @param {string} query - The text to display to the user.
 * @returns {Promise<string>} - The user's input.
 */
const ask = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

/**
 * A timer promise that rejects after a specific duration.
 * Used for the "Timed Feature" requirement.
 */
const timer = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("TIMEOUT")), ms);
  });
};

/**
 * Validates the input. 
 * Checks if input is a number and within the range of options.
 */
const validateInput = (input, optionsLength) => {
    const num = parseInt(input);
    return !isNaN(num) && num > 0 && num <= optionsLength;
};


// MAIN GAME LOGIC (Requirements: Loops, Async, Control Flow)


const runQuiz = async () => {
  console.log("\n===========================================");
  console.log("Welcome to the JS CLI Trivia Game!");
  console.log(`You have ${TIME_LIMIT_PER_QUESTION / 1000} seconds per question.`);
  console.log("===========================================\n");

  let score = 0;
  // We will store user answers here to use Array Iteration later
  let userHistory = []; 

  // Loop through questions sequentially
  for (let i = 0; i < questions.length; i++) {
    const currentQ = questions[i];
    
    // Display Question
    console.log(`Question ${i + 1}: ${currentQ.text}`);
    currentQ.options.forEach((opt, index) => {
      console.log(`  ${index + 1}. ${opt}`);
    });

    let answerIndex = -1;
    let timeOutOccurred = false;

    try {
      // PROMISE.RACE: This satisfies "Integrate asynchronous JavaScript feature"
      // We race the user's input against the timer. Whichever finishes first wins.
      const input = await Promise.race([
        ask(`\nEnter choice (1-${currentQ.options.length}): `),
        timer(TIME_LIMIT_PER_QUESTION)
      ]);

      // Process Input
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

    // Determine correctness
    const selectedOption = answerIndex >= 0 ? currentQ.options[answerIndex] : "No Answer";
    const isCorrect = !timeOutOccurred && selectedOption === currentQ.correctAnswer;

    // Immediate Feedback
    if (isCorrect) {
      console.log("✅ Correct!");
      score++;
    } else if (!timeOutOccurred) {
      console.log(`❌ Wrong! The correct answer was: ${currentQ.correctAnswer}`);
    } else {
        // Timeout feedback already given above
        console.log(`The correct answer was: ${currentQ.correctAnswer}`);
    }
    
    // Save history for final report
    userHistory.push({
      question: currentQ.text,
      isCorrect: isCorrect,
      userAnswer: selectedOption,
      correctAnswer: currentQ.correctAnswer
    });

    console.log("-------------------------------------------\n");
  }

  // End Game
  displayResults(score, userHistory);
  rl.close();
};


// REPORTING (Requirements: Array Iteration Methods - map/filter)


const displayResults = (score, history) => {
  console.log("================ GAME OVER ================");
  console.log(`Final Score: ${score} / ${questions.length}`);
  
  const percentage = (score / questions.length) * 100;
  console.log(`Percentage: ${percentage}%`);

  // Requirement: Use an array iteration method (filter)
  const wrongAnswers = history.filter(item => !item.isCorrect);

  if (wrongAnswers.length > 0) {
    console.log("\n--- Review Area (Questions you missed) ---");
    // Requirement: Use an array iteration method (map or forEach)
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

// Start the application
runQuiz();