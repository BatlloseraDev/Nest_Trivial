
// API en Nest (puerto 3000)
const API_BASE = 'http://localhost:9090/api';

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


// ====== USUARIOS ======
async function crearUsuario() {
  const id = document.getElementById("usuario-id").value;
  const nombre = document.getElementById("usuario-nombre").value;
  const edad = document.getElementById("usuario-edad").value;
  const email = document.getElementById("usuario-email").value;
  const password = document.getElementById("usuario-password").value;


  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({id: Number(id), name: nombre, age: Number(edad), email, password, roles:['user']})
  });

  alert(await res.json());
  listarUsuarios();
}

async function listarUsuarios() {
  const res = await fetch(`${API_BASE}/users`);
  const data = await res.json();
  document.getElementById("usuarios-listado").textContent = JSON.stringify(data, null, 2);
}

async function actualizarUsuario() {
  const uid = document.getElementById("usuario-uid").value;
  const nombre = document.getElementById("usuario-nombre-upd").value;
  const edad = document.getElementById("usuario-edad-upd").value;

  const res = await fetch(`${API_BASE}/users/${uid}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name: nombre, age: edad ? Number(edad) : undefined})
  });

  alert(await res.json());
  listarUsuarios();
}

async function eliminarUsuario() {
  const uid = document.getElementById("usuario-del-id").value;
  const res = await fetch(`${API_BASE}/users/${uid}`, { method: "DELETE" });
  alert(await res.json());
  listarUsuarios();

  
}
