
--USE QuanLyDonHang;

------------------FUNCTION-----------------------------------------

--Tổng giá trị đơn hàng của khách hàng theo trạng thái thanh toán: 

CREATE FUNCTION GetTotalOrderAmountByCustomer (@MaKhachHang INT, @TrangThaiThanhToan NVARCHAR(50))
RETURNS DECIMAL(18, 2)
AS
BEGIN
    DECLARE @TotalAmount DECIMAL(18, 2)
    
    -- Kiểm tra nếu Mã khách 
    IF NOT EXISTS (SELECT 1 FROM DonHang WHERE MaKhachHang = @MaKhachHang)
    BEGIN
        RETURN NULL;
    END;

    -- Tính tổng giá trị đơn hàng
    SELECT @TotalAmount = SUM(TongGiaTriDonHang)
    FROM DonHang
    WHERE MaKhachHang = @MaKhachHang
		AND TrangThaiThanhToan = @TrangThaiThanhToan;
    RETURN @TotalAmount;
END;

GetTotalOrderAmountByCustomer(@MaKhachHang, @TrangThaiThanhToan) AS TotalAmount;

--Số sao đánh giá trung bình của 1 sản phẩm:

CREATE FUNCTION GetAverageRatingForProduct (@MaHangHoa INT)
RETURNS DECIMAL(2, 1)
AS
BEGIN
    DECLARE @AverageRating DECIMAL(2, 1)
        IF NOT EXISTS (SELECT 1 FROM DanhGiaSanPham WHERE MaHangHoa = @MaHangHoa)
    BEGIN
        RETURN NULL
    END
    
    SELECT @AverageRating = AVG(SoSao)
    FROM DanhGiaSanPham
    WHERE MaHangHoa = @MaHangHoa
    
    RETURN @AverageRating
END;

SELECT dbo.GetAverageRatingForProduct(@MaHangHoa) AS AverageRating;


-- Lấy hàng hóa bán chạy theo thứ hạng mà mình nhập 

CREATE FUNCTION GetTopSellingProduct(@Rank INT)
RETURNS INT
AS
BEGIN
    DECLARE @ProductID INT;

    WITH RankedProducts AS (
        SELECT 
            MaHangHoa,
            RANK() OVER (ORDER BY SUM(SoLuong) DESC) AS Rank
        FROM ChiTietDonHang
        GROUP BY MaHangHoa
    )
    SELECT @ProductID = MaHangHoa
    FROM RankedProducts
    WHERE Rank = @Rank;

    RETURN @ProductID;
END;

SELECT dbo.GetTopSellingProduct(@ThuHang);



------------------PROCEDUCES---------------------------------------

-- Trả về danh sách các sản phẩm có số sao đánh giá tối thiểu theo mã hang sản xuất.
CREATE PROCEDURE GetProductsByMinRating
    @MinRating DECIMAL(2, 1), 
    @MaHangSanXuat INT        
AS
BEGIN
    SELECT 
        MaHangHoa,
        MaHangSanXuat,
        Ten,
        GiaMuaVao,
        GiaBanNiemYet,
        TonKho,
        MoTa,
        AVG(SoSaoDanhGia) AS AverageRating 
    FROM 
        QuanLyDonHang.dbo.HangHoa
    WHERE 
        SoSaoDanhGia >= @MinRating
        AND MaHangSanXuat = @MaHangSanXuat 
    GROUP BY 
        MaHangSanXuat, MaHangHoa, Ten, GiaMuaVao, GiaBanNiemYet, TonKho, MoTa
    ORDER BY 
        AverageRating DESC;  
END;
EXEC GetProductsByMinRating @MinRating = .. , @MaHangSanXuat = ..;

-- Cập nhật địa chỉ giao hàng.
CREATE PROCEDURE UpdateOrderAddress
    @MaDonHang INT,
    @NewAddress NVARCHAR(255)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM DonHang WHERE MaDonHang = @MaDonHang)
    BEGIN
        PRINT 'Đơn hàng không tồn tại';
        RETURN;
    END

    UPDATE DonHang
    SET DiaChiGiaoHang = @NewAddress
    WHERE MaDonHang = @MaDonHang;

    PRINT 'Địa chỉ giao hàng đã được cập nhật';
END;
EXEC UpdateOrderAddress @MaDonHang = 6, @NewAddress = '123 New Street, City';

-- TRẢ VỀ DANH SÁCH THỨ TỰ ĐƠN HÀNG BÁN CHẠY NHẤT

CREATE PROCEDURE GetTopSellingProducts
AS
BEGIN
    SELECT 
        hh.MaHangHoa,
        hh.Ten AS TenHangHoa,
        SUM(ct.SoLuong) AS TongSoLuongBan
    FROM ChiTietDonHang AS ct
    INNER JOIN HangHoa AS hh ON ct.MaHangHoa = hh.MaHangHoa
    GROUP BY hh.MaHangHoa, hh.Ten
    HAVING SUM(ct.SoLuong) > 0 
    ORDER BY TongSoLuongBan DESC; 
END;

EXEC GetTopSellingProducts;
