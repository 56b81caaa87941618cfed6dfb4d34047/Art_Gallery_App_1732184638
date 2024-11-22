import React from 'react';

const UniswapV3FactoryInteraction: React.FC = () => {
  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">UniswapV3Factory Information</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <i className='bx bx-info-circle mr-2'></i>
          Contract Info
        </h2>
        <p className="mt-2">This component previously contained smart contract interaction functionality.</p>
        <p className="mt-1">The smart contract interaction has been removed as requested.</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold flex items-center">
          <i className='bx bx-link mr-2'></i>
          Related Links
        </h2>
        <ul className="list-disc list-inside mt-2">
          <li>
            <a href="https://uniswap.org/" className="text-blue-500 hover:underline">Uniswap Official Website</a>
          </li>
          <li>
            <a href="https://docs.uniswap.org/" className="text-blue-500 hover:underline">Uniswap Documentation</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export { UniswapV3FactoryInteraction as component };
