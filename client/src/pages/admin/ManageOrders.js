import React, { useState, useEffect } from 'react';
import { apiGetOrders } from '../../apis';
import Swal from 'sweetalert2';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // const pageSize = 10;

    // const statusColors = {
    //     'Processing': 'bg-yellow-100 text-yellow-800',
    //     'Delivering': 'bg-purple-100 text-purple-800',
    //     'Delivered': 'bg-green-100 text-green-800',
    //     'Cancelled': 'bg-red-100 text-red-800'
    // };
    // const statusMap = {
    //     Processing: 'Đang xử lý',
    //     Delivering: 'Đang giao hàng',
    //     Delivered: 'Đã giao hàng thành công',
    //     Cancelled: 'Đã hủy',
    //   };
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const response = await apiGetOrders();
        console.log(response);

        if (response.success) {
            setOrders(response.data);
        }
        setLoading(false);
    };

    // const handleStatusChange = async (orderId, newStatus) => {
    //     try {
    //         const result = await Swal.fire({
    //             title: 'Xác nhận thay đổi',
    //             text: `Bạn có chắc chắn muốn chuyển trạng thái đơn hàng sang "${newStatus}"?`,
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: 'Xác nhận',
    //             cancelButtonText: 'Hủy'
    //         });

    //         if (result.isConfirmed) {
    //             const response = await apiUpdateOrder(orderId, {status: newStatus});
    //             if (response.success) {
    //                 Swal.fire({
    //                     title: 'Thành công',
    //                     text: 'Cập nhật trạng thái đơn hàng thành công',
    //                     icon: 'success'
    //                 });
    //                 fetchOrders();
    //             }
    //         }
    //     } catch (error) {
    //         Swal.fire({
    //             title: 'Lỗi',
    //             text: 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng',
    //             icon: 'error'
    //         });
    //     }
    // };
    
    
    // const handleKeyDown = (e) => {
    //     if (e.key === 'Enter') {
    //         handleSearch();
    //     }
    // };

    return (
        <div className="w-main flex relative flex-col py-10 container mx-auto p-6">
            {/* Search Bar */}
            {/* <div className="mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng..."
                    className="w-full px-4 py-2 border-2 border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div> */}

            {/* Orders Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-sky-800 text-white">
                            <th className="px-4 py-3 text-center">Mã đơn hàng</th>
                            {/* <th className="px-4 py-3 text-left">Khách hàng</th> */}
                            <th className="px-6 py-3 text-center">Tên khách hàng</th>
                            <th className="px-6 py-3 text-center">Tổng tiền</th>
                            <th className="px-6 py-3 text-center">Trạng thái</th>
                            <th className="px-6 py-3 text-center">Phương thức thanh toán</th>
                            <th className="px-6 py-3 text-center">Trạng thái thanh toán</th>
                            <th className="px-6 py-3 text-center">Ngày đặt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-center">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-center">
                                    Không tìm thấy đơn hàng
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 font-medium text-center">
                                        {order.MaDonHang}
                                    </td>
                                    {/* <td className="px-4 py-4">
                                        <div>{order.name}</div>
                                        <div className="text-sm text-gray-500">{order.email}</div>
                                    </td> */}
                                    <td className="px-6 py-4 text-center font-medium">
                                        {order['kh.Ho'] + ' ' + order['kh.Ten']}
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(order.TongGiaTriDonHang)}
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium">
                                        {/* <select
                                            value={order.status}
                                            onChange={e => handleStatusChange(order._id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                                        >
                                            {['Processing', 'Delivering', 'Delivered', 'Cancelled'].map((status) => (
                                                <option 
                                                    key={status} 
                                                    value={status}
                                                    className='text-sm font-medium'
                                                >
                                                        {statusMap[status]}
                                                </option>
                                            ))}
                                        </select> */}
                                        {order.TrangThaiDonHang}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-center">
                                            <span>
                                                {order.HinhThucThanhToan}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {order.TrangThaiThanhToan}
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        {new Date(order.ThoiGianDatHang).toLocaleDateString('vi-VN')}
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
                    Trang {currentPage} của {totalPages}
                </span>
                <button
                    className={`px-4 py-2 rounded transition-colors ${
                        orders.length < pageSize
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={orders.length < pageSize}
                >
                    Trang sau
                </button>
            </div> */}
        </div>
    );
};

export default ManageOrders;