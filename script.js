// Function to save the initial capital
window.saveInitialCapital = function () {
    const initialCapitalInput = document.getElementById('initialCapitalInput');
    const initialCapital = initialCapitalInput.value; // Get the value from the input
    document.getElementById('initialCapital').value = initialCapital; // Set the hidden input value
    initialCapitalInput.disabled = true; // Disable the input field
    document.getElementById('editCapitalButton').style.display = 'inline'; // Show the edit button
}

// Function to edit the initial capital
window.editInitialCapital = function () {
    const initialCapitalInput = document.getElementById('initialCapitalInput');
    initialCapitalInput.disabled = false; // Enable the input field
    document.getElementById('editCapitalButton').style.display = 'none'; // Hide the edit button
}

// Function to close modal
window.closeModal = function () {
    document.getElementById('addTradeModal').style.display = 'none';
}

// Function to show the add trade modal
window.showAddTradeModal = function () {
    document.getElementById('addTradeModal').style.display = 'block';
}

// Add a trade entry
window.addEntry = function (event) {
    event.preventDefault(); // Prevent default form submission

    const tradeDate = document.getElementById('tradeDate').value;
    const timeIn = document.getElementById('timeIn').value;
    const symbol = document.getElementById('symbol').value;
    const qty = parseInt(document.getElementById('qty').value);
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const exitPrice = parseFloat(document.getElementById('exitPrice').value);

    if (!tradeDate || !timeIn || !symbol || isNaN(qty) || qty <= 0 || isNaN(entryPrice) || entryPrice <= 0 || isNaN(exitPrice) || exitPrice <= 0) {
        alert("Please fill all fields correctly.");
        return;
    }

    const pnl = (exitPrice - entryPrice) * qty;
    const status = pnl > 0 ? 'Profit' : 'Loss';

    const initialCapital = parseFloat(document.getElementById('initialCapital').value) || 0;
    const roc = initialCapital > 0 ? (pnl / initialCapital) * 100 : 0;

    const table = document.getElementById('tradesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td>${tradeDate}</td>
        <td>${timeIn}</td>
        <td>${symbol}</td>
        <td>${status}</td>
        <td>${qty}</td>
        <td>${entryPrice.toFixed(2)}</td>
        <td>${exitPrice.toFixed(2)}</td>
        <td style="color: ${pnl > 0 ? 'green' : 'red'}">${pnl.toFixed(2)}</td>
        <td>${roc.toFixed(2)}%</td>
    `;

    document.getElementById('addTradeForm').reset();
    closeModal();
}
// Function to toggle theme
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-theme');

    // Save the theme preference in local storage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update the styles based on the theme
    if (isDark) {
        body.style.backgroundColor = '#121212';
        body.style.color = '#ffffff';
        // Add more dark theme styles here if needed
    } else {
        body.style.backgroundColor = '#f4f4f4';
        body.style.color = '#000000';
        // Add more light theme styles here if needed
    }
}

// Load the theme from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.getElementById('themeToggle').checked = true;
        toggleTheme(); // Apply dark theme
    }
});

// Add event listener to toggle button
document.getElementById('themeToggle').addEventListener('change', toggleTheme);

// Upload CSV file
window.uploadCSV = function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const rows = content.split('\n').map(row => row.split(','));
            rows.forEach(row => {
                if (row.length === 6) {
                    const [date, timeIn, symbol, qty, entryPrice, exitPrice] = row;
                    document.getElementById('tradeDate').value = date;
                    document.getElementById('timeIn').value = timeIn;
                    document.getElementById('symbol').value = symbol;
                    document.getElementById('qty').value = qty;
                    document.getElementById('entryPrice').value = entryPrice;
                    document.getElementById('exitPrice').value = exitPrice;
                    addEntry(event);
                }
            });
        };
        reader.readAsText(file);
    };
    fileInput.click();
}

// Sync Data from a CSV
window.syncData = function () {
    fetch('https://drive.google.com/uc?export=download&id=1LPYXdjjyv3Cf-wRmGQBnfDbcdnASKBrw')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(row => row.split(','));
            const table = document.getElementById('tradesTable').getElementsByTagName('tbody')[0];
            table.innerHTML = ''; // Clear the existing rows
            rows.forEach(row => {
                if (row.length === 6) {
                    const [date, timeIn, symbol, qty, entryPrice, exitPrice] = row;
                    const pnl = (exitPrice - entryPrice) * qty;
                    const status = pnl > 0 ? 'Profit' : 'Loss';
                    const initialCapital = parseFloat(document.getElementById('initialCapital').value) || 0;
                    const roc = initialCapital > 0 ? (pnl / initialCapital) * 100 : 0;

                    const newRow = table.insertRow();
                    newRow.innerHTML = `
                        <td>${date}</td>
                        <td>${timeIn}</td>
                        <td>${symbol}</td>
                        <td>${status}</td>
                        <td>${qty}</td>
                        <td>${parseFloat(entryPrice).toFixed(2)}</td>
                        <td>${parseFloat(exitPrice).toFixed(2)}</td>
                        <td style="color: ${pnl > 0 ? 'green' : 'red'}">${pnl.toFixed(2)}</td>
                        <td>${roc.toFixed(2)}%</td>
                    `;
                }
            });
        })
        .catch(error => console.error('Error fetching CSV:', error));
}
