const app = document.getElementById('app');
let state = {
    isLoggedIn: false,
    username: '',
    activeTab: 'bmi'
};
let exercises = [];
let meals = [];
let notes = [];
let progressData = [];
let waterData = {};
let targetKcal = 0;
let workouts = [];

function loadData() {
    if (state.username) {
        exercises = JSON.parse(localStorage.getItem(`fitness_exercises_${state.username}`)) || [];
        meals = JSON.parse(localStorage.getItem(`fitness_meals_${state.username}`)) || [];
        workouts = JSON.parse(localStorage.getItem(`fitness_workouts_${state.username}`)) || [];
        progressData = JSON.parse(localStorage.getItem(`fitness_progress_${state.username}`)) || [];
        waterData = JSON.parse(localStorage.getItem(`fitness_water_${state.username}`)) || {};
        targetKcal = parseInt(localStorage.getItem(`fitness_targetKcal_${state.username}`)) || 0;
        
        const loadedNotes = localStorage.getItem(`fitness_notes_${state.username}`);
        if (loadedNotes) {
            try {
                const parsed = JSON.parse(loadedNotes);
                notes = Array.isArray(parsed) ? parsed : [];
            } catch(e) {
                notes = [];
            }
        } else {
            notes = [];
        }
    }
}

function saveData() {
    if (state.username) {
        localStorage.setItem(`fitness_exercises_${state.username}`, JSON.stringify(exercises));
        localStorage.setItem(`fitness_meals_${state.username}`, JSON.stringify(meals));
        localStorage.setItem(`fitness_workouts_${state.username}`, JSON.stringify(workouts));
        localStorage.setItem(`fitness_notes_${state.username}`, JSON.stringify(notes));
        localStorage.setItem(`fitness_water_${state.username}`, JSON.stringify(waterData));
        localStorage.setItem(`fitness_targetKcal_${state.username}`, targetKcal);
        try {
            localStorage.setItem(`fitness_progress_${state.username}`, JSON.stringify(progressData));
        } catch(e) {
            alert('Brak miejsca w pamięci przeglądarki na nowe dane wejściowe/zdjęcia!');
        }
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
    workouts = [];
    notes = [];
    progressData = [];
    renderMain();
}

window.switchTab = function(tabName) {
    state.activeTab = tabName;
    renderDashboard();
}

function exportData() {
    const dataObj = {
        exercises,
        meals,
        workouts,
        notes,
        progressData,
        waterData,
        targetKcal
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `fitness_backup_${state.username}_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
}

function triggerImport() {
    document.getElementById('importFile').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            exercises = imported.exercises || [];
            meals = imported.meals || [];
            workouts = imported.workouts || [];
            notes = imported.notes || [];
            progressData = imported.progressData || [];
            waterData = imported.waterData || {};
            targetKcal = parseInt(imported.targetKcal) || 0;
            saveData();
            alert("Kopia zapasowa załadowana pomyślnie!");
            renderDashboard();
        } catch(err) {
            alert("Błąd odczytu pliku JSON");
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // reseting input
}

window.exportData = exportData;
window.triggerImport = triggerImport;
window.handleImport = handleImport;

function renderDashboard() {
    app.innerHTML = `
        <div class="glass-panel" style="animation: fadeIn 0.4s ease-out; position: relative;">
            <div style="position:absolute; top:1.25rem; right:1.25rem; display:flex; gap:0.5rem; align-items:center;">
                <button onclick="triggerImport()" title="Wgraj kopię zapasową" style="background:transparent; border:1px solid rgba(255, 255, 255, 0.2); color:white; padding:0.4rem; border-radius:0.5rem; cursor:pointer; font-size:0.75rem;">📁 Wczytaj</button>
                <button onclick="exportData()" title="Zapisz dane do pliku" style="background:transparent; border:1px solid rgba(16, 185, 129, 0.5); color:#10b981; padding:0.4rem; border-radius:0.5rem; cursor:pointer; font-size:0.75rem;">💾 Zapisz</button>
                <button onclick="logout()" style="background:transparent; border:1px solid rgba(239, 68, 68, 0.5); color:var(--danger); padding:0.4rem 0.8rem; border-radius:0.5rem; cursor:pointer; font-size:0.75rem;">Wyloguj</button>
            </div>
            <input type="file" id="importFile" accept=".json" style="display:none;" onchange="handleImport(event)">
            <h1 style="text-align: left; margin-top: 0; font-size:1.5rem;">Cześć, ${state.username}!</h1>
            <p class="subtitle" style="text-align: left; margin-bottom: 1.5rem;">Twój panel fitness</p>
            
            <div class="tabs" style="flex-wrap: wrap;">
                <button class="tab-btn ${state.activeTab === 'bmi' ? 'active' : ''}" onclick="switchTab('bmi')">BMI</button>
                <button class="tab-btn ${state.activeTab === 'exercises' ? 'active' : ''}" onclick="switchTab('exercises')">Ćwiczenia</button>
                <button class="tab-btn ${state.activeTab === 'meals' ? 'active' : ''}" onclick="switchTab('meals')">Posiłki</button>
                <button class="tab-btn ${state.activeTab === 'notes' ? 'active' : ''}" onclick="switchTab('notes')">Notatki</button>
                <button class="tab-btn ${state.activeTab === 'progress' ? 'active' : ''}" onclick="switchTab('progress')">Progres</button>
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
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1rem;">Kalkulator BMI i Kalorii</h2>
                
                <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
                    <div style="flex:1;">
                        <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Płeć</label>
                        <select id="gender" style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-family:inherit;">
                            <option value="male">Mężczyzna</option>
                            <option value="female">Kobieta</option>
                        </select>
                    </div>
                    <div style="flex:1;">
                        <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Wiek</label>
                        <input type="number" id="age" placeholder="np. 25" min="10" max="100" style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none;">
                    </div>
                </div>

                <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
                    <div style="flex:1;">
                        <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Wzrost (cm)</label>
                        <input type="number" id="height" placeholder="np. 180" min="50" max="250" style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none;">
                    </div>
                    <div style="flex:1;">
                        <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Waga (kg)</label>
                        <input type="number" id="weight" placeholder="np. 75" min="20" max="300" step="0.1" style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none;">
                    </div>
                </div>
                
                <div style="margin-bottom:1rem;">
                    <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Poziom aktywności (w ciągu dnia)</label>
                    <select id="activity" style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-family:inherit;">
                        <option value="1.2">Brak aktywności (siedzący tryb życia)</option>
                        <option value="1.375">Niska aktywność (trening 1-3 razy w tyg.)</option>
                        <option value="1.55">Umiarkowana (trening 3-5 razy w tyg.)</option>
                        <option value="1.725">Wysoka aktywność (trening codziennie)</option>
                        <option value="1.9">Bardzo wysoka (fizyczna praca + trening)</option>
                    </select>
                </div>
                
                <div style="margin-bottom:1.5rem;">
                    <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Twój Cel</label>
                    <select id="goal" style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-family:inherit;">
                        <option value="-500">Chcę schudnąć (Redukcja, ok. -0.5kg / tyg.)</option>
                        <option value="0">Chcę utrzymać masę ciała</option>
                        <option value="300">Chcę zbudować masę (Nadwyżka kaloryczna)</option>
                    </select>
                </div>
                
                <button id="calcBmiBtn" class="btn-primary">Oblicz Twój Plan</button>
                
                <div id="bmiResult" class="bmi-result hide" style="margin-top: 1.5rem;">
                    <div id="bmiValue" class="bmi-value">--</div>
                    <div id="bmiStatus" class="bmi-status">--</div>
                    
                    <hr style="border:0; border-top: 1px solid var(--glass-border); margin: 1.5rem 0;">
                    
                    <h3 style="font-size: 1.1rem; margin-top:0; color:var(--text-muted);">Zalecane kalorie dla Twojego celu:</h3>
                    <div style="text-align:center; padding: 0.5rem;">
                        <strong id="finalCalories" style="color:#10b981; font-size:2rem; line-height:1;">--</strong> <span style="color:#10b981; font-size:1rem;">kcal / dobę</span>
                    </div>
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
                    <button type="submit" class="btn-primary" style="background:linear-gradient(to right, #8b5cf6, #3b82f6);">Zapisz Wpis</button>
                </form>
                <div class="list-container" id="exerciseList"></div>
            </div>
        `;
        document.getElementById('exerciseForm').addEventListener('submit', handleAddExercise);
        renderExercisesList();
    }
    else if (state.activeTab === 'meals') {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        
        let currentWater = waterData[today] || 0; // Fetch immediately
        
        contentDiv.innerHTML = `
            <div class="meal-logger" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1rem;">Baza Posiłków</h2>
                
                <!-- NEW PANEL SIDE BY SIDE -->
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 140px; background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.4); border-radius: 0.5rem; padding: 1rem; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
                        <h3 style="font-size: 1rem; color: #38bdf8; margin-top: 0; margin-bottom: 0.25rem;">Woda 💧</h3>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem; min-height: 40px; display: flex; flex-direction: column; justify-content: center;">Dzisiaj: <br><strong id="waterCount" style="color:white; font-size:1.1rem; display:inline-block; margin-top:0.25rem;">--</strong></p>
                        <div style="display:flex; justify-content:center; gap:0.25rem; width: 100%;">
                            <button onclick="addWater(-250)" style="flex:0.5; background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.2); border-radius:0.5rem; padding:0.25rem; cursor:pointer;" title="Skasuj szklankę">-</button>
                            <button onclick="addWater(250)" class="btn-primary" style="flex:2; background:linear-gradient(to right, #0ea5e9, #0284c7); padding:0.5rem 0.25rem; margin:0; font-size:0.8rem;">+ Szklanka</button>
                        </div>
                    </div>
                    
                </div>

                <form id="mealForm" style="background: rgba(0,0,0,0.15); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--glass-border); margin-bottom: 1.5rem;">
                    <div style="display:flex; gap:0.5rem; margin-bottom: 0.75rem;">
                        <div style="flex:1;">
                            <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Data</label>
                            <input type="date" id="mealDate" value="${today}" required style="width:100%; border-radius:0.5rem; padding:0.75rem 0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-family:inherit; font-size:0.8rem;">
                        </div>
                        <div style="flex:1;">
                            <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Godz.</label>
                            <input type="time" id="mealTime" value="${timeStr}" required style="width:100%; border-radius:0.5rem; padding:0.75rem 0.5rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-family:inherit; font-size:0.8rem;">
                        </div>
                        <div style="flex:1;">
                            <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Typ</label>
                            <select id="mealType" style="width:100%; border-radius:0.5rem; padding:0.75rem 0.25rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-family:inherit; font-size:0.8rem;">
                                <option value="Śniadanie">Śniadanie</option>
                                <option value="II Śniadanie">II Śniadanie</option>
                                <option value="Obiad">Obiad</option>
                                <option value="Przekąska">Przekąska</option>
                                <option value="Kolacja">Kolacja</option>
                            </select>
                        </div>
                    </div>
                    <div class="input-group" style="margin-bottom:0.75rem;">
                        <label for="mealName">Nazwa posiłku</label>
                        <input type="text" id="mealName" placeholder="np. Owsianka z białkiem" required autocomplete="off">
                    </div>
                    <div style="display:flex; gap:0.5rem; margin-bottom: 1.25rem;">
                        <div style="flex:1;">
                            <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Kcal</label>
                            <input type="number" id="mealKcal" placeholder="450" min="0" required style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none;">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary" style="background:linear-gradient(to right, #10b981, #059669);">Dodaj Posiłek</button>
                </form>
                
                <form id="workoutForm" style="background: rgba(14, 165, 233, 0.1); padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(14, 165, 233, 0.3); margin-bottom: 1.5rem;">
                    <h3 style="font-size: 0.95rem; margin-top: 0; margin-bottom: 0.75rem; color:#38bdf8;">🏃 Dodaj Spalanie Kalorii (Trening)</h3>
                    <div style="display:flex; gap:0.5rem; margin-bottom: 0;">
                        <input type="number" id="workKcal" placeholder="Spalone Kcal" min="1" required style="flex:1; border-radius:0.5rem; padding:0.75rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-size:0.8rem;">
                        <button type="submit" class="btn-primary" style="flex:1; background:linear-gradient(to right, #0ea5e9, #0284c7); padding:0.75rem; margin:0; font-size:0.8rem;">Zapisz</button>
                    </div>
                </form>
                
                <div id="mealSummary" style="margin-top:1.5rem; padding:0.75rem; border-radius:0.5rem; background:rgba(0,0,0,0.3); text-align:center; border:1px solid rgba(16, 185, 129, 0.2); font-size:1.1rem;">
                     <strong style="color:var(--text-color);">Zjedzono bilansowo: </strong> 
                     <span id="totalKcal" style="color:#10b981; font-weight:bold;">0</span> kcal
                </div>

                <div class="list-container" id="mealList"></div>
            </div>
        `;
        document.getElementById('mealForm').addEventListener('submit', handleAddMeal);
        document.getElementById('workoutForm').addEventListener('submit', handleAddWorkout);
        renderMealsList();
    }
    else if (state.activeTab === 'notes') {
        contentDiv.innerHTML = `
            <div class="notes-logger" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1rem;">Złote myśli i plany</h2>
                <form id="noteForm">
                    <div class="input-group">
                        <textarea id="valNotes" placeholder="Nowa notatka, np. plan na klatkę piersiową..." required style="width:100%; height:80px; resize:vertical; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-family:inherit;"></textarea>
                    </div>
                    <button type="submit" class="btn-primary" style="background:linear-gradient(to right, #ec4899, #db2777);">Dodaj Notatkę</button>
                </form>
                
                <div class="notes-grid" id="notesList" style="margin-top: 1.5rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem;">
                    <!-- Notatki -->
                </div>
            </div>
        `;
        document.getElementById('noteForm').addEventListener('submit', handleAddNote);
        renderNotesList();
    }
    else if (state.activeTab === 'progress') {
        const today = new Date().toISOString().split('T')[0];
        contentDiv.innerHTML = `
            <div class="progress-logger" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1rem;">Śledzenie Postępów</h2>
                <form id="progressForm">
                    <div style="display:flex; gap:0.5rem; margin-bottom: 0.75rem;">
                        <div style="flex:1;">
                            <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Data wpisu</label>
                            <input type="date" id="progDate" value="${today}" required style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-family:inherit;">
                        </div>
                        <div style="flex:1;">
                            <label style="font-size:0.875rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Waga (kg)</label>
                            <input type="number" id="progWeight" placeholder="np. 70" step="0.1" required style="width:100%; border-radius:0.5rem; padding:0.75rem 1rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-family:inherit;">
                        </div>
                    </div>
                    <div class="input-group" style="margin-bottom:1rem;">
                        <label for="progPhoto">Dodaj zdjęcie sylwetki <span style="font-size:0.7rem;color:var(--text-muted);">(opcjonalne)</span></label>
                        <input type="file" id="progPhoto" accept="image/*" style="width:100%; border-radius:0.5rem; padding:0.75rem; background:rgba(0,0,0,0.2); border:1px solid var(--glass-border); color:white; outline:none; font-family:inherit; font-size: 0.8rem;">
                    </div>
                    <button type="submit" class="btn-primary" style="background:linear-gradient(to right, #f59e0b, #ea580c);">Zapisz Pomiar</button>
                    <div id="progStatus" style="text-align:center; margin-top:0.5rem; font-size:0.75rem; color:var(--text-muted);"></div>
                </form>

                <div class="progress-grid" id="progressList" style="margin-top: 1.5rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem;">
                    <!-- Postępy -->
                </div>
            </div>
        `;
        document.getElementById('progressForm').addEventListener('submit', handleAddProgress);
        renderProgressList();
    }
}

function calculateBMI() {
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const activityMultiplier = parseFloat(document.getElementById('activity').value);
    const goalAdjustment = parseInt(document.getElementById('goal').value);
    
    const resultDiv = document.getElementById('bmiResult');
    const valueDiv = document.getElementById('bmiValue');
    const statusDiv = document.getElementById('bmiStatus');

    if (!height || !weight || !age || height <= 0 || weight <= 0 || age <= 0) {
        alert("Proszę podać prawidłowe i pełne wartości wieku, wagi i wzrostu.");
        return;
    }

    // 1. BMI Calculation
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

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
    
    // 2. TDEE Calculation (Mifflin-St Jeor)
    let bmr = 0;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // Zapotrzebowanie docelowe
    const totalDailyEnergyExpenditure = bmr * activityMultiplier;
    const finalTarget = Math.round(totalDailyEnergyExpenditure + goalAdjustment);
    
    targetKcal = finalTarget;
    saveData();
    
    document.getElementById('finalCalories').textContent = finalTarget;
    
    resultDiv.classList.remove('hide');
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
    const dateInput = document.getElementById('mealDate');
    const timeInput = document.getElementById('mealTime');
    const typeInput = document.getElementById('mealType');
    const nameInput = document.getElementById('mealName');
    const kcalInput = document.getElementById('mealKcal');
    
    meals.push({
        id: Date.now().toString(),
        date: dateInput.value,
        time: timeInput.value,
        type: typeInput.value,
        name: nameInput.value.trim(),
        kcal: Math.max(0, parseInt(kcalInput.value) || 0)
    });
    saveData();
    
    nameInput.value = '';
    kcalInput.value = '';
    renderMealsList();
}

window.deleteWorkout = function(id) {
    workouts = workouts.filter(w => w.id !== id);
    saveData();
    renderMealsList();
}

function handleAddWorkout(e) {
    e.preventDefault();
    const wKcal = document.getElementById('workKcal');
    const today = new Date().toISOString().split('T')[0];
    
    workouts.push({
        id: Date.now().toString(),
        date: today,
        kcal: Math.max(0, parseInt(wKcal.value) || 0)
    });
    saveData();
    
    wKcal.value = '';
    renderMealsList();
}

function renderMealsList() {
    const listDiv = document.getElementById('mealList');
    let totalKcal = 0;
    let burnedKcal = 0;
    
    meals.forEach(m => totalKcal += m.kcal);
    workouts.forEach(w => burnedKcal += w.kcal);
    
    let netKcal = totalKcal - burnedKcal;
    
    // Target calculation wrapper update
    const summaryDiv = document.getElementById('mealSummary');
    if (summaryDiv) {
        if (targetKcal > 0) {
            let left = targetKcal - netKcal;
            let leftMsg = left >= 0 ? `🔥 Zostało ci: <strong style="color:#f59e0b;">${left} kcal</strong>` : `⚠️ Przekroczenie o: <strong style="color:var(--danger);">${Math.abs(left)} kcal</strong>`;
            summaryDiv.innerHTML = `<strong style="color:var(--text-color);">Zjedzono bilansowo: </strong><span id="totalKcal" style="color:#10b981; font-weight:bold;">${netKcal}</span> kcal / <span style="font-size:0.8rem; color:var(--text-muted);">${targetKcal} kcal cel</span><br><div style="margin-top:0.4rem; font-size:0.85rem;">${leftMsg} ${burnedKcal > 0 ? `(Odzyskano 🏃+${burnedKcal} kcal)` : ''}</div>`;
        } else {
            summaryDiv.innerHTML = `<strong style="color:var(--text-color);">Zjedzono bilansowo: </strong><span id="totalKcal" style="color:#10b981; font-weight:bold;">${netKcal}</span> kcal<div style="font-size:0.7rem; color:var(--text-muted); margin-top:0.3rem;">Oblicz swój Cel w Kalkulatorze BMI, aby zyskać licznik bilansu widoczny na żywo.</div>`;
        }
    }
    
    // Update Water Text Always
    let todayDate = new Date().toISOString().split('T')[0];
    let currentWater = waterData[todayDate] || 0;
    const waterElement = document.getElementById('waterCount');
    if (waterElement) {
        if (currentWater >= 3000) {
            waterElement.innerHTML = `${currentWater} / 3000 ml<br><span style="color:#10b981; font-size:0.75rem; display:block; margin-top:0.4rem; padding: 0.25rem; background:rgba(16, 185, 129, 0.1); border-radius:0.25rem; border:1px solid rgba(16, 185, 129, 0.2); font-weight:normal; animation: fadeIn 0.4s ease-out;">Cel osiągnięty! Świetna robota! 🏆</span>`;
        } else {
            waterElement.textContent = `${currentWater} / 3000 ml`;
        }
    }

    let html = '';
    
    if (meals.length === 0 && workouts.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center; color: var(--text-muted); font-size: 0.875rem; margin-top:1rem;">Brak wpisów dla tego dziennika.</p>';
        return;
    }
    
    let mixedItems = [];
    meals.forEach(m => mixedItems.push({ ...m, isWorkout: false }));
    workouts.forEach(w => mixedItems.push({ ...w, isWorkout: true }));
    // Sort by id (timestamp mostly) so recent enters show bottom
    mixedItems.sort((a,b) => parseInt(a.id) - parseInt(b.id));

    html += '<ul style="list-style:none; padding:0; margin-top:1.5rem;">';
    mixedItems.forEach(item => {
        if (item.isWorkout) {
            html += `
                <li class="list-item" style="position:relative; background: rgba(14, 165, 233, 0.05); border: 1px solid rgba(14, 165, 233, 0.2);">
                    <div class="item-info" style="width: 100%;">
                        <div style="font-size: 0.7rem; color:#38bdf8; margin-bottom: 0.25rem;">🗓️ ${item.date || '—'} &bull; 🏃 Aktywność Fizyczna</div>
                        <div class="item-details" style="color:#38bdf8; margin-top:0.35rem; font-weight:bold;">🔥 Odzyskano ${item.kcal} kcal</div>
                    </div>
                    <button onclick="deleteWorkout('${item.id}')" class="item-delete" style="position:absolute; top:0.75rem; right:0.75rem; color:#38bdf8;">✕</button>
                </li>
            `;
        } else {
            const mDate = item.date || '—';
            const mTime = item.time || '';
            const mType = item.type || '';
            html += `
                <li class="list-item" style="position:relative;">
                    <div class="item-info" style="width: 100%;">
                        <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.25rem;">🗓️ ${mDate} ${mTime ? '⏰ '+mTime : ''} &bull; ⏳ ${mType}</div>
                        <strong style="font-size:1rem;">${item.name}</strong>
                        <div class="item-details" style="color:#10b981; margin-top:0.35rem;">🔥 Spożyto ${item.kcal} kcal</div>
                    </div>
                    <button onclick="deleteMeal('${item.id}')" class="item-delete" style="position:absolute; top:0.75rem; right:0.75rem;">✕</button>
                </li>
            `;
        }
    });
    html += '</ul>';
    listDiv.innerHTML = html;
}

window.addWater = function(amount) {
    let todayDate = new Date().toISOString().split('T')[0];
    if (!waterData[todayDate]) waterData[todayDate] = 0;
    waterData[todayDate] += amount;
    if (waterData[todayDate] < 0) waterData[todayDate] = 0;
    if (waterData[todayDate] > 3000) waterData[todayDate] = 3000;
    saveData();
    renderMealsList();
}

window.deleteMeal = function(id) {
    meals = meals.filter(m => m.id !== id);
    saveData();
    renderMealsList();
}

function handleAddNote(e) {
    e.preventDefault();
    const input = document.getElementById('valNotes');
    
    notes.push({
        id: Date.now().toString(),
        content: input.value.trim(),
        date: new Date().toLocaleDateString()
    });
    
    saveData();
    input.value = '';
    renderNotesList();
}

function renderNotesList() {
    const listDiv = document.getElementById('notesList');
    if (notes.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--text-muted); font-size: 0.875rem; margin-top:0.5rem;">Brak zapisanych notatek.</p>';
        return;
    }
    
    let html = '';
    notes.forEach(n => {
        html += `
            <div class="note-card" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; padding: 0.75rem; position: relative; display: flex; flex-direction: column;">
                <button onclick="deleteNote('${n.id}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: transparent; border: none; color: var(--danger); font-size: 1rem; cursor: pointer; opacity: 0.7; padding: 0;">✕</button>
                <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 0.5rem;">${n.date}</div>
                <div style="font-size: 0.85rem; white-space: pre-wrap; word-wrap: break-word; flex:1; color: var(--text-color);">${n.content}</div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

window.deleteNote = function(id) {
    notes = notes.filter(n => n.id !== id);
    saveData();
    renderNotesList();
}

function handleAddProgress(e) {
    e.preventDefault();
    const dateInput = document.getElementById('progDate');
    const weightInput = document.getElementById('progWeight');
    const photoInput = document.getElementById('progPhoto');
    const statusDiv = document.getElementById('progStatus');
    
    statusDiv.textContent = 'Trwa miniaturyzacja i zapisywanie...';
    
    const weightVal = parseFloat(weightInput.value);
    const dateVal = dateInput.value;
    const file = photoInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 300;
                let scale = 1;
                if (img.width > MAX_WIDTH) {
                    scale = MAX_WIDTH / img.width;
                }
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const base64Photo = canvas.toDataURL('image/jpeg', 0.6);
                saveProgressItem(dateVal, weightVal, base64Photo);
            }
            img.src = evt.target.result;
        }
        reader.readAsDataURL(file);
    } else {
        saveProgressItem(dateVal, weightVal, '');
    }
}

