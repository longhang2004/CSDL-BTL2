-- Insert dữ liệu vào bảng NguoiDung
INSERT INTO NguoiDung (Ten, Ho, email, sdt, diaChi, LoaiNguoiDung, matkhau)
VALUES 
    (N'Minh', N'Nguyễn', 'admin1@gmail.com', '0901234567', N'Hà Nội', 'Admin', '123456'),
    (N'Hương', N'Trần', 'admin2@gmail.com', '0901234568', N'TP.HCM', 'Admin', '123456'),
    (N'Nam', N'Lê', 'customer1@gmail.com', '0901234569', N'Đà Nẵng', 'KhachHang', '123456'),
    (N'Lan', N'Phạm', 'customer2@gmail.com', '0901234570', N'Hải Phòng', 'KhachHang', '123456'),
    (N'Tuấn', N'Hoàng', 'customer3@gmail.com', '0901234571', N'Cần Thơ', 'KhachHang', '123456');

-- Insert dữ liệu vào bảng Admin
INSERT INTO Admin (MaNguoiDung)
VALUES 
    (1),
    (2);

-- Insert dữ liệu vào bảng KhachHang
INSERT INTO KhachHang (MaNguoiDung, CapBac)
VALUES 
    (3, N'Thành viên Bạc'),
    (4, N'Thành viên Vàng'),
    (5, N'Thành viên mới');

-- Insert dữ liệu vào bảng HangSanXuat
INSERT INTO HangSanXuat (TenHangSanXuat, DiaChi)
VALUES 
    ('Apple', 'California, USA'),
    ('Samsung', 'Seoul, Korea'),
    ('Xiaomi', 'Beijing, China'),
    ('OPPO', 'Guangdong, China'),
    ('Vivo', 'Dongguan, China');

-- Insert dữ liệu vào bảng HangHoa
INSERT INTO HangHoa (MaHangSanXuat, Ten, GiaMuaVao, GiaBanNiemYet, TonKho, MoTa, SoSaoDanhGia, LoaiHangHoa)
VALUES 
    (1, 'iPhone 14 Pro Max', 25000000, 29990000, 50, N'iPhone 14 Pro Max - Flagship mới nhất từ Apple', 4.8, N'DienThoai'),
    (2, 'Samsung Galaxy S23 Ultra', 23000000, 26990000, 45, N'Samsung Galaxy S23 Ultra với bút S-Pen', 4.7, N'DienThoai'),
    (1, 'iPhone 13', 15000000, 17990000, 30, N'iPhone 13 - Hiệu năng ổn định', 4.6, N'DienThoai'),
    (3, 'Xiaomi 13 Pro', 18000000, 21990000, 40, N'Xiaomi 13 Pro - Camera Leica', 4.5, N'DienThoai'),
    (4, 'OPPO Find X5 Pro', 19000000, 22990000, 35, N'OPPO Find X5 Pro - Thiết kế độc đáo', 4.4, N'DienThoai');

-- Insert dữ liệu vào bảng DienThoai
INSERT INTO DienThoai (MaHangHoa, ViXuLy, ManHinh, RAM_ROM, Camera, PinSac, ChuanKetNoi)
VALUES 
    (1, 'Apple A16 Bionic', 'OLED 6.7 inch', '6GB/256GB', '48MP + 12MP + 12MP', '4323mAh, 20W', '5G, Wifi 6'),
    (2, 'Snapdragon 8 Gen 2', 'Dynamic AMOLED 6.8 inch', '12GB/256GB', '200MP + 12MP + 10MP + 10MP', '5000mAh, 45W', '5G, Wifi 6E'),
    (3, 'Apple A15 Bionic', 'OLED 6.1 inch', '4GB/128GB', '12MP + 12MP', '3240mAh, 20W', '5G, Wifi 6'),
    (4, 'Snapdragon 8 Gen 2', 'AMOLED 6.73 inch', '12GB/256GB', '50MP + 50MP + 50MP', '4820mAh, 120W', '5G, Wifi 6'),
    (5, 'Snapdragon 8 Gen 1', 'AMOLED 6.7 inch', '12GB/256GB', '50MP + 50MP + 13MP', '5000mAh, 80W', '5G, Wifi 6');

