const app = document.getElementById('app');
let state = {
    isLoggedIn: false,
    username: '',
    activeTab: 'bmi'
};
let exercises = [];
let meals = [];
let notes = '';

function loadData() {
    if (state.username) {
        exercises = JSON.parse(localStorage.getItem(`fitness_exercises_${state.username}`)) || [];
        meals = JSON.parse(localStorage.getItem(`fitness_meals_${state.username}`)) || [];
        notes = localStorage.getItem(`fitness_notes_${state.username}`) || '';
    }
}

function saveData() {
    if (state.username) {
        localStorage.setItem(`fitness_exercises_${state.username}`, JSON.stringify(exercises));
        localStorage.setItem(`fitness_meals_${state.username}`, JSON.stringify(meals));
        localStorage.setItem(`fitness_notes_${state.username}`, notes);
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
        state.activeTab = 'bmi';
        loadData();
        renderMain();
    }, 300);
}

window.logout = function() {
    state.isLoggedIn = false;
    state.username = '';
    exercises = [];
    meals = [];
    notes = '';
    renderMain();
}

window.switchTab = function(tabName) {
    state.activeTab = tabName;
    renderDashboard();
}

function renderDashboard() {
    app.innerHTML = `
        <div class="glass-panel" style="animation: fadeIn 0.4s ease-out; position: relative;">
            <button onclick="logout()" style="position:absolute; top:1.25rem; right:1.25rem; background:transparent; border:1px solid rgba(239, 68, 68, 0.5); color:var(--danger); padding:0.4rem 0.8rem; border-radius:0.5rem; cursor:pointer; transition:all 0.2s; font-size:0.75rem;">Wyloguj</button>
            <h1 style="text-align: left; margin-top: 0; font-size:1.5rem;">Cześć, ${state.username}!</h1>
            <p class="subtitle" style="text-align: left; margin-bottom: 1.5rem;">Twój panel fitness</p>
            
            <div class="tabs">
                <button class="tab-btn ${state.activeTab === 'bmi' ? 'active' : ''}" onclick="switchTab('bmi')">BMI</button>
                <button class="tab-btn ${state.activeTab === 'exercises' ? 'active' : ''}" onclick="switchTab('exercises')">Ćwiczenia</button>
                <button class="tab-btn ${state.activeTab === 'meals' ? 'active' : ''}" onclick="switchTab('meals')">Posiłki</button>
                <button class="tab-btn ${state.activeTab === 'notes' ? 'active' : ''}" onclick="switchTab('notes')">Notatki</button>
            </div>
            
            <div id="tabContent"></div>
        </div>
    `;

    renderTabContent();
}

