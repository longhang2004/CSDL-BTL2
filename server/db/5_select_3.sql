-- 1. Xem tất cả người dùng và phân loại của họ
SELECT 
    ND.MaNguoiDung,
    ND.Ho,
    ND.Ten,
    ND.email,
    ND.LoaiNguoiDung,
    KH.CapBac
FROM NguoiDung ND
LEFT JOIN KhachHang KH ON ND.MaNguoiDung = KH.MaNguoiDung
ORDER BY ND.MaNguoiDung;

-- 2. Xem thông tin chi tiết các sản phẩm điện thoại
SELECT 
    HH.MaHangHoa,
    HSX.TenHangSanXuat,
    HH.Ten,
    HH.GiaBanNiemYet,
    HH.TonKho,
    DT.ViXuLy,
    DT.RAM_ROM,
    DT.Camera
FROM HangHoa HH
JOIN HangSanXuat HSX ON HH.MaHangSanXuat = HSX.MaHangSanXuat
JOIN DienThoai DT ON HH.MaHangHoa = DT.MaHangHoa;

-- 3. Xem tất cả đơn hàng và chi tiết
SELECT 
    DH.MaDonHang,
    ND.HoTen as TenKhachHang,
    HH.Ten as TenSanPham,
    CTDH.SoLuong,
    DH.TongGiaTriDonHang,
    DH.TrangThaiThanhToan,
    DH.TrangThaiDonHang,
    DH.ThoiGianDatHang
FROM DonHang DH
JOIN ChiTietDonHang CTDH ON DH.MaDonHang = CTDH.MaDonHang
JOIN HangHoa HH ON CTDH.MaHangHoa = HH.MaHangHoa
JOIN KhachHang KH ON DH.MaKhachHang = KH.MaNguoiDung
JOIN NguoiDung ND ON KH.MaNguoiDung = ND.MaNguoiDung
ORDER BY DH.ThoiGianDatHang DESC;

-- 4. Xem đánh giá sản phẩm
SELECT 
    HH.Ten as TenSanPham,
    ND.HoTen as NguoiDanhGia,
    DSP.SoSao,
    DSP.NoiDung,
    DSP.Anh_Video
FROM DanhGiaSanPham DSP
JOIN HangHoa HH ON DSP.MaHangHoa = HH.MaHangHoa
JOIN KhachHang KH ON DSP.MaKhachHang = KH.MaNguoiDung
JOIN NguoiDung ND ON KH.MaNguoiDung = ND.MaNguoiDung;

-- 5. Xem giỏ hàng của khách hàng
SELECT 
    ND.HoTen as TenKhachHang,
    HH.Ten as TenSanPham,
    GH.SoLuong,
    HH.GiaBanNiemYet,
    (GH.SoLuong * HH.GiaBanNiemYet) as ThanhTien
FROM GioHang GH
JOIN HangHoa HH ON GH.MaHangHoa = HH.MaHangHoa
JOIN NguoiDung ND ON GH.MaNguoiDung = ND.MaNguoiDung;

-- 6. Xem voucher còn hiệu lực
SELECT *
FROM Voucher
WHERE NgayKetThuc >= GETDATE()
AND SoLuong > 0;

-- 7. Xem lịch sử thay đổi sản phẩm
SELECT 
    ND.HoTen as NguoiThayDoi,
    HH.Ten as TenSanPham,
    LS.NgayGioThayDoi,
    LS.GiaCu,
    LS.GiaMoi,
    LS.MoTaCu,
    LS.MoTaMoi
FROM LichSuThayDoi LS
JOIN HangHoa HH ON LS.MaHangHoa = HH.MaHangHoa
JOIN NguoiDung ND ON LS.MaNguoiDung = ND.MaNguoiDung
ORDER BY LS.NgayGioThayDoi DESC;

-- 8. Xem tin nhắn giữa admin và khách hàng
SELECT 
    Admin.HoTen as TenAdmin,
    KH.HoTen as TenKhachHang,
    TN.NoiDung,
    TN.ThoiGian
FROM TinNhan TN
JOIN NguoiDung Admin ON TN.MaAdmin = Admin.MaNguoiDung
JOIN NguoiDung KH ON TN.MaKhachHang = KH.MaNguoiDung
ORDER BY TN.ThoiGian DESC;

-- 9. Thống kê số lượng đơn hàng theo trạng thái
SELECT 
    TrangThaiDonHang,
    COUNT(*) as SoLuongDon,
    SUM(TongGiaTriDonHang) as TongGiaTri
FROM DonHang
GROUP BY TrangThaiDonHang;

-- 10. Xem top 5 sản phẩm bán chạy nhất
SELECT 
    HH.Ten,
    SUM(CTDH.SoLuong) as TongSoLuongBan,
    COUNT(DISTINCT DH.MaDonHang) as SoDonHang
FROM HangHoa HH
JOIN ChiTietDonHang CTDH ON HH.MaHangHoa = CTDH.MaHangHoa
JOIN DonHang DH ON CTDH.MaDonHang = DH.MaDonHang
GROUP BY HH.MaHangHoa, HH.Ten
ORDER BY TongSoLuongBan DESC
OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY;