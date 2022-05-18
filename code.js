// varubals
let nMultipleCurrentQuestion = 0;
let nMultipleCorrectAnswers = 0;
let arrMultipleQuestions = [];
// const
const AMOUNT_OF_QUESTION = 10; // how many questions we want out of the array
const CODE = 5 // הקוד

let strLocation = "start-page" //המשתנה שומר את המקום של המשתמש ומחזיר אותו לשם בסגירת האודות

window.addEventListener("load", () => {
    document.querySelector(".loader").classList.add("fade");
    document.querySelector(".odot-logo").addEventListener("click", odot);
    setTimeout(() => {
        document.querySelector(`.div-rocket`).classList.add(`animation-rocket`);
        document.querySelector(`.div-mars`).style.visibility = "visible";
        // debugger;
        document.querySelector(`.animation-rocket`).addEventListener("animationend", () => {
            document.querySelector(`.start-button`).style.display = "block";
        })
    },5000);
    document.querySelector(`.start-button`).addEventListener("click", questionPage);
});

// פונקציה האחראית על פתיחת האודות
let odot = () => {
    document.querySelector(`.${strLocation}`).style.display = "none";
    document.querySelector(`.div-odot`).style.display = "block";  
    document.querySelector(`.div-body`).style.overflow = "hidden";
    document.querySelector(`.odot-logo`).style.display = "none";  
    document.querySelector(`#back-button-odot`).addEventListener("click", () => {
        document.querySelector(`.${strLocation}`).style.display = "block";
        document.querySelector(`.div-odot`).style.display = "none";  
        document.querySelector(`.odot-logo`).style.display = "block";  
        document.querySelector(`.div-body`).style.overflow = "scroll";
    })
}

let questionPage = () => {
    document.querySelector(`.start-page`).style.display = "none";
    document.querySelector(`.second-page`).style.display = "block";
    strLocation = "second-page";
    arrMultipleQuestions = shuffle(DATA.questions);
    addContentToQuestion();
}

/* addContentToQuestion
--------------------------------------------------------------
Description: */
const addContentToQuestion = () => {
    document.querySelector(`.multipleQuestionContainer`).innerHTML = "";
    // add question
    let question = El("div", {cls: `multipleQuestion`}, arrMultipleQuestions[nMultipleCurrentQuestion].question);
    document.querySelector(`.multipleQuestionContainer`).append(question);
    // add answeres
    if(arrMultipleQuestions[nMultipleCurrentQuestion].type === "multiple") {        
        let ansContainer = El("div", {cls: `ansContainer`},);
        document.querySelector(`.multipleQuestionContainer`).append(ansContainer);
        for(let i = 1; i <= 4; i++){
            let answer = El("div", {classes: [`multipleAns`, `ans${i}`, `ans`] , id: `ans${i}`,listeners: {click : onClickAnswer}}, arrMultipleQuestions[nMultipleCurrentQuestion][`ans${i}`]);
            document.querySelector(`.ansContainer`).append(answer);
        }
    } else {
        let ansContainer = El("div", {cls: `ansContainer`},
            El("div", {classes: [`binaryAns`, `true`, `ans`] , id: `true` ,listeners: {click : onClickAnswer}}, "נכון"),
            El("div", {classes: [`binaryAns`, `false`, `ans`] , id: `false` , listeners: {click : onClickAnswer}}, "לא נכון"),
        );
        document.querySelector(`.multipleQuestionContainer`).append(ansContainer);
    }
}

/* onClickAnswer
--------------------------------------------------------------
Description: */
const onClickAnswer = (event) => {
    // remove listeners
    let arrAns =  document.querySelectorAll(`.ans`);
    for(let i = 0; i < arrAns.length; i++){
        arrAns[i].removeEventListener("click" , onClickAnswer);
    }
    // debugger;
    // check if answer is correct
    if(event.currentTarget.classList[1] === String(arrMultipleQuestions[nMultipleCurrentQuestion].correctAns)){
        document.querySelector(`#${event.currentTarget.id}`).style.cssText = `background-image: url("assets/media/right_answer.svg");`;
        // console.log("נכון");
        nMultipleCorrectAnswers++;
    } else {
        document.querySelector(`#${event.currentTarget.id}`).style.cssText = `background-image: url("assets/media/wrong_answer.svg");`;
        // console.log("לא נכון");

    }

    // send to next question.
    nMultipleCurrentQuestion++;
    setTimeout(() => {
        if(nMultipleCurrentQuestion < AMOUNT_OF_QUESTION) {
            addContentToQuestion();
        } else {
            questionsEnd();
        }
    }, 1500)
}

/* questionsEnd
--------------------------------------------------------------
Description: */
const questionsEnd = () => {
    document.querySelector(`.second-page`).style.display = "none";
    document.querySelector(`.div-finish`).style.display = "flex";
    strLocation = "div-finish";
    if (nMultipleCorrectAnswers >= 7) {
        document.querySelector(`.h2-finish`).innerHTML = "הצלחתם!";
        document.querySelector(`.p-finish`).innerHTML =  `כל הכבוד! <br> עניתם על על ${nMultipleCorrectAnswers} תשובות נכונות! <br> <br> הקוד הוא ${CODE} `;

    } else {
        document.querySelector(`.h2-finish`).innerHTML = "הפסדתם";
        document.querySelector(`.p-finish`).innerHTML = "לא הצלחתם לענות על 7/10 מהשאלות נכון  <br>  ולכן לא תקבלו את הקוד";
        document.querySelector(`.try-again-button`).style.display = "block";
        document.querySelector(`.try-again-button`).addEventListener("click", restart);
    }
}

const restart = () => {
    nMultipleCurrentQuestion = 0;
    nMultipleCorrectAnswers = 0;
    arrMultipleQuestions = [];
    document.querySelector(`.try-again-button`).style.display = "none";
    strLocation = "second-page";
    document.querySelector(`.div-finish`).style.display = "none";
    document.querySelector(`.second-page`).style.display = "block";
    arrMultipleQuestions = shuffle(DATA.questions);
    addContentToQuestion();
}

/*
shuffle
------------------------------------------------
Description: take orgnaiz array and shffel it
Parameters: array.
------------------------------------------------
Programer: Gal
------------------------------------------------
*/
function shuffle(arr) {
    let tmp = arr.slice();
    for (let i = 0; i < arr.length; i++) {
        let index = Math.floor(Math.random() * tmp.length);
        arr[i] = tmp[index];
        tmp = tmp.slice(0, index).concat(tmp.slice(index + 1));
    }
    return arr;
}

function El(tagName, options = {}, ...children) {
    let el = Object.assign(document.createElement(tagName), options.fields || {});
    if (options.classes && options.classes.length) el.classList.add(...options.classes);
    else if (options.cls) el.classList.add(options.cls);
    if (options.id) el.id = options.id;
    el.append(...children.filter(el => el));
    for (let listenerName of Object.keys(options.listeners || {}))
        if (options.listeners[listenerName]) el.addEventListener(listenerName, options.listeners[listenerName], false);
    for (let attributeName of Object.keys(options.attributes || {})) {
        if (options.attributes[attributeName] !== undefined) el.setAttribute(attributeName, options.attributes[attributeName]);
    }
    return el;
}