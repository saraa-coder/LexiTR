let data = [
  { word: "kaplumbağa", correct: "tortuga" },
  { word: "kadın", correct: "mujer" },
  { word: "yapmak", correct: "hacer" },
  { word: "gemi", correct: "barco" }
];

// Mantenemos una copia constante para sacar las opciones incorrectas
const allData = [...data];

let current = null;
let locked = false;
let score = 0;
let progress = {};
let nextLocked = false;

function updateUI() {
  // Calculamos el progreso basado en las palabras totales iniciales
  let totalWords = allData.length;
  let percent = Math.round((score / (totalWords * 5)) * 100);

  document.getElementById("score").textContent = score + " aciertos";
  document.getElementById("percent").textContent = percent + "%";
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

  // Usamos allData para que siempre haya opciones, 
  // incluso si la palabra ya se eliminó de la lista de juego
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
    document.getElementById("word").textContent = "¡COMPLETADO!";
    document.getElementById("options").innerHTML = "<p>Has dominado todas las palabras.</p>";
    document.getElementById("dots").innerHTML = "";
    return;
  }

  locked = false;
  current = pickWord();

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

  // Mostrar la respuesta correcta visualmente
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

  // Eliminar palabra si llega a 5 aciertos
  if (progress[word] >= 5) {
    data = data.filter(x => x.word !== word);
  }

  // Control de flujo para evitar doble click o congelamiento
  if (nextLocked) return;
  nextLocked = true;

  setTimeout(() => {
    nextLocked = false; // Liberamos antes de cargar la siguiente
    loadQuestion();
  }, 400); // Un pelín más de tiempo para que se vea el feedback
}

// Inicio del juego
loadQuestion();
updateUI();
