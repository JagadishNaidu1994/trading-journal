document.getElementById('entryForm').addEventListener('submit', addEntry);

function addEntry(event) {
    event.preventDefault();

    const date = document.getElementById('date').value;
    const tradeType = document.getElementById('tradeType').value;
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const exitPrice = parseFloat(document.getElementById('exitPrice').value);
    const result = parseFloat(document.getElementById('result').value);

    const entry = { date, tradeType, entryPrice, exitPrice, result };
    
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.push(entry);
    localStorage.setItem('journalEntries', JSON.stringify(entries));

    displayEntries();
    document.getElementById('entryForm').reset();
}

function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = '';

    entries.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.date} - ${entry.tradeType} | Entry: ${entry.entryPrice}, Exit: ${entry.exitPrice}, Result: ${entry.result}R`;
        entriesList.appendChild(listItem);
    });
}

window.onload = displayEntries;
