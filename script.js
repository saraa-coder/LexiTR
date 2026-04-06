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

  if (!progress[word]) progress[word] = 0;

  if (opt === correct) {
    score++;
    progress[word]++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
  }

  document.querySelectorAll(".option").forEach(b => {
    if (b.textContent === correct) b.classList.add("correct");
  });

  updateUI();
  renderDots(word);

  if (progress[word] >= 5) {
    data = data.filter(x => x.word !== word);
  }

  setTimeout(load, 500);
}

load();
updateUI();
