let change1 = document.querySelector(".change1");
let page = document.querySelector("html");
let change2 = document.querySelector(".change2");
if (localStorage.getItem("changed") == 1) {
    page.style.filter = "invert(1)";
    change1.style.display = "none";
    change2.style.display = "block";
}
change1.onclick = function() {
    page.style.filter = "invert(1)";
    this.style.display = "none";
    change2.style.display = "block";
    localStorage.setItem("changed", 1);
}
change2.onclick = function() {
    page.style.filter = "invert(0)";
    this.style.display = "none";
    change1.style.display = "block";
    localStorage.setItem("changed", 0);
}

let choose = document.querySelector(".choose");
let secondsSpan = document.querySelector(".message .seconds");
let timeLeftSpan = document.querySelector(".time span");
choose.onchange = function() {
    let levelname, seconds, len;
    if (choose.value == "easy") {
        levelname = "easy";
        seconds = 9;
        len = "short";
    }
    else if (choose.value == "medium")  {
        levelname = "medium";
        seconds = 6;
        len = " between short and long";
    }
    else if (choose.value == "hard") {
        levelname = "hard";
        seconds = 3;
        len = "long";
    }
    else {
        levelname = "...";
        seconds = "...";
        len = "...";
    }
    secondsSpan.innerHTML = seconds;
    document.querySelector(".len").innerHTML = len;
    document.querySelector(".message2 .lvl").innerHTML = levelname;
    document.querySelector(".message2 .seconds").innerHTML = seconds;
    timeLeftSpan.innerHTML = seconds;
    document.querySelector(".last").innerHTML = levelname;
}

let input = document.querySelector(".input");
input.oninput = function () {
    new Audio("./sounds/keyboard.mp3").play();
}
input.onpaste = function () {
    return false;
};

let loca = document.querySelector(".loca");
let loca2 = document.querySelector(".loca2");
let loca3 = document.querySelector(".loca3");
let del = document.querySelector(".del");
if (localStorage.getItem("high") && localStorage.getItem("high") > 0) {
    loca.innerHTML = localStorage.getItem("high");
    loca3.innerHTML = localStorage.getItem("level");
    loca2.style.display = "block";
    del.style.display = "block";
}
else {
    localStorage.setItem("high", 0);
}

del.onclick = function() {
    new Audio("./sounds/reset.mp3").play();
    loca.innerHTML = 0;
    localStorage.setItem("high", 0);
    loca2.style.display = "none";
    localStorage.removeItem("level");
    this.style.display = "none";
}

let back = document.querySelector(".back");
back.onclick = function() {
    location.reload();
}

let words = [];
let startButton = document.querySelector(".start");
let sms2 = document.querySelector(".message2");
let high = document.querySelector(".high");
let give = document.querySelector(".give");
startButton.onclick = function () {
    if (choose.value == "") {
        alert("You must choose level before you can start playing");
        return false;
    }
    new Audio("./sounds/go.mp3").play();
    document.querySelector(".message").remove();
    sms2.style.cssText = "display: flex; justify-content: center; align-items: center";
    this.innerHTML = "Let's go";
    this.style.backgroundColor = "orange";
    this.style.cursor = "default"
    this.onclick = function () {
        return false;
    }
    input.focus();
    input.value = "";
    input.setAttribute("placeholder", "")
    high.style.display = "none";
    give.style.display = "block";
    if (secondsSpan.innerHTML == 9) {
        words = ["cat", "to", "by", "me", "if", "you", "at", "us", "in", "ok"];
    }
    else if (secondsSpan.innerHTML == 6) {
        words = ["METHOD", "code", "legal", "ORANGE", "hit", "repeat", "HELLO", "predict", "opposite", "through"];
    }
    else {
        words = ["Negotiation", "marketing", "participant", "president", "coverage", "widespread", "headline",
        "Remarkable", "Interview", "conversation"];
    }
    genwords();
}

give.onclick = function() {
    location.reload();
}

let theWord = document.querySelector(".the-word");
let upcomingWords = document.querySelector(".upcoming-words");
function genwords() {
    let randomWord = words[Math.floor(Math.random() * words.length)];
    theWord.innerHTML = randomWord;
    words.splice(words.indexOf(randomWord), 1);
    upcomingWords.innerHTML = "";
    for (let i = 0; i < words.length; i++) {
        let div = document.createElement("div");
        let txt = document.createTextNode(words[i]);
        div.appendChild(txt);
        upcomingWords.appendChild(div);
    }
    if (upcomingWords.hasChildNodes() == 0) {
        upcomingWords.remove();
    }
    startplay();
}

let scoreGot = document.querySelector(".score .got");
let span = document.createElement("span");
let finishMessage = document.querySelector(".finish");
let time = document.querySelector(".time");
function startplay() {
    let start = setInterval (function() {
        timeLeftSpan.innerHTML--;
        if (input.value == theWord.innerHTML) {
            new Audio("right.m4a").play();
            clearInterval(start);
            scoreGot.innerHTML++;
            if (words.length != 0) {
                input.value = '';
                timeLeftSpan.innerHTML = secondsSpan.innerHTML;
                genwords();
            }
            else {
                clearInterval(start);
                span.className = 'good';
                let spanText = document.createTextNode("Mission completed");
                span.appendChild(spanText);
                finishMessage.appendChild(span);
                sms2.remove();
                startButton.remove();
                theWord.remove();
                input.remove();
                time.remove();
                localStorage.setItem("high", scoreGot.innerHTML);
                loca.innerHTML = scoreGot.innerHTML;
                localStorage.setItem("level", choose.value);
                loca3.innerHTML = choose.value;
                high.style.display = "block";
                loca2.style.display = "block";
                del.style.display = "block";
                give.remove();
                back.style.display = "block"
            }
        }
        else if (timeLeftSpan.innerHTML == 0) {
            clearInterval(start);
            new Audio("./sounds/error.mp3").play();
            span.className = 'bad';
            let spanText = document.createTextNode("Mission failed");
            span.appendChild(spanText);
            finishMessage.appendChild(span);
            sms2.remove();
            startButton.remove();
            theWord.remove();
            input.remove();
            upcomingWords.remove();
            time.remove();
            if (parseInt(scoreGot.innerHTML) >= parseInt(localStorage.getItem("high"))) {
                localStorage.setItem("high", scoreGot.innerHTML);
                loca.innerHTML = scoreGot.innerHTML;
                localStorage.setItem("level", choose.value);
                loca3.innerHTML = choose.value;
            }
            high.style.display = "block";
            if (loca.innerHTML > 0) {
                loca2.style.display = "block";
                del.style.display = "block";
            }
            give.remove();
            back.style.display = "block";
        }
        else {
            new Audio("./sounds/timer.mp3").play();
        }
    }, 1000);
};