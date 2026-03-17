"use strict"

function el(id){return document.getElementById(id)}

// =================
// DATA
// =================

let data = JSON.parse(localStorage.getItem("mathTrainerData")) || {
  xp:0,
  streak:0,
  bestStreak:0,
  correct:0,
  wrong:0,
  total:0,
  history:[],
  achievements:[],
  lastDifficulty:1
}

let currentAnswer = 0

// =================
// SAVE
// =================

function save(){
  localStorage.setItem("mathTrainerData",JSON.stringify(data))
}

// =================
// AI-LEVEL ADAPTATION
// =================

function getDifficulty(){
  if(data.streak >= 3 && data.lastDifficulty < 5) data.lastDifficulty++
  if(data.streak === 0 && data.wrong >=2 && data.lastDifficulty>1) data.lastDifficulty--
  return data.lastDifficulty
}

// =================
// TASK GENERATION
// =================

function generate(){
  let difficulty = getDifficulty()
  let levels={
    1:{min:0,max:9},
    2:{min:10,max:99},
    3:{min:100,max:999},
    4:{min:1000,max:9999},
    5:{min:10000,max:99999}
  }

  let lvl = levels[difficulty]
  let a = Math.floor(Math.random()*(lvl.max-lvl.min+1))+lvl.min
  let b = Math.floor(Math.random()*(lvl.max-lvl.min+1))+lvl.min
  let op = Math.random()<0.5?"+":"-"

  if(op==="-" && b>a){let t=a;a=b;b=t}

  currentAnswer = op==="+"? a+b : a-b
  el("task").textContent=`${a} ${op} ${b} = ?`
  el("hint").textContent=""
}

// =================
// SAVE HISTORY
// =================

function saveHistory(){
  let today = new Date().toLocaleDateString()
  let entry = data.history.find(d=>d.date===today)
  if(entry) entry.total++
  else data.history.push({date:today,total:1})
}

// =================
// AI-PERSONAL HINTS
// =================

function showHint(){
  if(!el("hint")) return
  let hint=""
  let taskText=el("task").textContent
  if(taskText.includes("-")){
    hint="Сравни числа и вычти меньшее из большего."
  } else if(taskText.includes("+")){
    hint="Сложи числа по единицам, потом десятки."
  }
  el("hint").textContent="💡 Подсказка: "+hint
}

// =================
// AI-AVATAR
// =================

function aiMood(type){
  if(!el("avatar")) return
  if(type==="correct"){el("avatar").textContent="😄";el("aiText").textContent="Отлично!"}
  if(type==="wrong"){el("avatar").textContent="🤔";el("aiText").textContent="Попробуй ещё!"}
  if(type==="level"){el("avatar").textContent="🥳";el("aiText").textContent="Новый уровень!"}
}

// =================
// CHECK LEVEL
// =================

function checkLevel(){
  let newLevel=Math.floor(data.xp/100)+1
  if(newLevel > Math.floor(data.xp/100)){
    aiMood("level")
    confetti()
  }
}

// =================
// CHECK ACHIEVEMENTS
// =================

function updateAchievements(){
  if(!el("achievements"))return
  el("achievements").innerHTML=""
  data.achievements.forEach(a=>{
    let div=document.createElement("div")
    div.textContent="🏆 "+a
    el("achievements").appendChild(div)
  })
}

function checkAchievements(){
  if(data.xp>=100 && !data.achievements.includes("100 XP")) data.achievements.push("100 XP")
  if(data.bestStreak>=10 && !data.achievements.includes("Серия 10")) data.achievements.push("Серия 10")
}

// =================
// CONFETTI
// =================

function confetti(){
  for(let i=0;i<25;i++){
    let c=document.createElement("div")
    c.style.position="fixed"
    c.style.width="8px"
    c.style.height="8px"
    c.style.background=`hsl(${Math.random()*360},100%,50%)`
    c.style.left=Math.random()*100+"vw"
    c.style.top="-10px"
    document.body.appendChild(c)
    let fall=setInterval(()=>{
      c.style.top=(c.offsetTop+5)+"px"
      if(c.offsetTop>window.innerHeight){clearInterval(fall);c.remove()}
    },16)
  }
}

// =================
// TRAINING LOGIC
// =================

function initTraining(){
  if(!el("startBtn"))return
  el("startBtn").onclick=()=>{
    generate()
    el("startBtn").style.display="none"
    el("checkBtn").style.display="block"
  }

  el("checkBtn").onclick=()=>{
    let val=el("answer").value.trim()
    if(val==="") return
    let num=Number(val)

    data.total++
    saveHistory()

    if(num===currentAnswer){
      data.correct++
      data.streak++
      data.xp+=10
      aiMood("correct")
      if(data.streak>data.bestStreak) data.bestStreak=data.streak
    } else {
      data.wrong++
      data.streak=0
      aiMood("wrong")
      showHint()
    }

    checkLevel()
    checkAchievements()
    save()
    updateUI()
    el("answer").value=""
    generate()
  }
}

// =================
// RESET
// =================

function resetProgress(){
  if(confirm("Сбросить прогресс?")){
    localStorage.removeItem("mathTrainerData")
    location.reload()
  }
}

// =================
// DRAW GRAPH
// =================

function drawChart(){
  if(!document.getElementById("progressChart"))return
  let labels=data.history.map(d=>d.date)
  let values=data.history.map(d=>d.total)
  let ctx=document.getElementById("progressChart")
  new Chart(ctx,{
    type:"line",
    data:{labels:labels,datasets:[{label:"Решено задач",data:values,tension:0.3}]}
  })
}

// =================
// UI UPDATE
// =================

function updateUI(){
  if(el("xp")) el("xp").textContent=data.xp
  if(el("streak")) el("streak").textContent=data.streak
  if(el("playerLevel")) el("playerLevel").textContent=Math.floor(data.xp/100)+1
  if(el("xpBar")) el("xpBar").style.width=(data.xp%100)+"%"
  updateStats()
  updateAchievements()
}

function updateStats(){
  if(!el("total")) return
  let accuracy=data.total?Math.round(data.correct/data.total*100):0
  el("total").textContent=data.total
  el("correct").textContent=data.correct
  el("wrong").textContent=data.wrong
  el("accuracy").textContent=accuracy+"%"
  el("bestStreak").textContent=data.bestStreak
}

// =================
// INIT
// =================

document.addEventListener("DOMContentLoaded",()=>{
  updateUI()
  initTraining()
  drawChart()
})
