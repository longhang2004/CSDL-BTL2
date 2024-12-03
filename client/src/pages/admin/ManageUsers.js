import React, { useState, useEffect } from 'react'
import { apiGetAllUsers, apiDeleteUser, apiUpdateUser } from 'apis'
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const pageSize = 2;
    const roleMap = {
      admin: 'Quản trị viên',
      user: 'Người dùng'
    }
    const fetchUsers = async () => {
        setLoading(true);
        const response = await apiGetAllUsers(currentPage, pageSize);
        if (response.success) {
            setUsers(response.data.users);
            setTotalPages(Math.ceil(response.data.totalUsers / pageSize));
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const handleDelete = async (userId) => {
        try {
            const result = await Swal.fire({
                title: 'Xác nhận xóa',
                text: 'Bạn có chắc chắn muốn xóa người dùng này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                const response = await apiDeleteUser(userId);
                if (response.success) {
                    Swal.fire('Thành công', 'Đã xóa người dùng', 'success');
                    fetchUsers();
                }
            }
        } catch (error) {
            Swal.fire('Lỗi', 'Không thể xóa người dùng', 'error');
        }
    };

    const handleUpdate = async (userId) => {
        const currentUser = users.find(user => user._id === userId);
        
        const { value: formValues } = await Swal.fire({
            title: 'Cập nhật thông tin người dùng',
            html: `
                <div class="space-y-4">
                    <div class="flex gap-4">
                        <div class="text-left flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                            <input id="lastname" class="w-full px-3 py-2 border rounded-md" value="${currentUser.lastname}">
                        </div>
                        <div class="text-left flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                            <input id="firstname" class="w-full px-3 py-2 border rounded-md" value="${currentUser.firstname}">
                        </div>
                    </div>
                    <div class="text-left">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input id="email" type="email" class="w-full px-3 py-2 border rounded-md" value="${currentUser.email}">
                    </div>
                    <div class="text-left">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <input id="mobile" class="w-full px-3 py-2 border rounded-md" value="${currentUser.mobile}">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Hủy',
            preConfirm: () => {
                return {
                    firstname: document.getElementById('firstname').value,
                    lastname: document.getElementById('lastname').value,
                    email: document.getElementById('email').value,
                    mobile: document.getElementById('mobile').value
                }
            }
        });

        if (formValues) {
            try {
                const response = await apiUpdateUser(userId, formValues);
                if (response.success) {
                    Swal.fire('Thành công', 'Đã cập nhật thông tin người dùng', 'success');
                    fetchUsers();
                }
            } catch (error) {
                Swal.fire('Lỗi', 'Không thể cập nhật thông tin người dùng', 'error');
            }
        }
    };

    const handleRoleChange = async (userId, newRole, currentRole) => {
      try {
          const result = await Swal.fire({
              title: 'Xác nhận thay đổi',
              text: `Bạn có chắc chắn muốn thay đổi vai trò người dùng từ "${currentRole}" thành "${newRole}"?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Xác nhận',
              cancelButtonText: 'Hủy'
          });
  
          if (result.isConfirmed) {
              const response = await apiUpdateUser(userId, { role: newRole });
              if (response.success) {
                  await Swal.fire({
                      title: 'Thành công',
                      text: 'Đã cập nhật vai trò người dùng',
                      icon: 'success'
                  });
                  fetchUsers();
              }
          }
      } catch (error) {
          Swal.fire({
              title: 'Lỗi',
              text: 'Không thể cập nhật vai trò người dùng',
              icon: 'error'
          });
      }
  };
    return (
        <div className="w-main flex relative flex-col py-10 container mx-auto p-6">
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full table-auto">
                    <thead className="bg-sky-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">STT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Thông tin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Vai trò</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Ngày tạo</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">Đang tải...</td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {(currentPage - 1) * pageSize + index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{`${user.lastname} ${user.firstname}`}</div>
                                        <div className="text-sm">{user.email}</div>
                                        <div className="text-sm">{user.mobile}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                    <div className="text-sm">{user.LoaiNguoiDung}</div>
                                        {/* <select
                                          value={user.role}
                                          onChange={(e) => handleRoleChange(user._id, e.target.value, user.role)}
                                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                                              user.role === 'admin' 
                                                  ? 'bg-orange-200 text-orange-800' 
                                                  : 'bg-green-100 text-green-800'
                                          }`}
                                        >
                                          <option value="user">Người dùng</option>
                                          <option value="admin">Quản trị viên</option>
                                        </select> */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col space-y-2">
                                            <button
                                                onClick={() => handleUpdate(user._id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
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
                    className={`px-4 py-2 rounded ${
                        currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Trang trước
                </button>
                <span className="px-4 py-2">
                    Trang {currentPage} / {totalPages}
                </span>
                <button
                    className={`px-4 py-2 rounded ${
                        currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Trang sau
                </button>
            </div> */}
        </div>
    );
};

export default ManageUsers;