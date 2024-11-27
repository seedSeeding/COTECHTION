import { useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import apiService from '../components/Services/apiService';
import { useStateContext } from '../contexts/ContextProvider';
import axiosService from '../views/axios-client';
import { layer } from '@fortawesome/fontawesome-svg-core';

export default function UpdateProductForm({ item,setItem}) {
    //alert("selected item : "+ item.product_name)
    //const [peoducts  ,setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productDate, setProductDate] = useState('');
    const [productExpDate, setProductExpDate] = useState('');
    const [productType, setProductType] = useState('FAULTRY');
    const [organization, setOrganization] = useState('SIDC');
    const [error, setError] = useState('');
    const [stockLimit, setStockLimit] = useState('');
    
  
    const [products,setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [batch, setBatch] = useState(0);
    const { user } = useStateContext();
 
    useEffect(() => {
        if (item) {
            setProductName(item.product_name || '');
            setProductPrice(item.product_price || '');
            setProductQuantity(item.product_quantity || "");
            setProductDate(item.product_date || "");
            setProductExpDate(item.expiration_date || '');
            setProductType(item.product_type || 'FAULTRY');
            setStockLimit(item.stock_limit || '');
            
            setOrganization(item.product_category || organization || '');
        }
    }, [item]);
    

    

    const handleUpdateProduct =  async (e) => {
        e.preventDefault();

        if (!productName || !stockLimit || !productPrice || !productQuantity || !productExpDate || !productDate) {
            setError('All fields are required!');
            return;
        }

        setError('');

        const formattedDate = moment(productDate).format("YYYY-MM-DD");
        const formattedExpDate = moment(productExpDate).format("YYYY-MM-DD");
       
        const formData = {
            'product_type': productType,
            'product_name': productName,
            'product_price':Number(productPrice),
            'product_quantity': Number(productQuantity),
            'product_date': formattedDate,
            'stock_limit': Number(stockLimit),
            'expiration_date': formattedExpDate,
            'product_catigory': organization,
            'user_email': user.email,
          
        }
        try {
            const response = await axiosService.put(`products/${Number(item.id)}`, formData);

            alert('Product Updated Successfully');
            console.log('Product Updated:', response.data);
            
          
          
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Something went wrong');
                console.error(error.response.data.errors);
            } else {
                setError('Failed to update product. Please try again.');
                console.error('Error:', error);
            }
        }
    };
    const handleAddBatch =  async () => {    
        if (!productName || !productPrice || !productQuantity || !stockLimit ||!productExpDate || !productDate) {
            alert('All fields are required!');
            return;
        }
        const formattedDate = moment(productDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        const formattedExpDate = moment(productExpDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        let productBatch = batch + 1;
        //alert(item.product_category);
        const formData = {
            'product_type': productType,
            'product_image': item.product_image, 
            'product_name': productName,
            'product_price': Number(productPrice),
            'product_quantity': Number(productQuantity),
            'stock_limit': Number(stockLimit),
            'product_date': formattedDate,
            'expiration_date': formattedExpDate,
            'product_catigory': organization, 
            "user_email":  user.email,
            "batch": productBatch
        }
        
        
        try {
            const response =  await axiosService.post('add-batch', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
 
                },
            });

    
            alert('Product Created Successfully');
            console.log('Product Added:', response.data);

        
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
    useEffect(() => {
        axiosService.get('product-by-batch')
        .then((response) => {
            if(response.data.message){
                setProducts([]);
        }else{
            setProducts(response.data); 
            console.log('filtered fetched:', response.data);
        }		  
        }).catch((error) => {
            console.error('Error fetching products:', error);
            console.log(response.status)
        });
    }, [item]); 

      useEffect(() => {
        
        const filtered = products.find((data) => data.product_name === item.product_name);
      
        if (filtered && filtered.batch.length > 0) {
        
          const lastBatch = Math.max(...filtered.batch.map(b => b.batch));
    
         const category = filtered.batch[0].product_category;
        setOrganization(category);
          setBatch(lastBatch);
        }
      }, [products]);
      
    return (
        <form onSubmit={handleUpdateProduct}>
            <h3>UPDATE PRODUCT</h3>
            {error && <p className="error">{error}</p>}

            <input
                type="text"
               
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
            />

            <input
                type="number"
               
                placeholder="Product Price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
            />

            <input
                type="number"
                placeholder="Product Quantity"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
            />
            <input
                type="date"
              
              
                placeholder="Product Date"
                value={productDate}
                onChange={(e) => setProductDate(e.target.value)}
            />

            <input
                type="date"
              
               
                placeholder="Product Expiry Date"
                value={productExpDate}
                onChange={(e) => setProductExpDate(e.target.value)}
            />
            <div className="edit-btn">
                <button type="submit" className="update-btn">UPDATE</button>
                <button type="button" className="batch-btn" onClick={handleAddBatch}>ADD<br/>BATCH</button>
                <button type="button" className="cancel-btn" onClick={() => window.location.reload()}>CANCEL</button>
            </div>
        </form>
    );
}

UpdateProductForm.propTypes = {
    item: PropTypes.shape({
        product_name: PropTypes.string,
        product_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        product_quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        product_date: PropTypes.string,
        expiration_date: PropTypes.string,
        product_image: PropTypes.any,
        product_type: PropTypes.string,
        product_category: PropTypes.string,
        id: PropTypes.number.isRequired
      

    }).isRequired,
};
