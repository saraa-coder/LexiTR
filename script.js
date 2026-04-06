let data = [
  { word: "kaplumbağa", correct: "tortuga" },
  { word: "kadın", correct: "mujer" },
  { word: "yapmak", correct: "hacer" },
  { word: "gemi", correct: "barco" }
];

let current = 0;
let answered = false;

let score = 0;
let total = 0;

let wordProgress = 0;

function updateUI() {
  let percent = total === 0 ? 0 : Math.round((score / total) * 100);

  document.getElementById("score").textContent = score + " aciertos";
  document.getElementById("percent").textContent = percent + "%";
}

function renderDots() {
  let container = document.getElementById("dots");
  container.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    let dot = document.createElement("div");
    dot.className = "dot";

    if (i < wordProgress) {
      dot.classList.add("active");
    }

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
  answered = false;

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

  total++;

  let correct = data[current].correct;

  document.querySelectorAll(".option").forEach(btn => {
    if (btn.textContent === correct) {
      btn.classList.add("correct");
    } else if (btn === button) {
      btn.classList.add("wrong");
    }
  });

  if (selected === correct) {
    score++;
    wordProgress++;
  }

  updateUI();
  document.getElementById("word").textContent = q.word;
renderDots();

  if (wordProgress >= 5) {
    setTimeout(() => {
      document.getElementById("word").textContent = "";
      document.getElementById("options").innerHTML = "";
      document.getElementById("dots").innerHTML = "";
    }, 800);

    return;
  }

  setTimeout(() => {
    current = Math.floor(Math.random() * data.length);
    loadQuestion();
  }, 900);
}

loadQuestion();
updateUI();
renderDots();
