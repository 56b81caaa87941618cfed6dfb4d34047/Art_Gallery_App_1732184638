
import React from 'react';
import { ethers } from 'ethers';

const UniswapV3FactoryInteraction: React.FC = () => {
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  const [tokenA, setTokenA] = React.useState('');
  const [tokenB, setTokenB] = React.useState('');
  const [fee, setFee] = React.useState('');
  const [poolAddress, setPoolAddress] = React.useState('');
  const [tickSpacing, setTickSpacing] = React.useState('');
  const [parameters, setParameters] = React.useState<any>(null);

  const contractAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
  const chainId = 1; // Ethereum Mainnet

  const contractABI = [
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
      "name": "feeAmountTickSpacing",
      "stateMutability": "view",
      "inputs": [{ "name": "", "type": "uint24" }],
      "outputs": [{ "name": "", "type": "int24" }]
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

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const network = await provider.getNetwork();
        if (network.chainId !== chainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${chainId.toString(16)}` }],
            });
          } catch (switchError) {
            console.error('Failed to switch to the correct network:', switchError);
          }
        }
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
      } catch (error) {
        console.error('Failed to connect to the wallet:', error);
      }
    } else {
      console.error('MetaMask is not installed');
    }
  };

  const getPool = async () => {
    if (!contract) {
      await connectWallet();
    }
    try {
      const pool = await contract!.getPool(tokenA, tokenB, fee);
      setPoolAddress(pool);
    } catch (error) {
      console.error('Error getting pool:', error);
    }
  };

  const getFeeAmountTickSpacing = async () => {
    if (!contract) {
      await connectWallet();
    }
    try {
      const spacing = await contract!.feeAmountTickSpacing(fee);
      setTickSpacing(spacing.toString());
    } catch (error) {
      console.error('Error getting fee amount tick spacing:', error);
    }
  };

  const getParameters = async () => {
    if (!contract) {
      await connectWallet();
    }
    try {
      const params = await contract!.parameters();
      setParameters(params);
    } catch (error) {
      console.error('Error getting parameters:', error);
    }
  };

  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-md relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: `url('https://raw.githubusercontent.com/56b81caaa87941618cfed6dfb4d34047/Art_Gallery_App_1732184638/main/src/assets/images/6953eec90df64a3293c3623ad5638357.jpeg')`,
        }}
      ></div>

      <div className="relative z-10">
        <h1 className="text-2xl font-bold mb-4">UniswapV3Factory Interaction</h1>
        
        <div className="mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="bx bx-info-circle mr-2"></i>
            Get Pool
          </h2>
          <input
            type="text"
            placeholder="Token A Address"
            className="mt-2 p-2 w-full rounded"
            value={tokenA}
            onChange={(e) => setTokenA(e.target.value)}
          />
          <input
            type="text"
            placeholder="Token B Address"
            className="mt-2 p-2 w-full rounded"
            value={tokenB}
            onChange={(e) => setTokenB(e.target.value)}
          />
          <input
            type="text"
            placeholder="Fee"
            className="mt-2 p-2 w-full rounded"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
          <button
            onClick={getPool}
            className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Get Pool
          </button>
          {poolAddress && (
            <p className="mt-2">Pool Address: {poolAddress}</p>
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="bx bx-info-circle mr-2"></i>
            Fee Amount Tick Spacing
          </h2>
          <input
            type="text"
            placeholder="Fee"
            className="mt-2 p-2 w-full rounded"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
          <button
            onClick={getFeeAmountTickSpacing}
            className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Get Tick Spacing
          </button>
          {tickSpacing && (
            <p className="mt-2">Tick Spacing: {tickSpacing}</p>
          )}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="bx bx-info-circle mr-2"></i>
            Parameters
          </h2>
          <button
            onClick={getParameters}
            className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Get Parameters
          </button>
          {parameters && (
            <div className="mt-2">
              <p>Factory: {parameters.factory}</p>
              <p>Token0: {parameters.token0}</p>
              <p>Token1: {parameters.token1}</p>
              <p>Fee: {parameters.fee.toString()}</p>
              <p>Tick Spacing: {parameters.tickSpacing.toString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { UniswapV3FactoryInteraction as component };
