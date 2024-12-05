import React, { useState, useEffect } from 'react';
import { apiUpdateProduct, apiGetProducts, apiGetManufacturers, apiGetProductByFilter, apiGetProductDetail, apiUpdateProductDetail } from '../../apis';
import Swal from 'sweetalert2';

const UpdateProduct = ({ MaHangHoa, setEditProduct }) => {
    const [loading, setLoading] = useState(false);
    const [productType, setProductType] = useState('');
    const [formData, setFormData] = useState({});
    const [productDetail, setProductDetail] = useState({});
    const [manufacturers, setManufacturers] = useState([]);
    const [isAddingManufacturer, setIsAddingManufacturer] = useState(false);
    const [newManufacturer, setNewManufacturer] = useState({});

    const fetchManufacturers = async () => {
        try {
            const response = await apiGetManufacturers();
            if (response.success === true) {
                setManufacturers(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch manufacturers: ', error);
        } 
    }
    
    // Base attributes that all products share
    const baseAttributes = [
        { name: 'Ten', label: 'Tên sản phẩm', required: true },
        { name: 'TonKho', label: 'Số lượng' },
        { name: 'GiaMuaVao', label: 'Giá tiền (đơn vị VNĐ)', required: true },
        { name: 'GiaBanNiemYet', label: 'Giá tiền (đơn vị VNĐ)', required: true },
        // { name: 'hsx.TenHangSanXuat', label: 'Hãng sản xuất' },
        // { name: 'hsx.DiaChi', label: 'Xuất xứ' },
        { name: 'MoTa', label: 'Mô tả' },
    ];


    // Product-specific attributes
    const specificAttributes = {
        DienThoai: [
            { name: 'Camera', label: 'Camera' },
            { name: 'PinSac', label: 'Dung lượng pin' },
            { name: 'RAM_ROM', label: 'RAM/ROM' },
            { name: 'ViXuLy', label: 'Chipset' },
            { name: 'ManHinh', label: 'Màn hình' },
            { name: 'ChuanKetNoi', label: 'Chuẩn kết nối' }
        ],
        Laptop: [
            { name: 'ViXuLy', label: 'Vi xử lý' },
            { name: 'CardDoHoa', label: 'Card đồ hoạ' },
            { name: 'RAM_ROM', label: 'RAM/ROM' },
            { name: 'Pin', label: 'Dung lượng pin' },
            { name: 'ManHinh', label: 'Màn hình' },
            { name: 'TrongLuong', label: 'Trọng lượng' },
            { name: 'HeDieuHanh', label: 'Hệ điều hành' }
        ],
        Tablet: [
            { name: 'Camera', label: 'Camera' },
            { name: 'PinSac', label: 'Dung lượng pin' },
            { name: 'RAM_ROM', label: 'RAM/ROM' },
            { name: 'ViXuLy', label: 'Vi xử lý' },
            { name: 'ManHinh', label: 'Màn hình' },
            { name: 'KetNoi', label: 'Kết nối' },
            { name: 'HoTroBut', label: 'Hỗ trơ bút' }
        ],
        Smartwatch: [
            { name: 'DuongKinhMatDongHo', label: 'Dường kính mặt đồng hồ' },
            { name: 'ManHinh', label: 'Màn hình' },
            { name: 'ChatLieuDay', label: 'Chất liệu dây' },
            { name: 'ThoiLuongPin', label: 'Thời lượng pin' },
            { name: 'ChongNuoc', label: 'Chống nước' },
            { name: 'TinhNangSucKhoe', label: 'Tính năng sức khoẻ' },
            { name: 'KetNoi', label: 'Kết nối' }
        ],
        PhuKien: []
    }

    useEffect(() => {
        fetchProductDetails();
        fetchManufacturers();
    }, [MaHangHoa]);

    const fetchProductDetails = async () => {
      setLoading(true);
      const response = await apiGetProductByFilter({hanghoa_id: MaHangHoa});
      
      
      if (response.success) {
          const product = response.data[0];
          setProductType(product.LoaiHangHoa);
          setFormData(product);
          if (product.LoaiHangHoa !== 'PhuKien') {
          const response2 = await apiGetProductDetail({LoaiHangHoa: product.LoaiHangHoa, MaHangHoa: MaHangHoa});
            if (response2.success) {
                setProductDetail(response2.data[0]);
            } else {
                Swal.fire({
                    title: 'Lỗi',
                    text: 'Không thể tải thông tin chi tiết của sản phẩm',
                    icon: 'error'
                });
            }
          }
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

    const handleInputDetailChange = (e) => {
        const { name, value } = e.target;
        setProductDetail(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewManufacturerChange = (e) => {
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
                    GiaMuaVao: Number(formData.GiaMuaVao),
                    GiaBanNiemYet: Number(formData.GiaBanNiemYet),
                    MaHangSanXuat: isAddingManufacturer? -1: Number(formData.MaHangSanXuat),
                    TenHangSanXuatMoi: isAddingManufacturer? formData.TenHangSanXuat: '',
                    DiaChiHangSanXuatMoi: isAddingManufacturer? formData.DiaChi: '',
                    TonKho: formData.TonKho ? Number(formData.TonKho) : 0,
            };

            const response = await apiUpdateProduct(updateData);

            if (response.success) {
                Swal.fire({
                    title: 'Thành công',
                    text: 'Cập nhật sản phẩm thành công',
                    icon: 'success'
                });
                // window.location.reload()
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
            <div className="space-y-6">
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

                    {/* Manufacturer */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold font-medium text-gray-700">
                            Nhà sản xuất
                        </label>
                        <select
                            value={formData.MaHangSanXuat}
                            onChange={(e) => {
                                if (e.target.value === '0') {
                                    // Show a modal to add new manufacturer
                                    setIsAddingManufacturer(true);
                                }
                                else{
                                    setIsAddingManufacturer(false);
                                    setFormData({...formData, MaHangSanXuat: e.target.value})
                                }
                            }}
                            className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Vui lòng chọn nhà sản xuất</option>
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
                                value={formData.TenHangSanXuat || '' }
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
                                value={formData.DiaChi || '' }
                                className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        )}
                    
                </div>


                {/* Specific Attributes */}
                {productType && specificAttributes[productType] && (
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
                                            value={productDetail[attr.name] || ''}
                                            onChange={handleInputDetailChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div className='flex flex-row justify-center gap-10 pt-4'>
                  <button
                      disabled={loading}
                      onClick={handleSubmit}
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
                        //   onClick={() => {
                        //     setFormData({});
                        //     handleSubmit();
                        //     fetchProductDetails();
                        //     setLoading(false);
                        // }}
                        onClick={() => setEditProduct(null)}
                          className="flex py-3 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                      >
                          Thoát
                  </button>
                </div>
                
            </div>
        </div>
    );
};

export default UpdateProduct;