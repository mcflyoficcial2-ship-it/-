// Элементы DOM
const startBtn = document.getElementById('startBtn');
const checkBtn = document.getElementById('checkBtn');
const stopBtn = document.getElementById('stopBtn');
const taskDiv = document.getElementById('task');
const answerInput = document.getElementById('answer');
const xpSpan = document.getElementById('xp');
const streakSpan = document.getElementById('streak');
const xpBar = document.getElementById('xpBar');
const levelSelect = document.getElementById('levelSelect');
const aiText = document.getElementById('aiText');

// Переменные состояния
let currentAnswer = 0;
let xp = 0;
let streak = 0;
let timer = null;

// AI фразы
const aiPhrases = [
  "Отлично! Продолжаем!",
  "Ты молодец, давай следующий!",
  "Умница! Еще один пример!",
  "Ты справляешься замечательно!",
  "Давай проверим следующий пример!"
];

// Уровни сложности
const levels = {
  1: {min:0, max:9},
  2: {min:10, max:99},
  3: {min:100, max:999},
  4: {min:1000, max:9999},
  5: {min:10000, max:99999}
};

// Генерация примера
function generateExample(level){
  const {min, max} = levels[level];
  const a = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;
  const op = Math.random() < 0.5 ? '+' : '-';
  currentAnswer = op === '+' ? a + b : a - b;
  taskDiv.textContent = `${a} ${op} ${b} = ?`;
}

// Обновление XP
function updateXP(correct){
  if(correct){
    streak++;
    xp += 10 + streak*2;
  } else {
    streak = 0;
  }
  xpSpan.textContent = xp;
  streakSpan.textContent = streak;
  xpBar.style.width = `${Math.min(xp,100)}%`;
}

// Показать случайную фразу AI
function showAIPhrase(){
  const phrase = aiPhrases[Math.floor(Math.random() * aiPhrases.length)];
  aiText.textContent = phrase;
}

// Начало урока
startBtn.addEventListener('click', ()=>{
  const level = levelSelect.value;
  generateExample(level);
  answerInput.value = '';
  startBtn.classList.add('hidden');
  checkBtn.classList.remove('hidden');
  stopBtn.classList.remove('hidden');
  showAIPhrase();
});

// Проверка ответа
checkBtn.addEventListener('click', ()=>{
  const userAnswer = Number(answerInput.value);
  if(!isNaN(userAnswer) && userAnswer === currentAnswer){
    updateXP(true);
  } else {
    updateXP(false);
  }
  // Генерация нового примера сразу
  const level = levelSelect.value;
  generateExample(level);
  answerInput.value = '';
  showAIPhrase();
});

// Стоп урока
stopBtn.addEventListener('click', ()=>{
  startBtn.classList.remove('hidden');
  checkBtn.classList.add('hidden');
  stopBtn.classList.add('hidden');
  taskDiv.textContent = 'Нажми старт 🚀';
  answerInput.value = '';
});
