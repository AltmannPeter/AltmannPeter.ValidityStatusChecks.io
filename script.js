let entropyData = [];

function calculateShannonEntropy() {
  const coinBias = parseFloat(document.getElementById("coin-bias").value);

  if (isNaN(coinBias) || coinBias < 0 || coinBias > 100) {
    document.getElementById("result").textContent = "Please enter a valid probability of 1 (between 0 and 100%).";
  } else {
    // Check for duplicate entries
    const exists = entropyData.some(data => data.bias === coinBias);
    if (exists) {
      document.getElementById("result").textContent = "This value already exists in the table.";
      return;
    }

    const probabilityOfOne = coinBias / 100;
    const probabilityOfZero = 1 - probabilityOfOne;
    const shannonEntropy = -(probabilityOfOne * Math.log2(probabilityOfOne) + probabilityOfZero * Math.log2(probabilityOfZero));
    const formattedEntropy = shannonEntropy.toLocaleString(undefined, { maximumFractionDigits: 4 });

    entropyData.push({ bias: coinBias, entropy: shannonEntropy });

    // Sort the table and update
    entropyData.sort((a, b) => b.entropy - a.entropy);
    updateTable();

    document.getElementById("result").textContent = ""; // Clear any previous messages
  }
}

function updateTable() {
  const tableBody = document.getElementById("entropy-table");
  tableBody.innerHTML = "";

  entropyData.forEach((data) => {
    const row = document.createElement("tr");
    const biasCell = document.createElement("td");
    const entropyCell = document.createElement("td");

    biasCell.textContent = data.bias.toFixed(2) + "%";
    entropyCell.textContent = data.entropy.toFixed(4);

    row.appendChild(biasCell);
    row.appendChild(entropyCell);
    tableBody.appendChild(row);
  });
}
