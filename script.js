// Toggle Theme
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Modal Functions
function openModal() {
    document.getElementById('addTradeModal').style.display = "block";
}

function closeModal() {
    document.getElementById('addTradeModal').style.display = "none";
}

// Save Initial Capital
function saveInitialCapital() {
    const capital = document.getElementById('initialCapital').value;
    localStorage.setItem('initialCapital', capital);
    alert(`Initial capital saved: ${capital}`);
}

// Add Trade
function addTrade() {
    const date = document.getElementById('tradeDate').value;
    const symbol = document.getElementById('symbol').value;
    const quantity = Number(document.getElementById('quantity').value);
    const entry = Number(document.getElementById('entryPrice').value);
    const exit = Number(document.getElementById('exitPrice').value);

    const pnl = (exit - entry) * quantity;
    const status = pnl > 0 ? 'Win' : 'Loss';
    const row = `<tr>
                    <td>${date}</td>
                    <td>${symbol}</td>
                    <td>${status}</td>
                    <td>${quantity}</td>
                    <td>${entry}</td>
                    <td>${exit}</td>
                    <td>-</td>
                    <td style="color: ${pnl > 0 ? 'green' : 'red'};">${pnl}</td>
                    <td>-</td>
                    <td>-</td>
                </tr>`;
    
    document.querySelector("#tradesTable tbody").insertAdjacentHTML('beforeend', row);
    closeModal();
}

// Event Listeners
document.getElementById('themeToggle').addEventListener('change', toggleTheme);
document.getElementById('openAddTradeModal').addEventListener('click', openModal);
document.getElementById('closeModalBtn').addEventListener('click', closeModal);

// Apply saved theme
document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').checked = true;
    }
});
