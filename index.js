// validation of form
// fetch api
// map question, start timer, check ans
// show ans

const list = document.querySelector(".options");
const scoreText = document.querySelector(".score");
const header = document.querySelector(".header");
const timerText = document.querySelector(".timer");
const nextBtn = document.querySelector(".btn-next");
const submitBtn = document.querySelector(".btn-sub");
const username = document.querySelector("#username");
const questionTitle = document.querySelector(".title");
const resultsBlock = document.querySelector(".results");
const questionContainer = document.querySelector("#quiz");
const formContainer = document.querySelector("#registration-form");

const resultScore = document.querySelector(".res-score");
const resultUsername = document.querySelector(".res-username");

let questions;
let score = 0;
let timer = 20;
let currentQuestion = 0;

const getNextQuestion = () => {
    timer = 20;
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestions();
    } else {
        header.classList.add("hidden");
        questionContainer.classList.add("hidden");
        resultsBlock.classList.remove("hidden");
        resultScore.innerHTML = `Score: ${score}/${questions.length}`;
        resultUsername.innerHTML = `Username: ${username.value}`;

        document.querySelector("#image").src = "./done.svg"
    }
}

const checkAnswer = () => {
    timer = 0;

    let questionDetails = questions[currentQuestion]
    let selectedOption = document.querySelector("input[name='radio']:checked");

    if (selectedOption?.value === questionDetails.correct_answer) {
        selectedOption?.parentElement.classList.add("green");
        score++; 
    } else {
        document.querySelector(`input[value='${questionDetails.correct_answer}']`)?.parentElement.classList.add("green");
        selectedOption?.parentElement.classList.add("red");
    }

    Array.from(document.querySelectorAll("input[name='radio']")).map((input) => {
        input.disabled = true;
    })


    submitBtn.disabled = true;
    nextBtn.disabled = false;
}

const getTimer = () => {
    if (timer == 0) {
        checkAnswer();
    } else {
        timer--;
        timerText.textContent = timer
    }
}

const showQuestions = () => {
    document.querySelector("#image").src = "./test.svg"
    let timeInterval = setInterval(() => {
        getTimer();
        console.log("Time's up!!!", timer);
        if (timer == 0) {
            clearInterval(timeInterval);
            checkAnswer();
        }
    }, 1000)

    header.classList.remove("hidden")
    scoreText.textContent = score;

    let questionDetails = questions[currentQuestion]
    questionTitle.innerHTML = questionDetails.question;

    let random = Math.floor(Math.random() * 3);
    questionDetails.incorrect_answers.splice(random, 0, questionDetails.correct_answer);

    list.innerHTML = "";
    submitBtn.disabled = false;
    nextBtn.disabled = true;

    questionDetails.incorrect_answers.map((listItem) => {
        let radiobtn = document.createElement("input");
        radiobtn.type = "radio";
        radiobtn.name = "radio";
        radiobtn.value = listItem;
        radiobtn.style.display = "none";

        let radiobtnLabel = document.createElement("label");
        radiobtnLabel.classList.add("option");
        radiobtnLabel.addEventListener("click", () =>{
            radiobtnLabel.classList.add("selected")
        })
        radiobtnLabel.innerHTML = listItem;
        radiobtnLabel.appendChild(radiobtn);
        list.appendChild(radiobtnLabel);
    })
}

const displayError = (error) => {
    var questionElement = document.getElementById('error-block');
    console.log(questionElement)
    questionElement.innerHTML = '<p>Error: ' + error.message + '</p>';
}

submitBtn?.addEventListener("click", checkAnswer)
nextBtn?.addEventListener("click", getNextQuestion)

document.getElementById('registration-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    let level = document.querySelector('#level');
    let questionCategory = document.querySelector('#category');
    let category = questionCategory.options[questionCategory.selectedIndex].value;
    let numberOfQuestions = document.querySelector('#number-question').value;
    let levelValue = level.options[level.selectedIndex].value;

    try {
        const res = await fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${levelValue}&type=multiple`)
        const data = await res.json();
        questions = data.results
        showQuestions();
        formContainer.classList.add("hidden");
        questionContainer.classList.remove("hidden");
    } catch (error) {
        displayError(error);
    }
});
