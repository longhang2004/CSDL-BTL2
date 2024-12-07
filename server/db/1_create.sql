--CREATE DATABASE QuanLyDonHang;
--USE QuanLyDonHang;

-- Bảng Người dùng (thực thể cha)
CREATE TABLE NguoiDung (
    MaNguoiDung INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    Ten NVARCHAR(100) NOT NULL,
    Ho NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Sdt NVARCHAR(15),
    DiaChi NVARCHAR(255),
    LoaiNguoiDung NVARCHAR(50) NOT NULL, -- 'Admin' hoặc 'KhachHang' để phân biệt
    MatKhau NVARCHAR(100) NOT NULL
);

-- Bảng Admin kế thừa từ Người dùng
CREATE TABLE Admin (
    MaNguoiDung INT PRIMARY KEY NOT NULL,
    CONSTRAINT fk_Admin_User FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE
);

-- Bảng Khách hàng kế thừa từ Người dùng
CREATE TABLE KhachHang (
    MaNguoiDung INT PRIMARY KEY NOT NULL,
    CapBac NVARCHAR(50) DEFAULT N'Thành viên mới', -- Cấp bậc thành viên
    CONSTRAINT fk_KhachHang_User FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE
);

-- Bảng Đơn hàng
CREATE TABLE DonHang (
    ID INT IDENTITY(1,1) NOT NULL,
    MaDonHang AS 'DH' + RIGHT('00000' + CAST(ID AS VARCHAR(5)), 5) PERSISTED PRIMARY KEY,
    MaKhachHang INT NOT NULL,
    TongGiaTriDonHang DECIMAL(18, 2) NOT NULL DEFAULT 0,
    TrangThaiThanhToan NVARCHAR(50) NOT NULL DEFAULT N'Chưa thanh toán',
    HinhThucThanhToan NVARCHAR(50),
    DiaChiGiaoHang NVARCHAR(255) NOT NULL,
    ThoiGianDatHang DATETIME NOT NULL DEFAULT GETDATE(),
    TrangThaiDonHang NVARCHAR(50) NOT NULL DEFAULT N'Đang xử lý',
    CONSTRAINT fk_KhachHang_DonHang FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaNguoiDung) 
);

ALTER TABLE DonHang
ADD CONSTRAINT CHK_TongGiaTriDonHang 
CHECK (TongGiaTriDonHang >= 0);

-- Bảng Tin nhắn
CREATE TABLE TinNhan (
    MaTinNhan INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaAdmin INT NOT NULL,
    MaKhachHang INT NOT NULL,
    NoiDung NVARCHAR(1000) NOT NULL,
    ThoiGian DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_Admin_TinNhan FOREIGN KEY (MaAdmin) REFERENCES Admin(MaNguoiDung) ,
    CONSTRAINT fk_KhachHang_TinNhan FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaNguoiDung) 
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
    LoaiHangHoa NVARCHAR(50) NOT NULL DEFAULT N'DienThoai',
    CONSTRAINT fk_HangSanXuat_HangHoa FOREIGN KEY (MaHangSanXuat) REFERENCES HangSanXuat(MaHangSanXuat) 
);

ALTER TABLE HangHoa
ADD CONSTRAINT CHK_GiaBan 
CHECK (GiaBanNiemYet >= GiaMuaVao),
CONSTRAINT CHK_TonKho 
CHECK (TonKho >= 0),
CONSTRAINT CHK_SoSao 
CHECK (SoSaoDanhGia BETWEEN 0 AND 5);

-- Bảng Đăng tải Hàng hóa
CREATE TABLE DangTaiHangHoa (
    MaDangTai INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaAdmin INT NOT NULL,
    MaHangHoa INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 0,
    ThoiGian DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT fk_Admin_DangTai FOREIGN KEY (MaAdmin) REFERENCES Admin(MaNguoiDung) ,
    CONSTRAINT fk_HangHoa_DangTai FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa) ON DELETE CASCADE
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
    CONSTRAINT fk_HangHoa_DienThoai FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa) ON DELETE CASCADE
);

-- Bảng thông tin Laptop
CREATE TABLE Laptop (
    MaThongTin INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaHangHoa INT NOT NULL,
    ViXuLy NVARCHAR(100),
    ManHinh NVARCHAR(100),
    RAM_ROM NVARCHAR(50),
    CardDoHoa NVARCHAR(100),
    Pin NVARCHAR(50),
    TrongLuong NVARCHAR(50),
    HeDieuHanh NVARCHAR(50),
    CONSTRAINT fk_HangHoa_Laptop FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa) ON DELETE CASCADE
);

