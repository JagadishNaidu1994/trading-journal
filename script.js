document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('entryForm').addEventListener('submit', addEntry);
    displayEntries();
});


// Function to handle CSV upload and parsing
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
        parseCSV(csvData);
    };
    reader.readAsText(file);
}

// Function to parse CSV data and add entries
function parseCSV(data) {
    // Split the data by lines
    const rows = data.split('\n');

    // Assume the first row contains headers
    rows.shift(); // Remove header row

    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

    rows.forEach(row => {
        const columns = row.split(',');

        // Check if the row has enough columns (Date, Time In, Time Out, Symbol, Entry Price, Exit Price, Qty)
        if (columns.length >= 7) {
            const date = columns[0].trim();
            const timeIn = columns[1].trim();
            const timeOut = columns[2].trim();
            const symbol = columns[3].trim();
            const entryPrice = parseFloat(columns[4].trim());
            const exitPrice = parseFloat(columns[5].trim());
            const qty = parseInt(columns[6].trim());

            if (!date || !timeIn || !timeOut || !symbol || isNaN(entryPrice) || isNaN(exitPrice) || isNaN(qty)) {
                console.warn("Skipping invalid row:", row);
                return;
            }

            // Calculate Result and P&L
            const result = exitPrice > entryPrice ? "Win" : "Loss";
            const pnl = (exitPrice - entryPrice) * qty;

            // Create an entry object
            const entry = { date, timeIn, timeOut, symbol, entryPrice, exitPrice, qty, result, pnl };
            entries.push(entry);
        }
    });

    // Save all entries to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(entries));

    // Refresh the table display
    displayEntries();
}

// Existing code for displayEntries and addEntry functions



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

    // Check if entryPrice, exitPrice, or qty are NaN or missing
    if (isNaN(entryPrice) || isNaN(exitPrice) || isNaN(qty) || !date || !timeIn || !timeOut || !symbol) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Calculate Result and P&L
    const result = exitPrice > entryPrice ? "Win" : "Loss";
    const pnl = (exitPrice - entryPrice) * qty;

    // Create an entry object
    const entry = { date, timeIn, timeOut, symbol, entryPrice, exitPrice, qty, result, pnl };

    // Save the entry to localStorage
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
        // Check if entryPrice, exitPrice, and pnl are valid numbers
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
