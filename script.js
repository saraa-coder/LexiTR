let data = [
  { word: "kaplumbağa", correct: "tortuga" },
  { word: "kadın", correct: "mujer" },
  { word: "yapmak", correct: "hacer" },
  { word: "gemi", correct: "barco" }
];

let current;
let answered = false;

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

  let rand = data[Math.floor(Math.random() * data.length)];
  current = data.indexOf(rand);

  let q = data[current];

  document.getElementById("word").textContent = q.word;

  let options = getOptions(q.correct);
  let container = document.getElementById("options");
  container.innerHTML = "";

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

  let correct = data[current].correct;
  let buttons = document.querySelectorAll(".option");

  buttons.forEach(btn => {
    if (btn.textContent === correct) {
      btn.classList.add("correct");
    } else if (btn === button) {
      btn.classList.add("wrong");
    }
  });

  setTimeout(loadQuestion, 1000);
}

loadQuestion();
