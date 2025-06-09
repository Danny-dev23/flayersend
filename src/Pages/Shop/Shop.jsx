import React from "react";
import { useEffect, useState } from "react";
const Shop = () => {
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const response = await fetch(
  //       "http://127.0.0.1:8000/products/api/products/"
  //     );
  //     const data = await response.json();
  //     setProducts(data);
  //   };

  //   fetchProducts();
  // }, []);
  return (
    <div>
      <h1>Магазин</h1>
      <div className="product-list">
        {/* {products.map((product) => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{product.price} ₽</p>
            {product.image && <img src={product.image} alt={product.name} />}
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default Shop;
