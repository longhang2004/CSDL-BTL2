import React, { useState, useEffect } from 'react';
import { apiFetchProductByPage, apiFetchProductByName, apiDeleteProduct } from 'apis'
import Swal from 'sweetalert2';
import UpdateProduct from './UpdateProduct'

const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFiltering, setIsFiltering] = useState(false);
    const [filterTerm, setFilterTerm] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [productType, setProductType] = useState('');
    const [editProduct, setEditProduct] = useState(null);
    const [viewProduct, setViewProduct] = useState(null);

    // Base attributes that all products share
    const baseFilterAttributes = [
        { name: 'hanghoa_ten', label: 'Tên sản phẩm'},
        { name: 'tonkho_min', label: 'Tồn kho tối thiểu' },
        { name: 'tonkho_max', label: 'Tồn kho tối đa' },
        { name: 'giamua_min', label: 'Giá mua vào tối thiểu'},
        { name: 'giamua_max', label: 'Giá mua vào tối đa'},
        { name: 'giaban_min', label: 'Giá bán tối thiểu'},
        { name: 'giaban_max', label: 'Giá bán tối đa'},
        { name: 'hangsanxuat_ten', label: 'Hãng sản xuất' },
        { name: 'danhgia_min', label: 'Đánh giá tối thiểu' },
        { name: 'danhgia_max', label: 'Đánh giá tối đa' },
        { name: 'hangsanxuat_diachi', label: 'Xuất xứ' },
        { name: 'hanghoa_mota', label: 'Mô tả' }
    ];

    const sortAttributes = [
        { name: 'hh.hanghoa_ten', label: 'Tên sản phẩm'},
        { name: 'hh.tonkho_min', label: 'Tồn kho tối thiểu' },
        { name: 'hh.tonkho_max', label: 'Tồn kho tối đa' },
        { name: 'hh.giamua_min', label: 'Giá mua vào tối thiểu'},
        { name: 'hh.giamua_max', label: 'Giá mua vào tối đa'},
        { name: 'hh.giaban_min', label: 'Giá bán tối thiểu'},
        { name: 'hh.giaban_max', label: 'Giá bán tối đa'},
        { name: 'hsx.hangsanxuat_ten', label: 'Hãng sản xuất' },
        { name: 'hh.danhgia_min', label: 'Đánh giá tối thiểu' },
        { name: 'hh.danhgia_max', label: 'Đánh giá tối đa' },
        { name: 'hsx.hangsanxuat_diachi', label: 'Xuất xứ' },
        { name: 'hh.hanghoa_mota', label: 'Mô tả' }
    ];

    useEffect(() => {
        fetchProducts();
    // }, [currentPage, sortField, sortOrder]);
    },[]);

    const handleViewProduct = (MaHangHoa) => {
        setViewProduct(MaHangHoa) // Store only the ID
    };

    const handleEditProduct = (MaHangHoa) => {
        setEditProduct(MaHangHoa) // Store only the ID
    };

    const fetchProducts = async () => {
        setLoading(true);
        const response = await apiFetchProductByPage();
        if (response.success) {
            setProducts(response.data);
            setLoading(false);
        } 
    };

    // const handleSearch = async () => {
    //     if (searchTerm.trim()) {
    //         setLoading(true);
    //         const response = await apiFetchProductByName(searchTerm);
    //         if (response.success) {
    //             setProducts(response.productData);
    //         } 
    //         setLoading(false);
    //     } else {
    //         // If search term is empty, fetch all products
    //         fetchProducts();
    //     }
    // };

    const handleFilterInputChange = (e) => {
        const { name, value } = e.target;
        setFilterTerm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilter = async () => {
        if (isFiltering&&filterTerm) {
            setLoading(true);
            const response = await apiFetchProductByFilter({
                ...filterTerm,
                sort_by:sortField,
                sort_dir: sortOrder,
                hanghoa_loaihanghoa: productType
            });
            if (response.success) {
                setProducts(response.data);
            }
            setLoading(false);
        } else {
            // If filter term is empty, fetch all products
            fetchProducts();
        }
    };

    // const handleSubmitFilter = (e) => {
    //     e.preventDefault();
    //     handleFilter();
    // };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(1); // Reset to first page when searching
            handleSearch();
        }
    };

    const handleDeleteProduct = async (MaHangHoa) => {
        try {
            const result = await Swal.fire({
                title: 'Xác nhận xóa',
                text: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                const response = await apiDeleteProduct(MaHangHoa);
                
                if (response.success) {
                    Swal.fire({
                        title: 'Thành công',
                        text: 'Đã xóa sản phẩm thành công',
                        icon: 'success'
                    });

                    // Check if current page has only one product
                    fetchProducts();
                } else {
                    Swal.fire({
                        title: 'Lỗi',
                        text: 'Không thể xóa sản phẩm',
                        icon: 'error'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi',
                text: 'Đã xảy ra lỗi khi xóa sản phẩm',
                icon: 'error'
            });
        }
    };

    return (
        <div className="w-main flex relative flex-col py-10 container mx-auto p-6">
            {viewProduct && <div className='absolute inset-0 min-h-screen bg-white'>
                Xem chi tiết
                </div>
            }

            { editProduct && <div className='absolute inset-0 min-h-screen bg-white'>
                <UpdateProduct 
                    MaHangHoa={editProduct}
                    setEditProduct={setEditProduct}
                    />
                </div>
            }
            
            {/* Search Bar */}
            {/* <div className="mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full px-4 py-2 border-2 border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value);}}
                    onKeyDown={handleKeyDown}
                />
            </div> */}

            {/* Filter */}
            <div className="mb-6">
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => setIsFiltering(prev => !prev)}
                >
                    Lọc sản phẩm
                </button>
                {isFiltering && (
                <form onSubmit={handleFilter} className="mt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold font-medium text-gray-700">
                                Loại sản phẩm
                            </label>
                            <select
                                value={productType}
                                onChange={(e) => setProductType(e.target.value)}
                                className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Tất cả</option>
                                <option value="Laptop">Laptop</option>
                                <option value="DienThoai">Điện thoại</option>
                                <option value="Tablet">Tablet</option>
                                <option value="Smartwatch">Smartwatch</option>
                                <option value="PhuKien">Phụ kiện</option>
                            </select>
                        </div>
                        {baseFilterAttributes.map((attr) => (
                            <div key={attr.name} className="space-y-2">
                                <label 
                                    htmlFor={attr.name}
                                    className="block text-sm font-semibold font-medium text-gray-700"
                                >
                                    {attr.label}
                                </label>
                                <input
                                    id={attr.name}
                                    name={attr.name}
                                    required={attr.required}
                                    onChange={handleFilterInputChange}
                                    value={productData[attr.name] || ''}
                                    className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        ))}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold font-medium text-gray-700">
                                Sắp xếp theo
                            </label>
                            <select
                                value={productType}
                                onChange={(e) => setSortField(e.target.value)}
                                className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Vui lòng chọn trường sắp xếp</option>
                                {sortAttributes.map((field) => (
                                    <option key={field.name} value={field.name}>
                                        {field.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold font-medium text-gray-700">
                                Thứ tự sắp xếp
                            </label>
                            <select
                                value={productType}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full px-3 py-2 border border-sky-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Vui lòng chọn thứ tự sắp xếp</option>
                                <option value="ASC">Tăng dần</option>
                                <option value="DESC">Giảm dần</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isFiltering}
                        className={`w-full py-3 px-4 rounded-md transition-colors duration-200 
                            ${isFiltering 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            } text-white`}
                    >
                        {isFiltering ? 'Đang xử lý...' : 'Thêm sản phẩm'}
                    </button>
                </form>)}
                
                {/* {isFiltering && (
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center space-x-4">
                            <label htmlFor="manufacturer">Hãng sản xuất:</label>
                            <select
                                id="manufacturer"
                                className="px-3 py-1 border border-gray-300 rounded"

                            >
                                <option value="">Tất cả</option>
                                <option value="Apple">Apple</option>
                                <option value="Samsung">Samsung</option>
                                <option value="Xiaomi">Xiaomi</option>
                                <option value="Oppo">Oppo</option>
                                <option value="Vivo">Vivo</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-4">
                            <label htmlFor="price">Giá:</label> */}
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-sky-800 text-white">
                            <th className="px-6 py-3 text-left">STT</th>
                            <th className="px-6 py-3 text-left">Tên sản phẩm</th>
                            <th className="px-6 py-3 text-right">Giá mua vào</th>
                            <th className="px-6 py-3 text-right">Giá bán niêm yết</th>
                            <th className="px-6 py-3 text-center">Tồn kho</th>
                            <th className="px-6 py-3 text-center">Đánh giá</th>
                            <th className="px-6 py-3 text-center">Hãng sản xuất</th>
                            <th className="px-6 py-3 text-center">Xem chi tiết</th>
                            <th className="px-6 py-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="9" className="px-6 py-4 text-center">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="px-6 py-4 text-center">
                                    Không tìm thấy sản phẩm
                                </td>
                            </tr>
                        ) : (
                            products.map((product, index) => (
                                <tr key={product.MaHangHoa} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {index + 1}
                                    </td>
                                    {/* <td className="px-6 py-4">
                                        <img
                                            src={product.imageLink || '/placeholder-image.jpg'}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    </td> */}
                                    <td className="px-6 py-4 font-medium">{product.Ten}</td>
                                    {/* <td className="px-6 py-4 capitalize">{product.__t || 'product'}</td> */}
                                    <td className="px-6 py-4 text-right">
                                        {new Intl.NumberFormat('vi-VN', { 
                                            style: 'currency', 
                                            currency: 'VND' 
                                        }).format(product.GiaMuaVao)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {new Intl.NumberFormat('vi-VN', { 
                                            style: 'currency', 
                                            currency: 'VND' 
                                        }).format(product.GiaBanNiemYet)}
                                    </td>
                                    <td className="px-6 py-4 text-center">{product.TonKho}</td>
                                    <td className="px-6 py-4 text-center">{product.SoSaoDanhGia}</td>
                                    {/* <td className="px-6 py-4 text-center whitespace-nowrap">
                                        {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                                    </td> */}
                                    <td className="px-6 py-4 text-center">{product["hsx.TenHangSanXuat"]}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                            onClick={() => {handleViewProduct(product.MaHangHoa)}}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                                onClick={() => {handleEditProduct(product.MaHangHoa)}}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                                onClick={() => {handleDeleteProduct(product.MaHangHoa);}}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {/* <div className="mt-6 flex justify-center space-x-2">
                <button
                    className={`px-4 py-2 rounded transition-colors ${
                        currentPage === 1 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Trang trước
                </button>
                <span className="px-4 py-2">
                    Trang {currentPage}
                </span>
                <button
                    className={`px-4 py-2 rounded transition-colors ${
                        products.length < pageSize
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={products.length < pageSize}
                >
                    Trang sau
                </button>
            </div> */}
        </div>
    );
};

export default ManageProduct;