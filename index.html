// =============================
// SAFE ELEMENT GET
// =============================

function el(id){
  return document.getElementById(id);
}

// =============================
// STATE
// =============================

let xp = Number(localStorage.getItem("xp")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;
let achievements = JSON.parse(localStorage.getItem("achievements") || "[]");

let playerLevel = Math.floor(xp / 100) + 1;
let currentAnswer = 0;

const XP_PER_LEVEL = 100;

// =============================
// LEVEL SETTINGS
// =============================

const levels = {
  1:{min:0,max:9},
  2:{min:10,max:99},
  3:{min:100,max:999},
  4:{min:1000,max:9999},
  5:{min:10000,max:99999}
};

// =============================
// RANDOM
// =============================

function random(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

// =============================
// SAVE
// =============================

function save(){
  localStorage.setItem("xp",xp);
  localStorage.setItem("streak",streak);
  localStorage.setItem("achievements",JSON.stringify(achievements));
}

// =============================
// UI UPDATE
// =============================

function updateUI(){

  if(el("xp")) el("xp").textContent = xp;
  if(el("streak")) el("streak").textContent = streak;
  if(el("playerLevel")) el("playerLevel").textContent = playerLevel;

  if(el("xpBar")){
    const progress = xp % XP_PER_LEVEL;
    el("xpBar").style.width = (progress / XP_PER_LEVEL)*100 + "%";
  }
}

// =============================
// CONFETTI
// =============================

function confetti(){

  for(let i=0;i<25;i++){

    const c = document.createElement("div");

    c.style.position="fixed";
    c.style.width="8px";
    c.style.height="8px";
    c.style.background=`hsl(${Math.random()*360}deg,100%,50%)`;
    c.style.left=Math.random()*100+"vw";
    c.style.top="-10px";
    c.style.zIndex=9999;

    document.body.appendChild(c);

    const fall = setInterval(()=>{

      c.style.top = (c.offsetTop+5)+"px";

      if(c.offsetTop > window.innerHeight){
        clearInterval(fall);
        c.remove();
      }

    },16);

  }

}

// =============================
// LEVEL UP
// =============================

function checkLevelUp(){

  const newLevel = Math.floor(xp / XP_PER_LEVEL) + 1;

  if(newLevel > playerLevel){

    playerLevel = newLevel;

    confetti();

    const card = document.querySelector(".card");
    if(card){
      card.classList.add("level-up");
      setTimeout(()=>card.classList.remove("level-up"),800);
    }

  }

}

// =============================
// ACHIEVEMENTS
// =============================

function checkAchievements(){

  const list = [];

  if(xp >= 100) list.push("Первый уровень");
  if(streak >= 5) list.push("Серия 5");
  if(streak >= 10) list.push("Серия 10");
  if(xp >= 500) list.push("500 XP");

  list.forEach(a=>{
    if(!achievements.includes(a)){
      achievements.push(a);
      alert("🏆 Достижение: "+a);
    }
  });

}

// =============================
// GENERATE TASK
// =============================

function generateTask(){

  const levelSelect = el("levelSelect");
  const task = el("task");

  if(!levelSelect || !task) return;

  const {min,max} = levels[levelSelect.value];

  const a = random(min,max);
  const b = random(min,max);

  const op = Math.random()<0.5?"+":"-";

  currentAnswer = op==="+"?a+b:a-b;

  task.textContent = `${a} ${op} ${b} = ?`;

}

// =============================
// SOUND
// =============================

function playSound(){

  const audio = new Audio(
    "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
  );

  audio.play();

}

// =============================
// TIMER MODE
// =============================

let timer=null;
let timeLeft=60;

function startTimer(){

  const timerDiv = el("timer");

  if(!timerDiv) return;

  timeLeft=60;

  timerDiv.textContent="⏱ 60";

  timer=setInterval(()=>{

    timeLeft--;

    timerDiv.textContent="⏱ "+timeLeft;

    if(timeLeft<=0){

      clearInterval(timer);

      alert("⏰ Время вышло!");

    }

  },1000);

}

// =============================
// TRAINING INIT
// =============================

function initTraining(){

  const startBtn = el("startBtn");
  const checkBtn = el("checkBtn");
  const stopBtn = el("stopBtn");
  const answer = el("answer");

  if(!startBtn) return;

  startBtn.onclick=()=>{

    generateTask();

    startBtn.classList.add("hidden");
    checkBtn.classList.remove("hidden");
    stopBtn.classList.remove("hidden");

    startTimer();

  };

  checkBtn.onclick=()=>{

    if(!answer) return;

    const val = answer.value.trim();

    if(val==="") return;

    const num = Number(val);

    if(num===currentAnswer){

      streak++;
      xp += 10 + streak*2;

      playSound();

    }else{

      streak=0;

    }

    checkLevelUp();
    checkAchievements();
    save();
    updateUI();

    answer.value="";

    generateTask();

  };

  stopBtn.onclick=()=>{

    startBtn.classList.remove("hidden");
    checkBtn.classList.add("hidden");
    stopBtn.classList.add("hidden");

    clearInterval(timer);

    if(el("task")) el("task").textContent="Нажми Start 🚀";

  };

}

// =============================
// INIT
// =============================

document.addEventListener("DOMContentLoaded",()=>{

  updateUI();
  initTraining();

});
