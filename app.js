const app = document.getElementById('app');
let state = {
    isLoggedIn: false,
    username: '',
    activeTab: 'bmi'
};
let activeTheme = localStorage.getItem('fitness_theme') || 'dark';
document.documentElement.setAttribute('data-theme', activeTheme);
let exercises = [];
let meals = [];
let notes = [];
let progressData = [];
let waterData = {};
let targetKcal = 0;
let workouts = [];

const exerciseDB = {
    'Klatka piersiowa': ['Wyciskanie sztangi leżąc', 'Rozpiętki na hantlach', 'Wyciskanie na ławce skośnej (sztanga)', 'Wyciskanie na ławce skośnej (hantle)', 'Wyciskanie sztangi na skosie ujemnym', 'Pompki na poręczach (Dipy klatkowe)', 'Pompki klasyczne', 'Pompki z nogami wyżej (skos ujemny)', 'Pompki wąskie', 'Rozpiętki na bramie wyciąg górny', 'Rozpiętki na bramie wyciąg dolny', 'Maszyna Butterfly (Pec Dec)', 'Wyciskanie na maszynie Hammer (poziom)', 'Wyciskanie na maszynie Hammer (skos)', 'Przenoszenie hantla za głowę (Pullover)', 'Pompki na uchwytach wsporczych', 'Pompki z dodatkowym obciążeniem', 'Rozpiętki z gumą oporową', 'Floor press (wyciskanie z podłogi) sztangą', 'Floor press hantlami', 'Wyciskanie sztangi gilotynowe', 'Wyciskanie hantli chwytem młotkowym leżąc', 'Wyciskanie uchwytem odwrotnym', 'Pompki na kółkach gimnastycznych', 'Pompki spiderman (Spider push-ups)'],
    'Plecy': ['Podciąganie na drążku (nachwyt)', 'Podciąganie na drążku (podchwyt)', 'Podciąganie na drążku (chwyt neutralny)', 'Martwy ciąg klasyczny', 'Wiosłowanie sztangą (podchwyt)', 'Wiosłowanie sztangą (nachwyt)', 'Wiosłowanie hantlem jednorącz podparte', 'Ściąganie drążka wyciągu górnego do klatki', 'Ściąganie drążka wyciągu górnego za kark', 'Przyciąganie uchwytu wyciągu dolnego siedząc (wiosłowanie V-grip)', 'Wiosłowanie na maszynie T-bar', 'Wiosłowanie Pendlaya (Pendlay Rows)', 'Szrugsy ze sztangą', 'Szrugsy z hantlami', 'Przyciąganie drążka na prostych rękach (Straight arm pulldown)', 'Face pulls (Przyciąganie liny wyciągu górnego do twarzy)   ', 'Narciarz na wyciągu', 'Martwy ciąg z hantlami', 'Wiosłowanie hantlami leżąc przodem na ławce dodatniej', 'Renegade rows (wiosłowanie w podporze przodem z hantlami)', 'Odwrotne rozpiętki (akcentowanie tyłu barków i pleców)', 'Podciąganie australijskie (Inverted row)', 'Rack pulls (martwy ciąg z podwyższenia)', 'Szrugsy na maszynie Smitha', 'Wiosłowanie jednorącz na wyciągu dolnym'],
    'Nogi': ['Przysiady ze sztangą na karku (High bar)', 'Przysiady ze sztangą nisko na barkach (Low bar)', 'Przysiady przednie ze sztangą (Front squat)', 'Przysiady z hantlem/kettlem (Goblet squat)', 'Wykroki ze sztangą w miejscu lub chodzone', 'Wykroki z hantlami', 'Zakroki z obciążeniem', 'Przysiady bułgarskie (Bulgarian split squat)', 'Wyciskanie nogami na suwnicy (Leg press poziomy i skośny)', 'Prostowanie nóg siedząc na maszynie', 'Uginanie nóg leżąc na brzuchu na maszynie', 'Uginanie nóg siedząc na maszynie', 'Martwy ciąg na prostych nogach (RDL sztangą)', 'Rumuński martwy ciąg z hantlami (RDL hantle)', 'Przysiady na maszynie Smitha', 'Przysiad na maszynie Hack (Hack squat)', 'Wspięcia na łydki stojąc (sztanga/maszyna)', 'Wspięcia na łydki siedząc (tzw. ośle wspięcia)', 'Wykroki chodzone', 'Hip thrust (wypychanie bioder ze sztangą podparto plecami)', 'Hip thrust jednonóż', 'Glute bridge (mosty pośladkowe na podłodze)', 'Odwodzenie nóg na maszynie', 'Przywodzenie nóg na maszynie', 'Zbliżanie kolan (żabki) - maszyna brzuszna pod nogi', 'Syzyfki (Sissy squat)', 'Przysiady sumo ze sztangą lub hantlem', 'Skoki na skrzynię (Pliometria nóg)'],
    'Barki': ['Wyciskanie żołnierskie sztangi stojąc (OHP)  ', 'Wyciskanie sztangi sprzed głowy siedząc', 'Wyciskanie sztangi zza karku', 'Wyciskanie hantli siedząc nad głowę', 'Wyciskanie Arnolda (Arnold press)', 'Wznosy ramion bokiem z hantlami stąc', 'Wznosy ramion przodem z hantlami', 'Wznosy ramion przodem ze sztangą', 'Wznosy ramion bokiem na wyciągu dolnym', 'Odwrotne rozpiętki na maszynie (Pec dec tył na bark)', 'Podciąganie sztangi wzdłuż tułowia do brody', 'Podciąganie linek wyciągu dolnego wzdłuż tułowia', 'Face pulls na wyciągu górnym', 'Push press (wyciskanie z delikatnym wybiciem z nóg)  ', 'Krucyfiks z hantlami w trzymaniu izometrycznym', 'Thrusters (przysiad z całkowitym wyciskaniem sztangi)', 'Wznosy ramion z samym talerzem przodem', 'Wyciskanie na maszynie typu Hammer dedykowanej dla barków', 'Szrugsy z hantlami akcent górnej powięzi bocznej', 'Rozpiętki w opadzie tułowia z hantlami (tył barku)', 'Y-raises leżąc przodem na ławce pod skosem', 'Krzyżowanie linek wyciągu górnego przed twarzą'],
    'Biceps': ['Uginanie ramion ze sztangą prostą', 'Uginanie ramion ze sztangą łamaną (krzywką EZ)', 'Uginanie ramion z hantlami naprzemiennie (z supinacją)', 'Uginanie młotkowe z hantlami', 'Uginanie ramion na modlitewniku ze sztangą', 'Uginanie ramion na modlitewniku z hantlem jednorącz', 'Uginanie ramion z prostym drążkiem wyciągu dolnego', 'Uginanie ramion ze sznurem wyciągu dolnego (młotki)', 'Spider curls (uginanie ramion leżąc na ławce dodatniej brzuszkiem)', 'Uginanie koncentryczne w siadzie w oparciu o udo', 'Uginanie Zottmana (dynamiczna zmiana chwytu)', 'Uginanie ramion z silnie dociśniętą gumą oporową', 'Podciąganie na drążku podchwytem (bardzo wąski chwyt na ramię)', 'Uginanie ramion z hantlami siedząc na bardzo mocno odchylonej ławce', 'Uginanie jednorącz na wyciągu górnym z boku (pozycja podwójny biceps ze sceny)', 'Drag curls (wolne uginanie sztangi wzdłuż tarczy tułowia bez podnoszenia łokci)', 'Biceps curl na maszynach obciążeniowych', 'Uginanie ramion w oparciu ramionami o ścianę'],
    'Triceps': ['Wyciskanie francuskie sztangi leżąc (Skullcrushers/Czachołamacze)', 'Wyciskanie francuskie hantlami leżąc (naprzemiennie lub równoczesnie)', 'Wyciskanie francuskie sztangi bądź sztangielki oburącz siedząc', 'Prostowanie ramion na wyciągu górnym w dół (drążek V)', 'Prostowanie ramion na wyciągu górnym z liny (sznur)', 'Prostowanie ramienia z hantlem stając w opadzie tułowia do tyłu (Kickback)', 'Wyciskanie sztangi do góry w ekstremalnie wąskim chwycie', 'Pompki na poręczach z pionowym tułowiem (Dipy - czysty akcent na triceps)', 'Pompki w podporze tyłem, dłonie na krawędzi (np. na ławce z obciążeniem na biodrach)', 'Diamentowe pompki (pompki wąskie z ułożeniem dłoni w romb)', 'Prostowanie ramienia jednorącz pionowo na wyciągu górnym podchwytem', 'Prostowanie ramienia jednorącz pionowo na wyciągu górnym nachwytem', 'Prostowanie jednorącz na wyciągu dolnym ciągnąc linę wyciągniętą zza głowy', 'Wyciskanie francuskie wymuszone na maszynie Smitha', 'JM Press (hybryda wyciskania wąskiego z wyciskaniem francuskim)', 'Prostowanie ramion stając tyłem do stelaża, z gumą przeciąganą zza głowy nad ramionami', 'Pompki wąskie z uchwytami na obręczach gimnastycznych (TRX)', 'Dedykowana maszyna Tricepsowa obciążnikowa (Triceps Dip Machine)'],
    'Brzuch': ['Brzuszki klasyczne z łokciami na zewnątrz', 'Allahy (siłowe spięcia mięśnia z grubą linką wyciągu klęcząc)', 'Skurcze na maszynie z obciążnikami przymocowanymi do barków', 'Deska statyczna z opartymi łokciami w ziemię (Plank)', 'Deska boczna na lewą i prawą stronę (Side plank)', 'Russian Twist (dynamiczne obrotowe skręty tułowia siedząc - z lewej do prawej z obciążeniem)', 'Wznosy prostych nóg maksymalnie do poprzeczki w zwisie na drążku (Toes to Bar)', 'Wznosy ugiętych w kolanach nóg w swobodnym zwisie', 'Powolne wznosy prostych nóg z rotacją miednicy leżąc płasko na macie', 'Krótkie spięcia brzucha leżąc (Crunches) bez oderwania odcinka nerek', 'Rowerek w szybkim tempie leżąc (Bicycle crunches)', 'Scyzoryki (V-ups - jednoczesne uniesienie tułowia i nóg na macie)', 'Rollout z popularnym kółkiem w klęku (Ab wheel rollout) do pełnego wyprostu', 'Hollow body hold  - izometryczne napięcie kołyskowe w leżeniu', 'Świeca kulturystyczna (Dragon flag sylwetkowy na ławce poziomej)', 'Przeplatanie prostych nóg poziomo na boki siedząc w kształcie "L" (Wycieraczki/Pendulum)', 'Szybkie spięcia opierając odcinek lędźwiowy na nadmuchanej piłce gimnastycznej (Physioball crunches)', 'Woodchoppers (dynamiczne "rąbanie drwa" ukośnie liną wyciągu bocznego stojąc krok w bok)', 'Wznosy nóg w powietrzu ze statycznym oparciem pleców na maszynie drążkowej', 'Opuszczanie wolne nóg, podczas gdy partner rzuca je w dół na ziemię', 'Skręty rotacyjne korpusu na maszynie talerzowej w pozycji siedzącej']
};

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
    document.getElementById('floatingTimer').style.display = 'none';
    renderMain();
}

