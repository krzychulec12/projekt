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
            <p class="subtitle">Zalogowano pomyślnie. Co chcesz teraz zrobić?</p>
            <p style="text-align:center; color: var(--text-muted); font-size: 14px;">
                Panel gotowy na dodanie Kalkulatora BMI!
            </p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderMain();
});
