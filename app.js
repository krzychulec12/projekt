const app = document.getElementById('app');

function renderBase() {
    app.innerHTML = `
        <div class="glass-panel">
            <h1>Kalkulator Fitness</h1>
            <p class="subtitle">Projekt gotowy!</p>
            <p style="text-align:center; color: var(--text-muted); font-size: 14px;">
                Czekam na uruchomienie drugiego etapu!
            </p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderBase();
});
