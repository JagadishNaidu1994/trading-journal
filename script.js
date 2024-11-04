document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('entryForm').addEventListener('submit', addEntry);
    displayEntries();
});
function uploadCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Please select a CSV file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        parseCSV(csvData);  // Make sure parseCSV function exists
    };
    reader.readAsText(file);
}

function addEntry(event) {
    event.preventDefault();

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

    const status = exitPrice > entryPrice ? "Profit" : "Loss";
    const pnl = (exitPrice - entryPrice) * qty;
    const holdTime = calculateHoldTime(timeIn, timeOut);

    const initialCapital = parseFloat(document.getElementById('initialCapital').value) || 1;
    const roc = ((pnl / initialCapital) * 100).toFixed(2);

    const entry = { date, timeIn, timeOut, symbol, status, qty, entryPrice, exitPrice, holdTime, pnl, roc };
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

    entries.forEach((entry, index) => {
        // Safely parse values and provide defaults if undefined
        const entryPrice = isNaN(entry.entryPrice) ? 0 : entry.entryPrice;
        const exitPrice = isNaN(entry.exitPrice) ? 0 : entry.exitPrice;
        const qty = isNaN(entry.qty) ? 0 : entry.qty;
        const pnl = isNaN(entry.pnl) ? 0 : entry.pnl;
        const roc = isNaN(entry.roc) ? 0 : entry.roc;

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${entry.date || ''}</td>
            <td>${entry.timeIn || ''}</td>
            <td>${entry.timeOut || ''}</td>
            <td>${entry.symbol || ''}</td>
            <td class="${entry.status === 'Profit' ? 'profit-icon' : 'loss-icon'}">${entry.status === 'Profit' ? '✔️' : '❌'}</td>
            <td>${qty}</td>
            <td>${entryPrice.toFixed(2)}</td>
            <td>${exitPrice.toFixed(2)}</td>
            <td>${entry.holdTime || ''}</td>
            <td class="${pnl >= 0 ? 'win' : 'loss'}">${pnl.toFixed(2)}</td>
            <td>${roc.toFixed(2)}%</td>
            <td>${entry.tags || ''}</td>
            <td>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            </td>
        `;

        entriesTable.appendChild(row);
    });
}


function calculateHoldTime(timeIn, timeOut) {
    const inTime = new Date(`1970-01-01T${timeIn}:00`);
    const outTime = new Date(`1970-01-01T${timeOut}:00`);
    const diff = (outTime - inTime) / (1000 * 60); // in minutes
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
}

function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.splice(index, 1);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displayEntries();
}

function editEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entry = entries[index];

    document.getElementById('date').value = entry.date;
    document.getElementById('timeIn').value = entry.timeIn;
    document.getElementById('timeOut').value = entry.timeOut;
    document.getElementById('symbol').value = entry.symbol;
    document.getElementById('entryPrice').value = entry.entryPrice;
    document.getElementById('exitPrice').value = entry.exitPrice;
    document.getElementById('qty').value = entry.qty;

    entries.splice(index, 1); // Remove the old entry
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displayEntries();
}
