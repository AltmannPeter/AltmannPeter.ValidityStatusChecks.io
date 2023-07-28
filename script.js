let analysisData = [];

// Function to initialize the table with sample data
function initializeTableWithSampleData() {
  const sampleValues = [0.5, 1, 1.5, 2, 2.5, 3, 5, 10];
  sampleValues.forEach((bias) => {
    const probabilityOfOne = bias / 100;
    const probabilityOfZero = 1 - probabilityOfOne;
    const shannonEntropy = -(probabilityOfOne * Math.log2(probabilityOfOne) + probabilityOfZero * Math.log2(probabilityOfZero));

    // Calculate the number of bits required to represent the bit vector
    const numBits = 1 << 20;

    // Generate the bit vector
    const bitVector = generateBitVector(numBits, probabilityOfOne);

    // Gzip compress the bit vector with maximum compression (level 9)
    const compressedData = pako.gzip(bitVector, { level: 9 });

    // Get the size of the compressed data in bytes
    const compressedSizeInBytes = compressedData.length;

    analysisData.push({ bias: bias, entropy: shannonEntropy, compressedSize: compressedSizeInBytes });
  });
}

// Function to generate a random bit vector
function generateBitVector(length, probabilityOfOne) {
  const bitVector = new Uint8Array(length);
  const threshold = probabilityOfOne * 256;

  for (let i = 0; i < length; i++) {
    bitVector[i] = Math.random() * 256 < threshold ? 1 : 0;
  }

  return bitVector;
}

// Call the function to initialize the table with sample data
initializeTableWithSampleData();

function calculateBitVectorAnalysis() {
  // Rest of the code remains the same...
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
