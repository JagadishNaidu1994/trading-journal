document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('entryForm').addEventListener('submit', addEntry);
    displayEntries();

    // Modal functionality
    const modal = document.getElementById("tradeFormModal");
    const addTradeBtn = document.getElementById("addTradeBtn");
    const closeBtn = document.querySelector(".close-btn");

    // Show modal on "+ Add Trade" button click
    addTradeBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Close modal on "x" button click
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside of modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

function addEntry(event) {
    event.preventDefault();

    // Retrieve form values
    const date = document.getElementById('date').value;
    const timeIn = document.getElementById('timeIn').value;
    const timeOut = document.getElementById('timeOut').value;
    const symbol = document.getElementById('symbol').value;
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const exitPrice = parseFloat(document.getElementById('exitPrice').value);
    const qty = parseInt(document.getElementById('qty').value);

    if (isNaN(entryPrice) || isNaN(exitPrice) || isNaN(qty) || !date || !timeIn || !timeOut || !symbol) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const result = exitPrice > entryPrice ? "Win" : "Loss";
    const pnl = (exitPrice - entryPrice) * qty;

    const entry = { date, timeIn, timeOut, symbol, entryPrice, exitPrice, qty, result, pnl };

    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.push(entry);
    localStorage.setItem('journalEntries', JSON.stringify(entries));

    displayEntries();
    document.getElementById('entryForm').reset();

    // Hide modal after adding entry
    modal.style.display = "none";
}

function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entriesTable = document.getElementById('entriesTable');
    entriesTable.innerHTML = '';

    entries.forEach(entry => {
        const entryPrice = isNaN(entry.entryPrice) ? 0 : entry.entryPrice;
        const exitPrice = isNaN(entry.exitPrice) ? 0 : entry.exitPrice;
        const pnl = isNaN(entry.pnl) ? 0 : entry.pnl;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.timeIn}</td>
            <td>${entry.timeOut}</td>
            <td>${entry.symbol}</td>
            <td>${entryPrice.toFixed(2)}</td>
            <td>${exitPrice.toFixed(2)}</td>
            <td>${entry.qty}</td>
            <td class="${entry.result === 'Win' ? 'win' : 'loss'}">${entry.result}</td>
            <td class="${pnl >= 0 ? 'win' : 'loss'}">${pnl.toFixed(2)}</td>
        `;
        entriesTable.appendChild(row);
    });
}
