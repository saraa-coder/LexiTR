let data = [
  { word: "kaplumbağa", correct: "tortuga" },
  { word: "kadın", correct: "mujer" },
  { word: "yapmak", correct: "hacer" },
  { word: "gemi", correct: "barco" }
];

let score = 0;
let progress = {};
let current = null;
let locked = false;

function updateUI() {
  let wordsDone = Object.keys(progress).length || 1;
  let percent = Math.round((score / (wordsDone * 5)) * 100);

  document.getElementById("score").textContent = score + " aciertos";
  document.getElementById("percent").textContent = percent + "%";
}

function renderDots(word) {
  let container = document.getElementById("dots");
  container.innerHTML = "";

  let p = progress[word] || 0;

  for (let i = 0; i < 5; i++) {
    let dot = document.createElement("div");
    dot.className = "dot";
    if (i < p) dot.classList.add("active");
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

    btn.onclick = () => checkAnswer(opt, btn);

    container.appendChild(btn);
  });
}

function checkAnswer(opt, btn) {
  if (locked) return;
  locked = true;

  let word = current.word;
  let correct = current.correct;

  document.querySelectorAll(".option").forEach(b => {
    if (b.textContent === correct) b.classList.add("correct");
  });

  if (!progress[word]) progress[word] = 0;

  if (opt === correct) {
    score++;
    progress[word]++;
  } else {
    btn.classList.add("wrong");
  }

  updateUI();
  renderDots(word);

  if (progress[word] >= 5) {
    data = data.filter(x => x.word !== word);
  }

  setTimeout(nextQuestion, 500);
}

nextQuestion();
updateUI();
