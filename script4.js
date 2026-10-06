let timer = document.getElementsByClassName("timer")[0];
let quizContainer = document.getElementById("container");
let nextButton = document.getElementById("next-button");
let numOfQuestions = document.getElementsByClassName("number-of-questions")[0];
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let currentScore = document.getElementById("current-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let finalpara = document.querySelector(".final-para"); 
let questionCount;
let scoreCount = 0;
let count = 10;
let countdown;

// For hex codes
let letters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];

// Questions and Options Array
let quizArray = [];

const generateRandomValue = (array) => array[Math.floor(Math.random() * array.length)];

const colorGenerator = () => {
  let newColor = "#";
  for (let i = 0; i < 6; i += 1) {
    newColor += generateRandomValue(letters);
  }
  return newColor;
};

const populateQuiz = () => {
  quizArray = [];
  const totalQuestions = 10;

  for (let i = 0; i < totalQuestions; i += 1) {
    const correct = colorGenerator();
    const options = new Set([correct]);

    while (options.size < 4) {
      options.add(colorGenerator());
    } 

    quizArray.push({
      correct,
      options: Array.from(options),
    });
  }
};

const showScore = () => {
  displayContainer.classList.add("hide");
  scoreContainer.classList.remove("hide");
  userScore.innerHTML = `Your score is ${scoreCount} out of ${quizArray.length}`;
  finalpara.innerHTML = `Thank you for playing!! Your score is ${scoreCount} out of ${quizArray.length}`;
  finalpara.classList.remove("hide");
};

const displayNext = () => {
  questionCount += 1;

  if (questionCount >= quizArray.length) {
    showScore();
    return; 
  }

  numOfQuestions.innerHTML = `${questionCount + 1} of ${quizArray.length} Questions`; 
  quizDisplay(questionCount);
  count = 10;
  clearInterval(countdown);
  timerDisplay();
  nextButton.classList.add("hide");
  finalpara.classList.add("hide");
};

nextButton.addEventListener("click", displayNext);

const timerDisplay = () => {
  timer.innerHTML = `Time Left:  ${count} s`; 

  countdown = setInterval(() => {
    if (count <= 0) {
      clearInterval(countdown);
      // Handle timeout: show correct answer
      let question = document.getElementsByClassName("container-mid")[questionCount];
      if (question) {
        let options = question.querySelectorAll(".option-div");
        options.forEach((element) => {
          if (element.getAttribute("data-option") === quizArray[questionCount].correct) {
            element.classList.add("correct");
          }
          element.disabled = true;
        });
      }
      nextButton.classList.remove("hide");
      return;
    }

    count -= 1;
    timer.innerHTML = `<span>Time Left:</span> ${count}`; 
  }, 1000);
};

const quizDisplay = (questionCount) => {
  let quizCards = document.querySelectorAll(".container-mid");
  quizCards.forEach((card) => {
    card.classList.add("hide");  
  }); 

  if (quizCards[questionCount]) {
    quizCards[questionCount].classList.remove("hide");
    let questionColorDiv = quizCards[questionCount].querySelector(".question-color");
    if (questionColorDiv) {
      questionColorDiv.style.backgroundColor = quizArray[questionCount].correct;
    }
  }
};

function quizCreator() {
  quizArray.sort(() => Math.random() - 0.5);

  for (let item of quizArray) {
    item.options.sort(() => Math.random() - 0.5);

    let div = document.createElement("div");
    div.classList.add("container-mid", "hide");

    numOfQuestions.innerHTML = "1 of  Question";

    let questionDiv = document.createElement("p");
    questionDiv.classList.add("question");
    questionDiv.innerHTML = '<div class="question-color"></div>';
    div.appendChild(questionDiv);

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    item.options.forEach((option) => {
      let button = document.createElement("button");
      button.classList.add("option-div");
      button.setAttribute("data-option", option);
      button.textContent = option;
      button.addEventListener("click", () => checker(button));
      buttonContainer.appendChild(button);
    });

    div.appendChild(buttonContainer);
    quizContainer.appendChild(div);
  }
}

function checker(userOption) {
  let userSolution = userOption.getAttribute("data-option");
  let question = document.getElementsByClassName("container-mid")[questionCount];
  let options = question.querySelectorAll(".option-div");

  if (userSolution === quizArray[questionCount].correct) {
    userOption.classList.add("correct");
    scoreCount += 1;
    currentScore.innerHTML = scoreCount;
  } else {
    userOption.classList.add("incorrect");
    options.forEach((element) => {
      if (element.getAttribute("data-option") === quizArray[questionCount].correct) {
        element.classList.add("correct");
      }
    });
  } 

  clearInterval(countdown);
  options.forEach((element) => {
    element.disabled = true;
  });

  nextButton.classList.remove("hide");
}

function initial() {
  nextButton.classList.add("hide");
  quizContainer.innerHTML = "";
  questionCount = 0;
  scoreCount = 0;
  currentScore.innerHTML = 0;
  finalpara.classList.add("hide");
  clearInterval(countdown);
  count = 10;
  timerDisplay();
  quizCreator();
  quizDisplay(questionCount); 
}

restart.addEventListener("click", () => {
  populateQuiz();
  initial();
  displayContainer.classList.remove("hide");
  scoreContainer.classList.add("hide");
});

if (startButton) {
  startButton.addEventListener("click", () => {
    if (startScreen) {
      startScreen.classList.add("hide");
    }
    displayContainer.classList.remove("hide");
    populateQuiz();
    initial();
  });
}

window.addEventListener("load", () => {
  populateQuiz();
  initial();
}); 