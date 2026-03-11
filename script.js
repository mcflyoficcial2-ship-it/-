function el(id){return document.getElementById(id)}

let xp=Number(localStorage.getItem("xp"))||0
let streak=Number(localStorage.getItem("streak"))||0
let achievements=JSON.parse(localStorage.getItem("achievements")||"[]")
let level=Math.floor(xp/100)+1
let currentAnswer=0
let timer
let time=60

const levels={
1:{min:0,max:9},
2:{min:10,max:99},
3:{min:100,max:999},
4:{min:1000,max:9999},
5:{min:10000,max:99999}
}

function random(min,max){
return Math.floor(Math.random()*(max-min+1))+min
}

function save(){
localStorage.setItem("xp",xp)
localStorage.setItem("streak",streak)
localStorage.setItem("achievements",JSON.stringify(achievements))
}

function updateUI(){

if(el("xp")) el("xp").textContent=xp
if(el("streak")) el("streak").textContent=streak
if(el("playerLevel")) el("playerLevel").textContent=level

if(el("xpBar")){
let progress=xp%100
el("xpBar").style.width=progress+"%"
}

showAchievements()
}

function showAchievements(){

if(!el("achievements")) return

el("achievements").innerHTML=""

achievements.forEach(a=>{
let div=document.createElement("div")
div.textContent="🏆 "+a
el("achievements").appendChild(div)
})
}

function checkAchievements(){

if(xp>=100 && !achievements.includes("100 XP")){
achievements.push("100 XP")
alert("🏆 Достижение: 100 XP")
}

if(streak>=5 && !achievements.includes("Серия 5")){
achievements.push("Серия 5")
alert("🏆 Серия 5!")
}

}

function confetti(){

for(let i=0;i<20;i++){

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

if(c.offsetTop>window.innerHeight){
clearInterval(fall)
c.remove()
}

},16)

}

}

function generate(){

if(!el("levelSelect")) return

let lvl=levels[el("levelSelect").value]

let a=random(lvl.min,lvl.max)
let b=random(lvl.min,lvl.max)

let op=Math.random()<0.5?"+":"-"

currentAnswer=op=="+"?a+b:a-b

el("task").textContent=`${a} ${op} ${b} = ?`

}

function startTimer(){

time=60

timer=setInterval(()=>{

time--

if(el("timer")) el("timer").textContent="⏱ "+time

if(time<=0){
clearInterval(timer)
alert("Время вышло!")
}

},1000)

}

function init(){

updateUI()

if(!el("startBtn")) return

el("startBtn").onclick=()=>{
generate()
startTimer()

el("startBtn").classList.add("hidden")
el("checkBtn").classList.remove("hidden")
el("stopBtn").classList.remove("hidden")
}

el("checkBtn").onclick=()=>{

let val=el("answer").value.trim()
if(val==="") return

let num=Number(val)

if(num===currentAnswer){

streak++
xp+=10+streak*2

newLevel=Math.floor(xp/100)+1

if(newLevel>level){
level=newLevel
confetti()
}

}else{

streak=0

}

checkAchievements()
save()
updateUI()

el("answer").value=""
generate()

}

el("stopBtn").onclick=()=>{

clearInterval(timer)

el("startBtn").classList.remove("hidden")
el("checkBtn").classList.add("hidden")
el("stopBtn").classList.add("hidden")

el("task").textContent="Нажми Start 🚀"

}

}

document.addEventListener("DOMContentLoaded",init)
