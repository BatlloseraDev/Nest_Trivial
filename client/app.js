
// API en Nest (puerto 3000)
const API_BASE = 'http://localhost:9090';

let currentQuestion = null;

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${res.statusText}: ${msg}`);
  }
  return res.json();
}

async function loadRandom() {
  try {
    const q = await fetchJSON(`${API_BASE}/trivial/random`);
    currentQuestion = q;

    document.getElementById('statement').innerText = q.statement;

    const box = document.getElementById('options');
    box.innerHTML = '';
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = `${opt.index}. ${opt.text}`;
      btn.onclick = () => answerQuestion(opt.index);
      box.appendChild(btn);
    });

    document.getElementById('status').innerText = '';
  } catch (err) {
    document.getElementById('status').innerText = `Error: ${err.message}`;
  }
}

async function answerQuestion(optionIndex) {
  if (!currentQuestion) return;
  try {
    const res = await fetchJSON(`${API_BASE}/trivial/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: currentQuestion.id, answerIndex: optionIndex }),
    });

    document.getElementById('status').innerText = res.correct ? '✅ ¡Correcto!' : '❌ Incorrecto';
    await loadScore();
  } catch (err) {
    document.getElementById('status').innerText = `Error: ${err.message}`;
  }
}

async function loadScore() {
  try {
    const s = await fetchJSON(`${API_BASE}/trivial/score`);
    document.getElementById('score').innerText = s.score;
    document.getElementById('answered').innerText = s.answeredCount;
  } catch (err) {
    document.getElementById('status').innerText = `Error: ${err.message}`;
  }
}
