import { useState, useEffect } from "react"
import Product from "../ProductComponents/Product";
import apiService from "./Services/apiService";
import CircleLoader from "../Loader/CircleLoader.jsx";
import axiosService from "../views/axios-client.js";
export default function Faultry() {
    const [products, setProducts] = useState([{}]);
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

    return (
        <>
            { loading ? (
                <CircleLoader message="Fetching Products.." />
            ) : (
                <div className="item-sec">
                    <div className="item-con">
                        <div className="faultry-type">

                            <span>SIDC</span>
                        </div>
                        {products && products.map((item) => {
                            if (item.product_catigory == "SIDC")
                                return (
                                    <Product key={item.id}
                                        product_image={`${import.meta.env.VITE_STORAGE_BASE_URL}/${item.product_image}`}
                                        product_name={item.product_name}
                                        id={item.id}
                                        product_quantity={item.product_quantity
                                        } product_price={item.product_price}
                                        expiration_date={item.expiration_date}
                                    />
                                )
                        })}
                    
                    </div>

                    <div className="item-con">
                        <div className="faultry-type">
                            <span>LIMCOMA</span>
                        </div>
                        { products && products.map((item) => {
                            if (item.product_catigory == "LIMCOMA")
                                return (
                                    <Product key={item.id}
                                        product_image={`${import.meta.env.VITE_STORAGE_BASE_URL}/${item.product_image}`}
                                        product_name={item.product_name}
                                        id={item.id}
                                        product_quantity={item.product_quantity
                                        } product_price={item.product_price}
                                        expiration_date={item.expiration_date}
                                    />
                                )
                        })}
                    </div>
                </div>)}
        </>
    )

}