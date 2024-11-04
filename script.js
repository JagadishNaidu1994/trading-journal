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
    const capitalInput = document.getElementById('initialCapital');
    const capital = capitalInput.value;
    localStorage.setItem('initialCapital', capital);
    alert(`Initial capital saved: ${capital}`);

    // Toggle Save/Edit buttons
    capitalInput.disabled = true;
    document.getElementById('saveCapitalBtn').classList.add('hidden');
    document.getElementById('editCapitalBtn').classList.remove('hidden');
}

// Edit Initial Capital
function editInitialCapital() {
    document.getElementById('initialCapital').disabled = false;
    document.getElementById('saveCapitalBtn').classList.remove('hidden');
    document.getElementById('editCapitalBtn').classList.add('hidden');
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

// Apply saved theme and capital
document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.getElementById('themeToggle').checked = theme === 'dark';

    const capital = localStorage.getItem('initialCapital');
    if (capital) {
        document.getElementById('initialCapital').value = capital;
        document.getElementById('initialCapital').disabled = true;
        document.getElementById('saveCapitalBtn').classList.add('hidden');
        document.getElementById('editCapitalBtn').classList.remove('hidden');
    }
});
