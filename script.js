\  // =======================
// GLOBAL STATE
// =======================

let xp = Number(localStorage.getItem("xp")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;
let playerLevel = Math.floor(xp / 100) + 1;

const XP_PER_LEVEL = 100;

// =======================
// SAVE / LOAD
// =======================

function saveProgress(){
    localStorage.setItem("xp", xp);
    localStorage.setItem("streak", streak);
}

function updateStatsUI(){
    const xpSpan = document.getElementById("xp");
    const streakSpan = document.getElementById("streak");
    const levelSpan = document.getElementById("playerLevel");
    const xpBar = document.getElementById("xpBar");

    if(xpSpan) xpSpan.textContent = xp;
    if(streakSpan) streakSpan.textContent = streak;
    if(levelSpan) levelSpan.textContent = playerLevel;

    if(xpBar){
        const progress = xp % XP_PER_LEVEL;
        xpBar.style.width = (progress / XP_PER_LEVEL) * 100 + "%";
    }
}

// =======================
// LEVEL UP
// =======================

function checkLevelUp(){
    const newLevel = Math.floor(xp / XP_PER_LEVEL) + 1;
    if(newLevel > playerLevel){
        playerLevel = newLevel;
        const card = document.querySelector(".card");
        if(card){
            card.classList.add("level-up");
            setTimeout(()=>card.classList.remove("level-up"),800);
        }
    }
}

// =======================
// TRAINING LOGIC
// =======================

let currentAnswer = 0;

const levels = {
  1:{min:0,max:9},
  2:{min:10,max:99},
  3:{min:100,max:999},
  4:{min:1000,max:9999},
  5:{min:10000,max:99999}
};

function random(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function generateExample(){
    const levelSelect = document.getElementById("levelSelect");
    if(!levelSelect) return;

    const level = levelSelect.value;
    const {min,max} = levels[level];

    const a = random(min,max);
    const b = random(min,max);
    const op = Math.random() < 0.5 ? "+" : "-";

    currentAnswer = op === "+" ? a + b : a - b;

    const taskDiv = document.getElementById("task");
    if(taskDiv){
        taskDiv.textContent = `${a} ${op} ${b} = ?`;
    }
}

function playSound(){
    const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
    audio.play();
}

function initTraining(){

    const startBtn = document.getElementById("startBtn");
    const checkBtn = document.getElementById("checkBtn");
    const stopBtn = document.getElementById("stopBtn");
    const answerInput = document.getElementById("answer");
    const aiText = document.getElementById("aiText");

    if(!startBtn) return;

    startBtn.addEventListener("click", ()=>{
        generateExample();
        startBtn.classList.add("hidden");
        checkBtn.classList.remove("hidden");
        stopBtn.classList.remove("hidden");
        aiText.textContent = "Поехали! 🚀";
    });

    checkBtn.addEventListener("click", ()=>{
        const value = answerInput.value.trim();
        if(value === "") return;

        const userAnswer = Number(value);

        if(userAnswer === currentAnswer){
            streak++;
            xp += 10 + streak * 2;
            playSound();
            aiText.textContent = "Отлично! 🚀";
        } else {
            streak = 0;
            aiText.textContent = "Попробуем ещё!";
        }

        checkLevelUp();
        saveProgress();
        updateStatsUI();

        answerInput.value = "";
        generateExample();
    });

    stopBtn.addEventListener("click", ()=>{
        startBtn.classList.remove("hidden");
        checkBtn.classList.add("hidden");
        stopBtn.classList.add("hidden");
        document.getElementById("task").textContent = "Нажми Start 🚀";
        aiText.textContent = "Хочешь ещё тренировку?";
    });
}

// =======================
// INIT
// =======================

document.addEventListener("DOMContentLoaded", ()=>{
    updateStatsUI();
    initTraining();
});
