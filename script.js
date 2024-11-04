document.getElementById('addTradeBtn').addEventListener('click', () => {
    openModal('addTradeModal');
});

document.getElementById('addTradeForm').addEventListener('submit', addEntry);
document.getElementById('editTradeForm').addEventListener('submit', saveEditEntry);
// Load initial capital on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedCapital = localStorage.getItem('initialCapital');
    const initialCapitalInput = document.getElementById('initialCapital');
    const saveBtn = document.getElementById('saveCapitalBtn');
    const editBtn = document.getElementById('editCapitalBtn');

    if (savedCapital) {
        initialCapitalInput.value = savedCapital;
        initialCapitalInput.readOnly = true;
        saveBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';
    }
});

// Function to save initial capital
function saveInitialCapital() {
    const initialCapitalInput = document.getElementById('initialCapital');
    const saveBtn = document.getElementById('saveCapitalBtn');
    const editBtn = document.getElementById('editCapitalBtn');

    const capitalValue = initialCapitalInput.value;
    if (capitalValue) {
        localStorage.setItem('initialCapital', capitalValue);
        initialCapitalInput.readOnly = true;
        saveBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';
    } else {
        alert("Please enter a valid initial capital amount.");
    }
}

// Function to enable editing of initial capital
function editInitialCapital() {
    const initialCapitalInput = document.getElementById('initialCapital');
    const saveBtn = document.getElementById('saveCapitalBtn');
    const editBtn = document.getElementById('editCapitalBtn');

    initialCapitalInput.readOnly = false;
    saveBtn.style.display = 'inline-block';
    editBtn.style.display = 'none';
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function addEntry(event) {
    event.preventDefault();
    // Retrieve values and save as before
    closeModal('addTradeModal');
    displayEntries();
}

function editEntry(index) {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entry = entries[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('editDate').value = entry.date;
    document.getElementById('editTimeIn').value = entry.timeIn;
    document.getElementById('editTimeOut').value = entry.timeOut;
    document.getElementById('editSymbol').value = entry.symbol;
    document.getElementById('editEntryPrice').value = entry.entryPrice;
    document.getElementById('editExitPrice').value = entry.exitPrice;
    document.getElementById('editQty').value = entry.qty;
    openModal('editTradeModal');
}

function saveEditEntry(event) {
    event.preventDefault();
    const index = document.getElementById('editIndex').value;
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    // Update entry as needed
    closeModal('editTradeModal');
    displayEntries();
}
// Function to handle CSV upload and parse data
function uploadCSV() {
    const csvFile = document.getElementById('csvFile').files[0];
    if (!csvFile) {
        alert("Please select a CSV file to upload.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        parseCSVAndAddEntries(csvData);
    };
    reader.readAsText(csvFile);
}

// Function to parse CSV content and add entries to journal
function parseCSVAndAddEntries(csvData) {
    const lines = csvData.split('\n');
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

    lines.forEach((line, index) => {
        if (index === 0) return; // Skip header row

        const [date, timeIn, timeOut, symbol, qty, entryPrice, exitPrice] = line.split(',');

        // Validate data to ensure all required fields are present
        if (date && timeIn && timeOut && symbol && qty && entryPrice && exitPrice) {
            const newEntry = {
                date: date.trim(),
                timeIn: timeIn.trim(),
                timeOut: timeOut.trim(),
                symbol: symbol.trim(),
                qty: parseFloat(qty.trim()),
                entryPrice: parseFloat(entryPrice.trim()),
                exitPrice: parseFloat(exitPrice.trim()),
            };
            entries.push(newEntry);
        }
    });

    // Save updated entries to localStorage and display them
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displayEntries();
}

// Display entries in table (existing function)
function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entriesTable = document.getElementById('entriesTable');
    entriesTable.innerHTML = '';

    entries.forEach((entry, index) => {
        const row = document.createElement('tr');

        // Calculate result (win/loss), P&L, and any other necessary fields
        const result = entry.exitPrice > entry.entryPrice ? 'Win' : 'Loss';
        const pnl = (entry.exitPrice - entry.entryPrice) * entry.qty;
        const pnlColor = pnl > 0 ? 'green' : 'red';

        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.timeIn}</td>
            <td>${entry.timeOut}</td>
            <td>${entry.symbol}</td>
            <td>${result}</td>
            <td>${entry.qty}</td>
            <td>${entry.entryPrice}</td>
            <td>${entry.exitPrice}</td>
            <td>${entry.timeOut - entry.timeIn} hrs</td>
            <td style="color: ${pnlColor}">${pnl.toFixed(2)}</td>
            <td>—</td>
            <td>—</td>
            <td>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            </td>
        `;
        entriesTable.appendChild(row);
    });
}