function renderTabContent() {
    const contentDiv = document.getElementById('tabContent');
    
    if (state.activeTab === 'bmi') {
        contentDiv.innerHTML = `
            <div class="bmi-calculator" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1rem;">Kalkulator BMI</h2>
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
        `;
        document.getElementById('calcBmiBtn').addEventListener('click', calculateBMI);
    } 
    else if (state.activeTab === 'exercises') {
        contentDiv.innerHTML = `
            <div class="exercise-logger" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1rem;">Dziennik Ćwiczeń</h2>
                <form id="exerciseForm">
                    <div class="input-group">
                        <label for="exName">Nazwa ćwiczenia</label>
                        <input type="text" id="exName" placeholder="np. Przysiady" required autocomplete="off">
                    </div>
                    <div class="input-group">
                        <label for="exDetails">Serie / Powtórzenia</label>
                        <input type="text" id="exDetails" placeholder="np. 3x10" required autocomplete="off">
                    </div>
                    <button type="submit" class="btn-primary" style="background:linear-gradient(to right, #8b5cf6, #3b82f6);">Zapisz</button>
                </form>
                <div class="list-container" id="exerciseList"></div>
            </div>
        `;
        document.getElementById('exerciseForm').addEventListener('submit', handleAddExercise);
        renderExercisesList();
    }
    else if (state.activeTab === 'meals') {
        contentDiv.innerHTML = `
            <div class="meal-logger" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1rem;">Baza Posiłków</h2>
                <form id="mealForm">
                    <div class="input-group" style="margin-bottom:0.75rem;">
                        <label for="mealName">Nazwa posiłku</label>
                        <input type="text" id="mealName" placeholder="np. Owsianka z białkiem" required autocomplete="off">
                    </div>
                    <div style="display:flex; gap:0.5rem; margin-bottom: 0.75rem;">
                        <div style="flex:1;">
                            <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Kcal</label>
                            <input type="number" id="mealKcal" placeholder="450" min="0" required style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none;">
                        </div>
                        <div style="flex:1;">
                            <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Białko (g)</label>
                            <input type="number" id="mealProtein" placeholder="30" min="0" required style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none;">
                        </div>
                    </div>
                    <div style="display:flex; gap:0.5rem; margin-bottom: 1.25rem;">
                        <div style="flex:1;">
                            <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Węgle (g)</label>
                            <input type="number" id="mealCarbs" placeholder="50" min="0" required style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none;">
                        </div>
                        <div style="flex:1;">
                            <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Tłuszcz (g)</label>
                            <input type="number" id="mealFats" placeholder="15" min="0" required style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none;">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary" style="background:linear-gradient(to right, #10b981, #059669);">Dodaj Posiłek</button>
                </form>
                
                <div id="mealSummary" style="margin-top:1.5rem; padding:0.75rem; border-radius:0.5rem; background:rgba(0,0,0,0.3); text-align:center; border:1px solid rgba(16, 185, 129, 0.2); font-size:0.9rem;">
                     <strong style="color:var(--text-color);">Suma: </strong> 
                     <span id="totalKcal" style="color:#10b981; font-weight:bold;">0</span> kcal | 
                     <span id="totalProtein" style="color:#60a5fa; font-weight:bold;">0</span>g B | 
                     <span id="totalCarbs" style="color:#f59e0b; font-weight:bold;">0</span>g W | 
                     <span id="totalFats" style="color:#ef4444; font-weight:bold;">0</span>g T
                </div>

                <div class="list-container" id="mealList"></div>
            </div>
        `;
        document.getElementById('mealForm').addEventListener('submit', handleAddMeal);
        renderMealsList();
    }
    else if (state.activeTab === 'notes') {
        contentDiv.innerHTML = `
            <div class="notes-logger" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1rem;">Złote myśli i plany</h2>
                <div class="input-group">
                    <textarea id="valNotes" placeholder="Zapisz swoje przemyślenia, plan treningu na jutro..." style="width:100%; height:200px; resize:vertical; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-family:inherit;">${notes}</textarea>
                </div>
                <button id="saveNotesBtn" class="btn-primary" style="background:linear-gradient(to right, #ec4899, #db2777);">Zapisz Notatnik</button>
                <div id="notesStatus" style="text-align:center; margin-top:1rem; font-size:0.875rem; color:#10b981; opacity:0; transition:opacity 0.3s;">Zapisano pomyślnie!</div>
            </div>
        `;
        document.getElementById('saveNotesBtn').addEventListener('click', () => {
            notes = document.getElementById('valNotes').value;
            saveData();
            const statusNode = document.getElementById('notesStatus');
            statusNode.style.opacity = '1';
            setTimeout(() => { statusNode.style.opacity = '0'; }, 2000);
        });
    }
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

    if (bmi < 16) {
        status = 'Wygłodzenie';
        colorClass = 'text-danger';
    } else if (bmi >= 16 && bmi < 17) {
        status = 'Wychudzenie';
        colorClass = 'text-warning';
    } else if (bmi >= 17 && bmi < 18.5) {
        status = 'Niedowaga';
        colorClass = 'text-warning';
    } else if (bmi >= 18.5 && bmi < 25) {
        status = 'Prawidłowa masa ciała (Norma)';
        colorClass = 'text-success';
    } else if (bmi >= 25 && bmi < 30) {
        status = 'Nadwaga';
        colorClass = 'text-warning';
    } else if (bmi >= 30 && bmi < 35) {
        status = 'Otyłość I stopnia';
        colorClass = 'text-danger';
    } else if (bmi >= 35 && bmi < 40) {
        status = 'Otyłość II stopnia';
        colorClass = 'text-danger';
    } else {
        status = 'Otyłość III stopnia (skrajna)';
        colorClass = 'text-danger';
    }

    statusDiv.textContent = status;
    statusDiv.className = `bmi-status ${colorClass}`;
}

