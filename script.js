document.addEventListener("DOMContentLoaded", function() {
    // Function to open the Add Trade modal
    function openModal() {
        document.getElementById('addTradeModal').style.display = 'block';
    }

    // Function to close the modal
    function closeModal() {
        document.getElementById('addTradeModal').style.display = 'none';
    }

    // Function to add a trade entry
    function addEntry() {
        // Get input values
        const tradeDate = document.getElementById('tradeDate').value;
        const timeIn = document.getElementById('timeIn').value;
        const symbol = document.getElementById('symbol').value;
        const qty = parseInt(document.getElementById('qty').value);
        const entryPrice = parseFloat(document.getElementById('entryPrice').value);
        const exitPrice = parseFloat(document.getElementById('exitPrice').value);

        // Validate input values
        if (!tradeDate || !timeIn || !symbol || qty <= 0 || entryPrice <= 0 || exitPrice <= 0) {
            alert("Please fill all fields correctly.");
            return;
        }

        // Calculate P&L and Status
        const pnl = (exitPrice - entryPrice) * qty;
        const status = pnl > 0 ? 'Profit' : 'Loss';

        // Calculate Return on Capital (ROC%)
        const initialCapital = parseFloat(document.getElementById('initialCapital').value) || 0;
        const roc = initialCapital > 0 ? (pnl / initialCapital) * 100 : 0;

        // Create a new row in the trades table
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

        // Clear the form fields
        document.getElementById('addTradeForm').reset();

        // Close the modal
        closeModal();
    }

    // Add event listener for the Add Trade button
    document.getElementById('addTradeButton').addEventListener('click', openModal);
});
