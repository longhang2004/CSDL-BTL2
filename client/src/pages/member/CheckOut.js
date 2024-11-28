import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address } from '../../components';
import { apiGetCurrent } from '../../apis/user';
import { apiFetchUserCart, apiDeleteAllProductsFromUserCart } from '../../apis/cart';
import { apiCreateOrder } from '../../apis/order';
import { apiCreatePayment } from '../../apis/payOS';
import path from '../../utils/path';
import Swal from 'sweetalert2';

const CheckOut = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [shippingFee, setShippingFee] = useState(20000);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  // Tải thông tin user và giỏ hàng khi component được mount
  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const userResponse = await apiGetCurrent();
        const userId = userResponse.rs?._id;
        setUserId(userId);

        if (userId) {
          const cartResponse = await apiFetchUserCart(userId);
          setCart(cartResponse.cartData || []); // Dữ liệu giỏ hàng từ API
        }
        
      } catch (error) {
        console.error('Lỗi tải thông tin người dùng hoặc giỏ hàng:', error);
        Swal.fire('Lỗi', 'Không thể tải thông tin người dùng hoặc giỏ hàng', 'error');
      }
    };
    fetchUserAndCart();
  }, []);

  // Tính tổng tiền hàng và tổng thanh toán
  const productPrice = cart.reduce((total, item) => total + item.productId.price * item.quantity, 0); 
  const totalPrice = productPrice + shippingFee;

  // Hàm xử lý khi thay đổi địa chỉ
  const handleAddressChange = (address) => {
    setDeliveryAddress(address);
  };

  // Hàm xác nhận đặt hàng
  const handleOrderConfirmation = async () => {
    if (!name || !phone || !email || !deliveryAddress) {
      Swal.fire('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin thanh toán', 'error');
      return;
    }

    if (cart.length === 0) {
      Swal.fire('Lỗi', 'Giỏ hàng không có sản phẩm', 'error');
      return;
    }

    try {
      const orderData = {
        totalPrice,
        status: 'Processing',
        address: deliveryAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Processing',
        productList: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        createdBy: userId,
      };

      if (paymentMethod === 'bank'){
        orderData.payOSOrderId = Number(String(Date.now()).slice(-6)); // Tạo mã đơn hàng ngẫu nhiên
      }
      else {orderData.payOSOrderId = '';}

      const response = await apiCreateOrder( {orderData} );

      if (response.success) {
        if (paymentMethod === 'bank') {
          const paymentLink=await apiCreatePayment({
            price: totalPrice,
            payOSCode: orderData.payOSOrderId
          })
          
          window.location.href=paymentLink.url;
        } else {
          Swal.fire('Thành công', 'Đặt hàng thành công', 'success').then(async () => {
              // Gọi API để xóa giỏ hàng
              const deleteResponse = await apiDeleteAllProductsFromUserCart({ userId });
              if (deleteResponse.success) {
                  setCart([]); 
              } else {
                  console.error('Failed to clear cart:', deleteResponse.cartData);
              }
              navigate(`\${path.HOME}`);
              window.location.reload(); // Reload trang
          });
        }
    } else {
        Swal.fire('Thất bại', 'Đặt hàng thất bại, vui lòng thử lại', 'error');
    }
  } catch (error) {
      console.error('Order error:', error);
      Swal.fire('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại', 'error');
  }
};

  return (
    <div className='w-main min-h-screen flex flex-row mt-10'>
      <div className='w-2/3 flex flex-col flex-1 gap-8 pr-10'>
        {/* Form nhập thông tin thanh toán */}
        <div className='flex flex-col gap-5'>
          <h2 className="text-xl font-semibold">THÔNG TIN THANH TOÁN</h2>
          <div className="flex flex-col gap-2">
            <label className="font-medium font-semibold" htmlFor="name">Họ và tên</label>
            <input
              type="text"
              id="name"
              placeholder="Nhập họ và tên"
              className="border border-gray-200 shadow-inner outline-none rounded-md p-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-medium font-semibold" htmlFor="phone">Số điện thoại</label>
              <input
                type="text"
                id="phone"
                placeholder="Nhập số điện thoại"
                className="border border-gray-200 shadow-inner outline-none rounded-md p-2 w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-medium font-semibold" htmlFor="email">Địa chỉ email</label>
              <input
                type="email"
                id="email"
                placeholder="Nhập địa chỉ email"
                className="border border-gray-200 shadow-inner outline-none rounded-md p-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Component Address */}
        <Address onAddressChange={handleAddressChange} />

        <div className="flex flex-col gap-2">
          <label className="font-medium font-semibold" htmlFor="order-note">Ghi chú đơn hàng</label>
          <textarea
            id="order-note"
            placeholder="Ví dụ: giao giờ hành chính, gọi điện trước khi giao hàng"
            className="border border-gray-200 shadow-inner outline-none rounded-md p-2 w-full resize-none"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      {/* Hiển thị giỏ hàng và thông tin đơn hàng */}
      <div className='w-1/3'>
        <div className="border border-blue-500 border-2 p-4 rounded-md flex flex-col gap-8 mb-10">
          <h2 className="text-xl font-semibold text-blue-600 text-center">ĐƠN HÀNG CỦA BẠN</h2>
          <div className="max-h-[150px] overflow-y-auto border rounded-md border-gray-300 p-3 mb-5">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center gap-4 py-2">
                <img src={item.productId.imageLink || 'https://via.placeholder.com/50'} alt={item.productId.name} className="w-12 h-12 border rounded-md" />
                <div className="flex-1">
                  <p className="font-semibold">{item.productId.name}</p>
                  <p>Số lượng: {item.quantity}</p>
                </div>
                <span>{(item.productId.price * item.quantity).toLocaleString()} VND</span>
              </div>
            ))}
          </div>

          {/* Chọn phương thức vận chuyển */}
          <div>
            <h3 className="font-semibold mb-2">Chọn phương thức vận chuyển</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 bg-gray-300 p-2 rounded-md opacity-80">
                <input
                  type="radio"
                  name="shipping"
                  value={20000}
                  checked={shippingFee === 20000}
                  onChange={() => setShippingFee(20000)}
                />
                <strong className="font-bold">Giao hàng tiết kiệm</strong>: 20.000 VND
              </label>
              <label className="flex items-center gap-2 bg-gray-300 p-2 rounded-md opacity-80">
                <input
                  type="radio"
                  name="shipping"
                  value={30000}
                  checked={shippingFee === 30000}
                  onChange={() => setShippingFee(30000)}
                />
                <strong className="font-bold">Giao hàng siêu tốc nội thành</strong>: 30.000 VND
              </label>
            </div>
          </div>

            {/* Tổng thanh toán */}
            <div className="flex justify-between font-semibold">
              <span>Tổng thanh toán</span>
              <span>{totalPrice.toLocaleString()} VND</span> {/* Sử dụng toLocaleString để định dạng số */}
            </div>

          {/* Chọn phương thức thanh toán */}
          <div>
            <h3 className="font-semibold">Chọn phương thức thanh toán</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                Thanh toán khi nhận hàng (COD)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                />
                Thanh toán qua
                <img
                  src="https://payos.vn/docs/img/logo.svg" 
                  alt="Ví MoMo"
                  className="w-9 h-6" 
                />
              </label>
            </div>
          </div>

          <button onClick={handleOrderConfirmation} className="bg-blue-600 text-white p-3 rounded-md mt-4 w-full">
            XÁC NHẬN ĐẶT HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;