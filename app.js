const app = document.getElementById('app');
let state = {
    isLoggedIn: false,
    username: ''
};

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
        renderMain();
    }, 300);
}

function renderDashboard() {
    app.innerHTML = `
        <div class="glass-panel" style="animation: fadeIn 0.5s ease-out;">
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
            
            <p style="text-align:center; color: var(--text-muted); font-size: 12px; margin-top: 1.5rem;">
                Dziennik ćwiczeń (Krok 4) wkrótce...
            </p>
        </div>
    `;

    document.getElementById('calcBmiBtn').addEventListener('click', calculateBMI);
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

document.addEventListener('DOMContentLoaded', () => {
    renderMain();
});
