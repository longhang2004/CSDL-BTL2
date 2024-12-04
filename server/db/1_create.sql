--CREATE DATABASE QuanLyDonHang;
--USE QuanLyDonHang;

-- Bảng Người dùng (thực thể cha)
CREATE TABLE NguoiDung (
    MaNguoiDung INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    Ten NVARCHAR(100) NOT NULL,
    Ho NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Sdt NVARCHAR(15),
    DiaChi NVARCHAR(255),
    LoaiNguoiDung NVARCHAR(50) NOT NULL, -- 'Admin' hoặc 'KhachHang' để phân biệt
    MatKhau NVARCHAR(100) NOT NULL
);

-- Bảng Admin kế thừa từ Người dùng
CREATE TABLE Admin (
    MaNguoiDung INT PRIMARY KEY NOT NULL,
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung)
);

-- Bảng Khách hàng kế thừa từ Người dùng
CREATE TABLE KhachHang (
    MaNguoiDung INT PRIMARY KEY NOT NULL,
    CapBac NVARCHAR(50) DEFAULT N'Thành viên mới', -- Cấp bậc thành viên
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung)
);

-- Bảng Đơn hàng
CREATE TABLE DonHang (
    MaDonHang INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaKhachHang INT NOT NULL,
    TongGiaTriDonHang DECIMAL(18, 2) NOT NULL DEFAULT 0,
    TrangThaiThanhToan NVARCHAR(50) NOT NULL DEFAULT N'Chưa thanh toán',
    HinhThucThanhToan NVARCHAR(50),
    DiaChiGiaoHang NVARCHAR(255) NOT NULL,
    ThoiGianDatHang DATETIME NOT NULL DEFAULT GETDATE(),
    TrangThaiDonHang NVARCHAR(50) NOT NULL DEFAULT N'Đang xử lý',
    FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaNguoiDung)
);

-- Bảng Tin nhắn
CREATE TABLE TinNhan (
    MaTinNhan INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaAdmin INT NOT NULL,
    MaKhachHang INT NOT NULL,
    NoiDung NVARCHAR(1000) NOT NULL,
    ThoiGian DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (MaAdmin) REFERENCES Admin(MaNguoiDung),
    FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaNguoiDung)
);

CREATE TABLE HangSanXuat (
    MaHangSanXuat INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    TenHangSanXuat NVARCHAR(100) NOT NULL,
    DiaChi NVARCHAR(255)
);

CREATE TABLE HangHoa (
    MaHangHoa INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaHangSanXuat INT NOT NULL,
    Ten NVARCHAR(100) NOT NULL,
    GiaMuaVao DECIMAL(18, 2) NOT NULL,
    GiaBanNiemYet DECIMAL(18, 2) NOT NULL,
    TonKho INT NOT NULL DEFAULT 0,
    MoTa NVARCHAR(1000),
    SoSaoDanhGia DECIMAL(2, 1) DEFAULT 0,
    FOREIGN KEY (MaHangSanXuat) REFERENCES HangSanXuat(MaHangSanXuat)
);

-- Bảng Đăng tải Hàng hóa
CREATE TABLE DangTaiHangHoa (
    MaDangTai INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaAdmin INT NOT NULL,
    MaHangHoa INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 0,
    ThoiGian DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (MaAdmin) REFERENCES Admin(MaNguoiDung),
    FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa)
);

CREATE TABLE DienThoai (
    MaThongTin INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaHangHoa INT NOT NULL,
    ViXuLy NVARCHAR(100),
    ManHinh NVARCHAR(100),
    RAM_ROM NVARCHAR(50),
    Camera NVARCHAR(100),
    PinSac NVARCHAR(100),
    ChuanKetNoi NVARCHAR(100),
    FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa)
);

-- Bảng Lịch sử thay đổi
CREATE TABLE LichSuThayDoi (
    MaLichSu INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaHangHoa INT NOT NULL,
    MaNguoiDung INT NOT NULL,
    Ten NVARCHAR(100) NOT NULL,
    NgayGioThayDoi DATETIME NOT NULL DEFAULT GETDATE(),
    MoTaCu NVARCHAR(1000),
    MoTaMoi NVARCHAR(1000),
    GiaCu DECIMAL(18, 2),
    GiaMoi DECIMAL(18, 2),
    FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa),
    FOREIGN KEY (MaNguoiDung) REFERENCES Admin(MaNguoiDung)
);

-- Bảng Đánh giá Sản phẩm
CREATE TABLE DanhGiaSanPham (
    MaDanhGia INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaDonHang INT NOT NULL,
    MaKhachHang INT NOT NULL,
    MaHangHoa INT NOT NULL,
    NoiDung NVARCHAR(1000),
    SoSao DECIMAL(2, 1) NOT NULL DEFAULT 5,
    Anh_Video NVARCHAR(255),
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaNguoiDung),
    FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa)
);

CREATE TABLE Voucher (
    MaVoucher INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    PhanTramGiam DECIMAL(4, 2) NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    SoLuong INT NOT NULL DEFAULT 0,
    TenMaGiam NVARCHAR(100) NOT NULL,
    DieuKienApDung NVARCHAR(30)
);

-- Bảng Sử dụng Voucher
CREATE TABLE SuDungVoucher (
    MaSuDung INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaDonHang INT NOT NULL,
    MaVoucher INT NOT NULL,
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    FOREIGN KEY (MaVoucher) REFERENCES Voucher(MaVoucher)
);

-- Bảng Giỏ hàng
CREATE TABLE GioHang (
    MaGioHang INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaNguoiDung INT NOT NULL,
    MaHangHoa INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 1,
    FOREIGN KEY (MaNguoiDung) REFERENCES KhachHang(MaNguoiDung),
    FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa)
);

-- Bảng Chi tiết Đơn hàng
CREATE TABLE ChiTietDonHang (
    MaChiTiet INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaDonHang INT NOT NULL,
    MaHangHoa INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 1,
    FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang),
    FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa)
);