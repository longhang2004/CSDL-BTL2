import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { apiFetchProductByPage } from 'apis/product'
import { useNavigate } from 'react-router-dom';
import { YourNeed, BannerProduct } from '../../components/index';

export const Product = () => {

  const {category} = useParams();

  const [products, setProducts] = useState([]);

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProduct = async () => {
    const response = await apiFetchProductByPage(category);
    if(response.success) {
      setProducts(response.productData); 
    }
  }

  useEffect(() => { 
    fetchProduct(); 
  }, [])

  const handleProductClick = (id) => {
    window.scrollTo(0, 0);
    navigate(`/product/${id}`);
  };
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating); 
  };
  
  return (
    <>
      <div className="w-full p-6 mt-6">
        {error && <p className="text-red-500 text-center font-bold mb-5">Error: {error}</p>}

        <div className="mb-6">
          <BannerProduct />
        </div>

        <div className="mb-48">
          <YourNeed />
        </div>
        

        <div className="grid grid-cols-5 gap-6 ">
          {products.length === 0 ? (
            <p className="text-center text-lg font-medium col-span-full">Chưa có sản phẩm</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-2 transition-transform cursor-pointer hover:border-gray-400 relative"
                onClick={() => handleProductClick(product._id)}
              >
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold py-1 px-2 rounded">
                  Trả góp 0%
                </div>

                <div className="p-3">
                  <img
                    src={product.imageLink}
                    alt={product.name}
                    className="w-48 h-48 object-contain bg-white rounded-md"
                  />
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 h-12 overflow-hidden uppercase">
                    {product.name}
                  </h2>
                  <p className="text-red-600 text-xl font-extrabold mb-2">{product.price.toLocaleString()}đ</p>
                  <p className="text-lg text-gray-700 font-bold uppercase mb-2">
                    <span className="text-lg text-gray-600">{product.origin.toUpperCase()}</span>
                  </p>
                  <p className="text-yellow-500 text-base font-medium">
                    {renderStars(product.rating || 0)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default Product;