-- Bảng thông tin Tablet
CREATE TABLE Tablet (
    MaThongTin INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaHangHoa INT NOT NULL,
    ViXuLy NVARCHAR(100),
    ManHinh NVARCHAR(100),
    RAM_ROM NVARCHAR(50),
    Camera NVARCHAR(100),
    Pin NVARCHAR(50),
    KetNoi NVARCHAR(100),
    HoTroBut NVARCHAR(50),
    CONSTRAINT fk_HangHoa_Tablet FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa) ON DELETE CASCADE
);

-- Bảng thông tin Smartwatch
CREATE TABLE Smartwatch (
    MaThongTin INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaHangHoa INT NOT NULL,
    ManHinh NVARCHAR(100),
    DuongKinhMatDongHo NVARCHAR(50),
    ChatLieuDay NVARCHAR(50),
    ThoiLuongPin NVARCHAR(50),
    TinhNangSucKhoe NVARCHAR(200),
    ChongNuoc NVARCHAR(50),
    KetNoi NVARCHAR(100),
    CONSTRAINT fk_HangHoa_Smartwatch FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa) ON DELETE CASCADE
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
    CONSTRAINT fk_HangHoa_LichSuThayDoi FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa) ON DELETE CASCADE,
    CONSTRAINT fk_Admin_LichSuThayDoi FOREIGN KEY (MaNguoiDung) REFERENCES Admin(MaNguoiDung) 
);

-- Bảng Đánh giá Sản phẩm
CREATE TABLE DanhGiaSanPham (
    MaDanhGia INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaDonHang VARCHAR(7) NOT NULL,
    MaKhachHang INT NOT NULL,
    MaHangHoa INT NOT NULL,
    NoiDung NVARCHAR(1000),
    SoSao DECIMAL(2, 1) NOT NULL DEFAULT 5,
    Anh_Video NVARCHAR(255),
    CONSTRAINT fk_DonHang_DanhGia FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang) ,
    CONSTRAINT fk_KhachHang_DanhGia FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaNguoiDung) ,
    CONSTRAINT fk_HangHoa_DanhGia FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa) ON DELETE CASCADE
);

ALTER TABLE DanhGiaSanPham
ADD CONSTRAINT CHK_SoSaoDanhGia 
CHECK (SoSao BETWEEN 0 AND 5);

CREATE TABLE Voucher (
    MaVoucher INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    PhanTramGiam DECIMAL(4, 2) NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    SoLuong INT NOT NULL DEFAULT 0,
    TenMaGiam NVARCHAR(100) NOT NULL,
    DieuKienApDung NVARCHAR(30)
);

ALTER TABLE Voucher
ADD CONSTRAINT CHK_PhanTramGiam 
CHECK (PhanTramGiam BETWEEN 0 AND 100),
CONSTRAINT CHK_NgayVoucher 
CHECK (NgayBatDau <= NgayKetThuc);

-- Bảng Sử dụng Voucher
CREATE TABLE SuDungVoucher (
    MaSuDung INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaDonHang VARCHAR(7) NOT NULL,
    MaVoucher INT NOT NULL,
    CONSTRAINT fk_DonHang_SuDungVoucher FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang) ,
    CONSTRAINT fk_Voucher_SuDungVoucher FOREIGN KEY (MaVoucher) REFERENCES Voucher(MaVoucher) ON DELETE CASCADE
);

-- Bảng Giỏ hàng
CREATE TABLE GioHang (
    MaGioHang INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaNguoiDung INT NOT NULL,
    MaHangHoa INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_KhachHang_GioHang FOREIGN KEY (MaNguoiDung) REFERENCES KhachHang(MaNguoiDung) ON DELETE CASCADE,
    CONSTRAINT fk_HangHoa_GioHang FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa) 
);

ALTER TABLE GioHang
ADD CONSTRAINT CHK_SoLuongGioHang 
CHECK (SoLuong > 0);

-- Bảng Chi tiết Đơn hàng
CREATE TABLE ChiTietDonHang (
    MaChiTiet INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    MaDonHang VARCHAR(7) NOT NULL,
    MaHangHoa INT NOT NULL,
    SoLuong INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_DonHang_ChiTietDonHang FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang) ON DELETE CASCADE,
    CONSTRAINT fk_HangHoa_ChiTietDonHang FOREIGN KEY (MaHangHoa) REFERENCES HangHoa(MaHangHoa)
);

ALTER TABLE ChiTietDonHang
ADD CONSTRAINT CHK_SoLuongChiTiet 
CHECK (SoLuong > 0);