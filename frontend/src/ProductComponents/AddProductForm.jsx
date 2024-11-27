import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import apiService from '../components/Services/apiService';
import { useStateContext } from '../contexts/ContextProvider';
import axiosService from '../views/axios-client';

export default function AddProductForm() {

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productDate, setProductDate] = useState('');
    const [productExpDate, setProductExpDate] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [stockLimit, setStockLimit] = useState('');
    const [productType, setProductType] = useState('FEED');
    const [organization, setOrganization] = useState('SIDC');
    
    const { user } = useStateContext();

    
   
    const handleAddProduct = async (e) => {
        e.preventDefault();
    
        if (!productName || !productPrice || !productQuantity || !stockLimit || !productExpDate || !productDate) {
            alert('All fields are required!');
            return;
        }
    
        const formattedDate = moment(productDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formattedExpDate = moment(productExpDate, "DD-MM-YYYY").format("YYYY-MM-DD");
    
      
        if (moment(formattedExpDate).isBefore(formattedDate)) {
            alert('Expiration date cannot be earlier than the product date.');
            return;
        }
    
        
        if (Number(productQuantity) > Number(stockLimit)) {
            alert('Product quantity exceeds the stock limit.');
            return;
        }
    
        const formData = {
            'product_type': productType,
            'product_image': productImage,
            'product_name': productName,
            'product_price': Number(productPrice),
            'product_quantity': Number(productQuantity),
            'stock_limit': Number(stockLimit),
            'product_date': formattedDate,
            'expiration_date': formattedExpDate,
            'product_catigory': productType === "FEED" ? organization : "NONE",
            "user_email": user.email,
            "batch": 1
        };
    
        try {
            const response = await axiosService.post('products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            alert('Product Created Successfully');
            console.log('Product Added:', response.data);
    
            // Reset form fields
            setProductName('');
            setProductPrice('');
            setProductQuantity('');
            setProductDate('');
            setProductExpDate('');
            setProductImage(null);
            setStockLimit('');
            setProductType('FEED');
            setOrganization('SIDC');
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message || 'Something went wrong');
                console.error(error.response.data.errors);
            } else {
                alert('Failed to add product. Please try again.');
                console.error('Error:', error);
            }
        }
    };
    
   
    return (
        <>
            <form onSubmit={handleAddProduct}>
                <span>Add a NEW PRODUCT</span>
                <input 
                    type="text" 
                    placeholder='Product Name' 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)} 
                />
                <input 
                    type="number" 
                    placeholder='Product Price' 
                    value={productPrice} 
                    onChange={(e) => setProductPrice(e.target.value)} 
                />
                <input 
                    type="number" 
                    placeholder='Product Quantity' 
                    value={productQuantity} 
                    onChange={(e) => setProductQuantity(e.target.value)} 
                />
                <input 
                    type="number" 
                    placeholder='Stock Limit' 
                    value={stockLimit} 
                    onChange={(e) => setStockLimit(e.target.value)} 
                />
                <input 
                    type="date" 
                    placeholder='Product Date' 
                    value={productDate} 
                    onChange={(e) => setProductDate(e.target.value)} 
                />
                <input 
                    type="date" 
                    placeholder='Product Expiry Date' 
                    value={productExpDate} 
                    onChange={(e) => setProductExpDate(e.target.value)} 
                />
                <input 
                    type="file" 
                    onChange={(e) => setProductImage(e.target.files[0])} 
                />
                <select value={productType} onChange={(e) => setProductType(e.target.value)}>
                    <option value="FEED">FEED</option>
                    <option value="HOUSEHOLD">HOUSEHOLD</option>
                    <option value="LUANDRY">LAUNDRY</option>
                    <option value="PERSONAL">PERSONAL</option>
                </select>
                {productType === "FEED" && (
                    <select value={organization} onChange={(e) => setOrganization(e.target.value)}>
                        <option value="SIDC">SIDC</option>
                        <option value="LIMCOMA">LIMCOMA</option>
                        <option value="NONE">NONE</option>
                    </select>
                )}
               
                <button type='submit'>
                    Add Product
                </button>
            </form>
        </>
    );
}
