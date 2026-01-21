const readline = require('readline');
const fs = require('fs/promises');
// We require chalk to add color to our output
const chalk = require('chalk');

// Configuration
const TIME_LIMIT_PER_QUESTION = 10000; // 10 seconds
const DATA_FILE = './questions.json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------

const loadQuestions = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(chalk.red("Error loading questions: " + error.message));
    process.exit(1);
  }
};

const ask = (query) => {
  return new Promise((resolve) => rl.question(chalk.cyan(query), resolve));
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

// ------------------------------------------------------------------
// MAIN GAME LOGIC
// ------------------------------------------------------------------

const runQuiz = async () => {
  console.log(chalk.yellow("Loading questions..."));
  const questions = await loadQuestions();

  console.log(chalk.bold.magenta("\n==========================================="));
  console.log(chalk.bold.magenta("   WELCOME TO THE JS CLI TRIVIA GAME!   "));
  console.log(chalk.bold.magenta("===========================================\n"));
  console.log(chalk.gray(`Loaded ${questions.length} questions.`));
  console.log(chalk.gray(`You have ${TIME_LIMIT_PER_QUESTION / 1000} seconds per question.\n`));

  let score = 0;
  let userHistory = []; 

  for (let i = 0; i < questions.length; i++) {
    const currentQ = questions[i];
    
    // Display Question in Bold
    console.log(chalk.white.bold(`Question ${i + 1}: ${currentQ.text}`));
    
    // Display Options
    currentQ.options.forEach((opt, index) => {
      console.log(chalk.blue(`  ${index + 1}. ${opt}`));
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
        console.log(chalk.yellow("Invalid input treated as incorrect."));
      }

    } catch (error) {
      if (error.message === "TIMEOUT") {
        console.log(chalk.red("\n⏰ TIME'S UP! Moving to next question."));
        timeOutOccurred = true;
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }

    const selectedOption = answerIndex >= 0 ? currentQ.options[answerIndex] : "No Answer";
    const isCorrect = !timeOutOccurred && selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      console.log(chalk.green("✅ Correct!"));
      score++;
    } else if (!timeOutOccurred) {
      console.log(chalk.red(`❌ Wrong! The correct answer was: ${currentQ.correctAnswer}`));
    } else {
        console.log(chalk.yellow(`The correct answer was: ${currentQ.correctAnswer}`));
    }
    
    userHistory.push({
      question: currentQ.text,
      isCorrect: isCorrect,
      userAnswer: selectedOption,
      correctAnswer: currentQ.correctAnswer
    });

    console.log(chalk.gray("-------------------------------------------\n"));
  }

  displayResults(score, userHistory, questions.length);
  rl.close();
};

// ------------------------------------------------------------------
// REPORTING
// ------------------------------------------------------------------

const displayResults = (score, history, totalQuestions) => {
  console.log(chalk.bold.magenta("================ GAME OVER ================"));
  console.log(chalk.white(`Final Score: ${chalk.yellow(score)} / ${totalQuestions}`));
  
  const percentage = (score / totalQuestions) * 100;
  let colorFunc = percentage >= 70 ? chalk.green : chalk.red;
  console.log(`Percentage: ${colorFunc(percentage.toFixed(2) + "%")}`);

  const wrongAnswers = history.filter(item => !item.isCorrect);

  if (wrongAnswers.length > 0) {
    console.log(chalk.yellow("\n--- Review Area (Questions you missed) ---"));
    wrongAnswers.forEach((item, index) => {
      console.log(chalk.bold(`${index + 1}. ${item.question}`));
      console.log(chalk.red(`   You answered: ${item.userAnswer}`));
      console.log(chalk.green(`   Correct:      ${item.correctAnswer}`));
    });
  } else {
    console.log(chalk.green("\nPerfect score! You are a JavaScript wizard! 🧙‍♂️"));
  }
  console.log(chalk.bold.magenta("==========================================="));
};

runQuiz();