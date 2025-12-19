// Questions categorized by difficulty
const easyQuestions = [
    {
        question: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
        correctOption: 'Paris'
    },
    {
        question: 'What color is the sky on a clear day?',
        options: ['Green', 'Blue', 'Red', 'Yellow'],
        correctOption: 'Blue'
    },
    {
        question: 'How many legs does a dog have?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correctOption: 'Four'
    },
    {
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
        correctOption: 'Pacific'
    },
    {
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctOption: '4'
    }
];

const mediumQuestions = [
    {
        question: 'Who painted the Mona Lisa?',
        options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Claude Monet'],
        correctOption: 'Leonardo da Vinci'
    },
    {
        question: 'What is the largest planet in our solar system?',
        options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
        correctOption: 'Jupiter'
    },
    {
        question: 'What is the chemical symbol for gold?',
        options: ['Au', 'Ag', 'Fe', 'Cu'],
        correctOption: 'Au'
    },
    {
        question: 'Who wrote "To Kill a Mockingbird"?',
        options: ['Harper Lee', 'J.K. Rowling', 'Mark Twain', 'Jane Austen'],
        correctOption: 'Harper Lee'
    },
    {
        question: 'What year did the Titanic sink?',
        options: ['1905', '1912', '1920', '1931'],
        correctOption: '1912'
    }
];

const hardQuestions = [
    {
        question: 'What is the smallest prime number?',
        options: ['1', '2', '3', '5'],
        correctOption: '2'
    },
    {
        question: 'Who discovered penicillin?',
        options: ['Alexander Fleming', 'Marie Curie', 'Albert Einstein', 'Isaac Newton'],
        correctOption: 'Alexander Fleming'
    },
    {
        question: 'What is the speed of light in vacuum (km/s)?',
        options: ['300,000', '150,000', '500,000', '1,000,000'],
        correctOption: '300,000'
    },
    {
        question: 'Which element has the atomic number 1?',
        options: ['Helium', 'Hydrogen', 'Carbon', 'Oxygen'],
        correctOption: 'Hydrogen'
    },
    {
        question: 'What is the longest river in the world?',
        options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
        correctOption: 'Nile'
    }
];

let quizData = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 15; // Default for easy
let timerInterval;
let userAnswers = [];

const difficultySection = document.getElementById('difficulty');
const gameSection = document.getElementById('game');
const timerEl = document.getElementById('time');
const questionEl = document.querySelector('.question');
const optionsEl = document.querySelector('.options');
const resultEl = document.querySelector('.result');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');
const detailsEl = document.getElementById('details');
const detailedResultsEl = document.querySelector('.detailed-results');
const restartBtn = document.querySelector('.restart-btn');

// Handle difficulty selection
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const difficulty = e.target.dataset.difficulty;
        switch (difficulty) {
            case 'easy':
                quizData = easyQuestions;
                timeLeft = 15;
                break;
            case 'medium':
                quizData = mediumQuestions;
                timeLeft = 10;
                break;
            case 'hard':
                quizData = hardQuestions;
                timeLeft = 5;
                break;
        }
        difficultySection.style.display = 'none';
        gameSection.style.display = 'block';
        loadQuestion();
    });
});

// Function to load the question
function loadQuestion() {
    if (currentQuestion >= quizData.length) {
        endQuiz();
        return;
    }
    clearInterval(timerInterval);
    timerEl.textContent = timeLeft;
    startTimer();

    const currentQuiz = quizData[currentQuestion];
    questionEl.textContent = currentQuiz.question;
    optionsEl.innerHTML = ''; // Clear previous options

    currentQuiz.options.forEach(option => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsEl.appendChild(button);
    });
}

// Check the answer
function checkAnswer(selectedOption) {
    clearInterval(timerInterval);
    userAnswers.push(selectedOption);
    if (selectedOption === quizData[currentQuestion].correctOption) {
        score++;
    }
    currentQuestion++;
    loadQuestion();
}

// Start the timer
function startTimer() {
    let remaining = timeLeft;
    timerEl.textContent = remaining;
    timerInterval = setInterval(() => {
        remaining--;
        timerEl.textContent = remaining;
        if (remaining <= 0) {
            clearInterval(timerInterval);
            userAnswers.push(null); // Timeout
            currentQuestion++;
            loadQuestion();
        }
    }, 1000);
}

// End the quiz and show the results
function endQuiz() {
    clearInterval(timerInterval);
    questionEl.style.display = 'none';
    optionsEl.style.display = 'none';
    document.querySelector('.timer').style.display = 'none';
    resultEl.style.display = 'block';
    detailedResultsEl.style.display = 'block';
    scoreEl.textContent = score;
    totalEl.textContent = quizData.length;
    restartBtn.style.display = 'block';

    // Display detailed results using map
    const detailedResults = quizData.map((q, i) => {
        const userAnswer = userAnswers[i] ? userAnswers[i] : 'No answer (timeout)';
        return `Question ${i + 1}: ${userAnswer} (Correct: ${q.correctOption})`;
    });
    detailsEl.innerHTML = detailedResults.join('<br>');
}

// Restart the quiz
restartBtn.addEventListener('click', () => {
    difficultySection.style.display = 'flex';
    gameSection.style.display = 'none';
    questionEl.style.display = 'block';
    optionsEl.style.display = 'flex';
    document.querySelector('.timer').style.display = 'block';
    resultEl.style.display = 'none';
    detailedResultsEl.style.display = 'none';
    restartBtn.style.display = 'none';
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
});