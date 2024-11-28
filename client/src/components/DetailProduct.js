import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { apiGetProductById } from '../apis/product';
import { apiAddToUserCart } from '../apis/cart'
import { apiGetCurrent } from '../apis/user'
import ProductPhone from './ProductPhone';
import ProductLaptop from './ProductLaptop';
import ProductHeadphone from './ProductHeadphone';
import ProductTablet from './ProductTablet';
import '../css/Detail.css';

const DetailProduct = () => {
  const { productId } = useParams(); 
  const [products, setProducts] = useState(null); 
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [isAdded, setIsAdded] = useState(false);  
  const [quantity, setQuantity] = useState(1); 
  const [user, setUser] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const results = await apiGetCurrent();
      if (results.success === false) {
        setError(results.message);
      } else {
        setUser(results.rs); 
      }
    } catch (err) {
      setError('Lỗi khi tải thông tin người dùng');
    }
  };
  
  const fetchProductDetails = async () => {
    try {
      const result = await apiGetProductById(productId);
      if (result.success === false) {
        setError(result.message);
      } else {
        setProducts(result.productData);
        setQuantity(1); 
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu sản phẩm');
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async (products) => {
    if (!user) {
      console.error('User không hợp lệ');
      return;
    }
    const newProduct = {
      _id: products?._id,
      name: products?.name,
      imageLink: products?.imageLink,
      price: products?.price,
      stock: products?.stock,
      quantity
    };

    try {
      await apiAddToUserCart({
        userId: user?._id,
        productId: newProduct?._id,
        quantity: newProduct?.quantity
      });

      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
    window.location.reload();
  };
    
  // Tăng số lượng sản phẩm
  const increaseQuantity = () => {
    if (products && quantity < products?.stock) {
      const updatedQuantity = quantity + 1;
      setQuantity(updatedQuantity); 
    }
  };

  // Giảm số lượng sản phẩm
  const decreaseQuantity = () => {
    if (quantity > 1) {
      const updatedQuantity = quantity - 1;
      setQuantity(updatedQuantity); 
    }
  };

  // Xử lý thay đổi số lượng trực tiếp
  const handleQuantityChange = (event) => {
    let value = Math.max(1, Number(event.target.value));
    if (products && value > products.stock) {
      value = products.stock;
    }
    setQuantity(value); 
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!products) {
    return <p className="loading-message">Đang tải...</p>;
  }

  const renderProductDetails = () => {
    if (products.__t === "phone") {
      return (
        <>
          <div className="detail-product-item">
            <div className="field">Camera:</div>
            <div className="desc">{products.camera}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Pin:</div>
            <div className="desc">{products.battery}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Màn hình:</div>
            <div className="desc">{products.screen}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Kết nối:</div>
            <div className="desc">{products.connection}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Bộ vi xử lý:</div>
            <div className="desc">{products.processor}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">RAM/ROM:</div>
            <div className="desc">{products.ramRom}</div>
          </div>
        </>
      );
    } else if (products.__t === "laptop") {
      return (
        <>
          <div className="detail-product-item">
            <div className="field">CPU:</div>
            <div className="desc">{products.cpu}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">GPU:</div>
            <div className="desc">{products.gpu}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Hard Drive:</div>
            <div className="desc">{products.hardDrive}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">RAM:</div>
            <div className="desc">{products.ram}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Màn hình:</div>
            <div className="desc">{products.screen}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Kết nối:</div>
            <div className="desc">{products.connectionPorts}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Pin:</div>
            <div className="desc">{products.battery}</div>
          </div>
        </>
      );
    } else if (products.__t === "headphone") {
      return (
        <>
          <div className="detail-product-item">
            <div className="field">Loại tai nghe:</div>
            <div className="desc">{products.type}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Pin:</div>
            <div className="desc">{products.battery}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Màu sắc:</div>
            <div className="desc">{products.color}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Kết nối:</div>
            <div className="desc">{products.connection}</div>
          </div>
        </>
      );
    } else if (products.__t === "tablet") {
      return (
        <>
          <div className="detail-product-item">
            <div className="field">Màn hình:</div>
            <div className="desc">{products.screen}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Bộ vi xử lý:</div>
            <div className="desc">{products.processor}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">RAM/ROM:</div>
            <div className="desc">{products.ramRom}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Camera:</div>
            <div className="desc">{products.camera}</div>
          </div>
          <div className="detail-product-item">
            <div className="field">Kết nối:</div>
            <div className="desc">{products.connection}</div>
          </div>
        </>
      );
    } else {
      return <div className="detail-product-item">No details available.</div>;
    }
  };

  return (
    <>
      <div className="detail-container">
        <div className="center">
          <img src={products.imageLink} alt={`${products.name}`} />
        </div>
        <div className="name-product">{products.name}</div>
        <div className="under">
          <div className="price">
            <ion-icon className="price-tag-icon" name="pricetags-outline" />
            <div className="price-self">{products.price.toLocaleString()}đ</div>
          </div>
        </div>
        
        <div className="product-action">
          <div className="quantity-selector">
            <label htmlFor="quantity">Số lượng: </label>
            <div className="quantity-input">
              <button className="quantity-btn" onClick={decreaseQuantity}>-</button>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button className="quantity-btn" onClick={increaseQuantity}>+</button>
            </div>
          </div>

          <button 
            className="btn-shopping btn-add-to-card" 
            onClick={() => handleAddToCart(products)}
          >
            <ion-icon name="cart-outline" className="shopping-cart" /> Thêm vào giỏ hàng
          </button>

          {isAdded && (
            <div className="cart-notification">
              <p>Sản phẩm đã được thêm vào giỏ hàng</p>
            </div>
          )}
        </div>
        
        <div className="product-describe bg-gray-100 p-4 rounded-md shadow-md my-6 mx-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Thông tin mô tả</h2>
          <ul className="list-disc list-inside text-gray-600">
            <p>{products.description}</p>
          </ul>
        </div>


        <div className="more-detail">
          <div className="detail">Thông tin chi tiết</div>
          <div className="hide" onClick={() => setShow(!show)}>
            {show ? "Ẩn bớt" : "Xem thêm"}
            <ion-icon name={show ? "chevron-up-outline" : "chevron-down-outline"} />
          </div>
        </div>

        {show && (
          <div className="detail-product">
            {renderProductDetails()}
          </div>
        )}

        <div className="extra-info">
          <div className="info-item">
            <span>Giao Hàng Siêu Tốc 24H</span>
          </div>
          <div className="info-item">
            <span>Đổi trả 15 ngày</span>
          </div>
          <div className="info-item">
            <span>Đa Dạng Thanh Toán</span>
          </div>
          <div className="info-item">
            <span>Chính Hãng</span>
          </div>
        </div>

        <div className="related-products">
          <h3 class="related-products">Sản phẩm liên quan</h3>
          {products.__t === "phone" && <ProductPhone />}
          {products.__t === "laptop" && <ProductLaptop />}
          {products.__t === "headphone" && <ProductHeadphone />}
          {products.__t === "tablet" && <ProductTablet />}
        </div>
      </div>

    </>
  );
};

export default DetailProduct;