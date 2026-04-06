let data = [
  { word: "kaplumbağa", correct: "tortuga" },
  { word: "kadın", correct: "mujer" },
  { word: "yapmak", correct: "hacer" },
  { word: "gemi", correct: "barco" }
];

let current = 0;
let answered = false;

let score = 0;
let wordProgress = {};

function updateUI() {
  let totalWords = Object.keys(wordProgress).length || 1;
  let percent = Math.round((score / (totalWords * 5)) * 100);

  document.getElementById("score").textContent = score + " aciertos";
  document.getElementById("percent").textContent = percent + "%";
}

function renderDots() {
  if (data.length === 0) return;

  let word = data[current].word;
  let progress = wordProgress[word] || 0;

  let container = document.getElementById("dots");
  container.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let dot = document.createElement("div");
    dot.className = "dot";
    if (i < progress) dot.classList.add("active");
    container.appendChild(dot);
  }
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function getOptions(correct) {
  let opts = [correct];

  while (opts.length < 4) {
    let r = data[Math.floor(Math.random() * data.length)].correct;
    if (!opts.includes(r)) opts.push(r);
  }

  return shuffle(opts);
}

function loadQuestion() {
  if (data.length === 0) {
    document.getElementById("word").textContent = "¡Juego terminado!";
    document.getElementById("options").innerHTML = "";
    document.getElementById("dots").innerHTML = "";
    return;
  }

  answered = false;

  current = Math.floor(Math.random() * data.length);
  let q = data[current];

  document.getElementById("word").textContent = q.word;

  renderDots();

  let container = document.getElementById("options");
  container.innerHTML = "";

  let options = getOptions(q.correct);

  options.forEach(opt => {
    let btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option";

    btn.onclick = () => checkAnswer(btn, opt);

    container.appendChild(btn);
  });
}

function checkAnswer(button, selected) {
  if (answered) return;
  answered = true;

  let word = data[current].word;
  let correct = data[current].correct;

  document.querySelectorAll(".option").forEach(btn => {
    if (btn.textContent === correct) {
      btn.classList.add("correct");
    } else if (btn === button) {
      btn.classList.add("wrong");
    }
  });

  if (!wordProgress[word]) wordProgress[word] = 0;

  if (selected === correct) {
    score++;
    wordProgress[word]++;
  }

  updateUI();
  renderDots();

  if (wordProgress[word] >= 5) {
    setTimeout(() => {
      data = data.filter(w => w.word !== word);
      current = 0;
      loadQuestion();
    }, 500);
    return;
  }

  setTimeout(() => {
    loadQuestion();
  }, 700);
}

loadQuestion();
updateUI();
