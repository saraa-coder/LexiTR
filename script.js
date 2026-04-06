let data = [
  { word: "kaplumbağa", correct: "tortuga" },
  { word: "kadın", correct: "mujer" },
  { word: "yapmak", correct: "hacer" },
  { word: "gemi", correct: "barco" }
];

let current = null;
let locked = false;
let score = 0;
let progress = {};

function updateUI() {
  let words = Object.keys(progress).length || 1;
  let percent = Math.round((score / (words * 5)) * 100);

  document.getElementById("score").textContent = score + " aciertos";
  document.getElementById("percent").textContent = percent + "%";
}

function renderDots(word) {
  let container = document.getElementById("dots");
  container.innerHTML = "";

  let p = progress[word] || 0;

  for (let i = 0; i < 5; i++) {
    let d = document.createElement("div");
    d.className = "dot";
    if (i < p) d.classList.add("active");
    container.appendChild(d);
  }
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getOptions(correct) {
  let opts = new Set([correct]);

  while (opts.size < 4) {
    let r = data[Math.floor(Math.random() * data.length)].correct;
    opts.add(r);
  }

  return shuffle([...opts]);
}

function loadQuestion() {
  if (data.length === 0) {
    document.getElementById("word").textContent = "FIN";
    document.getElementById("options").innerHTML = "";
    document.getElementById("dots").innerHTML = "";
    return;
  }

  locked = false;

  current = data[Math.floor(Math.random() * data.length)];

  document.getElementById("word").textContent = current.word;

  renderDots(current.word);

  let container = document.getElementById("options");
  container.innerHTML = "";

  getOptions(current.correct).forEach(opt => {
    let btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;

    btn.addEventListener("click", () => handleAnswer(opt, btn), { once: true });

    container.appendChild(btn);
  });
}

function handleAnswer(opt, btn) {
  if (locked) return;
  locked = true;

  let word = current.word;
  let correct = current.correct;

  if (!progress[word]) progress[word] = 0;

  // marcar visual
  document.querySelectorAll(".option").forEach(b => {
    if (b.textContent === correct) b.classList.add("correct");
  });

  if (opt === correct) {
    score++;
    progress[word]++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
  }

  updateUI();
  renderDots(word);

  // eliminar palabra si completada
  if (progress[word] >= 5) {
    data = data.filter(x => x.word !== word);
  }

  // siguiente pregunta SIN bucles peligrosos
  setTimeout(() => {
    loadQuestion();
  }, 350);
}

loadQuestion();
updateUI();
