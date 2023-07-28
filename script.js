function calculateBitVectorSize() {
  const coinBias = parseFloat(document.getElementById("coin-bias").value);

  if (isNaN(coinBias) || coinBias < 0 || coinBias > 1) {
    document.getElementById("result").textContent = "Please enter a valid coin bias (between 0 and 1).";
  } else {
    const bitVectorSize = 1 << 20;
    const probabilityOfOne = coinBias;
    const expectedOnes = bitVectorSize * probabilityOfOne;
    const sizeInBytes = expectedOnes / 8;

    const formattedSize = sizeInBytes.toLocaleString(undefined, { maximumFractionDigits: 2 });
    document.getElementById("result").textContent = `Estimated size of the compressed bit vector: ${formattedSize} bytes`;
  }
}
