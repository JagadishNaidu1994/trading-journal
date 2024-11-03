document.getElementById('entryForm').addEventListener('submit', addEntry);

function addEntry(event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const timeIn = document.getElementById('timeIn').value;
    const timeOut = document.getElementById('timeOut').value;
    const symbol = document.getElementById('symbol').value;
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const exitPrice = parseFloat(document.getElementById('exitPrice').value);
    const qty = parseInt(document.getElementById('qty').value);

    const result = exitPrice > entryPrice ? "Win" : "Loss";
    const pnl = (exitPrice - entryPrice) * qty;

    const entry = { date, timeIn, timeOut, symbol, entryPrice, exitPrice, qty, result, pnl };
    
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.push(entry);
    localStorage.setItem('journalEntries', JSON.stringify(entries));

    displayEntries();
    document.getElementById('entryForm').reset();
}

function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entriesTable = document.getElementById('entriesTable');
    entriesTable.innerHTML = '';

    entries.forEach(entry => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.timeIn}</td>
            <td>${entry.timeOut}</td>
            <td>${entry.symbol}</td>
            <td>${entry.entryPrice.toFixed(2)}</td>
            <td>${entry.exitPrice.toFixed(2)}</td>
            <td>${entry.qty}</td>
            <td class="${entry.result === 'Win' ? 'win' : 'loss'}">${entry.result}</td>
            <td class="${entry.pnl >= 0 ? 'win' : 'loss'}">${entry.pnl.toFixed(2)}</td>
        `;

        entriesTable.appendChild(row);
    });
}

window.onload = displayEntries;
