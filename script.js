let data = [
  { word: "kaplumbağa", correct: "tortuga" },
  { word: "kadın", correct: "mujer" },
  { word: "yapmak", correct: "hacer" },
  { word: "gemi", correct: "barco" }
];

const allData = [...data];

let current = null;
let locked = false;
let score = 0; 
let progress = {};
let nextLocked = false;

function updateUI() {
  let totalWords = allData.length;
  let percent = Math.round((score / totalWords) * 100);

  // Marcador en turco: "X tamamlanan"
  document.getElementById("score").textContent = score + " tamamlanan";
  
  // Formato turco para porcentaje: % delante del número
  document.getElementById("percent").textContent = "%" + percent;
}

function renderDots(word) {
  let container = document.getElementById("dots");
  container.innerHTML = "";

  let value = progress[word] || 0;

  for (let i = 0; i < 5; i++) {
    let dot = document.createElement("div");
    dot.className = "dot";
    if (i < value) dot.classList.add("active");
    container.appendChild(dot);
  }
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getOptions(correct) {
  let opts = new Set([correct]);
  while (opts.size < 4 && opts.size < allData.length) {
    let randomIdx = Math.floor(Math.random() * allData.length);
    opts.add(allData[randomIdx].correct);
  }
  return shuffle([...opts]);
}

function pickWord() {
  if (data.length === 0) return null;
  return data[Math.floor(Math.random() * data.length)];
}

function loadQuestion() {
  if (data.length === 0) {
    document.getElementById("word").textContent = "TEBRİKLER!"; 
    document.getElementById("options").innerHTML = "<p>Bütün kelimeleri öğrendiniz.</p>";
    document.getElementById("dots").innerHTML = "";
    return;
  }

  locked = false;
  current = pickWord();

  // Se muestra solo la palabra (sin etiquetas de título/número)
  document.getElementById("word").textContent = current.word;
  renderDots(current.word);

  let container = document.getElementById("options");
  container.innerHTML = "";

  getOptions(current.correct).forEach(opt => {
    let btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt, btn);
    container.appendChild(btn);
  });
}

function handleAnswer(opt, btn) {
  if (locked) return;
  locked = true;

  let word = current.word;
  let correct = current.correct;

  if (!progress[word]) progress[word] = 0;

  document.querySelectorAll(".option").forEach(b => {
    if (b.textContent === correct) b.classList.add("correct");
  });

  if (opt === correct) {
    progress[word]++;
    btn.classList.add("correct");
    
    // Suma 1 al contador solo al completar los 5 aciertos
    if (progress[word] === 5) {
      score++;
    }
  } else {
    btn.classList.add("wrong");
  }

  updateUI();
  renderDots(word);

  if (progress[word] >= 5) {
    data = data.filter(x => x.word !== word);
  }

  if (nextLocked) return;
  nextLocked = true;

  setTimeout(() => {
    nextLocked = false;
    loadQuestion();
  }, 400);
}

loadQuestion();
updateUI();
