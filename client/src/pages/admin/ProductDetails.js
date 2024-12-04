import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/product"; // Import từ file product.js
import '../../css/ProductDetails.css';
import { apiGetRatings } from "../../apis/rating";

const ProductDetails = () => {
    const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
    const [reviews, setReviews] = useState([]);
    const [showReviews, setShowReviews] = useState({}); // Trạng thái hiển thị đánh giá cho mỗi sản phẩm

    useEffect(() => {
        // Gọi API lấy sản phẩm
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
        apiGetRatings()
            .then(response => {
                if (response.data.success) {
                    setReviews(response.data.data);
                } else {
                    console.log("Failed to fetch products:", response.data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching reviews:", error);
            });
    }, []);

    // Hàm để toggle trạng thái hiển thị đánh giá
    const toggleReviews = (productId) => {
        setShowReviews((prevState) => ({
            ...prevState,
            [productId]: !prevState[productId],
        }));
    };

    return (
        <div>
            <h1>Danh sách sản phẩm</h1>
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.MaHangHoa} className="product-item">
                        <h2 className="product-name">{product.Ten}</h2>
                        <p><strong>Mã hàng hóa:</strong> {product.MaHangHoa}</p>
                        <p><strong>Giá bán:</strong> {product.GiaBanNiemYet.toLocaleString()} VND</p>
                        <p><strong>Mô tả:</strong> {product.MoTa}</p>
                        <p><strong>Đánh giá:</strong> {product.SoSaoDanhGia} ⭐</p>
                        <button onClick={() => toggleReviews(product.MaHangHoa)}>
                            {showReviews[product.MaHangHoa] ? "Ẩn đánh giá" : "Hiển thị đánh giá"}
                        </button>
                        {showReviews[product.MaHangHoa] && (
                            <div className="reviews">
                                <h3>Đánh giá sản phẩm</h3>
                                {reviews.filter(review => review.MaHangHoa === product.MaHangHoa).map((review) => (
                                    <div key={review.MaDanhGia} className="review-item">
                                        <p><strong>Người đánh giá:</strong> {review.HoTen} ({review.CapBac})</p>
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
        </div>
    );
};

export default ProductDetails;
