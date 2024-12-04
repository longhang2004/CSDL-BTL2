import React, { useState, useEffect } from 'react';
import { apiAddProduct } from 'apis/product';
import Swal from 'sweetalert2';

const CreatProduct = () => {
    const [productType, setProductType] = useState('');
    const [productData, setProductData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [manufacturers, setManufacturers] = useState([]);
    const [isAddingManufacturer, setIsAddingManufacturer] = useState(false);
    const [newManufacturer, setNewManufacturer] = useState({});

    const fetchManufacturers = async () => {
        try {
            setIsLoading(true);
            const response = await apiGetManufacturers();
            if (response.success === true) {
                setManufacturers(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch manufacturers: ', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchManufacturers();
    }, []);


    // Base attributes that all products share
    const baseAttributes = [
        { name: 'Ten', label: 'Tên sản phẩm', required: true },
        { name: 'TonKho', label: 'Số lượng' },
        { name: 'GiaMuaVao', label: 'Giá mua vào (đơn vị VNĐ)', required: true },
        { name: 'GiaBanNiemYet', label: 'Giá bán (đơn vị VNĐ)', required: true },
        { name: 'TenHangSanXuat', label: 'Hãng sản xuất' },
        { name: 'DiaChi', label: 'Xuất xứ' },
        { name: 'MoTa', label: 'Mô tả' },
    ];

    // Product-specific attributes (keeping your existing specificAttributes object)
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewManufacturerChange = (e) => {
        const { name, value } = e.target;
        setNewManufacturer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (isAddingManufacturer) {
                // Add new manufacturer first
                const response = await apiAddManufacturer(newManufacturer);
                if (response.success === true) {
                    // Fetch manufacturers again
                    fetchManufacturers();
                    // Reset new manufacturer data
                    setNewManufacturer({});
                    // Reset the form
                }
                else {
                    Swal.fire({
                        title: 'Lỗi',
                        text: 'Có lỗi xảy ra khi thêm nhà sản xuất',
                        icon: 'error'
                    });
                }
                setIsAddingManufacturer(false);
            }
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

    if (isLoading) {
        return <p>Loading...</p>;
    }

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
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold font-medium text-gray-700">
                            Nhà sản xuất
                        </label>
                        <select
                            value={productType}
                            onChange={(e) => {
                                if (e.target.value === '0') {
                                    // Show a modal to add new manufacturer
                                    setIsAddingManufacturer(true);
                                }
                                setProductData({...productData, MaHangSanXuat: e.target.value})
                            }}
                            className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Vui lòng chọn loại sản phẩm</option>
                            <option value="0">Thêm nhà sản xuất mới</option>
                            {manufacturers.map((manufacturer) => (
                                <option key={manufacturer.MaHangSanXuat} value={manufacturer.MaHangSanXuat}>
                                    {manufacturer.TenHangSanXuat}
                                </option>
                            ))}
                        </select>
                    </div>
                    {isAddingManufacturer && (
                        <div key={"TenHangSanXuat"} className="space-y-2">
                            <label 
                                htmlFor={"TenHangSanXuat"}
                                className="block text-sm font-semibold font-medium text-gray-700"
                            >
                                {"Tên hãng sản xuất"}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                id={"TenHangSanXuat"}
                                name={"TenHangSanXuat"}
                                required={true}
                                onChange={handleNewManufacturerChange}
                                value={''}
                                className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}
                    {isAddingManufacturer && (
                        <div key={"DiaChi"} className="space-y-2">
                            <label 
                                htmlFor={"DiaChi"}
                                className="block text-sm font-semibold font-medium text-gray-700"
                            >
                                {"Địa chỉ"}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                id={"DiaChi"}
                                name={"DiaChi"}
                                required={true}
                                onChange={handleNewManufacturerChange}
                                value={''}
                                className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        )}
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