document.addEventListener("DOMContentLoaded", function () {
    // Open the Add Trade modal
    function openModal() {
        document.getElementById('addTradeModal').style.display = 'block';
    }

    // Close the modal
    window.closeModal = function () {
        document.getElementById('addTradeModal').style.display = 'none';
    }

    // Add a trade entry
    window.addEntry = function () {
        const tradeDate = document.getElementById('tradeDate').value;
        const timeIn = document.getElementById('timeIn').value;
        const symbol = document.getElementById('symbol').value;
        const qty = parseInt(document.getElementById('qty').value);
        const entryPrice = parseFloat(document.getElementById('entryPrice').value);
        const exitPrice = parseFloat(document.getElementById('exitPrice').value);

        if (!tradeDate || !timeIn || !symbol || qty <= 0 || entryPrice <= 0 || exitPrice <= 0) {
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
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const rows = text.split('\n').map(row => row.split(','));
                const table = document.getElementById('tradesTable').getElementsByTagName('tbody')[0];

                rows.forEach((row, index) => {
                    if (index === 0) return; // Skip header row
                    const [date, timeIn, symbol, qty, entryPrice, exitPrice] = row;
                    const qtyNum = parseInt(qty);
                    const entryPriceNum = parseFloat(entryPrice);
                    const exitPriceNum = parseFloat(exitPrice);

                    if (!date || !timeIn || !symbol || qtyNum <= 0 || entryPriceNum <= 0 || exitPriceNum <= 0) {
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

    // Save initial capital
    window.saveInitialCapital = function () {
        const initialCapital = document.getElementById('initialCapitalInput').value;
        document.getElementById('initialCapital').value = initialCapital; // Save capital value
        document.getElementById('initialCapitalInput').disabled = true; // Disable input
        document.getElementById('editCapitalButton').style.display = 'inline'; // Show edit button
    }

    // Add event listeners for buttons
    document.getElementById('addTradeButton').addEventListener('click', openModal);
    document.getElementById('syncButton').addEventListener('click', uploadCSV); // Make sure to bind the sync button to uploadCSV
    document.getElementById('saveCapitalButton').addEventListener('click', saveInitialCapital);
});
