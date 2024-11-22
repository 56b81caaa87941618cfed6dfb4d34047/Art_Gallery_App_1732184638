
import React, { useState, useEffect } from 'react';
import * as ethers from 'ethers';

const UniswapV3FactoryInteraction: React.FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [owner, setOwner] = useState<string>('');
  const [parameters, setParameters] = useState<any>(null);
  const [createPoolResult, setCreatePoolResult] = useState<string>('');
  const [getPoolResult, setGetPoolResult] = useState<string>('');
  const [feeAmountTickSpacingResult, setFeeAmountTickSpacingResult] = useState<string>('');

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
      "name": "owner",
      "stateMutability": "view",
      "inputs": [],
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
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        const uniswapContract = new ethers.Contract(contractAddress, contractABI, web3Provider);
        setContract(uniswapContract);
        
        try {
          const ownerAddress = await uniswapContract.owner();
          setOwner(ownerAddress);
          const params = await uniswapContract.parameters();
          setParameters(params);
        } catch (error) {
          console.error("Error fetching contract data:", error);
        }
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
        if (network.chainId !== chainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ethers.utils.hexValue(chainId) }],
            });
          } catch (switchError) {
            console.error("Failed to switch to the correct network:", switchError);
          }
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const createPool = async (tokenA: string, tokenB: string, fee: number) => {
    if (!contract || !provider) {
      await connectWallet();
      return;
    }
    try {
      const signer = provider.getSigner();
      const tx = await contract.connect(signer).createPool(tokenA, tokenB, fee);
      const receipt = await tx.wait();
      setCreatePoolResult(`Pool created: ${receipt.transactionHash}`);
    } catch (error) {
      console.error("Error creating pool:", error);
      setCreatePoolResult('Error creating pool. See console for details.');
    }
  };

  const getPool = async (tokenA: string, tokenB: string, fee: number) => {
    if (!contract) {
      await connectWallet();
      return;
    }
    try {
      const pool = await contract.getPool(tokenA, tokenB, fee);
      setGetPoolResult(`Pool address: ${pool}`);
    } catch (error) {
      console.error("Error getting pool:", error);
      setGetPoolResult('Error getting pool. See console for details.');
    }
  };

  const getFeeAmountTickSpacing = async (fee: number) => {
    if (!contract) {
      await connectWallet();
      return;
    }
    try {
      const tickSpacing = await contract.feeAmountTickSpacing(fee);
      setFeeAmountTickSpacingResult(`Tick spacing: ${tickSpacing}`);
    } catch (error) {
      console.error("Error getting fee amount tick spacing:", error);
      setFeeAmountTickSpacingResult('Error getting fee amount tick spacing. See console for details.');
    }
  };

  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">UniswapV3Factory Interaction</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Contract Info</h2>
        <p>Owner: {owner}</p>
        <p>Parameters: {parameters ? JSON.stringify(parameters) : 'Loading...'}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Create Pool</h2>
        <input id="tokenA" className="border p-2 mr-2" placeholder="Token A Address" />
        <input id="tokenB" className="border p-2 mr-2" placeholder="Token B Address" />
        <input id="fee" className="border p-2 mr-2" placeholder="Fee" type="number" />
        <button 
          className="bg-blue-500 text-white p-2 rounded" 
          onClick={() => createPool(
            (document.getElementById('tokenA') as HTMLInputElement).value,
            (document.getElementById('tokenB') as HTMLInputElement).value,
            Number((document.getElementById('fee') as HTMLInputElement).value)
          )}
        >
          Create Pool
        </button>
        <p>{createPoolResult}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Get Pool</h2>
        <input id="getTokenA" className="border p-2 mr-2" placeholder="Token A Address" />
        <input id="getTokenB" className="border p-2 mr-2" placeholder="Token B Address" />
        <input id="getFee" className="border p-2 mr-2" placeholder="Fee" type="number" />
        <button 
          className="bg-green-500 text-white p-2 rounded"
          onClick={() => getPool(
            (document.getElementById('getTokenA') as HTMLInputElement).value,
            (document.getElementById('getTokenB') as HTMLInputElement).value,
            Number((document.getElementById('getFee') as HTMLInputElement).value)
          )}
        >
          Get Pool
        </button>
        <p>{getPoolResult}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Get Fee Amount Tick Spacing</h2>
        <input id="tickSpacingFee" className="border p-2 mr-2" placeholder="Fee" type="number" />
        <button 
          className="bg-purple-500 text-white p-2 rounded"
          onClick={() => getFeeAmountTickSpacing(
            Number((document.getElementById('tickSpacingFee') as HTMLInputElement).value)
          )}
        >
          Get Tick Spacing
        </button>
        <p>{feeAmountTickSpacingResult}</p>
      </div>
    </div>
  );
};

export { UniswapV3FactoryInteraction as component };
