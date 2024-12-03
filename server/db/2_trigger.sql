
--USE QuanLyDonHang;

--------------------TRIGGER----------------------------------------
-- Cập nhật điểm đánh giá trung bình khi thêm một đánh giá mới 

CREATE TRIGGER trg_UpdateSoSaoDanhGia
ON DanhGiaSanPham
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    UPDATE HangHoa
    SET SoSaoDanhGia = (
        SELECT AVG(SoSao)
        FROM DanhGiaSanPham
        WHERE DanhGiaSanPham.MaHangHoa = HangHoa.MaHangHoa
    )
    WHERE MaHangHoa IN (
        SELECT MaHangHoa FROM inserted
        UNION
        SELECT MaHangHoa FROM deleted
    );
END;
GO

-- cập nhật số lượng tồn kho của sản phẩm trong bảng HangHoa khi có sự thay đổi trong bảng DangTaiHangHoa
CREATE TRIGGER trg_UpdateTonKho_in_DangTaiHangHoa
ON DangTaiHangHoa
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    UPDATE HangHoa
    SET TonKho = (
		-- Số tồn kho bằng tổng đăng tải trừ cho tổng lên đơn bán hàng
        (SELECT ISNULL(SUM(SoLuong), 0) FROM DangTaiHangHoa WHERE DangTaiHangHoa.MaHangHoa = HangHoa.MaHangHoa)
        -
        (SELECT ISNULL(SUM(SoLuong), 0) FROM ChiTietDonHang WHERE ChiTietDonHang.MaHangHoa = HangHoa.MaHangHoa)
    )
    WHERE MaHangHoa IN (
        SELECT MaHangHoa FROM inserted
        UNION
        SELECT MaHangHoa FROM deleted
    );
END;
GO

-- cập nhật số lượng tồn kho của sản phẩm trong bảng HangHoa khi có sự thay đổi trong bảng ChiTietDonHang

CREATE TRIGGER trg_UpdateTonKho_in_ChiTietDonHang
ON ChiTietDonHang
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    UPDATE HangHoa
    SET TonKho = (
		-- Số tồn kho bằng tổng đăng tải trừ cho tổng lên đơn bán hàng
        (SELECT ISNULL(SUM(SoLuong), 0) FROM DangTaiHangHoa WHERE DangTaiHangHoa.MaHangHoa = HangHoa.MaHangHoa)
        -
        (SELECT ISNULL(SUM(SoLuong), 0) FROM ChiTietDonHang WHERE ChiTietDonHang.MaHangHoa = HangHoa.MaHangHoa)
    )
    WHERE MaHangHoa IN (
        SELECT MaHangHoa FROM inserted
        UNION
        SELECT MaHangHoa FROM deleted
    );
END;
GO

-- Trigger  kiểm tra tính hợp lệ của giá bán niêm yết của sản phẩm (GiaBanNiemYet) khi thêm hoặc cập nhật thông tin sản phẩm trong bảng HangHoa.

CREATE TRIGGER trg_ValidateGiaBanNiemYet
ON HangHoa
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE GiaBanNiemYet <= GiaMuaVao
    )
    BEGIN
        RAISERROR ('GiaBanNiemYet phải lớn hơn GiaMuaVao.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- Trigger kiểm tra tính hợp lệ của điểm đánh giá sản phẩm (SoSao) trong bảng DanhGiaSanPham.
CREATE TRIGGER trg_ValidateSoSao
ON DanhGiaSanPham
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE SoSao NOT BETWEEN 1 AND 5
        OR SoSao != FLOOR(SoSao)
    )
    BEGIN
        RAISERROR ('SoSao phải là một số nguyên từ 1 đến 5.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- Trigger này kiểm tra tính hợp lệ của phần trăm giảm giá (PhanTramGiam) trong bảng Voucher

CREATE TRIGGER trg_ValidatePhanTramGiam
ON Voucher
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE PhanTramGiam <= 0
        OR PhanTramGiam >= 100
    )
    BEGIN
        RAISERROR ('PhanTramGiam phải lớn hơn 0 và nhỏ hơn 100.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO