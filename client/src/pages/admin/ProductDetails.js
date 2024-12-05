import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/product"; // Import from product.js
import '../../css/ProductDetails.css';
import { apiGetRatings } from "../../apis/rating";
import { apiGetProductDetail } from "../../apis/productdetails";

const ProductDetails = () => {
    const [products, setProducts] = useState([]); // List of products
    const [reviews, setReviews] = useState([]); // Product reviews
    const [showReviews, setShowReviews] = useState({}); // Review display toggle for each product
    const [productDetail, setProductDetail] = useState({}); // Product detail data
    const [selectedCategory, setSelectedCategory] = useState(null);
    useEffect(() => {
        // Fetch products
        apiGetProducts()
            .then(response => {
                if (response.data.success) {
                    setProducts(response.data.data);
                } else {
                    console.error("Failed to fetch products:", response.data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
    }, []);

    useEffect(() => {
        // Fetch product reviews
        apiGetRatings()
            .then(response => {
                if (response.data.success) {
                    setReviews(response.data.data);
                } else {
                    console.log("Failed to fetch reviews:", response.data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching reviews:", error);
            });
    }, []);

    // Toggle review display for each product
    const toggleReviews = (productId) => {
        setShowReviews((prevState) => ({
            ...prevState,
            [productId]: !prevState[productId],
        }));

    };

    const toggleDetails = (productId) => {
        if (productDetail[productId]) {
            // Nếu đã có thông tin chi tiết, xóa để ẩn
            setProductDetail((prevState) => {
                const newDetails = { ...prevState };
                delete newDetails[productId];
                return newDetails;
            });
        } else {
            // Nếu chưa có thông tin chi tiết, gọi API
            getProductDetail(productId);
        }
    };

    // Fetch product detail
    const getProductDetail = (maHangHoa) => {
        apiGetProductDetail(maHangHoa)
            .then(response => {
                setProductDetail((prevState) => ({
                    ...prevState,
                    [maHangHoa]: response.data
                }));
            })
            .catch(error => {
                console.error("Error fetching product details:", error);
            });
    };

    // const filterByCategory = (category) => {
    //     setSelectedCategory(category);
    // };

    const filteredProducts = selectedCategory
        ? products.filter(product => product.LoaiHangHoa === selectedCategory)
        : products;

    return (
        <div>
            <h1>Danh sách sản phẩm</h1>
            <div className="category-bar">
                <button
                    className={`category-item ${selectedCategory === "Laptop" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("Laptop")}>
                    Laptop
                </button>
                <button
                    className={`category-item ${selectedCategory === "DienThoai" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("DienThoai")}>
                    Điện thoại
                </button>
                <button
                    className={`category-item ${selectedCategory === "MayTinhBang" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("MayTinhBang")}>
                    Máy tính bảng
                </button>
                <button
                    className={`category-item ${selectedCategory === "PhuKien" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("PhuKien")}>
                    Phụ kiện
                </button>
                <button
                    className={`category-item ${selectedCategory === null ? "active" : ""}`}
                    onClick={() => setSelectedCategory(null)}>
                    Tất cả
                </button>
            </div>


            <div className="product-list">
                {filteredProducts.map((product) => (
                    <div key={product.MaHangHoa} className="product-item">
                        <h2 className="product-name">{product.Ten}</h2>
                        <p><strong>Mã hàng hóa:</strong> {product.MaHangHoa}</p>
                        <p><strong>Giá mua vào:</strong> {product.GiaMuaVao.toLocaleString()} VND</p>
                        <p><strong>Giá bán niêm yết:</strong> {product.GiaBanNiemYet.toLocaleString()} VND</p>
                        <p><strong>Mô tả:</strong> {product.MoTa}</p>
                        <p><strong>Đánh giá:</strong> {product.SoSaoDanhGia} ⭐</p>
                        <p><strong>Tồn kho:</strong> {product.TonKho} </p>
                        <p><strong>Loại hàng hóa:</strong> {product.LoaiHangHoa} </p>
                        <p><strong>Mã hãng sản xuất:</strong> {product.MaHangSanXuat}</p>

                        {/* Product detail */}
                        {productDetail[product.MaHangHoa] ? (
                            < div >
                                <p><strong>Tên hãng sản xuất:</strong> {productDetail[product.MaHangHoa].data.TenHangSanXuat}</p>
                                <p><strong>Địa chỉ hãng sản xuất:</strong> {productDetail[product.MaHangHoa].data.DiaChiHangSanXuat}</p>
                                <p><strong>Mã thông tin:</strong> {(JSON.stringify(productDetail[product.MaHangHoa].data.ThongTinChiTiet[0].MaThongTin))} </p>
                                <p><strong>Vi xử lý:</strong> {(JSON.stringify(productDetail[product.MaHangHoa].data.ThongTinChiTiet[0].ViXuLy))} </p>
                                <p><strong>Màn hình:</strong> {(JSON.stringify(productDetail[product.MaHangHoa].data.ThongTinChiTiet[0].ManHinh))} </p>
                                <p><strong>RAM_ROM:</strong> {(JSON.stringify(productDetail[product.MaHangHoa].data.ThongTinChiTiet[0].RAM_ROM))} </p>
                                <p><strong>Camera:</strong> {(JSON.stringify(productDetail[product.MaHangHoa].data.ThongTinChiTiet[0].Camera))} </p>
                                <p><strong>Pin sạc:</strong> {(JSON.stringify(productDetail[product.MaHangHoa].data.ThongTinChiTiet[0].PinSac))} </p>
                                <p><strong>Chuẩn kết nối:</strong> {(JSON.stringify(productDetail[product.MaHangHoa].data.ThongTinChiTiet[0].ChuanKetNoi))} </p>

                            </div>
                        ) : (
                            <p></p>
                        )}

                        {/* Button to toggle reviews */}
                        <div id="detailButton" >
                            <button onClick={() => toggleDetails(product.MaHangHoa)}>
                                {productDetail[product.MaHangHoa] ? "Ẩn thông tin chi tiết" : "Hiển thị thông tin chi tiết"}
                            </button>
                        </div>
                        <div id="reviewButton">
                            <button onClick={() => toggleReviews(product.MaHangHoa)}>
                                {showReviews[product.MaHangHoa] ? "Ẩn đánh giá" : "Hiển thị đánh giá"}
                            </button>
                        </div>



                        {/* Display reviews if the toggle is true */}
                        {showReviews[product.MaHangHoa] && (
                            <div className="reviews">
                                <h3>Đánh giá sản phẩm</h3>
                                {reviews.filter(review => review.MaHangHoa === product.MaHangHoa).map((review) => (
                                    <div key={review.MaDanhGia} className="review-item">
                                        <p><strong>Người đánh giá:</strong> {review.Ho} {review.Ten} ({review.CapBac})</p>
                                        <p><strong>Số sao:</strong> {review.SoSao} ⭐</p>
                                        <p><strong>Nội dung:</strong> {review.NoiDung}</p>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div >
    );
};

export default ProductDetails;

