const app = document.getElementById('app');
let state = {
    isLoggedIn: false,
    username: ''
};
let exercises = [];

function loadExercises() {
    if (state.username) {
        exercises = JSON.parse(localStorage.getItem(`fitness_exercises_${state.username}`)) || [];
    }
}

function saveExercises() {
    if (state.username) {
        localStorage.setItem(`fitness_exercises_${state.username}`, JSON.stringify(exercises));
    }
}

function renderMain() {
    if (!state.isLoggedIn) {
        renderLogin();
    } else {
        renderDashboard();
    }
}

function renderLogin() {
    app.innerHTML = `
        <div class="glass-panel" id="loginPanel">
            <h1>Zaloguj się</h1>
            <p class="subtitle">Wprowadź swoje dane, by rozpocząć trening</p>
            <form id="loginForm">
                <div class="input-group">
                    <label for="username">Nazwa użytkownika</label>
                    <input type="text" id="username" placeholder="Np. Anna Kowalska" required autocomplete="off">
                </div>
                <div class="input-group">
                    <label for="password">Hasło</label>
                    <input type="password" id="password" placeholder="Skonfigurujesz je później" required>
                </div>
                <button type="submit" class="btn-primary">Wchodzę</button>
            </form>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('username').value.trim();
        if (usernameInput) {
            handleLoginSuccess(usernameInput);
        }
    });
}

function handleLoginSuccess(username) {
    const loginPanel = document.getElementById('loginPanel');
    loginPanel.style.animation = 'fadeOut 0.3s ease-in forwards';
    
    setTimeout(() => {
        state.isLoggedIn = true;
        state.username = username;
        loadExercises();
        renderMain();
    }, 300);
}

window.logout = function() {
    state.isLoggedIn = false;
    state.username = '';
    exercises = [];
    renderMain();
}

function renderDashboard() {
    app.innerHTML = `
        <div class="glass-panel" style="animation: fadeIn 0.5s ease-out; position: relative;">
            <button onclick="logout()" style="position:absolute; top:1rem; right:1rem; background:transparent; border:1px solid rgba(239, 68, 68, 0.5); color:var(--danger); padding:0.4rem 0.8rem; border-radius:0.5rem; cursor:pointer; transition:all 0.2s; font-size:0.75rem;">Wyloguj</button>
            <h1>Cześć, ${state.username}!</h1>
            <p class="subtitle">Twój osobisty panel fitness</p>
            
            <div class="bmi-calculator">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top: 0; margin-bottom: 1rem;">Kalkulator BMI</h2>
                <div class="input-group">
                    <label for="height">Wzrost (cm)</label>
                    <input type="number" id="height" placeholder="np. 180" min="50" max="250">
                </div>
                <div class="input-group">
                    <label for="weight">Waga (kg)</label>
                    <input type="number" id="weight" placeholder="np. 75" min="20" max="300" step="0.1">
                </div>
                <button id="calcBmiBtn" class="btn-primary">Oblicz BMI</button>
                
                <div id="bmiResult" class="bmi-result hide">
                    <div id="bmiValue" class="bmi-value">--</div>
                    <div id="bmiStatus" class="bmi-status">--</div>
                </div>
            </div>
            
            <!-- Sekcja Zapisywania Ćwiczeń -->
            <hr style="border:0; border-top: 1px solid var(--glass-border); margin: 2rem 0;">
            
            <div class="exercise-logger">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top: 0; margin-bottom: 1rem;">Dziennik Ćwiczeń</h2>
                <form id="exerciseForm">
                    <div class="input-group">
                        <label for="exName">Nazwa ćwiczenia</label>
                        <input type="text" id="exName" placeholder="np. Martwy Ciąg" required autocomplete="off">
                    </div>
                    <div class="input-group">
                        <label for="exDetails">Serie / Powtórzenia</label>
                        <input type="text" id="exDetails" placeholder="np. 4x8" required autocomplete="off">
                    </div>
                    <button type="submit" class="btn-primary" style="background:linear-gradient(to right, #8b5cf6, #3b82f6);">Zapisz ćwiczenie</button>
                </form>

                <div class="exercise-list" id="exerciseList">
                    <!-- Lista ukaże się tutaj -->
                </div>
            </div>
        </div>
    `;

    document.getElementById('calcBmiBtn').addEventListener('click', calculateBMI);
    document.getElementById('exerciseForm').addEventListener('submit', handleAddExercise);
    renderExercises();
}

function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const resultDiv = document.getElementById('bmiResult');
    const valueDiv = document.getElementById('bmiValue');
    const statusDiv = document.getElementById('bmiStatus');

    if (!height || !weight || height <= 0 || weight <= 0) {
        alert("Proszę podać prawidłowe wartości wagi i wzrostu.");
        return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    resultDiv.classList.remove('hide');
    valueDiv.textContent = bmi;

    let status = '';
    let colorClass = '';

    if (bmi < 18.5) {
        status = 'Niedowaga';
        colorClass = 'text-warning';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        status = 'W normie';
        colorClass = 'text-success';
    } else if (bmi >= 25 && bmi < 29.9) {
        status = 'Nadwaga';
        colorClass = 'text-warning';
    } else {
        status = 'Otyłość';
        colorClass = 'text-danger';
    }

    statusDiv.textContent = status;
    statusDiv.className = `bmi-status ${colorClass}`;
}

function handleAddExercise(e) {
    e.preventDefault();
    const nameInput = document.getElementById('exName');
    const detailsInput = document.getElementById('exDetails');
    
    const newEx = {
        id: Date.now().toString(),
        name: nameInput.value.trim(),
        details: detailsInput.value.trim()
    };
    
    exercises.push(newEx);
    saveExercises();
    
    nameInput.value = '';
    detailsInput.value = '';
    
    renderExercises();
}

function renderExercises() {
    const listDiv = document.getElementById('exerciseList');
    if (exercises.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center; color: var(--text-muted); font-size: 0.875rem; margin-top:1rem;">Brak zapisanych ćwiczeń.</p>';
        return;
    }
    
    let html = '<ul style="list-style:none; padding:0; margin-top:1.5rem;">';
    exercises.forEach(ex => {
        html += `
            <li class="exercise-item">
                <div class="ex-info">
                    <strong>${ex.name}</strong>
                    <span class="ex-details">${ex.details}</span>
                </div>
                <button onclick="deleteExercise('${ex.id}')" class="ex-delete">✕</button>
            </li>
        `;
    });
    html += '</ul>';
    
    listDiv.innerHTML = html;
}

window.deleteExercise = function(id) {
    exercises = exercises.filter(ex => ex.id !== id);
    saveExercises();
    renderExercises();
}

document.addEventListener('DOMContentLoaded', () => {
    renderMain();
});
