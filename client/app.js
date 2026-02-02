
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
    const token = localStorage.getItem('token');
    if(!token){
      alert('No hay usuario loggeado. Por favor inicia sesión primero.');
      return;
    }

    const res = await fetchJSON(`${API_BASE}/trivial/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
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
    const s = await fetchJSON(`${API_BASE}/trivial/score`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
    });
    document.getElementById('score').innerText = s.score;
    document.getElementById('answered').innerText = s.answeredCount;
  } catch (err) {
    document.getElementById('status').innerText = `Error: ${err.message}`;
  }
}


// ====== USUARIOS ======
async function login() {
  const email = document.getElementById("usuario-email-login").value;
  const password = document.getElementById("usuario-password-login").value;

  try {
    const res = await fetchJSON(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    alert('Login exitoso');
    console.log(res);
    //guardar el token en localStorage
    localStorage.setItem('token', res.access_token);

    if(res.user){
      localStorage.setItem('user', JSON.stringify(res.user));

      const scoreElement = document.getElementById('score');
      const answeredElement = document.getElementById('answered');
      
      scoreElement.innerText = res.user.score;
      answeredElement.innerText = res.user.answeredCount;
    }


  } catch (err) {
    document.getElementById('status').innerText = `Error: ${err.message}`;
  }
}





async function crearUsuario() {
  const id = document.getElementById("usuario-id").value;
  const nombre = document.getElementById("usuario-nombre").value;
  const edad = document.getElementById("usuario-edad").value;
  const email = document.getElementById("usuario-email").value;
  const password = document.getElementById("usuario-password").value;
  const score = 0;
  const answeredCount = 0;

  const token = localStorage.getItem('token');
  if (!token) {
    alert("No hay token guardado. Por favor inicia sesión primero.");
    return;
  }

  //porporcionar el token a traves del header
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
    body: JSON.stringify({id: Number(id), name: nombre, age: Number(edad), email, password, roles:['user'], score, answeredCount})
  });

  alert(await res.json());
  listarUsuarios();
}

async function listarUsuarios() {
  const res = await fetch(`${API_BASE}/users`, {
    headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
  });
  const data = await res.json();
  document.getElementById("usuarios-listado").textContent = JSON.stringify(data, null, 2);
}

async function actualizarUsuario() {
  const uid = document.getElementById("usuario-uid").value;
  const nombre = document.getElementById("usuario-nombre-upd").value;
  const edad = document.getElementById("usuario-edad-upd").value;

  const res = await fetch(`${API_BASE}/users/${uid}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}`},
    body: JSON.stringify({name: nombre, age: edad ? Number(edad) : undefined})
  });

  alert(await res.json());
  listarUsuarios();
}

async function eliminarUsuario() {
  const uid = document.getElementById("usuario-del-id").value;
  const res = await fetch(`${API_BASE}/users/${uid}`, { method: "DELETE", 
    headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}
   });
  alert(await res.json());
  listarUsuarios();

  
}
