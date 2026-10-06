const quizData = [
  {
    question: 'What is the core principle of Economics?',
    options: ['Supply and Demand', 'Gravity', 'Evolution', 'Thermodynamics'],
    answer: 'Supply and Demand',
    category: 'Commerce'
  },
  {
    question: 'What is the chemical symbol for water?',
    options: ['CO2', 'H2O', 'O2', 'HO2'],
    answer: 'H2O',
    category: 'Science'
  },
  {
    question: 'Which order is correct for the planets in our solar system?',
    options: ['Mercury, Venus, Earth, Mars', 'Mars, Earth, Venus, Mercury', 'Earth, Mercury, Mars, Venus', 'Venus, Mercury, Earth, Mars'],
    answer: 'Mercury, Venus, Earth, Mars',
    category: 'Science'
  },
  {
    question: 'Which of the following is a feature of a healthy economy?',
    options: ['High unemployment', 'Rising prices only', 'Balanced growth and jobs', 'No exports'],
    answer: 'Balanced growth and jobs',
    category: 'Commerce'
  },
  {
    question: 'Which programming language is used most often for web development?',
    options: ['C++', 'JavaScript', 'python', 'Ruby'],
    answer: 'JavaScript',
    category: 'Technology'
  },
  {
    question: 'What do artists usually use to create a portrait?',
    options: ['Microscope', 'Paintbrush', 'Calculator', 'Compass'],
    answer: 'Paintbrush',
    category: 'Arts'
  },
  {
    question: 'What is the derivative of x²?',
    options: ['2x', 'x', 'x²', '2'],
    answer: '2x',
    category: 'Mathematics'
  },
  {
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Rome', 'Madrid'],
    answer: 'Paris',
    category: 'General'
  },
  {
    question: 'Who invented the light bulb?',
    options: ['Alexander Graham Bell', 'Thomas Edison', 'Isaac Newton', 'Albert Einstein'],
    answer: 'Thomas Edison',
    category: 'General'
  },
  {
    question: 'Which market type has many buyers and sellers?',
    options: ['Monopoly', 'Oligopoly', 'Perfect competition', 'Duopoly'],
    answer: 'Perfect competition',
    category: 'Commerce'
  },
  {
    question: 'Which of these is part of the computer memory hierarchy?',
    options: ['Cache', 'RAM', 'mouse', 'CPU'],
    answer: 'Cache',
    category: 'Technology'
  },
  {
    question: 'What is the main function of the heart?',
    options: ['Digest food', 'Pump blood', 'Store memories', 'Produce hormones'],
    answer: 'Pump blood',
    category: 'Science'
  },
  {
    question: 'Which artist painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Claude Monet', 'Leonardo da Vinci', 'Pablo Picasso'],
    answer: 'Leonardo da Vinci',
    category: 'Arts'
  },
  {
    question: 'Which Indian festival celebrates lights?',
    options: ['Holi', 'Diwali', 'Eid', 'Christmas'],
    answer: 'Diwali',
    category: 'General'
  },
  {
    question: 'What does GDP measure?',
    options: ['Market production', 'Government contribution', 'Unemployment rate in the country', 'Success of other country'],
    answer: 'Market production',
    category: 'Commerce'
  }
];

const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const questionCounter = document.getElementById('questionCounter');
const scoreDisplay = document.getElementById('scoreDisplay');
const categoryLabel = document.getElementById('categoryLabel');
const resultCard = document.getElementById('resultCard');
const resultText = document.getElementById('resultText');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

let currentIndex = 0;
let score = 0;
let quizQuestions = [];
const answers = new Array(quizData.length).fill(null);

function shuffleQuestions() {
  quizQuestions = JSON.parse(JSON.stringify(quizData));
  for (let i = quizQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizQuestions[i], quizQuestions[j]] = [quizQuestions[j], quizQuestions[i]];
  }
}