-- Insert dữ liệu vào bảng DangTaiHangHoa
INSERT INTO DangTaiHangHoa (MaAdmin, MaHangHoa, SoLuong, ThoiGian)
VALUES 
    (1, 1, 50, GETDATE()),
    (1, 2, 45, GETDATE()),
    (2, 3, 30, GETDATE()),
    (2, 4, 40, GETDATE()),
    (1, 5, 35, GETDATE());

-- Insert dữ liệu vào bảng Voucher
INSERT INTO Voucher (PhanTramGiam, NgayBatDau, NgayKetThuc, SoLuong, TenMaGiam, DieuKienApDung)
VALUES 
    (10.00, '2024-03-01', '2024-03-31', 100, N'Giảm 10% Tháng 3', N'Đơn hàng từ 5 triệu'),
    (15.00, '2024-03-01', '2024-03-15', 50, N'Giảm 15% Đầu tháng', N'Đơn hàng từ 10 triệu'),
    (20.00, '2024-03-08', '2024-03-08', 30, N'Giảm 20% 8/3', N'Đơn hàng từ 15 triệu');

-- Insert dữ liệu vào bảng DonHang
INSERT INTO DonHang (MaKhachHang, TongGiaTriDonHang, TrangThaiThanhToan, HinhThucThanhToan, DiaChiGiaoHang, TrangThaiDonHang)
VALUES 
    (3, 29990000, N'Đã thanh toán', N'Chuyển khoản', N'123 Đường ABC, Đà Nẵng', N'Đang giao'),
    (4, 26990000, N'Đã thanh toán', N'Thẻ tín dụng', N'456 Đường XYZ, Hải Phòng', N'Đã giao'),
    (5, 17990000, N'Chưa thanh toán', N'COD', N'789 Đường DEF, Cần Thơ', N'Đang xử lý');

-- Insert dữ liệu vào bảng ChiTietDonHang
INSERT INTO ChiTietDonHang (MaDonHang, MaHangHoa, SoLuong)
VALUES 
    ('DH00001', 1, 1),
    ('DH00002', 2, 1),
    ('DH00003', 3, 1);

-- Insert dữ liệu vào bảng GioHang
INSERT INTO GioHang (MaNguoiDung, MaHangHoa, SoLuong)
VALUES 
    (3, 4, 1),
    (4, 5, 1),
    (5, 1, 1);

-- Insert dữ liệu vào bảng DanhGiaSanPham
INSERT INTO DanhGiaSanPham (MaDonHang, MaKhachHang, MaHangHoa, NoiDung, SoSao)
VALUES 
    ('DH00002', 4, 2, N'Sản phẩm rất tốt, đóng gói cẩn thận', 5),
    ('DH00001', 3, 1, N'Chất lượng sản phẩm tuyệt vời', 5),
    ('DH00003', 5, 3, N'Giao hàng nhanh, sản phẩm đúng mô tả', 4);

-- Insert dữ liệu vào bảng TinNhan
INSERT INTO TinNhan (MaAdmin, MaKhachHang, NoiDung)
VALUES 
    (1, 3, N'Chào bạn, tôi có thể giúp gì cho bạn?'),
    (2, 4, N'Đơn hàng của bạn đã được xử lý'),
    (1, 5, N'Cảm ơn bạn đã mua hàng');

-- Insert dữ liệu vào bảng SuDungVoucher
INSERT INTO SuDungVoucher (MaDonHang, MaVoucher)
VALUES 
    ('DH00001', 1),
    ('DH00002', 2),
    ('DH00003', 3);

-- Insert dữ liệu vào bảng LichSuThayDoi
INSERT INTO LichSuThayDoi (MaHangHoa, MaNguoiDung, Ten, MoTaCu, MoTaMoi, GiaCu, GiaMoi)
VALUES 
    (1, 1, 'iPhone 14 Pro Max', N'iPhone 14 Pro Max phiên bản cũ', N'iPhone 14 Pro Max - Flagship mới nhất từ Apple', 28990000, 29990000),
    (2, 2, 'Samsung Galaxy S23 Ultra', N'Samsung Galaxy S23 Ultra phiên bản cũ', N'Samsung Galaxy S23 Ultra với bút S-Pen', 25990000, 26990000),
    (3, 1, 'iPhone 13', N'iPhone 13 phiên bản cũ', N'iPhone 13 - Hiệu năng ổn định', 16990000, 17990000);