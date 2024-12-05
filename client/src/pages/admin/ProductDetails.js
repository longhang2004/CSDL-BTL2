import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../../apis/product"; // Import from product.js
import '../../css/ProductDetails.css';
import { apiGetRatings, apiGetAverageRating } from "../../apis/rating";
import { apiGetProductDetail, apiGetProductByFilter } from "../../apis/product";
import Swal from 'sweetalert2';
// import { apiGetProductDetail } from "../../apis/productdetails";

const ProductDetails = ({ MaHangHoa, setViewProduct }) => {
    const [products, setProducts] = useState([]); // List of products
    const [reviews, setReviews] = useState([]); // Product reviews
    const [showReviews, setShowReviews] = useState(false); // Review display toggle for each product
    const [productDetail, setProductDetail] = useState({}); // Product detail data
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [productType, setProductType] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const specificAttributes = {
        DienThoai: [
            { name: 'Camera', label: 'Camera' },
            { name: 'PinSac', label: 'Dung lượng pin' },
            { name: 'RAM_ROM', label: 'RAM/ROM' },
            { name: 'ViXuLy', label: 'Chipset' },
            { name: 'ManHinh', label: 'Màn hình' },
            { name: 'ChuanKetNoi', label: 'Chuẩn kết nối' }
        ],
        Laptop: [
            { name: 'ViXuLy', label: 'Vi xử lý' },
            { name: 'CardDoHoa', label: 'Card đồ hoạ' },
            { name: 'RAM_ROM', label: 'RAM/ROM' },
            { name: 'Pin', label: 'Dung lượng pin' },
            { name: 'ManHinh', label: 'Màn hình' },
            { name: 'TrongLuong', label: 'Trọng lượng' },
            { name: 'HeDieuHanh', label: 'Hệ điều hành' }
        ],
        Tablet: [
            { name: 'Camera', label: 'Camera' },
            { name: 'PinSac', label: 'Dung lượng pin' },
            { name: 'RAM_ROM', label: 'RAM/ROM' },
            { name: 'ViXuLy', label: 'Vi xử lý' },
            { name: 'ManHinh', label: 'Màn hình' },
            { name: 'KetNoi', label: 'Kết nối' },
            { name: 'HoTroBut', label: 'Hỗ trơ bút' }
        ],
        Smartwatch: [
            { name: 'DuongKinhMatDongHo', label: 'Dường kính mặt đồng hồ' },
            { name: 'ManHinh', label: 'Màn hình' },
            { name: 'ChatLieuDay', label: 'Chất liệu dây' },
            { name: 'ThoiLuongPin', label: 'Thời lượng pin' },
            { name: 'ChongNuoc', label: 'Chống nước' },
            { name: 'TinhNangSucKhoe', label: 'Tính năng sức khoẻ' },
            { name: 'KetNoi', label: 'Kết nối' }
        ],
        PhuKien: []
    }

    const fetchProductDetails = async () => {
        setLoading(true);
        const response = await apiGetProductByFilter({hanghoa_id: MaHangHoa});
        
        if (response.success) {
            const product = response.data[0];
            setProductType(product.LoaiHangHoa);
            setFormData(product);
            if (product.LoaiHangHoa !== 'PhuKien') {
            const response2 = await apiGetProductDetail({LoaiHangHoa: product.LoaiHangHoa, MaHangHoa: MaHangHoa});
              if (response2.success) {
                  setProductDetail(response2.data[0]);
              } else {
                  Swal.fire({
                      title: 'Lỗi',
                      text: 'Không thể tải thông tin chi tiết của sản phẩm',
                      icon: 'error'
                  });
              }
            }
        } else {
            Swal.fire({
                title: 'Lỗi',
                text: 'Không thể tải thông tin sản phẩm',
                icon: 'error'
            });
        }
        setLoading(false);
      };

    useEffect(() => {
        // Fetch products
        fetchProductDetails();
        apiGetRatings({MaHangHoa})
            .then(response => {
                if (response.success) {
                    setReviews(response.data);
                } else {
                    console.log("Failed to fetch reviews:", response.data.message);
                }
            })
            .catch(error => {
                console.error("Error fetching reviews:", error);
            });
        apiGetAverageRating({MaHangHoa}).then(response => {
            if (response.success) {
                console.log(response.data[0].SoSaoDanhGia);
                setAverageRating(response.data[0].SoSaoDanhGia? response.data[0].SoSaoDanhGia : 0);
            } else {
                console.log("Failed to fetch average rating:", response.data.message);
            }
        }).catch(error => {
            console.error("Error fetching average rating:", error);
        });
    }, [MaHangHoa]);

    // useEffect(() => {
    //     // Fetch product reviews
    //     apiGetRatings()
    //         .then(response => {
    //             if (response.data.success) {
    //                 setReviews(response.data.data);
    //             } else {
    //                 console.log("Failed to fetch reviews:", response.data.message);
    //             }
    //         })
    //         .catch(error => {
    //             console.error("Error fetching reviews:", error);
    //         });
    // }, []);

    // Toggle review display for each product
    // const toggleReviews = (productId) => {
    //     setShowReviews((prevState) => ({
    //         ...prevState,
    //         [productId]: !prevState[productId],
    //     }));

    // };

    // const toggleDetails = (productId) => {
    //     if (productDetail[productId]) {
    //         // Nếu đã có thông tin chi tiết, xóa để ẩn
    //         setProductDetail((prevState) => {
    //             const newDetails = { ...prevState };
    //             delete newDetails[productId];
    //             return newDetails;
    //         });
    //     } else {
    //         // Nếu chưa có thông tin chi tiết, gọi API
    //         getProductDetail(productId);
    //     }
    // };

    // Fetch product detail
    // const getProductDetail = (maHangHoa) => {
    //     apiGetProductDetail(maHangHoa)
    //         .then(response => {
    //             setProductDetail((prevState) => ({
    //                 ...prevState,
    //                 [maHangHoa]: response.data
    //             }));
    //         })
    //         .catch(error => {
    //             console.error("Error fetching product details:", error);
    //         });
    // };

    // const filterByCategory = (category) => {
    //     setSelectedCategory(category);
    // };

    // const filteredProducts = selectedCategory
    //     ? products.filter(product => product.LoaiHangHoa === selectedCategory)
    //     : products;

    return (
        <div>
            {/* <h1>Danh sách sản phẩm</h1>
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
            </div> */}


            <div className="product-list">
                {/* {filteredProducts.map((product) => ( */}
                    <div key={formData.MaHangHoa} className="product-item">
                        <h2 className="product-name">{formData.Ten}</h2>
                        <p><strong>Mã hàng hóa:</strong> {formData.MaHangHoa}</p>
                        <p><strong>Giá mua vào:</strong> {new Intl.NumberFormat('vi-VN', { 
                                            style: 'currency', 
                                            currency: 'VND' 
                                        }).format(formData.GiaMuaVao)}</p>
                        <p><strong>Giá bán niêm yết:</strong> {new Intl.NumberFormat('vi-VN', { 
                                            style: 'currency', 
                                            currency: 'VND' 
                                        }).format(formData.GiaBanNiemYet)}</p>
                        <p><strong>Mô tả:</strong> {formData.MoTa}</p>
                        <p><strong>Đánh giá:</strong> {averageRating} ⭐</p>
                        <p><strong>Tồn kho:</strong> {formData.TonKho} </p>
                        <p><strong>Loại hàng hóa:</strong> {formData.LoaiHangHoa} </p>
                        <p><strong>Mã hãng sản xuất:</strong> {formData.MaHangSanXuat}</p>

                        {/* Product detail */}
                        {productType && specificAttributes[productType] && (
                            < div >
                                <h3>Thông số kỹ thuật</h3>
                                {specificAttributes[productType].map((attribute) => (
                                    <p key={attribute.name}><strong>{attribute.label}:</strong> {productDetail[attribute.name]}</p>
                                ))}
                                {/* <p><strong>Tên hãng sản xuất:</strong> {formData.TenHangSanXuat}</p>
                                <p><strong>Địa chỉ hãng sản xuất:</strong> {formData.DiaChiHangSanXuat}</p>
                                <p><strong>Mã thông tin:</strong> {(JSON.stringify(productDetail.MaThongTin))} </p>
                                <p><strong>Vi xử lý:</strong> {(JSON.stringify(productDetail.ViXuLy))} </p>
                                <p><strong>Màn hình:</strong> {(JSON.stringify(productDetail.ManHinh))} </p>
                                <p><strong>RAM_ROM:</strong> {(JSON.stringify(productDetail.RAM_ROM))} </p>
                                <p><strong>Camera:</strong> {(JSON.stringify(productDetail.Camera))} </p>
                                <p><strong>Pin sạc:</strong> {(JSON.stringify(productDetail.PinSac))} </p>
                                <p><strong>Chuẩn kết nối:</strong> {(JSON.stringify(productDetail.ChuanKetNoi))} </p> */}
                            </div>
                        )}


                        {/* Button to toggle reviews */}
                        <div id="detailButton" >
                            <button onClick={() => setViewProduct(null)}>
                                {"Quay lại"}
                            </button>
                        </div>
                        <div id="reviewButton">
                            <button onClick={() => setShowReviews(!showReviews)}>
                                {showReviews ? "Ẩn đánh giá" : "Hiển thị đánh giá"}
                            </button>
                        </div>



                        {/* Display reviews if the toggle is true */}
                        {showReviews && (
                            <div className="reviews">
                                <h3>Đánh giá sản phẩm</h3>
                                {reviews.filter(review => review.MaHangHoa === formData.MaHangHoa).map((review) => (
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
                {/* ))} */}
            </div>
        </div >
    );
};

export default ProductDetails;