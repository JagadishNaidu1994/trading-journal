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
