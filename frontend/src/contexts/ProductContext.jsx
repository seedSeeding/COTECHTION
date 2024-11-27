import { createContext, useState, useContext } from "react";
import apiService from "../components/Services/apiService";
import axiosService from "../views/axios-client";

const  ProductData = createContext({

    id: Number,
    product_type: String,
    product_catigory: String,
    product_image: String,
    product_name: String,
    product_price: String,
    product_quantity: String,
    product_date: String,
    expiration_date: String,
    created_at: String,
    updated_at: String
    
})


export const ContextProvider = ({ children }) => {
        const [data, setData] = useState(null);
         async () => {
        try {
            const response = await axiosService.get('products', {});
           setData(response.data)
        } catch (error) {
            console.error('Error fetching products:', error);
          
            alert('Failed to load products. Please try again.');
        }
    };
    
    return (
        <ProductData.Provider value={data}>
            {children}
        </ProductData.Provider>
    );
};

export const useProductContext = () => useContext(ProductData);