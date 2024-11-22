
import React from 'react';
import * as ethers from 'ethers';

const UniswapV3FactoryInteraction: React.FC = () => {
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [tokenA, setTokenA] = React.useState('');
  const [tokenB, setTokenB] = React.useState('');
  const [fee, setFee] = React.useState('');
  const [result, setResult] = React.useState('');

  const contractAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
  const chainId = 1; // Ethereum mainnet

  const contractABI = [
    {
      "name": "createPool",
      "stateMutability": "nonpayable",
      "inputs": [
        {"name": "tokenA", "type": "address"},
        {"name": "tokenB", "type": "address"},
        {"name": "fee", "type": "uint24"}
      ],
      "outputs": [{"name": "pool", "type": "address"}]
    },
    {
      "name": "feeAmountTickSpacing",
      "stateMutability": "view",
      "inputs": [{"name": "", "type": "uint24"}],
      "outputs": [{"name": "", "type": "int24"}]
    },
    {
      "name": "getPool",
      "stateMutability": "view",
      "inputs": [
        {"name": "", "type": "address"},
        {"name": "", "type": "address"},
        {"name": "", "type": "uint24"}
      ],
      "outputs": [{"name": "", "type": "address"}]
    },
    {
      "name": "parameters",
      "stateMutability": "view",
      "inputs": [],
      "outputs": [
        {"name": "factory", "type": "address"},
        {"name": "token0", "type": "address"},
        {"name": "token1", "type": "address"},
        {"name": "fee", "type": "uint24"},
        {"name": "tickSpacing", "type": "int24"}
      ]
    }
  ];

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        setSigner(web3Provider.getSigner());
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        setResult('Failed to connect wallet. Please try again.');
      }
    } else {
      setResult('Please install MetaMask to interact with this dApp!');
    }
  };

  const checkAndSwitchChain = async () => {
    if (!provider) {
      await connectWallet();
      return false;
    }

    const network = await provider.getNetwork();
    if (network.chainId !== chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexValue(chainId) }],
        });
        return true;
      } catch (error) {
        console.error('Failed to switch network:', error);
        setResult('Failed to switch to the correct network. Please switch to Ethereum mainnet manually.');
        return false;
      }
    }
    return true;
  };

  const createPool = async () => {
    if (!await checkAndSwitchChain()) return;
    
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer!);
      const tx = await contract.createPool(tokenA, tokenB, fee);
      const receipt = await tx.wait();
      setResult(`Pool created successfully. Transaction hash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error('Error creating pool:', error);
      setResult('Error creating pool. Please check your inputs and try again.');
    }
  };

  const getPool = async () => {
    if (!await checkAndSwitchChain()) return;

    try {
      const contract = new ethers.Contract(contractAddress, contractABI, provider!);
      const pool = await contract.getPool(tokenA, tokenB, fee);
      setResult(`Pool address: ${pool}`);
    } catch (error) {
      console.error('Error getting pool:', error);
      setResult('Error getting pool. Please check your inputs and try again.');
    }
  };

  const getParameters = async () => {
    if (!await checkAndSwitchChain()) return;

    try {
      const contract = new ethers.Contract(contractAddress, contractABI, provider!);
      const params = await contract.parameters();
      setResult(`Factory: ${params.factory}\nToken0: ${params.token0}\nToken1: ${params.token1}\nFee: ${params.fee}\nTick Spacing: ${params.tickSpacing}`);
    } catch (error) {
      console.error('Error getting parameters:', error);
      setResult('Error getting parameters. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-5">
        <h1 className="text-2xl font-bold mb-5">Uniswap V3 Factory Interaction</h1>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Token A Address"
            className="w-full p-2 border rounded"
            value={tokenA}
            onChange={(e) => setTokenA(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Token B Address"
            className="w-full p-2 border rounded"
            value={tokenB}
            onChange={(e) => setTokenB(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Fee (in bps, e.g. 3000 for 0.3%)"
            className="w-full p-2 border rounded"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button
            onClick={createPool}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Pool
          </button>
          <button
            onClick={getPool}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Get Pool
          </button>
          <button
            onClick={getParameters}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Get Parameters
          </button>
        </div>
        
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{result}</pre>
        </div>
      </div>
    </div>
  );
};

export { UniswapV3FactoryInteraction as component };
