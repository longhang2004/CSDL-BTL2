import React from 'react';
import { XCircle } from 'lucide-react';

const Cancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 mx-auto text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-red-500 mb-8">
          THANH TOÁN THẤT BẠI
        </h1>
        
        <div className="space-y-2 mb-8 text-gray-700">
          <p>
            Mã đơn: <span className="font-semibold">#25641</span>
            {' - '}
            Tổng tiền: <span className="font-semibold">1.000</span>
          </p>
          <p>Giao dịch của bạn không thành công</p>
        </div>

        <div className="space-y-4">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors w-full"
            onClick={() => window.location.href = '/'}
          >
            Quay về trang chủ
          </button>
          
          <button 
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors w-full"
            onClick={() => window.location.href = '/checkout'}
          >
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cancel;