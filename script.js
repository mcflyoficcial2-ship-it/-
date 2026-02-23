let a,b,correct,isActive=false;
let data={xp:0,level:1,streak:0,history:[]};
let chart;

const task=document.getElementById('task');
const answer=document.getElementById('answer');
const xpBar=document.getElementById('xpBar');
const xpSpan=document.getElementById('xp');
const levelSpan=document.getElementById('level');
const streakSpan=document.getElementById('streak');
const aiText=document.getElementById('aiText');
const historyDiv=document.getElementById('history');

const startBtn=document.getElementById("startBtn");
const checkBtn=document.getElementById("checkBtn");
const stopBtn=document.getElementById("stopBtn");

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
aiText.innerText="Отличная работа! Хочешь ещё?";
}

function newTask(){
if(!isActive) return;
a=Math.floor(Math.random()*20)+1;
b=Math.floor(Math.random()*20)+1;
correct=a+b;
task.innerText=`${a} + ${b}`;
answer.value="";
}

function checkAnswer(){
if(!isActive||answer.value==="") return;

let ok=Number(answer.value)===correct;
data.history.push({task:`${a}+${b}`,correct:ok});

if(ok){
data.xp+=10;
data.streak++;
showXP();
confetti();
aiText.innerText="🔥 Супер!";
}else{
data.streak=0;
aiText.innerText="🙂 Попробуем ещё!";
}

levelUp();
updateUI();
newTask();
}

function levelUp(){
let need=data.level*100;
if(data.xp>=need){
data.xp-=need;
data.level++;
confetti();
aiText.innerText="🏆 Новый уровень!";
}
}

function updateUI(){
xpSpan.innerText=data.xp;
levelSpan.innerText=data.level;
streakSpan.innerText=data.streak;
xpBar.style.width=(data.xp/(data.level*100))*100+"%";
}

function showXP(){
let el=document.createElement("div");
el.className="xp-float";
el.innerText="+10 XP";
document.getElementById("child").appendChild(el);
setTimeout(()=>el.remove(),1000);
}

function confetti(){
for(let i=0;i<25;i++){
let c=document.createElement("div");
c.className="confetti";
c.style.left=Math.random()*100+"%";
c.style.background=`hsl(${Math.random()*360},70%,60%)`;
document.body.appendChild(c);
setTimeout(()=>c.remove(),2000);
}
}

function showStats(){
const last10=data.history.slice(-10);
const correctCount=last10.filter(h=>h.correct).length;
const wrongCount=last10.filter(h=>!h.correct).length;

historyDiv.innerHTML=last10.map(h=>h.task+" "+(h.correct?"✅":"❌")).join("<br>");

if(!chart){
chart=new Chart(document.getElementById('chart'),{
type:'bar',
data:{
labels:['Верные','Неверные'],
datasets:[{
data:[correctCount,wrongCount],
backgroundColor:['#22c55e','#ef4444']
}]
},
options:{responsive:true,plugins:{legend:{display:false}}}
});
}else{
chart.data.datasets[0].data=[correctCount,wrongCount];
chart.update();
}
}
