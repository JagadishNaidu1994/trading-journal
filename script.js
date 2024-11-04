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

// Upload CSV file
window.uploadCSV = function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("No file selected.");
            return; // User canceled the file selection
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const rows = text.split('\n').map(row => row.split(','));
            const table = document.getElementById('tradesTable').getElementsByTagName('tbody')[0];

            // Clear existing table rows before adding new data
            while (table.rows.length > 0) {
                table.deleteRow(0);
            }

            rows.forEach((row, index) => {
                if (index === 0) return; // Skip header row
                const [date, timeIn, symbol, qty, entryPrice, exitPrice] = row;
                const qtyNum = parseInt(qty);
                const entryPriceNum = parseFloat(entryPrice);
                const exitPriceNum = parseFloat(exitPrice);

                if (!date || !timeIn || !symbol || isNaN(qtyNum) || qtyNum <= 0 || isNaN(entryPriceNum) || entryPriceNum <= 0 || isNaN(exitPriceNum) || exitPriceNum <= 0) {
                    alert("Invalid data in CSV.");
                    return;
                }

                const pnl = (exitPriceNum - entryPriceNum) * qtyNum;
                const status = pnl > 0 ? 'Profit' : 'Loss';
                const initialCapital = parseFloat(document.getElementById('initialCapital').value) || 0;
                const roc = initialCapital > 0 ? (pnl / initialCapital) * 100 : 0;

                const newRow = table.insertRow();
                newRow.innerHTML = `
                    <td>${date}</td>
                    <td>${timeIn}</td>
                    <td>${symbol}</td>
                    <td>${status}</td>
                    <td>${qtyNum}</td>
                    <td>${entryPriceNum.toFixed(2)}</td>
                    <td>${exitPriceNum.toFixed(2)}</td>
                    <td style="color: ${pnl > 0 ? 'green' : 'red'}">${pnl.toFixed(2)}</td>
                    <td>${roc.toFixed(2)}%</td>
                `;
            });
        };
        reader.readAsText(file);
    };
    fileInput.click();
}

// Function to synchronize data from a remote CSV file
window.syncData = async function () {
    const response = await fetch('https://drive.google.com/uc?export=download&id=YOUR_FILE_ID'); // Replace with your file ID
    if (!response.ok) {
        alert('Error fetching CSV file');
        return;
    }
    const csvText = await response.text();
    const rows = csvText.split('\n').map(row => row.split(','));
    const table = document.getElementById('tradesTable').getElementsByTagName('tbody')[0];

    // Clear existing table rows before adding new data
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const [date, timeIn, symbol, qty, entryPrice, exitPrice] = row;
        const qtyNum = parseInt(qty);
        const entryPriceNum = parseFloat(entryPrice);
        const exitPriceNum = parseFloat(exitPrice);

        if (!date || !timeIn || !symbol || isNaN(qtyNum) || qtyNum <= 0 || isNaN(entryPriceNum) || entryPriceNum <= 0 || isNaN(exitPriceNum) || exitPriceNum <= 0) {
            alert("Invalid data in CSV.");
            return;
        }

        const pnl = (exitPriceNum - entryPriceNum) * qtyNum;
        const status = pnl > 0 ? 'Profit' : 'Loss';
        const initialCapital = parseFloat(document.getElementById('initialCapital').value) || 0;
        const roc = initialCapital > 0 ? (pnl / initialCapital) * 100 : 0;

        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td>${date}</td>
            <td>${timeIn}</td>
            <td>${symbol}</td>
            <td>${status}</td>
            <td>${qtyNum}</td>
            <td>${entryPriceNum.toFixed(2)}</td>
            <td>${exitPriceNum.toFixed(2)}</td>
            <td style="color: ${pnl > 0 ? 'green' : 'red'}">${pnl.toFixed(2)}</td>
            <td>${roc.toFixed(2)}%</td>
        `;
    });
}
