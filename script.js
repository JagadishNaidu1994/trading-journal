let entries = []; // Store trade entries globally

// Function to display entries
function displayEntries() {
    const entriesTableBody = document.querySelector('#entriesTable tbody');
    entriesTableBody.innerHTML = ''; // Clear existing entries

    entries.forEach((entry, index) => {
        const row = document.createElement('tr');

        // Create table cells for each entry
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.timeIn}</td>
            <td>${entry.timeOut}</td>
            <td>${entry.symbol}</td>
            <td>${entry.entryPrice.toFixed(2)}</td>
            <td>${entry.exitPrice.toFixed(2)}</td>
            <td>${entry.qty}</td>
            <td class="${entry.result === 'Win' ? 'win' : 'loss'}">${entry.result}</td>
            <td class="${entry.pl > 0 ? 'win' : 'loss'}">${entry.pl.toFixed(2)}</td>
            <td>
                <i class="fas fa-pencil-alt" onclick="editEntry(${index})" style="cursor: pointer; margin-right: 10px;"></i>
                <i class="fas fa-trash-alt" onclick="deleteEntry(${index})" style="cursor: pointer;"></i>
            </td>
        `;

        entriesTableBody.appendChild(row);
    });
}

// Function to delete an entry
function deleteEntry(index) {
    if (confirm('Are you sure you want to delete this trade?')) {
        entries.splice(index, 1); // Remove the entry from the array
        displayEntries(); // Refresh the table display
    }
}

// Function to edit an entry
function editEntry(index) {
    const entry = entries[index];

    // Populate form fields with existing entry data
    document.querySelector('#date').value = entry.date;
    document.querySelector('#timeIn').value = entry.timeIn;
    document.querySelector('#timeOut').value = entry.timeOut;
    document.querySelector('#symbol').value = entry.symbol;
    document.querySelector('#entryPrice').value = entry.entryPrice;
    document.querySelector('#exitPrice').value = entry.exitPrice;
    document.querySelector('#qty').value = entry.qty;

    // Change button to indicate editing
    document.querySelector('#addEntryButton').textContent = 'Update Trade';
    document.querySelector('#addEntryButton').onclick = function() {
        updateEntry(index);
    };

    // Open modal
    document.querySelector('.modal').style.display = 'block';
}

// Function to update an entry
function updateEntry(index) {
    const updatedEntry = {
        date: document.querySelector('#date').value,
        timeIn: document.querySelector('#timeIn').value,
        timeOut: document.querySelector('#timeOut').value,
        symbol: document.querySelector('#symbol').value,
        entryPrice: parseFloat(document.querySelector('#entryPrice').value),
        exitPrice: parseFloat(document.querySelector('#exitPrice').value),
        qty: parseInt(document.querySelector('#qty').value),
    };

    // Calculate result and P&L
    updatedEntry.result = updatedEntry.exitPrice - updatedEntry.entryPrice > 0 ? 'Win' : 'Loss';
    updatedEntry.pl = (updatedEntry.exitPrice - updatedEntry.entryPrice) * updatedEntry.qty;

    entries[index] = updatedEntry; // Update the entry in the array
    displayEntries(); // Refresh the table display

    // Reset form and modal
    resetForm();
}

// Reset the form after submission
function resetForm() {
    document.querySelector('#date').value = '';
    document.querySelector('#timeIn').value = '';
    document.querySelector('#timeOut').value = '';
    document.querySelector('#symbol').value = '';
    document.querySelector('#entryPrice').value = '';
    document.querySelector('#exitPrice').value = '';
    document.querySelector('#qty').value = '';
    document.querySelector('#addEntryButton').textContent = 'Add Trade';
    document.querySelector('#addEntryButton').onclick = addEntry; // Reset to add
    document.querySelector('.modal').style.display = 'none'; // Close modal
}

// Function to add a new entry
function addEntry() {
    const newEntry = {
        date: document.querySelector('#date').value,
        timeIn: document.querySelector('#timeIn').value,
        timeOut: document.querySelector('#timeOut').value,
        symbol: document.querySelector('#symbol').value,
        entryPrice: parseFloat(document.querySelector('#entryPrice').value),
        exitPrice: parseFloat(document.querySelector('#exitPrice').value),
        qty: parseInt(document.querySelector('#qty').value),
    };

    // Calculate result and P&L
    newEntry.result = newEntry.exitPrice - newEntry.entryPrice > 0 ? 'Win' : 'Loss';
    newEntry.pl = (newEntry.exitPrice - newEntry.entryPrice) * newEntry.qty;

    entries.push(newEntry); // Add the new entry to the array
    displayEntries(); // Refresh the table display

    resetForm(); // Reset the form after submission
}
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("button").onclick = function() {
        const element = document.getElementById("yourElementId");
        if (element) {
            element.style.color = "red";
        }
    };
});
