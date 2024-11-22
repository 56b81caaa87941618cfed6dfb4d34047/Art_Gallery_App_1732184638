
import React, { useState, useEffect } from 'react';
import ethers from 'ethers';

const UniswapV3FactoryInteraction: React.FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [fee, setFee] = useState('');
  const [token0, setToken0] = useState('');
  const [token1, setToken1] = useState('');
  const [result, setResult] = useState<string>('');

  const contractAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
  const chainId = 1; // Ethereum mainnet

  const contractABI = [
    {
      "name": "createPool",
      "stateMutability": "nonpayable",
      "inputs": [
        { "name": "tokenA", "type": "address" },
        { "name": "tokenB", "type": "address" },
        { "name": "fee", "type": "uint24" }
      ],
      "outputs": [{ "name": "pool", "type": "address" }]
    },
    {
      "name": "feeAmountTickSpacing",
      "stateMutability": "view",
      "inputs": [{ "name": "", "type": "uint24" }],
      "outputs": [{ "name": "", "type": "int24" }]
    },
    {
      "name": "getPool",
      "stateMutability": "view",
      "inputs": [
        { "name": "", "type": "address" },
        { "name": "", "type": "address" },
        { "name": "", "type": "uint24" }
      ],
      "outputs": [{ "name": "", "type": "address" }]
    },
    {
      "name": "parameters",
      "stateMutability": "view",
      "inputs": [],
      "outputs": [
        { "name": "factory", "type": "address" },
        { "name": "token0", "type": "address" },
        { "name": "token1", "type": "address" },
        { "name": "fee", "type": "uint24" },
        { "name": "tickSpacing", "type": "int24" }
      ]
    }
  ];

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        const signer = web3Provider.getSigner();
        const factoryContract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(factoryContract);
      }
    };
    initProvider();
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
        if (network.chainId !== chainId) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(chainId) }],
          });
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setResult("Failed to connect wallet. Please try again.");
      }
    }
  };

  const checkWalletAndChain = async () => {
    if (!provider) {
      setResult("Please connect your wallet first.");
      return false;
    }
    const network = await provider.getNetwork();
    if (network.chainId !== chainId) {
      setResult("Please switch to Ethereum mainnet.");
      return false;
    }
    return true;
  };

  const createPool = async () => {
    if (!await checkWalletAndChain()) return;
    try {
      const tx = await contract?.createPool(tokenA, tokenB, parseInt(fee));
      const receipt = await tx.wait();
      setResult(`Pool created: ${receipt.transactionHash}`);
    } catch (error) {
      console.error("Failed to create pool:", error);
      setResult("Failed to create pool. Please check your inputs and try again.");
    }
  };

  const getFeeAmountTickSpacing = async () => {
    if (!await checkWalletAndChain()) return;
    try {
      const tickSpacing = await contract?.feeAmountTickSpacing(parseInt(fee));
      setResult(`Tick spacing for fee ${fee}: ${tickSpacing}`);
    } catch (error) {
      console.error("Failed to get fee amount tick spacing:", error);
      setResult("Failed to get fee amount tick spacing. Please check your input and try again.");
    }
  };

  const getPoolAddress = async () => {
    if (!await checkWalletAndChain()) return;
    try {
      const poolAddress = await contract?.getPool(token0, token1, parseInt(fee));
      setResult(`Pool address: ${poolAddress}`);
    } catch (error) {
      console.error("Failed to get pool address:", error);
      setResult("Failed to get pool address. Please check your inputs and try again.");
    }
  };

  const getParameters = async () => {
    if (!await checkWalletAndChain()) return;
    try {
      const params = await contract?.parameters();
      setResult(`Parameters: ${JSON.stringify(params)}`);
    } catch (error) {
      console.error("Failed to get parameters:", error);
      setResult("Failed to get parameters. Please try again.");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">UniswapV3Factory Interaction</h1>
      
      <button onClick={connectWallet} className="bg-blue-500 text-white p-2 rounded-lg mb-4">
        Connect Wallet
      </button>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Create Pool</h2>
        <input
          type="text"
          placeholder="Token A Address"
          value={tokenA}
          onChange={(e) => setTokenA(e.target.value)}
          className="border p-2 rounded-lg mr-2"
        />
        <input
          type="text"
          placeholder="Token B Address"
          value={tokenB}
          onChange={(e) => setTokenB(e.target.value)}
          className="border p-2 rounded-lg mr-2"
        />
        <input
          type="text"
          placeholder="Fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="border p-2 rounded-lg mr-2"
        />
        <button onClick={createPool} className="bg-green-500 text-white p-2 rounded-lg">
          Create Pool
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Get Fee Amount Tick Spacing</h2>
        <input
          type="text"
          placeholder="Fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="border p-2 rounded-lg mr-2"
        />
        <button onClick={getFeeAmountTickSpacing} className="bg-green-500 text-white p-2 rounded-lg">
          Get Tick Spacing
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Get Pool</h2>
        <input
          type="text"
          placeholder="Token0 Address"
          value={token0}
          onChange={(e) => setToken0(e.target.value)}
          className="border p-2 rounded-lg mr-2"
        />
        <input
          type="text"
          placeholder="Token1 Address"
          value={token1}
          onChange={(e) => setToken1(e.target.value)}
          className="border p-2 rounded-lg mr-2"
        />
        <input
          type="text"
          placeholder="Fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="border p-2 rounded-lg mr-2"
        />
        <button onClick={getPoolAddress} className="bg-green-500 text-white p-2 rounded-lg">
          Get Pool Address
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Get Parameters</h2>
        <button onClick={getParameters} className="bg-green-500 text-white p-2 rounded-lg">
          Get Parameters
        </button>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Result:</h2>
        <p>{result}</p>
      </div>
    </div>
  );
};

export { UniswapV3FactoryInteraction as component };
