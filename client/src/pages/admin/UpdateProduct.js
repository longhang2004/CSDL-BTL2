import React, { useState, useEffect } from 'react';
import { apiUpdateProduct, apiFetchProductById } from 'apis';
import Swal from 'sweetalert2';

const UpdateProduct = ({ productId, setEditProduct }) => {
    const [loading, setLoading] = useState(false);
    // const [productType, setProductType] = useState('');
    const [formData, setFormData] = useState({});
    
    // Base attributes that all products share
    const baseAttributes = [
        { name: 'Ten', label: 'Tên sản phẩm', required: true },
        { name: 'TonKho', label: 'Số lượng' },
        { name: 'GiaMuaVao', label: 'Giá tiền (đơn vị VNĐ)', required: true },
        { name: 'GiaBanNiemYet', label: 'Giá tiền (đơn vị VNĐ)', required: true },
        { name: 'TenHangSanXuat', label: 'Hãng sản xuất' },
        { name: 'DiaChi', label: 'Xuất xứ' },
        { name: 'MoTa', label: 'Mô tả' },
    ];


    // Product-specific attributes
    const specificAttributes = {
        phone: [
            { name: 'camera', label: 'Camera' },
            { name: 'battery', label: 'Dung lượng pin' },
            { name: 'ramRom', label: 'RAM/ROM' },
            { name: 'processor', label: 'Chipset' },
            { name: 'screen', label: 'Màn hình' },
            { name: 'sim', label: 'Thẻ SIM' },
            { name: 'connection', label: 'Hỗ trợ mạng' }
        ],
        laptop: [
            { name: 'cpu', label: 'CPU' },
            { name: 'gpu', label: 'GPU' },
            { name: 'ram', label: 'RAM' },
            { name: 'battery', label: 'Dung lượng pin' },
            { name: 'screen', label: 'Màn hình' },
            { name: 'hardDrive', label: 'Ổ cứng' },
            { name: 'connectionPorts', label: 'Cổng kết nối' }
        ],
        tablet: [
            { name: 'camera', label: 'Camera' },
            { name: 'battery', label: 'Dung lượng pin' },
            { name: 'ramRom', label: 'RAM/ROM' },
            { name: 'processor', label: 'GPU' },
            { name: 'screen', label: 'Màn hình' },
            { name: 'sim', label: 'Thẻ SIM' },
            { name: 'connection', label: 'Hỗ trợ mạng' }
        ],
        smartwatch: [
            { name: 'battery', label: 'Dung lượng pin' },
            { name: 'screen', label: 'Màn hình' },
            { name: 'connection', label: 'Kết nối' },
            { name: 'certificate', label: 'Chứng nhận' }
        ],
        powerbank: [
            { name: 'capacity', label: 'Dung lượng' },
            { name: 'input', label: 'Input' },
            { name: 'output', label: 'Output' },
            { name: 'numOfPorts', label: 'Số cổng sạc' }
        ],
        headphone: [
            { name: 'battery', label: 'Dung lượng pin' },
            { name: 'connection', label: 'Kết nối' },
            { name: 'certificate', label: 'Chứng nhận' },
            { name: 'typeOfHeadphone', label: 'Loại tai nghe' }
        ],
        charger: [
            { name: 'input', label: 'Input' },
            { name: 'output', label: 'Output' },
            { name: 'typeOfPort', label: 'Loại cổng sạc' }
        ],
        case: [
            { name: 'material', label: 'Chất liệu' },
            { name: 'color', label: 'Màu sắc' },
            { name: 'productSupported', label: 'Tương thích với thiết bị' }
        ],
        mouse: [
            { name: 'connection', label: 'Kết nối' },
            { name: 'sensor', label: 'Cảm biến' },
            { name: 'battery', label: 'Pin' },
            { name: 'weight', label: 'Khối lượng' }
        ],
        keyboard: [
            { name: 'connection', label: 'Kết nối' },
            { name: 'layout', label: 'Layout' },
            { name: 'size', label: 'Kích thước' }
        ]
    };

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = async () => {
      setLoading(true);
      const response = await apiFetchProductById(productId);
      
      if (response.success) {
          const product = response.productData;
          setFormData(product);
      } else {
          Swal.fire({
              title: 'Lỗi',
              text: 'Không thể tải thông tin sản phẩm',
              icon: 'error'
          });
      }
      setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await Swal.fire({
          title: 'Xác nhận cập nhật',
          text: 'Bạn có chắc chắn muốn cập nhật sản phẩm này?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Xác nhận',
          cancelButtonText: 'Hủy'
        });
        if (result.isConfirmed) {
          try {
            setLoading(true);
            const updateData = {
                    ...formData,
                    GiaMuaVao: Number(productData.GiaMuaVao),
                    GiaBanNiemYet: Number(productData.GiaBanNiemYet),
                    TonKho: productData.TonKho ? Number(productData.TonKho) : 0,
            };

            const response = await apiUpdateProduct(updateData);

            if (response.success) {
                Swal.fire({
                    title: 'Thành công',
                    text: 'Cập nhật sản phẩm thành công',
                    icon: 'success'
                });
                window.location.reload()
                setEditProduct(null);
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Không thể cập nhật sản phẩm',
                    icon: 'error'
                });
            }
          } catch (error) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Đã xảy ra lỗi khi cập nhật sản phẩm',
                icon: 'error'
            });
          } finally {
              setLoading(false);
          }
        }
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="w-main mx-auto p-6 px-10 pt-20">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Base Attributes */}
                <div className="grid grid-cols-2 gap-6">
                    {baseAttributes.map((attr) => (
                        <div key={attr.name} className="space-y-2">
                            <label 
                                htmlFor={attr.name}
                                className="block text-sm font-medium text-gray-700"
                            >
                                {attr.label}
                                {attr.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                id={attr.name}
                                name={attr.name}
                                value={formData[attr.name] || ''}
                                required={attr.required}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    ))}
                </div>

                {/* Specific Attributes */}
                {/* {productType && specificAttributes[productType] && (
                    <div className="space-y-6">
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Thông tin cụ thể
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                {specificAttributes[productType].map((attr) => (
                                    <div key={attr.name} className="space-y-2">
                                        <label 
                                            htmlFor={attr.name}
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            {attr.label}
                                        </label>
                                        <input
                                            id={attr.name}
                                            name={attr.name}
                                            value={formData[attr.name] || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )} */}
                <div className='flex flex-row justify-center gap-10 pt-4'>
                  <button
                      type="submit"
                      disabled={loading}
                      className={`flex  py-3 px-4 rounded-md  transition-colors duration-200 
                          ${loading 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                          } text-white`}
                  >
                      {loading ? 'Đang xử lý...' : 'Cập nhật sản phẩm'}
                  </button>

                  <button
                          type="button"
                          onClick={() => setEditProduct(null)}
                          className="flex py-3 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                      >
                          Thoát
                  </button>
                </div>
                
            </form>
        </div>
    );
};

export default UpdateProduct;