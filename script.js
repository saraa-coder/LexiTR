let data = [
  { word: "kaplumbağa", correct: "tortuga" },
  { word: "kadın", correct: "mujer" },
  { word: "yapmak", correct: "hacer" },
  { word: "gemi", correct: "barco" }
];

let score = 0;
let wordProgress = {};
let locked = false;

let current = null;

function updateUI() {
  let words = Object.keys(wordProgress).length || 1;
  let percent = Math.round((score / (words * 5)) * 100);

  document.getElementById("score").textContent = score + " aciertos";
  document.getElementById("percent").textContent = percent + "%";
}

function renderDots(word) {
  let progress = wordProgress[word] || 0;

  let container = document.getElementById("dots");
  container.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let d = document.createElement("div");
    d.className = "dot";
    if (i < progress) d.classList.add("active");
    container.appendChild(d);
  }
}

function shuffle(a) {
  return a.sort(() => Math.random() - 0.5);
}

function getOptions(correct) {
  let opts = [correct];

  while (opts.length < 4) {
    let r = data[Math.floor(Math.random() * data.length)].correct;
    if (!opts.includes(r)) opts.push(r);
  }

  return shuffle(opts);
}

function load() {
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
    let b = document.createElement("button");
    b.className = "option";
    b.textContent = opt;

    b.onclick = () => check(opt, b);

    container.appendChild(b);
  });
}

function check(opt, btn) {
  if (locked) return;
  locked = true;

  let word = current.word;
  let correct = current.correct;

  document.querySelectorAll(".option").forEach(b => {
    if (b.textContent === correct) b.classList.add("correct");
    if (b === btn && opt !== correct) b.classList.add("wrong");
  });

  if (!wordProgress[word]) wordProgress[word] = 0;

  if (opt === correct) {
    score++;
    wordProgress[word]++;
  }

  updateUI();
  renderDots(word);

  setTimeout(() => {
    if (wordProgress[word] >= 5) {
      data = data.filter(x => x.word !== word);
    }
    load();
  }, 400);
}

load();
updateUI();
