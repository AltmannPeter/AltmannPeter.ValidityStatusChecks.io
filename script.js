let analysisData = [];

// Function to initialize the table with sample data
function initializeTableWithSampleData() {
  const sampleValues = [0.5, 1, 1.5, 2, 2.5, 3, 5, 10];
  const sampleData = [];

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

    // Calculate ASR (Average Sample Rate) in bytes
    const asrInBytes = (numBits * (bias / 100) * 128) / 8;

    sampleData.push({ bias: bias, entropy: shannonEntropy, compressedSize: compressedSizeInBytes, asr: asrInBytes });
  });

  // Sort the sampleData array in ascending order by Shannon entropy
  sampleData.sort((a, b) => a.entropy - b.entropy);

  // Push the sorted sampleData into the analysisData array
  analysisData.push(...sampleData);
}

// Call the function to initialize the table with sample data
initializeTableWithSampleData();

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
    const numBits = 1 << 20;

    // Generate the bit vector
    const bitVector = generateBitVector(numBits, probabilityOfOne);

    // Gzip compress the bit vector with maximum compression (level 9)
    const compressedData = pako.gzip(bitVector, { level: 9 });

    // Get the size of the compressed data in bytes
    const compressedSizeInBytes = compressedData.length;

    // Calculate ASR (Average Sample Rate) in bytes
    const asrInBytes = (numBits * (coinBias / 100) * 128) / 8;

    analysisData.push({ bias: coinBias, entropy: shannonEntropy, compressedSize: compressedSizeInBytes, asr: asrInBytes });

    // Sort the table by Shannon entropy in descending order
    analysisData.sort((a, b) => b.entropy - a.entropy);

    // Update the table
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
    const asrCell =
