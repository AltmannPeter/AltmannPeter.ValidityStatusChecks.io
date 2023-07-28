let analysisData = [];

// Function to initialize the table with sample data
function initializeTableWithSampleData() {
  const sampleValues = [1, 2, 3, 10];
  sampleValues.forEach((bias) => {
    const probabilityOfOne = bias / 100;
    const probabilityOfZero = 1 - probabilityOfOne;
    // Calculate the number of bits required to represent the bit vector
    const numBits = 1 << 20;
    const shannonEntropy = (-(probabilityOfOne * Math.log2(probabilityOfOne) + probabilityOfZero * Math.log2(probabilityOfZero))) * numBits / 8;

    // Generate the bit vector
    const bitVector = generateBitVector(numBits, probabilityOfOne);

    // Gzip compress the bit vector with maximum compression (level 9)
    const compressedData = pako.gzip(bitVector, { level: 9 });

    // Get the size of the compressed data in bytes
    const compressedSizeInBytes = compressedData.length;

    const asr = numBits * probabilityOfOne * 128 / 8; // Convert bits to bytes

    analysisData.push({ bias: bias, entropy: shannonEntropy, compressedSize: compressedSizeInBytes, asr: asr });
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

    // Calculate the number of bits required to represent the bit vector
    const numBits = 1 << 20;

    const probabilityOfOne = coinBias / 100;
    const probabilityOfZero = 1 - probabilityOfOne;
    const shannonEntropy = (-(probabilityOfOne * Math.log2(probabilityOfOne) + probabilityOfZero * Math.log2(probabilityOfZero))) * numBits / 8;

    // Generate the bit vector
    const bitVector = generateBitVector(numBits, probabilityOfOne);

    // Gzip compress the bit vector with maximum compression (level 9)
    const compressedData = pako.gzip(bitVector, { level: 9 });

    // Get the size of the compressed data in bytes
    const compressedSizeInBytes = compressedData.length;

    const asr = numBits * probabilityOfOne * 128 / 8; // Convert bits to bytes
    
    analysisData.push({ bias: coinBias, entropy: shannonEntropy, compressedSize: compressedSizeInBytes, asr: asr });

    // Sort the table by Shannon entropy in ascending order
    analysisData.sort((a, b) => a.entropy - b.entropy);

    // Update the table
    updateTable();

    document.getElementById("result").textContent = ""; // Clear any previous messages
    coinBiasInput.value = ""; // Clear the input field after adding to the table
  }
}


function updateTable() {
  const tableBody = document.getElementById("analysis-table");
  tableBody.innerHTML = "";
  
  
  analysisData.forEach((data) => {
    const row = document.createElement("tr");
    const biasCell = document.createElement("td");
    const entropyCell = document.createElement("td");
    const compressedSizeCell = document.createElement("td");
    const asrCell = document.createElement("td");

    biasCell.textContent = data.bias.toFixed(2) + "%";
    entropyCell.textContent = Math.round(data.entropy).toLocaleString();
    compressedSizeCell.textContent = data.compressedSize.toLocaleString();
    asrCell.textContent = Math.round(data.asr).toLocaleString();

    row.appendChild(biasCell);
    row.appendChild(entropyCell);
    row.appendChild(compressedSizeCell);
    row.appendChild(asrCell);
    tableBody.appendChild(row);
  });
  generateGraph(); // Call generateGraph after updating the table
}

function generateGraph() {
  const biases = [];
  const compressedSizes = [];

  // Extract relevant data for the chart
  analysisData.forEach((data) => {
    biases.push(data.bias.toFixed(2) + "%");
    compressedSizes.push(data.compressedSize);
  });

  const ctx = document.getElementById("analysis-chart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: biases,
      datasets: [
        {
          label: "Gzip Compressed ASL Size (bytes)",
          data: compressedSizes,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: "linear", // Use linear scale for the x-axis
          min: 0, // Set the minimum value of the x-axis to 0
          ticks: {
            stepSize: 0.1, // Set the step size to 1 to show all integer values on the x-axis
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}


// Show an empty table when the page loads
updateTable();
