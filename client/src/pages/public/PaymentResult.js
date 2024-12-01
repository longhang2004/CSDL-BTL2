import React from 'react';
import { XCircle } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { apiCheckPaymentStatus } from 'apis/payOS';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const PaymentResult = () => {
    const {orderCode}  = useParams();
    const [paymentInfo, setPaymentInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchPaymentInfo = async () => {
        try {
        const payment = await apiCheckPaymentStatus(orderCode);
        setPaymentInfo(payment? payment.paymentData: {});
        setIsLoading(false);
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        fetchPaymentInfo();
    }, [orderCode]);

    if (isLoading) return <div>Loading...</div>;

    if (!paymentInfo) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 mx-auto text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-red-500 mb-8">
          THANH TOÁN KHÔNG TỒN TẠI
        </h1>
        
        <div className="space-y-2 mb-8 text-gray-700">
          <p>Giao dịch này chưa được khỏi tạo</p>
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

    if (paymentInfo.status === "PENDING") return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 mx-auto text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-red-500 mb-8">
          THANH TOÁN ĐANG ĐƯỢC XỬ LÝ
        </h1>
        
        <div className="space-y-2 mb-8 text-gray-700">
            <p>
                Mã đơn: <span className="font-semibold">#{paymentInfo.orderCode}</span>
                {' - '}
                Tổng tiền: <span className="font-semibold">{paymentInfo.amount*1000}</span>
            </p>
            <p>Giao dịch của bạn đang trong quá trình xử lý</p>
        </div>

        <div className="space-y-4">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors w-full"
            onClick={() => window.location.href = '/'}
          >
            Quay về trang chủ
          </button>
        
        </div>
      </div>
    </div>
    )

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg text-center">
            <div className="mb-6">
            {paymentInfo.status==="CANCELLED"?<XCircle className="w-16 h-16 mx-auto text-red-500" />:<CheckCircle className="w-16 h-16 mx-auto text-green-500" />}
            </div>
            
            {paymentInfo.status==="CANCELLED"?<h1 className="text-2xl font-bold text-red-500 mb-8">
            THANH TOÁN THẤT BẠI
            </h1>:<h1 className="text-2xl font-bold text-green-500 mb-8">
              THANH TOÁN THÀNH CÔNG
            </h1>}
            
            <div className="space-y-2 mb-8 text-gray-700">
            <p>
                Mã đơn: <span className="font-semibold">#{paymentInfo.orderCode}</span>
                {' - '}
                Tổng tiền: <span className="font-semibold">{paymentInfo.amount*1000}</span>
            </p>
            <p>Giao dịch của bạn {paymentInfo.status==="CANCELLED"?"không":"đã"} thành công</p>
            </div>

            <div className="space-y-4">
            <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors w-full"
                onClick={() => window.location.href = '/'}
            >
                Quay về trang chủ
            </button>
            
            {paymentInfo.status==="CANCELLED"&&<button 
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors w-full"
                onClick={() => window.location.href = '/checkout'}
            >
                Thử lại
            </button>}
            </div>
        </div>
        </div>
    );
}

export default PaymentResult;