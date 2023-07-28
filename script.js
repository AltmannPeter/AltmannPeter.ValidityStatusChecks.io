let entropyData = [];

function calculateShannonEntropy() {
  const coinBias = parseFloat(document.getElementById("coin-bias").value);

  if (isNaN(coinBias) || coinBias < 0 || coinBias > 1) {
    document.getElementById("result").textContent = "Please enter a valid coin bias (between 0 and 1).";
  } else {
    const probabilityOfZero = 1 - coinBias;
    const shannonEntropy = -(coinBias * Math.log2(coinBias) + probabilityOfZero * Math.log2(probabilityOfZero));
    const formattedEntropy = shannonEntropy.toLocaleString(undefined, { maximumFractionDigits: 4 });

    entropyData.push({ bias: coinBias, entropy: shannonEntropy });

    updateTable();
  }
}

function updateTable() {
  const tableBody = document.getElementById("entropy-table");
  tableBody.innerHTML = "";

  entropyData.sort((a, b) => b.entropy - a.entropy);

  entropyData.forEach((data) => {
    const row = document.createElement("tr");
    const biasCell = document.createElement("td");
    const entropyCell = document.createElement("td");

    biasCell.textContent = data.bias.toFixed(2);
    entropyCell.textContent = data.entropy.toFixed(4);

    row.appendChild(biasCell);
    row.appendChild(entropyCell);
    tableBody.appendChild(row);
  });
}