function updateScore() {
  score = quizQuestions.reduce((total, question, index) => {
    return total + (answers[index] === question.answer ? 1 : 0);
  }, 0);
  scoreDisplay.textContent = `Score: ${score}`;
}

function renderQuestion() {
  const currentQuiz = quizQuestions[currentIndex];
  questionText.textContent = currentQuiz.question;
  questionCounter.textContent = `Question ${currentIndex + 1} / ${quizQuestions.length}`;
  categoryLabel.textContent = `Topic: ${currentQuiz.category}`;
  optionsContainer.innerHTML = '';

  const selectedAnswer = answers[currentIndex];
  const hasAnswered = selectedAnswer !== null;

  currentQuiz.options.forEach((optionText) => {
    const optionButton = document.createElement('button');
    optionButton.type = 'button';
    optionButton.className = 'option';
    optionButton.textContent = optionText;

    if (selectedAnswer === optionText) {
      optionButton.classList.add('selected');
    }

    if (hasAnswered) {
      optionButton.disabled = true;
      optionButton.classList.add('disabled');

      if (optionText === currentQuiz.answer) {
        optionButton.classList.add('correct');
      } else if (selectedAnswer === optionText) {
        optionButton.classList.add('wrong');
      }
    }

    if (!hasAnswered) {
      optionButton.addEventListener('click', () => selectOption(optionText));
    }

    optionsContainer.appendChild(optionButton);
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === quizQuestions.length - 1 ? 'Submit' : 'Next';
  updateScore();
}

function selectOption(optionText) {
  if (answers[currentIndex] !== null) return;

  answers[currentIndex] = optionText;
  renderQuestion();
}

function changeQuestion(direction) {
  if (direction < 0 && currentIndex === 0) return;

  currentIndex += direction;
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex >= quizQuestions.length) currentIndex = quizQuestions.length - 1;
  renderQuestion();
}

function calculateCategoryScores() {
  return quizQuestions.reduce((acc, item, index) => {
    const answer = answers[index];
    if (answer === item.answer) {
      acc[item.category] = (acc[item.category] || 0) + 1;
    }
    return acc;
  }, {});
}

function getRecommendedStream(categoryScores) {
  const orderedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);

  return orderedCategories[0] || 'General';
}

function submitQuiz() {
  const total = quizQuestions.length;
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const percentage = total ? Math.round((score / total) * 100) : 0;
  const categoryScores = calculateCategoryScores();
  const recommended = getRecommendedStream(categoryScores);
  const streamMessage = categoryScores[recommended]
    ? `Your strongest subject area is ${recommended}.`
    : 'Your performance is balanced across several streams.';

  resultText.innerHTML = `You scored <strong>${score}</strong> out of <strong>${total}</strong> (${percentage}%).<br>
    ${answeredCount === total ? 'You answered every question — nice work!' : 'Answer all questions to get the most accurate suggestion.'}<br>
    <strong>Recommended stream:</strong> ${recommended}.<br>
    ${streamMessage}`;

  resultCard.classList.add('active');
  nextBtn.textContent = 'Restart';
  nextBtn.removeEventListener('click', handleNext);
  nextBtn.addEventListener('click', restartQuiz);
}

function handleNext() {
  if (answers[currentIndex] === null) {
    alert('Please select an answer before continuing.');
    return;
  }

  if (currentIndex === quizQuestions.length - 1) {
    submitQuiz();
    return;
  }

  currentIndex += 1;
  renderQuestion();
}

function restartQuiz() {
  currentIndex = 0;
  score = 0;
  answers.fill(null);
  resultCard.classList.remove('active');
  shuffleQuestions();
  nextBtn.removeEventListener('click', restartQuiz);
  nextBtn.addEventListener('click', handleNext);
  renderQuestion();
}

prevBtn.addEventListener('click', () => changeQuestion(-1));
nextBtn.addEventListener('click', handleNext);
restartBtn.addEventListener('click', restartQuiz);

shuffleQuestions();
renderQuestion();
