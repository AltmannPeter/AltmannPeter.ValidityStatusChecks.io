function calculateShannonEntropy() {
  const coinBias = parseFloat(document.getElementById("coin-bias").value);

  if (isNaN(coinBias) || coinBias < 0 || coinBias > 1) {
    document.getElementById("result").textContent = "Please enter a valid coin bias (between 0 and 1).";
  } else {
    const probabilityOfZero = 1 - coinBias;
    const shannonEntropy = -(coinBias * Math.log2(coinBias) + probabilityOfZero * Math.log2(probabilityOfZero));

    const formattedEntropy = shannonEntropy.toLocaleString(undefined, { maximumFractionDigits: 4 });
    document.getElementById("result").textContent = `Shannon Entropy: ${formattedEntropy}`;
  }
}