window.switchTab = function(tabName) {
    state.activeTab = tabName;
    
    // Update button active states
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${tabName}'`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTabContent();
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

window.toggleTheme = function() {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('fitness_theme', activeTheme);
    document.documentElement.setAttribute('data-theme', activeTheme);
    renderDashboard();
};



function renderDashboard() {
    document.getElementById('floatingTimer').style.display = 'flex';
    if(document.getElementById('timerDisplay').textContent === "01:30") updateTimerDisplay(); // init just once safely
    
    app.innerHTML = `
        <div class="glass-panel" style="animation: fadeIn 0.4s ease-out;">
            <header style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:2.5rem; padding: 0 1rem;">
                <div style="flex: 1; min-width: 250px;">
                    <h1 style="margin: 0; font-size:2.2rem; font-weight:800; letter-spacing:-0.5px;">Cześć, ${state.username}!</h1>
                    <p class="subtitle" style="margin: 0.4rem 0 0 0; font-size: 1.1rem; opacity: 0.8;">Twój zaawansowany panel fitness</p>
                </div>
                <div style="display:flex; gap:0.5rem; align-items:center; background: var(--panel-bg); padding: 0.5rem; border-radius: 0.75rem; border: 1px solid var(--glass-border);">
                    <button onclick="toggleTheme()" title="Zmień motyw" style="background:transparent; border:1px solid var(--glass-border); color:var(--text-color); padding:0.4rem; border-radius:0.5rem; cursor:pointer; font-size:1.1rem; transition: all 0.2s;">${activeTheme === 'dark' ? '🌞' : '🌙'}</button>
                    <button onclick="triggerImport()" title="Wgraj kopię zapasową" style="background:transparent; border:1px solid var(--glass-border); color:var(--text-color); padding:0.4rem 0.8rem; border-radius:0.5rem; cursor:pointer; font-size:0.75rem; font-weight:600;">📁 Wczytaj</button>
                    <button onclick="exportData()" title="Zapisz dane do pliku" style="background:transparent; border:1px solid rgba(16, 185, 129, 0.4); color:#10b981; padding:0.4rem 0.8rem; border-radius:0.5rem; cursor:pointer; font-size:0.75rem; font-weight:600;">💾 Kopia</button>
                    <button onclick="logout()" style="background:var(--danger); border:none; color:white; padding:0.4rem 0.8rem; border-radius:0.5rem; cursor:pointer; font-size:0.75rem; font-weight:700;">Wyloguj</button>
                </div>
            </header>
            
            <input type="file" id="importFile" accept=".json" style="display:none;" onchange="handleImport(event)">
            
            <div class="dashboard-layout">
                <div class="tabs">
                    <button class="tab-btn ${state.activeTab === 'bmi' ? 'active' : ''}" onclick="switchTab('bmi')">🥑 BMI & Cel</button>
                    <button class="tab-btn ${state.activeTab === 'exercises' ? 'active' : ''}" onclick="switchTab('exercises')">🏋️ Ćwiczenia</button>
                    <button class="tab-btn ${state.activeTab === 'meals' ? 'active' : ''}" onclick="switchTab('meals')">🍽️ Posiłki & Cardio</button>
                    <button class="tab-btn ${state.activeTab === 'supplements' ? 'active' : ''}" onclick="switchTab('supplements')">💊 Suplementacja</button>
                    <button class="tab-btn ${state.activeTab === 'notes' ? 'active' : ''}" onclick="switchTab('notes')">📝 Notatki</button>
                    <button class="tab-btn ${state.activeTab === 'progress' ? 'active' : ''}" onclick="switchTab('progress')">📈 Progres</button>
                </div>
                
                <div id="tabContent" class="tab-content"></div>
            </div>
        </div>
    `;

    renderTabContent();
}

function renderTabContent() {
    const contentDiv = document.getElementById('tabContent');
    if (!contentDiv) return;
    
    if (!state.activeTab) state.activeTab = 'bmi';

    if (state.activeTab === 'bmi') {
        contentDiv.innerHTML = `
            <div class="bmi-calculator" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1.5rem;">Kalkulator BMI i Kalorii</h2>
                
                <div style="display:flex; gap:1rem; margin-bottom:1rem;">
                    <div style="flex:1;">
                        <label class="input-label">Płeć</label>
                        <select id="gender" class="input-field">
                            <option value="male">Mężczyzna</option>
                            <option value="female">Kobieta</option>
                        </select>
                    </div>
                    <div style="flex:1;">
                        <label class="input-label">Wiek</label>
                        <input type="number" id="age" placeholder="np. 25" min="10" max="100" class="input-field">
                    </div>
                </div>

                <div style="display:flex; gap:1rem; margin-bottom:1rem;">
                    <div style="flex:1;">
                        <label class="input-label">Wzrost (cm)</label>
                        <input type="number" id="height" placeholder="np. 180" min="50" max="250" class="input-field">
                    </div>
                    <div style="flex:1;">
                        <label class="input-label">Waga (kg)</label>
                        <input type="number" id="weight" placeholder="np. 75" min="20" max="300" step="0.1" class="input-field">
                    </div>
                </div>
                
                <div style="margin-bottom:1rem;">
                    <label class="input-label">Poziom aktywności</label>
                    <select id="activity" class="input-field">
                        <option value="1.2">Brak aktywności</option>
                        <option value="1.375">Niska aktywność</option>
                        <option value="1.55">Umiarkowana</option>
                        <option value="1.725">Wysoka aktywność</option>
                        <option value="1.9">Bardzo wysoka</option>
                    </select>
                </div>
                
                <div style="margin-bottom:1.5rem;">
                    <label class="input-label">Twój Cel</label>
                    <select id="goal" class="input-field">
                        <option value="-500">Redukcja (-0.5kg/tydz.)</option>
                        <option value="0">Utrzymanie masy</option>
                        <option value="300">Budowa masy (+nadwyżka)</option>
                    </select>
                </div>
                
                <!-- US Navy BF Toggle -->
                <div style="margin-bottom: 1.5rem; background: var(--input-bg); padding: 1.25rem; border-radius: 0.75rem; border: 1px dashed var(--glass-border);">
                    <div style="display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="document.getElementById('navyFields').classList.toggle('hide')">
                        <span style="font-size:0.95rem; font-weight:600; color:var(--text-color);">Wylicz Tkankę Tłuszczową (US Navy) 📏</span>
                        <small style="color:var(--text-muted); font-size:0.75rem;">Pokaż ▼</small>
                    </div>
                    <div id="navyFields" class="hide" style="margin-top: 1rem; border-top: 1px solid var(--glass-border); padding-top: 1rem;">
                        <div style="display:flex; gap:1rem; margin-bottom:1rem;">
                            <div style="flex:1;">
                                <label class="input-label">Pas (cm)</label>
                                <input type="number" id="waistCirc" placeholder="Na pępku" step="0.1" class="input-field">
                            </div>
                            <div style="flex:1;">
                                <label class="input-label">Szyja (cm)</label>
                                <input type="number" id="neckCirc" placeholder="Pod krtanią" step="0.1" class="input-field">
                            </div>
                        </div>
                        <div style="display:flex; gap:1rem;" id="hipFieldContainer" class="hide">
                            <div style="flex:1;">
                                <label class="input-label">Biodra (cm)</label>
                                <input type="number" id="hipCirc" placeholder="Najszerszy punkt" step="0.1" class="input-field">
                            </div>
                        </div>
                    </div>
                </div>

                <button id="calcBmiBtn" class="btn-primary">Oblicz Twój Plan</button>
                
                <div id="bmiResult" class="bmi-result hide" style="margin-top: 2rem;">
                    <div id="bmiValue" class="bmi-value">--</div>
                    <div id="bmiStatus" class="bmi-status">--</div>
                    <div id="navyBfResult" style="margin-top:0.75rem; color:var(--primary); font-weight:bold; font-size:1.1rem; display:none;"></div>
                    
                    <hr style="border:0; border-top: 1px solid var(--glass-border); margin: 1.5rem 0;">
                    
                    <h3 style="font-size: 1rem; margin-top:0; color:var(--text-muted); font-weight:500;">Zalecane kalorie dla Twojego celu:</h3>
                    <div style="text-align:center; padding: 0.5rem;">
                        <strong id="finalCalories" style="color:var(--primary); font-size:2.5rem; line-height:1;">--</strong> <span style="color:var(--primary); font-size:1rem; font-weight:600;">kcal / dobę</span>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('gender').addEventListener('change', function(e) {
            const hips = document.getElementById('hipFieldContainer');
            if(e.target.value === 'female') {
                hips.classList.remove('hide');
            } else {
                hips.classList.add('hide');
            }
        });
        
        document.getElementById('calcBmiBtn').addEventListener('click', calculateBMI);
    } 
    else if (state.activeTab === 'exercises') {
        contentDiv.innerHTML = `
            <div class="exercise-logger" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1.5rem;">Dziennik Ćwiczeń</h2>

                <form id="exerciseForm">
                    <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:1.25rem;">
                        <div style="flex:1; min-width: 150px;">
                            <label class="input-label">Partia Ciała</label>
                            <select id="exGroup" required class="input-field">
                                <option value="" disabled selected>Wybierz...</option>
                                ${Object.keys(exerciseDB).map(grp => `<option value="${grp}">${grp}</option>`).join('')}
                            </select>
                        </div>
                        <div style="flex:2; min-width: 200px;">
                            <label class="input-label">Ćwiczenie</label>
                            <select id="exName" required class="input-field">
                                <option value="" disabled selected>Najpierw wybierz partię</option>
                            </select>
                        </div>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Serie / Powtórzenia / Ciężar</label>
                        <input type="text" id="exDetails" placeholder="np. 3x10 80kg" class="input-field" autocomplete="off">
                    </div>
                    <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                        <button type="submit" class="btn-primary" style="flex:2; background:var(--primary);">Zapisz Wpis</button>
                        <button type="button" id="btnGenerateWorkout" class="btn-primary" style="flex:1; background:var(--panel-bg); color:var(--text-color); border:1px solid var(--glass-border);" title="Wybierz Partię i kliknij!">🎲 Wylosuj</button>
                    </div>
                </form>
                <div class="list-container" id="exerciseList"></div>
            </div>
        `;
        
        
        // Dynamika Selecta Grupy Ćwiczeń
        document.getElementById('exGroup').addEventListener('change', function(e) {
            const group = e.target.value;
            const exNameSelect = document.getElementById('exName');
            exNameSelect.innerHTML = '<option value="" disabled selected>Wybierz ćwiczenie...</option>';
            if(exerciseDB[group]) {
                exerciseDB[group].forEach(ex => {
                    exNameSelect.innerHTML += `<option value="${ex}">${ex}</option>`;
                });
            }
        });
        
        // Generator Treningu
        document.getElementById('btnGenerateWorkout').addEventListener('click', function() {
            const group = document.getElementById('exGroup').value;
            if(!group) return alert("Wybierz najpierw Partię Ciała, aby wylosować trening!");
            
            let arr = exerciseDB[group].slice(); // copy
            arr.sort(() => 0.5 - Math.random());
            let picked = arr.slice(0, Math.min(5, arr.length));
            
            picked.forEach(exNameVal => {
                exercises.push({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    name: exNameVal,
                    details: '3x10 (do przypisania)'
                });
            });
            saveData();
            renderExercisesList();
            alert("Losowanie zakończone! 5 Piekielnych Ćwiczeń gotowych do wykonania!");
        });
        
        document.getElementById('exerciseForm').addEventListener('submit', handleAddExercise);
        renderExercisesList();
    }
    else if (state.activeTab === 'meals') {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        
        contentDiv.innerHTML = `
            <div class="meal-logger" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1.5rem;">Dziennik Żywienia</h2>
                
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <div class="card-sub" style="flex: 1; min-width: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom:0; background: var(--panel-bg);">
                        <h3 style="font-size: 1rem; color: var(--primary); margin-top: 0; margin-bottom: 0.5rem;">Nawodnienie 💧</h3>
                        <p style="font-size: 1.25rem; font-weight:700; color: var(--text-color); margin-bottom: 1rem;" id="waterCount">--</p>
                        <div style="display:flex; justify-content:center; gap:0.5rem; width: 100%;">
                            <button onclick="addWater(-250)" class="btn-primary" style="flex:1; background:var(--glass-bg); color:var(--text-color); border:1px solid var(--glass-border); padding:0.5rem; margin:0;">-</button>
                            <button onclick="addWater(250)" class="btn-primary" style="flex:2; margin:0; padding:0.5rem;">+ 250ml</button>
                        </div>
                    </div>
                </div>

                <form id="mealForm" class="card-sub">
                    <h3 style="font-size: 1rem; margin-top: 0; margin-bottom: 1rem; color:var(--text-color);">🍲 Dodaj Posiłek</h3>
                    <div style="display:flex; gap:0.75rem; margin-bottom: 1rem; flex-wrap:wrap;">
                        <div style="flex:1; min-width:120px;">
                            <label class="input-label">Data</label>
                            <input type="date" id="mealDate" value="${today}" required class="input-field">
                        </div>
                        <div style="flex:1; min-width:100px;">
                            <label class="input-label">Godzina</label>
                            <input type="time" id="mealTime" value="${timeStr}" required class="input-field">
                        </div>
                        <div style="flex:1; min-width:120px;">
                            <label class="input-label">Typ</label>
                            <select id="mealType" class="input-field">
                                <option value="Śniadanie">Śniadanie</option>
                                <option value="II Śniadanie">II Śniadanie</option>
                                <option value="Obiad">Obiad</option>
                                <option value="Przekąska">Przekąska</option>
                                <option value="Kolacja">Kolacja</option>
                            </select>
                        </div>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Nazwa Posiłku</label>
                        <input type="text" id="mealName" placeholder="np. Omlet z warzywami" required class="input-field" autocomplete="off">
                    </div>
                    <div style="display:flex; gap:0.75rem; margin-bottom: 1.5rem; flex-wrap:wrap;">
                        <div style="flex:1; min-width:80px;">
                            <label class="input-label">Kcal</label>
                            <input type="number" id="mealKcal" placeholder="0" min="0" required class="input-field">
                        </div>
                        <div style="flex:1; min-width:80px;">
                            <label class="input-label">B (g)</label>
                            <input type="number" id="mealP" placeholder="0" min="0" class="input-field">
                        </div>
                        <div style="flex:1; min-width:80px;">
                            <label class="input-label">W (g)</label>
                            <input type="number" id="mealC" placeholder="0" min="0" class="input-field">
                        </div>
                        <div style="flex:1; min-width:80px;">
                            <label class="input-label">T (g)</label>
                            <input type="number" id="mealF" placeholder="0" min="0" class="input-field">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary" style="background:var(--primary);">Dodaj Posiłek</button>
                </form>
                
                <form id="workoutForm" class="card-sub" style="background: rgba(14, 165, 233, 0.05); border-color: rgba(14, 165, 233, 0.2);">
                    <h3 style="font-size: 1rem; margin-top: 0; margin-bottom: 1rem; color:var(--primary);">🏃 Aktywność Spalająca</h3>
                    <div style="display:flex; gap:0.75rem;">
                        <input type="number" id="workKcal" placeholder="Spalone kalorie" min="1" required class="input-field" style="flex:2;">
                        <button type="submit" class="btn-primary" style="flex:1; margin:0; padding:0.75rem;">Zapisz</button>
                    </div>
                </form>
                
                <div id="mealSummary" class="card-sub" style="text-align:center; font-size:1.1rem; border-color: var(--primary);">
                     <strong style="color:var(--text-color);">Zjedzono dzisiaj: </strong> 
                     <span id="totalKcal" style="color:var(--primary); font-weight:bold;">0</span> kcal
                </div>

                <div class="list-container" id="mealList"></div>
            </div>
        `;
        document.getElementById('mealForm').addEventListener('submit', handleAddMeal);
        document.getElementById('workoutForm').addEventListener('submit', handleAddWorkout);
        renderMealsList();
    }
    else if (state.activeTab === 'supplements') {
        const supplements = [
            {
                name: 'Kreatyna (Monohydrat)',
                icon: '⚡',
                desc: 'Najlepiej przebadany suplement na świecie. Zwiększa siłę, wytrzymałość i nawodnienie komórek mięśniowych. Idealna dla każdego stopnia zaawansowania.',
                dosage: '5g dziennie, o dowolnej porze.'
            },
            {
                name: 'Odżywka Białkowa (WPC/WPI)',
                icon: '🥛',
                desc: 'Szybkie i wygodne źródło pełnowartościowego białka. Pomaga w regeneracji i budowie masy mięśniowej, gdy nie dostarczasz go dość z diety.',
                dosage: 'Według braków w diecie (zazwyczaj 30g po treningu).'
            },
            {
                name: 'Kwasy Omega-3',
                icon: '🐟',
                desc: 'Wspierają pracę serca, mózgu oraz hamują stany zapalne w organizmie. Kluczowe dla ogólnego zdrowia i regeneracji stawów.',
                dosage: '1-2 kapsułki dziennie do posiłku.'
            },
            {
                name: 'Kompleks Witamin i Minerałów',
                icon: '🍎',
                desc: 'Uzupełnia niedobory wynikające z intensywnego wysiłku. Wspiera odporność i prawidłowe funkcjonowanie metabolizmu.',
                dosage: '1 porcja rano do śniadania.'
            },
            {
                name: 'Magnez + B6',
                icon: '🔋',
                desc: 'Zapobiega skurczom mięśni, poprawia jakość snu i wspiera układ nerwowy po ciężkich sesjach treningowych.',
                dosage: 'Najlepiej wieczorem przed snem.'
            },
            {
                name: 'Kofeina / Przedtreningówka',
                icon: '☕',
                desc: 'Zwiększa skupienie, pobudza i pozwala na wykonanie cięższego treningu. Stosować z umiarem, by nie obciążać układu nerwowego.',
                dosage: '200-300mg na ok. 30-45 min przed treningiem.'
            }
        ];

        contentDiv.innerHTML = `
            <div class="supplements-section" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1.5rem;">Podstawowa Suplementacja</h2>
                <p style="text-align:center; color:var(--text-muted); font-size:0.9rem; margin-bottom:2rem; max-width:600px; margin-left:auto; margin-right:auto;">
                    Pamiętaj, że suplementy to tylko dodatek do zbilansowanej diety i treningu. Poniżej znajdziesz fundamenty, które realnie wspierają formę.
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
                    ${supplements.map(s => `
                        <div class="card-sub" style="margin-bottom:0; display:flex; flex-direction:column; gap:0.75rem; transition: transform 0.2s ease;">
                            <div style="display:flex; align-items:center; gap:0.75rem;">
                                <span style="font-size:2rem;">${s.icon}</span>
                                <h3 style="font-size:1.1rem; margin:0; color:var(--text-color);">${s.name}</h3>
                            </div>
                            <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5; margin:0; flex:1;">${s.desc}</p>
                            <div style="background:var(--input-bg); padding:0.6rem 0.8rem; border-radius:0.5rem; border:1px solid var(--glass-border);">
                                <span style="font-size:0.75rem; font-weight:700; color:var(--primary); display:block; margin-bottom:0.2rem; text-transform:uppercase;">Dawkowanie:</span>
                                <span style="font-size:0.85rem; color:var(--text-color);">${s.dosage}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    else if (state.activeTab === 'notes') {
        contentDiv.innerHTML = `
            <div class="notes-logger" style="animation: fadeIn 0.3s ease-out;">
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1.5rem;">Złote myśli i plany</h2>
                <form id="noteForm" class="card-sub">
                    <div class="input-group">
                        <textarea id="valNotes" placeholder="Nowa notatka, np. plan na klatkę piersiową..." required class="input-field" style="height:120px; resize:vertical;"></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Dodaj Notatkę</button>
                </form>
                
                <div class="notes-grid" id="notesList" style="margin-top: 1.5rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
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
                <h2 style="font-size: 1.25rem; text-align:center; margin-top:0; margin-bottom:1.5rem;">Śledzenie Postępów</h2>
                <form id="progressForm" class="card-sub">
                    <div style="display:flex; gap:1rem; margin-bottom: 1.25rem; flex-wrap:wrap;">
                        <div style="flex:1; min-width:140px;">
                            <label class="input-label">Data wpisu</label>
                            <input type="date" id="progDate" value="${today}" required class="input-field">
                        </div>
                        <div style="flex:1; min-width:140px;">
                            <label class="input-label">Waga (kg)</label>
                            <input type="number" id="progWeight" placeholder="np. 70" step="0.1" required class="input-field">
                        </div>
                    </div>
                    <div class="input-group" style="margin-bottom:1.5rem;">
                        <label class="input-label">Dodaj zdjęcie sylwetki</label>
                        <input type="file" id="progPhoto" accept="image/*" class="input-field" style="padding: 0.5rem;">
                    </div>
                    <button type="submit" class="btn-primary">Zapisz Pomiar</button>
                    <div id="progStatus" style="text-align:center; margin-top:0.75rem; font-size:0.85rem; color:var(--primary); font-weight:500;"></div>
                </form>

                <div class="progress-grid" id="progressList" style="margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem;">
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
    
    // US Navy Body Fat Method (Optional)
    const waist = parseFloat(document.getElementById('waistCirc').value);
    const neck = parseFloat(document.getElementById('neckCirc').value);
    const hip = parseFloat(document.getElementById('hipCirc').value);
    const bfResultDiv = document.getElementById('navyBfResult');
    bfResultDiv.style.display = 'none';

    if (waist && neck) {
        let bf = 0;
        if (gender === 'male' && waist > neck) {
            bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
            bfResultDiv.textContent = `Szacowany poziom tkanki tłuszczowej (US Navy): ${bf.toFixed(1)}%`;
            bfResultDiv.style.display = 'block';
        } else if (gender === 'female' && hip && (waist + hip > neck)) {
            bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
            bfResultDiv.textContent = `Szacowany poziom tkanki tłuszczowej (US Navy): ${bf.toFixed(1)}%`;
            bfResultDiv.style.display = 'block';
        }
    }
    
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
    const pInput = document.getElementById('mealP');
    const cInput = document.getElementById('mealC');
    const fInput = document.getElementById('mealF');
    
    meals.push({
        id: Date.now().toString(),
        date: dateInput.value,
        time: timeInput.value,
        type: typeInput.value,
        name: nameInput.value.trim(),
        kcal: Math.max(0, parseInt(kcalInput.value) || 0),
        p: Math.max(0, parseInt(pInput.value) || 0),
        c: Math.max(0, parseInt(cInput.value) || 0),
        f: Math.max(0, parseInt(fInput.value) || 0)
    });
    saveData();
    
    nameInput.value = '';
    kcalInput.value = '';
    pInput.value = '';
    cInput.value = '';
    fInput.value = '';
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
    let totalKcal = 0, totalP = 0, totalC = 0, totalF = 0;
    let burnedKcal = 0;
    
    meals.forEach(m => {
        totalKcal += m.kcal;
        totalP += m.p || 0;
        totalC += m.c || 0;
        totalF += m.f || 0;
    });
    workouts.forEach(w => burnedKcal += w.kcal);
    
    let netKcal = totalKcal - burnedKcal;
    let targetP = 0, targetC = 0, targetF = 0;
    if (targetKcal > 0) {
        targetP = Math.round((targetKcal * 0.3) / 4);
        targetC = Math.round((targetKcal * 0.45) / 4);
        targetF = Math.round((targetKcal * 0.25) / 9);
    }
    
    // Target calculation wrapper update
    const summaryDiv = document.getElementById('mealSummary');
    if (summaryDiv) {
        if (targetKcal > 0) {
            let left = targetKcal - netKcal;
            let leftMsg = left >= 0 ? `🔥 Zostało ci: <strong style="color:#f59e0b;">${left} kcal</strong>` : `⚠️ Przekroczenie o: <strong style="color:var(--danger);">${Math.abs(left)} kcal</strong>`;
            
            let macroHtml = `
                <div style="display:flex; justify-content:space-around; align-items:center; margin-top:1rem; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.1);">
                    <div style="width: 140px; height: 140px;"><canvas id="macroChart"></canvas></div>
                    <div style="text-align:left; font-size:0.85rem;">
                        <div style="color:#3b82f6; margin-bottom:0.25rem;">🔵 Białko: ${totalP}g / ${targetP}g</div>
                        <div style="color:#10b981; margin-bottom:0.25rem;">🟢 Węglowodany: ${totalC}g / ${targetC}g</div>
                        <div style="color:#f59e0b;">🟠 Tłuszcze: ${totalF}g / ${targetF}g</div>
                    </div>
                </div>
            `;
            
            summaryDiv.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="text-align:left;">
                        <strong style="color:var(--text-color);">Bilans: </strong><span id="totalKcal" style="color:var(--primary); font-weight:bold; font-size:1.25rem;">${netKcal}</span> <span style="font-size:0.85rem; color:var(--text-muted);">/ ${targetKcal} kcal</span>
                    </div>
                </div>
                <div style="margin-top:0.4rem; font-size:0.85rem; text-align:left;">${leftMsg} ${burnedKcal > 0 ? `<span style="color:var(--primary); font-weight:500;">(Spalono 🏃 ${burnedKcal} kcal)</span>` : ''}</div> 
                ${macroHtml}
            `;
            
            // Render Chart
            setTimeout(() => {
                const ctx = document.getElementById('macroChart')?.getContext('2d');
                if (ctx) {
                    if(window.macroChartInstance) window.macroChartInstance.destroy();
                    const isDark = activeTheme === 'dark';
                    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
                    
                    window.macroChartInstance = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Białko', 'Węglowodany', 'Tłuszcze', 'Pozostało'],
                            datasets: [{
                                data: [
                                    Math.min(totalP, targetP), 
                                    Math.min(totalC, targetC), 
                                    Math.min(totalF, targetF), 
                                    Math.max(0, targetP - totalP + targetC - totalC + targetF - totalF)
                                ],
                                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'],
                                borderWidth: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '75%',
                            plugins: { legend: { display: false } }
                        }
                    });
                }
            }, 50);

        } else {
            summaryDiv.innerHTML = `<strong style="color:var(--text-color);">Zjedzono bilansowo: </strong><span id="totalKcal" style="color:var(--primary); font-weight:bold;">${netKcal}</span> kcal<div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem; line-height:1.4;">Oblicz swój Cel w Kalkulatorze BMI, aby odblokować licznik bilansu i estymację Makroskładników.</div>`;
        }
    }
    
    // Update Water Text Always
    let todayDate = new Date().toISOString().split('T')[0];
    let currentWater = waterData[todayDate] || 0;
    const waterElement = document.getElementById('waterCount');
    if (waterElement) {
        if (currentWater >= 3000) {
            waterElement.innerHTML = `${currentWater} / 3000 ml<br><span style="color:#10b981; font-size:0.75rem; display:block; margin-top:0.5rem; padding: 0.4rem; background:rgba(16, 185, 129, 0.1); border-radius:0.5rem; border:1px solid rgba(16, 185, 129, 0.2); font-weight:500; animation: fadeIn 0.4s ease-out;">Cel osiągnięty! 🏆</span>`;
        } else {
            waterElement.textContent = `${currentWater} / 3000 ml`;
            waterElement.style.color = 'var(--text-color)';
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
                        <div class="item-details" style="margin-top:0.35rem;">
                            <span style="color:#10b981; font-weight:bold; margin-right:0.5rem;">🔥 Spożyto ${item.kcal} kcal</span>
                            <span style="color:#3b82f6; margin-right:0.3rem;">B:${item.p||0}g</span>
                            <span style="color:#10b981; margin-right:0.3rem;">W:${item.c||0}g</span>
                            <span style="color:#f59e0b;">T:${item.f||0}g</span>
                        </div>
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
            <div class="note-card" style="background: var(--panel-bg); border: 1px solid var(--glass-border); border-radius: 0.5rem; padding: 1rem; position: relative; display: flex; flex-direction: column; box-shadow: var(--card-shadow);">
                <button onclick="deleteNote('${n.id}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: transparent; border: none; color: var(--danger); font-size: 1.1rem; cursor: pointer; opacity: 0.6; padding: 0;">✕</button>
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight:500;">${n.date}</div>
                <div style="font-size: 0.9rem; white-space: pre-wrap; word-wrap: break-word; flex:1; color: var(--text-color); line-height:1.4;">${n.content}</div>
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
            photoHtml = `<img src="${p.photo}" style="width:100%; height:120px; object-fit:cover; border-radius:0.5rem; margin-bottom:0.5rem; border:1px solid var(--glass-border);">`;
        } else {
            photoHtml = `<div style="width:100%; height:120px; background:var(--glass-bg); border-radius:0.5rem; display:flex; align-items:center; justify-content:center; color:var(--text-muted); margin-bottom:0.5rem; font-size: 0.75rem; border: 1px dashed var(--glass-border);">Brak zdjęcia</div>`;
        }
        
        html += `
            <div class="progress-card" style="background: var(--panel-bg); border: 1px solid var(--glass-border); border-radius: 0.5rem; padding: 0.75rem; position: relative; box-shadow: var(--card-shadow);">
                <button onclick="deleteProgress('${p.id}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: var(--danger); border: none; color: white; width:22px; height:22px; border-radius: 50%; font-size: 0.75rem; cursor: pointer; display:flex; align-items:center; justify-content:center; opacity: 0.8;">✕</button>
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
            
            const isDark = activeTheme === 'dark';
            const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();

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
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#2563eb',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { 
                            labels: { color: textColor, font: { size: 11 } } 
                        } 
                    },
                    scales: {
                        x: { 
                            ticks: { color: textColor, font: { size: 10 } }, 
                            grid: { color: gridColor } 
                        },
                        y: { 
                            ticks: { color: textColor, font: { size: 10 } }, 
                            grid: { color: gridColor } 
                        }
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
    // Inject floating timer dynamically
    const timerDiv = document.createElement('div');
    timerDiv.id = 'floatingTimer';
    timerDiv.style.cssText = 'display:none; position:fixed; bottom:24px; right:24px; background:var(--glass-bg); backdrop-filter:blur(12px); border:1px solid var(--glass-border); border-radius:1rem; padding:0.75rem 1rem; flex-direction:column; align-items:center; z-index:1000; box-shadow:var(--card-shadow); transition:all 0.3s ease;';
    timerDiv.innerHTML = `
        <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.3rem; font-weight:600;">⏱️ Przerwa</div>
        <div style="display:flex; gap:0.75rem; align-items:center; margin-bottom:0.5rem;">
            <button onclick="addTime(-15)" style="background:transparent; color:var(--text-muted); border:none; cursor:pointer; font-size:1.25rem; min-width:30px; transition:color 0.2s;">-</button>
            <span id="timerDisplay" style="font-size:1.75rem; font-weight:700; font-family:monospace; color:var(--primary); width:80px; text-align:center; transition: color 0.3s;">01:30</span>
            <button onclick="addTime(15)" style="background:transparent; color:var(--text-muted); border:none; cursor:pointer; font-size:1.25rem; min-width:30px; transition:color 0.2s;">+</button>
        </div>
        <div style="display:flex; gap:0.5rem; width: 100%;">
            <button onclick="toggleTimer()" id="timerToggleBtn" style="flex:2; background:var(--primary); color:white; border:none; border-radius:0.5rem; padding:0.3rem; cursor:pointer; font-size:0.8rem; font-weight:bold;">Start</button>
            <button onclick="resetTimer()" style="flex:1; background:rgba(239,68,68,0.2); color:#ef4444; border:1px solid rgba(239,68,68,0.3); border-radius:0.5rem; padding:0.3rem; cursor:pointer; font-size:0.8rem; font-weight:bold;">⏹</button>
        </div>
    `;
    document.body.appendChild(timerDiv);
    
    renderMain();
});

// --- TIMER LOGIC ---
let timerInterval = null;
let currentSeconds = 90; // Default 1:30
let isTimerRunning = false;

window.updateTimerDisplay = function() {
    const mins = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
    const secs = (currentSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${mins}:${secs}`;
    
    // Change color if close to 0
    if (currentSeconds <= 10) {
        document.getElementById('timerDisplay').style.color = '#ef4444'; // Red
    } else {
        document.getElementById('timerDisplay').style.color = '#38bdf8'; // Blue
    }
}

window.addTime = function(amount) {
    if (!isTimerRunning) {
        currentSeconds += amount;
        if (currentSeconds < 15) currentSeconds = 15; // Min 15s
        updateTimerDisplay();
    }
}

window.toggleTimer = function() {
    const btn = document.getElementById('timerToggleBtn');
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        btn.textContent = 'Start';
        btn.style.background = 'var(--primary)';
    } else {
        if (currentSeconds <= 0) currentSeconds = 90; // Reset to 90s if started from 0
        isTimerRunning = true;
        btn.textContent = 'Pauza';
        btn.style.background = '#f59e0b';
        timerInterval = setInterval(() => {
            currentSeconds--;
            updateTimerDisplay();
            
            if (currentSeconds <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                btn.textContent = 'Start';
                btn.style.background = 'var(--primary)';
                
                // Visual cue
                const floatingTimer = document.getElementById('floatingTimer');
                floatingTimer.style.boxShadow = "0 0 20px #ef4444";
                document.getElementById('timerDisplay').style.color = '#ef4444';
                setTimeout(() => {
                   floatingTimer.style.boxShadow = "0 10px 25px rgba(0,0,0,0.5)"; 
                   document.getElementById('timerDisplay').style.color = '#38bdf8';
                }, 2000);
            }
        }, 1000);
    }
}

window.resetTimer = function() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    currentSeconds = 90;
    const btn = document.getElementById('timerToggleBtn');
    btn.textContent = 'Start';
    btn.style.background = 'var(--primary)';
    updateTimerDisplay();
}
