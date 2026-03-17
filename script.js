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
  lastDifficulty:1 // для AI‑адаптации
}

let currentAnswer = 0

// =================
// SOUNDS
// =================

const soundCorrect=new Audio("sounds/correct.mp3")
const soundWrong=new Audio("sounds/wrong.mp3")
const soundLevel=new Audio("sounds/level.mp3")
const soundClick=new Audio("sounds/click.mp3")

function playCorrect(){soundCorrect.currentTime=0;soundCorrect.play()}
function playWrong(){soundWrong.currentTime=0;soundWrong.play()}
function playLevel(){soundLevel.currentTime=0;soundLevel.play()}
function playClick(){soundClick.currentTime=0;soundClick.play()}

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
  // AI-адаптация: повышаем сложность если серия > 3, снижаем при 2 ошибках подряд
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

  el("hint").textContent="" // скрываем подсказку
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
  // простая стратегия устного счета
  // пример: если вычитание, предложить "сравни числа, вычти меньшее из большего"
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
    playLevel()
    aiMood("level")
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
// TRAINING LOGIC
// =================

function initTraining(){
  if(!el("startBtn"))return

  el("startBtn").onclick=()=>{
    playClick()
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
      playCorrect()
      data.correct++
      data.streak++
      data.xp+=10
      aiMood("correct")
      if(data.streak>data.bestStreak) data.bestStreak=data.streak
    } else {
      playWrong()
      data.wrong++
      data.streak=0
      aiMood("wrong")
      showHint() // показываем подсказку при ошибке
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
// INIT
// =================

document.addEventListener("DOMContentLoaded",()=>{
  updateUI()
  initTraining()
  drawChart()
})