function handleAddExercise(e) {
    e.preventDefault();
    const nameInput = document.getElementById('exName');
    const detailsInput = document.getElementById('exDetails');
    
    exercises.push({
        id: Date.now().toString(),
        name: nameInput.value.trim(),
        details: detailsInput.value.trim()
    });
    saveData();
    
    nameInput.value = '';
    detailsInput.value = '';
    renderExercisesList();
}

function renderExercisesList() {
    const listDiv = document.getElementById('exerciseList');
    if (exercises.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center; color: var(--text-muted); font-size: 0.875rem; margin-top:1rem;">Brak zapisanych ćwiczeń.</p>';
        return;
    }
    
    let html = '<ul style="list-style:none; padding:0; margin-top:1.5rem;">';
    exercises.forEach(ex => {
        html += `
            <li class="list-item">
                <div class="item-info">
                    <strong>${ex.name}</strong>
                    <span class="item-details">${ex.details}</span>
                </div>
                <button onclick="deleteExercise('${ex.id}')" class="item-delete">✕</button>
            </li>
        `;
    });
    html += '</ul>';
    listDiv.innerHTML = html;
}

window.deleteExercise = function(id) {
    exercises = exercises.filter(ex => ex.id !== id);
    saveData();
    renderExercisesList();
}

function handleAddMeal(e) {
    e.preventDefault();
    const nameInput = document.getElementById('mealName');
    const kcalInput = document.getElementById('mealKcal');
    const proteinInput = document.getElementById('mealProtein');
    const carbsInput = document.getElementById('mealCarbs');
    const fatsInput = document.getElementById('mealFats');
    
    meals.push({
        id: Date.now().toString(),
        name: nameInput.value.trim(),
        kcal: Math.max(0, parseInt(kcalInput.value) || 0),
        protein: Math.max(0, parseInt(proteinInput.value) || 0),
        carbs: Math.max(0, parseInt(carbsInput.value) || 0),
        fats: Math.max(0, parseInt(fatsInput.value) || 0)
    });
    saveData();
    
    nameInput.value = '';
    kcalInput.value = '';
    proteinInput.value = '';
    carbsInput.value = '';
    fatsInput.value = '';
    renderMealsList();
}

function renderMealsList() {
    const listDiv = document.getElementById('mealList');
    let totalKcal = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    if (meals.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center; color: var(--text-muted); font-size: 0.875rem; margin-top:1rem;">Brak zapisanych posiłków.</p>';
        document.getElementById('totalKcal').textContent = '0';
        document.getElementById('totalProtein').textContent = '0';
        document.getElementById('totalCarbs').textContent = '0';
        document.getElementById('totalFats').textContent = '0';
        return;
    }
    
    let html = '<ul style="list-style:none; padding:0; margin-top:1.5rem;">';
    meals.forEach(m => {
        totalKcal += m.kcal;
        totalProtein += m.protein;
        totalCarbs += m.carbs || 0;
        totalFats += m.fats || 0;
        
        html += `
            <li class="list-item">
                <div class="item-info">
                    <strong>${m.name}</strong>
                    <span class="item-details" style="color:#10b981;">🔥 ${m.kcal} kcal &bull; <span style="color:#60a5fa;">🥩 ${m.protein}g B</span> &bull; <span style="color:#f59e0b;">🌾 ${m.carbs || 0}g W</span> &bull; <span style="color:#ef4444;">🥑 ${m.fats || 0}g T</span></span>
                </div>
                <button onclick="deleteMeal('${m.id}')" class="item-delete">✕</button>
            </li>
        `;
    });
    html += '</ul>';
    
    document.getElementById('totalKcal').textContent = totalKcal;
    document.getElementById('totalProtein').textContent = totalProtein;
    document.getElementById('totalCarbs').textContent = totalCarbs;
    document.getElementById('totalFats').textContent = totalFats;
    listDiv.innerHTML = html;
}

window.deleteMeal = function(id) {
    meals = meals.filter(m => m.id !== id);
    saveData();
    renderMealsList();
}

document.addEventListener('DOMContentLoaded', () => {
    renderMain();
});