function saveProgressItem(date, weight, photoString) {
    progressData.push({
        id: Date.now().toString(),
        date: date,
        weight: weight,
        photo: photoString
    });
    
    progressData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    saveData();
    document.getElementById('progStatus').textContent = '';
    renderProgressList();
}

function renderProgressList() {
    const listDiv = document.getElementById('progressList');
    if (progressData.length === 0) {
        listDiv.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--text-muted); font-size: 0.875rem; margin-top:0.5rem;">Brak postępów.</p>';
        return;
    }
    
    let html = '';
    progressData.forEach(p => {
        let photoHtml = '';
        if (p.photo) {
            photoHtml = `<img src="${p.photo}" style="width:100%; height:120px; object-fit:cover; border-radius:0.5rem; margin-bottom:0.5rem; border:1px solid rgba(255,255,255,0.1);">`;
        } else {
            photoHtml = `<div style="width:100%; height:120px; background:rgba(0,0,0,0.2); border-radius:0.5rem; display:flex; align-items:center; justify-content:center; color:var(--text-muted); margin-bottom:0.5rem; font-size: 0.75rem;">Brak zdjęcia</div>`;
        }
        
        html += `
            <div class="progress-card" style="background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 0.5rem; padding: 0.75rem; position: relative;">
                <button onclick="deleteProgress('${p.id}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(0,0,0,0.7); border: none; color: white; width:22px; height:22px; border-radius: 50%; font-size: 0.75rem; cursor: pointer; display:flex; align-items:center; justify-content:center;">✕</button>
                ${photoHtml}
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">${p.date}</div>
                <div style="font-size: 1.1rem; font-weight:bold; color: var(--text-color);">${p.weight} kg</div>
            </div>
        `;
    });
    
    // Line Chart logic
    let chartHtml = `
        <div style="margin-bottom: 2rem; margin-top:1rem;">
            <h3 style="font-size: 1rem; color:var(--text-color); margin-bottom: 0.5rem; text-align:center;">Historia Wagi</h3>
            <div style="height:220px; width:100%;"><canvas id="weightChart"></canvas></div>
        </div>
    `;
    
    listDiv.innerHTML = chartHtml + html;
    
    setTimeout(() => {
        const ctx = document.getElementById('weightChart')?.getContext('2d');
        if (ctx && progressData.length > 0) {
            if (window.weightChartInstance) window.weightChartInstance.destroy();
            
            const sortedData = [...progressData].sort((a,b) => new Date(a.date) - new Date(b.date));
            const labels = sortedData.map(d => d.date);
            const dataPts = sortedData.map(d => d.weight);
            
            window.weightChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Waga (kg)',
                        data: dataPts,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        borderWidth: 3,
                        pointBackgroundColor: '#ea580c',
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: 'white' } } },
                    scales: {
                        x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                        y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                    }
                }
            });
        }
    }, 50);
}

window.deleteProgress = function(id) {
    progressData = progressData.filter(p => p.id !== id);
    saveData();
    renderProgressList();
}

document.addEventListener('DOMContentLoaded', () => {
    renderMain();
});
