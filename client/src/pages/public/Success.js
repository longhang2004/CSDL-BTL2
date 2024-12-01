import React from 'react';
import { CheckCircle } from 'lucide-react';

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-green-500 mb-8">
          THANH TOÁN THÀNH CÔNG
        </h1>
        
        <div className="space-y-2 mb-8 text-gray-700">
          <p>
            Mã đơn: <span className="font-semibold">#25641</span>
            {' - '}
            Tổng tiền: <span className="font-semibold">1.000</span>
          </p>
          <p>Kiểu thanh toán: Online</p>
        </div>

        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          onClick={() => window.location.href = '/'}
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default Success;