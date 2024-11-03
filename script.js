document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('entryForm').addEventListener('submit', (event) => {
        event.preventDefault();

        // Retrieve form values
        const date = document.getElementById('date').value;
        const timeIn = document.getElementById('timeIn').value;
        const timeOut = document.getElementById('timeOut').value;
        const symbol = document.getElementById('symbol').value;
        const entryPrice = document.getElementById('entryPrice').value;
        const exitPrice = document.getElementById('exitPrice').value;
        const qty = document.getElementById('qty').value;

        // Verify all fields have values
        if (!date || !timeIn || !timeOut || !symbol || !entryPrice || !exitPrice || !qty) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // Calculate Result and P&L
        const result = exitPrice > entryPrice ? "Win" : "Loss";
        const pnl = (exitPrice - entryPrice) * qty;

        // Create a new row in the table
        const entriesTable = document.getElementById('entriesTable');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date}</td>
            <td>${timeIn}</td>
            <td>${timeOut}</td>
            <td>${symbol}</td>
            <td>${parseFloat(entryPrice).toFixed(2)}</td>
            <td>${parseFloat(exitPrice).toFixed(2)}</td>
            <td>${qty}</td>
            <td>${result}</td>
            <td>${parseFloat(pnl).toFixed(2)}</td>
        `;

        entriesTable.appendChild(row);
        document.getElementById('entryForm').reset();
    });
});
