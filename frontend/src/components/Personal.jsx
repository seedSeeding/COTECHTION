import { useState, useEffect } from "react";
import Product from "../ProductComponents/Product";
import apiService from "./Services/apiService";
import CircleLoader from "../Loader/CircleLoader.jsx";
import axiosService from "../views/axios-client.js";
export default function Personal() {
  const [products, setProducts] = useState([]);
  const [leftProducts, setLeftProducts] = useState([]);
    const [rightProducts, setRightProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await axiosService.get("products");
  
          if (response.data.message) {
            setProducts([]);
          } else {
            setProducts(response.data);
            console.log("Products fetched:", response.data);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false); 
        }
      };
  
      fetchProducts();
    }, []);
  useEffect(() => {
    const filtered = products.filter((data) => data.product_type === "PERSONAL");
    setFilteredProducts(filtered);

    if (filtered.length > 0) {
      const half = Math.ceil(filtered.length / 2);
      setLeftProducts(filtered.slice(0, half));
      setRightProducts(filtered.slice(half));
    }
  }, [products]); 

  return (
    <>
      {loading ? (
        <CircleLoader message="Fetching Products.." />
      ) : (
        <div className="item-sec">
          <div className="item-con">
            {leftProducts.map((item) => (
          
              <Product
                key={item.id}
                product_image={`${import.meta.env.VITE_STORAGE_BASE_URL}/${item.product_image}`}
                product_name={item.product_name}
                id={item.id}
                product_quantity={item.product_quantity}
                product_price={item.product_price}
                expiration_date={item.expiration_date}
              />
             
            ))}
          </div>
          <div className="item-con">
            {rightProducts.map((item) => (
          
              <Product
                key={item.id}
                product_image={`${import.meta.env.VITE_STORAGE_BASE_URL}/${item.product_image}`}
                product_name={item.product_name}
                id={item.id}
                product_quantity={item.product_quantity}
                product_price={item.product_price}
                expiration_date={item.expiration_date}
              />
            
            ))}
          </div>
        </div>)}
    </>
  );
}
