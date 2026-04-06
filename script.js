let data = [
  { word: "kaplumbağa", correct: "tortuga" },
  { word: "kadın", correct: "mujer" },
  { word: "yapmak", correct: "hacer" },
  { word: "gemi", correct: "barco" }
];

let answered = false;
let score = 0;
let wordProgress = {};

let currentItem = null;

function updateUI() {
  let totalCompletedWords = Object.keys(wordProgress).length || 1;
  let percent = Math.round((score / (totalCompletedWords * 5)) * 100);

  document.getElementById("score").textContent = score + " aciertos";
  document.getElementById("percent").textContent = percent + "%";
}

function renderDots(word) {
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

function nextQuestion() {
  if (data.length === 0) {
    document.getElementById("word").textContent = "¡Juego terminado!";
    document.getElementById("options").innerHTML = "";
    document.getElementById("dots").innerHTML = "";
    return;
  }

  answered = false;

  currentItem = data[Math.floor(Math.random() * data.length)];

  document.getElementById("word").textContent = currentItem.word;

  renderDots(currentItem.word);

  let container = document.getElementById("options");
  container.innerHTML = "";

  let options = getOptions(currentItem.correct);

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

  let word = currentItem.word;
  let correct = currentItem.correct;

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
  renderDots(word);

  if (wordProgress[word] >= 5) {
    wordProgress[word] = 5;

    // eliminar palabra de forma segura (SIN romper flujo)
    data = data.filter(w => w.word !== word);

    setTimeout(() => {
      nextQuestion();
    }, 500);

    return;
  }

  setTimeout(() => {
    nextQuestion();
  }, 700);
}

nextQuestion();
updateUI();
