import React, { useState, useEffect } from 'react';
import { apiFetchProductByPage, apiFetchProductByName, apiDeleteProduct } from 'apis'
import Swal from 'sweetalert2';
import UpdateProduct from './UpdateProduct'

const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('updatedAt');
    const [sortOrder, setSortOrder] = useState('descend');
    const [editProduct, setEditProduct] = useState(null);

    const pageSize = 10;

    useEffect(() => {
        fetchProducts();
    }, [currentPage, sortField, sortOrder]);

    const handleEditProduct = (productId) => {
        setEditProduct(productId) // Store only the ID
    };

    const fetchProducts = async () => {
        setLoading(true);
        const response = await apiFetchProductByPage('all', currentPage, sortField, sortOrder, pageSize);
        if (response.success) {
            setProducts(response.productData);
            setLoading(false);
        } 
    };

    const handleSearch = async () => {
        if (searchTerm.trim()) {
            setLoading(true);
            const response = await apiFetchProductByName(searchTerm);
            if (response.success) {
                setProducts(response.productData);
            } 
            setLoading(false);
        } else {
            // If search term is empty, fetch all products
            fetchProducts();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setCurrentPage(1); // Reset to first page when searching
            handleSearch();
        }
    };

    const handleDeleteProduct = async (productId) => {
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
                const response = await apiDeleteProduct(productId);
                
                if (response.success) {
                    Swal.fire({
                        title: 'Thành công',
                        text: 'Đã xóa sản phẩm thành công',
                        icon: 'success'
                    });

                    // Check if current page has only one product
                    if (products.length === 1 && currentPage > 1) {
                        setCurrentPage(prev => prev - 1);
                    } else {
                        fetchProducts();
                    }
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
          { editProduct && <div className='absolute inset-0 min-h-screen bg-white'>
              <UpdateProduct 
                productId={editProduct}
                setEditProduct={setEditProduct}
                />
            </div>
          }
            
            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full px-4 py-2 border-2 border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value);}}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-sky-800 text-white">
                            <th className="px-6 py-3 text-left">STT</th>
                            <th className="px-6 py-3 text-left">Hình ảnh</th>
                            <th className="px-6 py-3 text-left">Tên sản phẩm</th>
                            <th className="px-6 py-3 text-left">Loại</th>
                            <th className="px-6 py-3 text-right">Giá</th>
                            <th className="px-6 py-3 text-center">Tồn kho</th>
                            <th className="px-6 py-3 text-center">Đánh giá</th>
                            <th className="px-6 py-3 text-center">Cập nhật</th>
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
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {(currentPage - 1) * pageSize + index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <img
                                            src={product.imageLink || '/placeholder-image.jpg'}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium">{product.name}</td>
                                    <td className="px-6 py-4 capitalize">{product.__t || 'product'}</td>
                                    <td className="px-6 py-4 text-right">
                                        {new Intl.NumberFormat('vi-VN', { 
                                            style: 'currency', 
                                            currency: 'VND' 
                                        }).format(product.price)}
                                    </td>
                                    <td className="px-6 py-4 text-center">{product.stock}</td>
                                    <td className="px-6 py-4 text-center">{product.rating}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                                onClick={() => {handleEditProduct(product._id)}}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                                onClick={() => {handleDeleteProduct(product._id);}}
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
            <div className="mt-6 flex justify-center space-x-2">
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
            </div>
        </div>
    );
};

export default ManageProduct;