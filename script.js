let analysisData = [];

function calculateBitVectorAnalysis() {
  const coinBiasInput = document.getElementById("coin-bias");
  const coinBias = parseFloat(coinBiasInput.value.trim());

  if (isNaN(coinBias) || coinBias < 0 || coinBias > 100) {
    document.getElementById("result").textContent = "Please enter a valid probability of 1 (between 0 and 100%).";
  } else {
    // Check for duplicate entries
    const exists = analysisData.some(data => data.bias === coinBias);
    if (exists) {
      document.getElementById("result").textContent = "This value already exists in the table.";
      return;
    }

    const probabilityOfOne = coinBias / 100;
    const probabilityOfZero = 1 - probabilityOfOne;
    const shannonEntropy = -(probabilityOfOne * Math.log2(probabilityOfOne) + probabilityOfZero * Math.log2(probabilityOfZero));
    const formattedEntropy = shannonEntropy.toLocaleString(undefined, { maximumFractionDigits: 4 });

    // Calculate the number of bits required to represent the bit vector
    const numBits = 1048576;

    // Generate the bit vector
    const bitVector = generateBitVector(numBits, probabilityOfOne);

    // Gzip compress the bit vector
    const compressedData = pako.gzip(bitVector);

    // Get the size of the compressed data in bytes
    const compressedSizeInBytes = compressedData.length;

    analysisData.push({ bias: coinBias, entropy: shannonEntropy, compressedSize: compressedSizeInBytes });

    // Sort the table and update
    analysisData.sort((a, b) => b.entropy - a.entropy);
    updateTable();

    document.getElementById("result").textContent = ""; // Clear any previous messages
    coinBiasInput.value = ""; // Clear the input field after adding to the table
  }
}

function generateBitVector(length, probabilityOfOne) {
  const bitVector = new Uint8Array(length);
  const threshold = probabilityOfOne * 256;

  for (let i = 0; i < length; i++) {
    bitVector[i] = Math.random() * 256 < threshold ? 1 : 0;
  }

  return bitVector;
}

function updateTable() {
  const tableBody = document.getElementById("analysis-table");
  tableBody.innerHTML = "";

  analysisData.forEach((data) => {
    const row = document.createElement("tr");
    const biasCell = document.createElement("td");
    const entropyCell = document.createElement("td");
    const compressedSizeCell = document.createElement("td");

    biasCell.textContent = data.bias.toFixed(2) + "%";
    entropyCell.textContent = data.entropy.toFixed(4);
    compressedSizeCell.textContent = data.compressedSize.toLocaleString();

    row.appendChild(biasCell);
    row.appendChild(entropyCell);
    row.appendChild(compressedSizeCell);
    tableBody.appendChild(row);
  });
}

// Show an empty table when the page loads
updateTable();
