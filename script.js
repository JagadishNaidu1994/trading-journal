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
        const qty = document.getElementById('qty').value;
        const entryPrice = document.getElementById('entryPrice').value;
        const exitPrice = document.getElementById('exitPrice').value;

        // Calculate P&L and Status
        const pnl = (exitPrice - entryPrice) * qty;
        const status = pnl > 0 ? 'Profit' : 'Loss';

        // Calculate Return on Capital (ROC%)
        const initialCapital = parseFloat(document.getElementById('saveInitialCapital').value) || 0;
        const roc = initialCapital > 0 ? (pnl / initialCapital) * 100 : 0;

        // Create a new row in the trades table
        const table = document.getElementById('tradesTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td>${tradeDate}</td>
            <td>${timeIn}</td>
            <td><span class="${status === 'Profit' ? 'icon-profit' : 'icon-loss'}"></span>${status}</td>
            <td>${qty}</td>
            <td>${entryPrice}</td>
            <td>${exitPrice}</td>
            <td style="color: ${pnl > 0 ? 'green' : 'red'}">${pnl.toFixed(2)}</td>
            <td>${roc.toFixed(2)}%</td>
        `;

        // Clear the form fields
        document.getElementById('addTradeForm').reset();

        // Close the modal
        closeModal();
    }

    // Function to sync data from CSV (if you still want to keep this functionality)
    async function syncData() {
        const response = await fetch('https://drive.google.com/uc?export=download&id=1LPYXdjjyv3Cf-wRmGQBnfDbcdnASKBrw');
        if (!response.ok) {
            console.error('Error fetching CSV:', response.statusText);
            return;
        }

        const data = await response.text();
        const rows = data.split('\n');
        const table = document.getElementById('tradesTable').getElementsByTagName('tbody')[0];
        table.innerHTML = ''; // Clear the table before adding new rows

        rows.forEach((row) => {
            const cols = row.split(',');
            const newRow = table.insertRow();
            newRow.innerHTML = `
                <td>${cols[0]}</td>
                <td>${cols[1]}</td>
                <td><span class="${cols[2] === 'Profit' ? 'icon-profit' : 'icon-loss'}"></span>${cols[2]}</td>
                <td>${cols[3]}</td>
                <td>${cols[4]}</td>
                <td>${cols[5]}</td>
                <td style="color: ${parseFloat(cols[6]) > 0 ? 'green' : 'red'}">${parseFloat(cols[6]).toFixed(2)}</td>
                <td>${parseFloat(cols[7]).toFixed(2)}%</td>
            `;
        });
    }

    // Add event listener for the Add Trade button
    document.getElementById('addTradeButton').addEventListener('click', openModal);
});
