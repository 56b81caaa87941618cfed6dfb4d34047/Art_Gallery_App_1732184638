import React from 'react';

const UniswapV3FactoryInteraction: React.FC = () => {
  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-md relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: `url('https://raw.githubusercontent.com/56b81caaa87941618cfed6dfb4d34047/Art_Gallery_App_1732184638/main/src/assets/images/6953eec90df64a3293c3623ad5638357.jpeg')`,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-2xl font-bold mb-4">UniswapV3Factory Information</h1>
        
        {/* Contract Info */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="bx bx-info-circle mr-2"></i>
            Contract Info
          </h2>
          <p className="mt-2">
            This component previously contained smart contract interaction functionality.
          </p>
          <p className="mt-1">The smart contract interaction has been removed as requested.</p>
        </div>

        {/* Related Links */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold flex items-center">
            <i className="bx bx-link mr-2"></i>
            Related Links
          </h2>
          <ul className="list-disc list-inside mt-2">
            <li>
              <a href="https://uniswap.org/" className="text-blue-500 hover:underline">
                Uniswap Official Website
              </a>
            </li>
            <li>
              <a href="https://docs.uniswap.org/" className="text-blue-500 hover:underline">
                Uniswap Documentation
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export { UniswapV3FactoryInteraction as component };
