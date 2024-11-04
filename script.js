// Define your CSV URL here
// Corrected CSV URL from GitHub
// CSV URL from GitHub (using CORS proxy)
const csvUrl = "https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=1LPYXdjjyv3Cf-wRmGQBnfDbcdnASKBrw";

// Function to sync data from online CSV
async function syncData() {
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error("Could not fetch CSV file");

        const csvData = await response.text();
        parseCSVAndSyncEntries(csvData);
    } catch (error) {
        console.error("Error fetching CSV:", error);
        alert("Failed to sync data from online CSV.");
    }
}

// Function to parse CSV and add non-duplicate entries
function parseCSVAndSyncEntries(csvData) {
    const lines = csvData.split('\n');
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

    lines.forEach((line, index) => {
        if (index === 0) return; // Skip header row

        const [date, timeIn, symbol, qty, entryPrice, exitPrice] = line.split(',');

        // Check if the entry already exists based on unique identifiers (e.g., date and symbol)
        const duplicate = entries.some(entry => 
            entry.date === date.trim() && entry.symbol === symbol.trim()
        );

        if (!duplicate && date && timeIn && timeOut && symbol && qty && entryPrice && exitPrice) {
            const newEntry = {
                date: date.trim(),
                timeIn: timeIn.trim(),
                symbol: symbol.trim(),
                qty: parseFloat(qty.trim()),
                entryPrice: parseFloat(entryPrice.trim()),
                exitPrice: parseFloat(exitPrice.trim()),
            };
            entries.push(newEntry);
        }
    });

    // Update localStorage and display updated entries
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displayEntries();
}

// Display entries in the table (existing function)
function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entriesTable = document.getElementById('entriesTable');
    entriesTable.innerHTML = '';

    entries.forEach((entry, index) => {
        const row = document.createElement('tr');

        // Calculate result (win/loss) and P&L
        const result = entry.exitPrice > entry.entryPrice ? 'Win' : 'Loss';
        const pnl = (entry.exitPrice - entry.entryPrice) * entry.qty;
        const pnlColor = pnl > 0 ? 'green' : 'red';

        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.timeIn}</td>
            <td>${entry.symbol}</td>
            <td>${result}</td>
            <td>${entry.qty}</td>
            <td>${entry.entryPrice}</td>
            <td>${entry.exitPrice}</td>
            <td style="color: ${pnlColor}">${pnl.toFixed(2)}</td>
            <td>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            </td>
        `;
        entriesTable.appendChild(row);
    });
}
