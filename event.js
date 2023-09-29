const ethers = require('ethers');

const abi = ["event Transfer(address indexed from, address indexed to, uint amount)"]
async function getTransfer() {
  const usdcAddress = "0xe9f36Ec3F1B8056A67a2B542551D248D511aA7d6"; ///USDC Contract
  const provider = new ethers.providers.JsonRpcProvider(
    'https://eth-mainnet.g.alchemy.com/v2/WFBdGhYbU1lCBTZCKFboFJNGEuiBVcVB'
  );
  // Create a contract; connected to a Provider, so it may
  // only access read-only methods (like view and pure)
  contract = new ethers.Contract("dai.tokens.ethers.eth", abi, provider)

  // Begin listening for any Transfer event
  contract.on("Transfer", (from, to, _amount, event) => {
    const amount = ethers.utils.formatEther(_amount, 18)
    console.log(`${from} => ${to}: ${amount}`);

    // The `event.log` has the entire EventLog

    // Optionally, stop listening
    event.removeListener();
  });
}

getTransfer()