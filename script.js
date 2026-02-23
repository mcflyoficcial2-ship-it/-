document.addEventListener("DOMContentLoaded", function() {

let a, b, correct, operator, isActive=false;
let data = {xp:0, streak:0, history:[]};
let chart;

const task = document.getElementById('task');
const answer = document.getElementById('answer');
const xpBar = document.getElementById('xpBar');
const xpSpan = document.getElementById('xp');
const streakSpan = document.getElementById('streak');
const aiText = document.getElementById('aiText');
const historyDiv = document.getElementById('history');
const startBtn = document.getElementById("startBtn");
const checkBtn = document.getElementById("checkBtn");
const stopBtn = document.getElementById("stopBtn");
const levelSelect = document.getElementById("levelSelect");

// Привязка кнопок
startBtn.addEventListener("click", startGame);
checkBtn.addEventListener("click", checkAnswer);
stopBtn.addEventListener("click", stopGame);

function enterChild(){
  document.getElementById('roleSelect').classList.add('hidden');
  document.getElementById('child').classList.remove('hidden');
}

function enterParent(){
  document.getElementById('roleSelect').classList.add('hidden');
  document.getElementById('statsPage').classList.remove('hidden');
  showStats();
}

function enterTeacher(){ enterParent(); }

function backToMenu(){
  document.getElementById('child').classList.add('hidden');
  document.getElementById('statsPage').classList.add('hidden');
  document.getElementById('roleSelect').classList.remove('hidden');
}

function startGame(){
  isActive=true;
  data.streak=0;

  startBtn.classList.add("hidden");
  checkBtn.classList.remove("hidden");
  stopBtn.classList.remove("hidden");

  aiText.innerText="Поехали! 🚀";
  newTask();
}

function stopGame(){
  isActive=false;

  startBtn.classList.remove("hidden");
  checkBtn.classList.add("hidden");
  stopBtn.classList.add("hidden");

  task.innerText="Нажми старт 🚀";
  aiText.innerText="Отличная работа!";
}

function getRange(){
  const level = Number(levelSelect.value);
  switch(level){
    case 1: return [0,9];
    case 2: return [10,99];
    case 3: return [100,999];
    case 4: return [1000,9999];
    case 5: return [10000,99999];
    default: return [0,9];
  }
}

function newTask(){
  if(!isActive) return;

  const [min, max] = getRange();
  a = Math.floor(Math.random()*(max-min+1))+min;
  b = Math.floor(Math.random()*(max-min+1))+min;

  operator = Math.random() > 0.5 ? "+" : "-";
  if(operator === "-"){
    if(b > a) [a,b] = [b,a]; // не отрицательные
    correct = a - b;
  } else {
    correct = a + b;
  }

  task.innerText = `${a} ${operator} ${b}`;
  answer.value = "";
}

function checkAnswer(){
  if(!isActive || answer.value==="") return;

  const ok = Number(answer.value) === correct;
  data.history.push({task:`${a}${operator}${b}`, correct: ok});

  if(ok){
    data.xp += 10;
    data.streak++;
    showXP();
    confetti();
    aiText.innerText = "🔥 Отлично!";
  } else {
    data.streak = 0;
    aiText.innerText = "🙂 Попробуем ещё!";
  }

  updateUI();
  newTask();
}

function updateUI(){
  xpSpan.innerText = data.xp;
  streakSpan.innerText = data.streak;
  const level = Number(levelSelect.value);
  xpBar.style.width = Math.min(data.xp / (level*100) * 100, 100) + "%";
}

function showXP(){
  const el = document.createElement("div");
  el.className="xp-float";
  el.innerText="+10 XP";
  document.getElementById("child").appendChild(el);
  setTimeout(()=>el.remove(),1000);
}

function confetti(){
  for(let i=0;i<25;i++){
    const c = document.createElement("div");
    c.className="confetti";
    c.style.left = Math.random()*100 + "%";
    c.style.background = `hsl(${Math.random()*360},70%,60%)`;
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),2000);
  }
}

function showStats(){
  const last10 = data.history.slice(-10);
  const correctCount = last10.filter(h=>h.correct).length;
  const wrongCount = last10.filter(h=>!h.correct).length;

  historyDiv.innerHTML = last10.map(h=>h.task + " " + (h.correct ? "✅":"❌")).join("<br>");

  if(!chart){
    chart = new Chart(document.getElementById('chart'),{
      type:'bar',
      data:{
        labels:['Верные','Неверные'],
        datasets:[{
          data:[correctCount,wrongCount],
          backgroundColor:['#22c55e','#ef4444']
        }]
      },
      options:{responsive:true, plugins:{legend:{display:false}}}
    });
  } else {
    chart.data.datasets[0].data = [correctCount, wrongCount];
    chart.update();
  }
}

}); // конец DOMContentLoaded