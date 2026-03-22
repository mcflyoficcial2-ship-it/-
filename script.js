// === ВСПОМОГАТЕЛЬНОЕ ===
function el(id){ return document.getElementById(id); }
function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

// === ДАННЫЕ (сохраняем ВСЁ) ===
let data = JSON.parse(localStorage.getItem("mathData")) || {
  total:0,
  correct:0,
  wrong:0,
  streak:0,
  bestStreak:0,
  xp:0,
  level:1,
  history:[],
  achievements:[],
  difficulty:1,
  correctStreak:0,
  wrongStreak:0
};

let currentAnswer = 0;

// === ГЕНЕРАЦИЯ ПРИМЕРОВ (АДАПТИВНАЯ) ===
function generate(){
  let a,b,op;
  let difficulty = data.difficulty;

  if(difficulty === 1){
    a = rand(1,9);
    b = rand(1,9);
    op = "+";
  }

  else if(difficulty === 2){
    a = rand(10,99);

    if(Math.random() < 0.6){
      b = Math.floor(rand(1,9))*10 + 9; // важный фикс
      op = "-";
    } else {
      b = rand(10,99);
      op = "+";
    }
  }

  else if(difficulty === 3){
    a = rand(100,999);
    b = rand(10,99);
    op = Math.random()<0.5?"+":"-";
  }

  else if(difficulty === 4){
    a = rand(2,9);
    b = rand(2,9);
    op = Math.random()<0.5?"×":"÷";
  }

  else if(difficulty === 5){
    a = rand(10,50);
    b = rand(2,10);
    op = Math.random()<0.5?"×":"÷";
  }

  if(op === "+") currentAnswer = a+b;
  if(op === "-") currentAnswer = a-b;
  if(op === "×") currentAnswer = a*b;
  if(op === "÷"){
    currentAnswer = a;
    a = a*b;
  }

  el("task").textContent = `${a} ${op} ${b}`;
}

// === AI РЕАКЦИИ ===
function aiMood(type){
  if(!el("avatar")) return;

  if(type==="correct") el("avatar").textContent = "😄";
  else el("avatar").textContent = "🤔";
}

// === АДАПТИВНАЯ СЛОЖНОСТЬ ===
function updateDifficulty(isCorrect){

  if(isCorrect){
    data.correctStreak++;
    data.wrongStreak = 0;
  } else {
    data.wrongStreak++;
    data.correctStreak = 0;
  }

  // повышение сложности
  if(data.correctStreak >= 3 && data.difficulty < 5){
    data.difficulty++;
    data.correctStreak = 0;
    if(el("aiText")) el("aiText").textContent = "🔥 Супер! Усложняем!";
  }

  // понижение сложности
  if(data.wrongStreak >= 2 && data.difficulty > 1){
    data.difficulty--;
    data.wrongStreak = 0;
    if(el("aiText")) el("aiText").textContent = "💡 Давай чуть проще!";
  }
}

// === УРОВЕНЬ ===
function checkLevel(){
  if(data.xp >= data.level*100){
    data.level++;
    if(el("aiText")) el("aiText").textContent = "🎉 Новый уровень!";
  }
}

// === ДОСТИЖЕНИЯ ===
function checkAchievements(){
  if(data.correct >= 10 && !data.achievements.includes("10")){
    data.achievements.push("10");
  }
}

// === ИСТОРИЯ ===
function saveHistory(){
  data.history.push(data.correct);
  if(data.history.length > 20) data.history.shift();
}

// === СОХРАНЕНИЕ ===
function save(){
  localStorage.setItem("mathData", JSON.stringify(data));
}

// === UI ===
function updateUI(){

  if(el("xp")) el("xp").textContent = data.xp;
  if(el("streak")) el("streak").textContent = data.streak;
  if(el("playerLevel")) el("playerLevel").textContent = data.level;

  if(el("xpBar")){
    el("xpBar").style.width = (data.xp % 100) + "%";
  }

  if(el("total")) el("total").textContent = data.total;
  if(el("correct")) el("correct").textContent = data.correct;
  if(el("wrong")) el("wrong").textContent = data.wrong;

  if(el("accuracy")){
    let acc = data.total ? Math.round(data.correct/data.total*100) : 0;
    el("accuracy").textContent = acc + "%";
  }

  if(el("bestStreak")) el("bestStreak").textContent = data.bestStreak;

  if(el("achievements")){
    el("achievements").textContent =
      data.achievements.length ? "🏆 Есть достижения!" : "Пока нет";
  }
}

// === ГРАФИК ===
function drawChart(){
  if(!document.getElementById("progressChart")) return;

  new Chart(document.getElementById("progressChart"),{
    type:"line",
    data:{
      labels:data.history.map((_,i)=>i+1),
      datasets:[{
        label:"Прогресс",
        data:data.history
      }]
    }
  });
}
