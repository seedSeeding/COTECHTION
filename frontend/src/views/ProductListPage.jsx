import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import apiService from '../components/Services/apiService';
import { useStateContext } from '../contexts/ContextProvider';
import CircleLoader from "../Loader/CircleLoader.jsx";
import axiosService from './axios-client.js';
import { useNavigate } from 'react-router-dom';
export default function ProductListPage() {

    const [products, setProducts] = useState([]);
  
    const [loading, setLoading] = useState(false);

    const { setCart } = useStateContext();
    
    const { user } = useStateContext();
    
    const navigate = useNavigate();
    useEffect(() => {
        if(user.position != "CASHIER"){
            return navigate("/");
        }
       },[])
        
    const updateCartHandler = (id,product_name,product_price,product_image,product_quantity) => {
        setCart({
            id,
            product_name,
            product_price,
            product_image, 
            product_quantity
        });
    };
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                setLoading(true);
                const response = await axiosService.get('products');
                console.log(response.data)
                if(response.data.message){
                    setProducts([]);     
		}else{
                setProducts(response.data); 
                console.log('Products fetched:', response.data);

               
}
            } catch (error) {
                console.error('Error fetching products:', error);
                alert('Failed to load products. Please try again.');
            }
        };

        fetchProducts();
        setLoading(false);
        
    }, []); 
    return (
        <>
            <div className='cashier-table'>
            <table className="manage-table ">
                <thead>
                    <tr>
                        <th className="manage-table-header">Product<br/>Image</th>
                        <th className="manage-table-header">Product<br/>Name</th>
                        <th className="manage-table-header">Product<br/>Price</th>
                        <th className="manage-table-header">Product<br/>Date</th>
                        <th className="manage-table-header">Product<br/>Exp Date</th>
                        <th className="manage-table-header">Action</th>
                    </tr>
                </thead>                   
                <tbody>
                {loading ? (
                        <CircleLoader message="Fetching products.." />
                    ) :
                                    
                    products.map((item) => (
                        <tr key={item.id}>
                            <td className="manage-table-d">
                                <img 
                                    src={`${import.meta.env.VITE_IMAGE_API_URL}/${item.product_image}`} 
                                    alt={item.product_name} 
                                />
                            </td>
                            <td className="manage-table-d">{item.product_name}</td>
                            <td className="manage-table-d">&#8369;{item.product_price}</td>
                            <td className="manage-table-d">{String(item.created_at).split(":")[0]}</td>
                            <td className="manage-table-d">{item.expiration_date}</td>
                            <td className="manage-table-d btn">
                            <button className='list-select-btn' onClick={() => updateCartHandler(
                                 item.id,
                                 item.product_name,
                                 item.product_price,
                                 item.product_image, 
                                 item.product_quantity
                            )}>SELECT</button>
                               
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
            </div>
        </>
    );
}
