import React, { useState } from 'react';
import { apiAddProduct } from 'apis/product';
import Swal from 'sweetalert2';

const CreatProduct = () => {
    const [productType, setProductType] = useState('');
    const [productData, setProductData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Product-specific attributes (keeping your existing specificAttributes object)
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
          { name: 'connection', label: 'Hỗ trợ mạng' },
          { name: 'certificate', label: 'Certificate' }
      ],
      powerbank: [
          { name: 'capacity', label: 'Dung lượng pin' },
          { name: 'input', label: 'Input' },
          { name: 'output', label: 'Output' },
          { name: 'numOfPorts', label: 'Số lượng cổng kết nối' }
      ],
      headphone: [
          { name: 'battery', label: 'Dung lượng pin' },
          { name: 'connection', label: 'Hỗ trợ kết nối' },
          { name: 'certificate', label: 'Certificate' },
          { name: 'typeOfHeadphone', label: 'Kiểu tai nghe' }
      ],
      charger: [
          { name: 'input', label: 'Input' },
          { name: 'output', label: 'Output' },
          { name: 'typeOfPort', label: 'Loại cổng sạc' }
      ],
      case: [
          { name: 'material', label: 'Chất liệu' },
          { name: 'color', label: 'Màu' },
          { name: 'productSupported', label: 'Tương thích với thiết bị' }
      ],
      mouse: [
          { name: 'connection', label: 'Hỗ trợ kết nối' },
          { name: 'sensor', label: 'Cảm biến' },
          { name: 'battery', label: 'Dung lượng pin' },
          { name: 'weight', label: 'Khối lượng' }
      ],
      keyboard: [
          { name: 'connection', label: 'Hỗ trợ kết nối' },
          { name: 'layout', label: 'Layout' },
          { name: 'size', label: 'Size' }
      ]
      };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            // Format the data according to your API requirements
            const payload = {
                    ...productData,
                    // Convert numeric fields
                    GiaMuaVao: Number(productData.GiaMuaVao),
                    GiaBanNiemYet: Number(productData.GiaBanNiemYet),
                    TonKho: productData.TonKho ? Number(productData.TonKho) : 0,
            };

            const response = await apiAddProduct(payload);

            if (response.success === true) {
              Swal.fire({
                title: 'Thành công',
                text: 'Thêm sản phẩm thành công',
                icon: 'success'
              });
                // Reset form
              setProductType('');
              setProductData({});
            }
            else {
              Swal.fire({
                title: 'Lỗi',
                text: 'Có lỗi xảy ra khi thêm sản phẩm',
                icon: 'error'
              });
            }
            console.log(response)
            console.log(payload)
        } catch (error) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Có lỗi xảy ra khi thêm sản phẩm',
                icon: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-main p-6 border-sky-600 border-2 container mx-auto bg-white mt-10 rounded-lg shadow-lg">
            <div className="border-b pb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Thông tin chung của sản phẩm</h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Product Type Selection */}
                {/* <div className="space-y-2">
                    <label className="block text-sm font-semibold font-medium text-gray-700">
                        Loại sản phẩm
                    </label>
                    <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Vui lòng chọn loại sản phẩm</option>
                        {Object.keys(specificAttributes).map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div> */}

                {/* Base Attributes */}
                <div className="grid grid-cols-2 gap-6">
                    {baseAttributes.map((attr) => (
                        <div key={attr.name} className="space-y-2">
                            <label 
                                htmlFor={attr.name}
                                className="block text-sm font-semibold font-medium text-gray-700"
                            >
                                {attr.label}
                                {attr.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                id={attr.name}
                                name={attr.name}
                                required={attr.required}
                                onChange={handleInputChange}
                                value={productData[attr.name] || ''}
                                className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    ))}
                </div>

                {/* Specific Attributes */}
                {/* {productType && (
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
                                            type="text"
                                            onChange={handleInputChange}
                                            value={productData[attr.name] || ''}
                                            className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )} */}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-md transition-colors duration-200 
                        ${isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        } text-white`}
                >
                    {isSubmitting ? 'Đang xử lý...' : 'Thêm sản phẩm'}
                </button>
            </form>
        </div>
    );
};

export default CreatProduct;