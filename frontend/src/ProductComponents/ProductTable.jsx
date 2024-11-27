import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import apiService from '../components/Services/apiService';
import { useStateContext } from '../contexts/ContextProvider';
import CircleLoader from "../Loader/CircleLoader.jsx";
import axiosService from '../views/axios-client.js';
export default function ProductTable({ setIsEdit, setItem,setProducts,products }) {

    //const [products, setProducts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axiosService.get('products');
                console.log(response.data)
                if(response.data.message){
                    setProducts([]);     
		}else{
                setProducts(response.data); 
                console.log('Products fetssched:', response.data);

               
}
            } catch (error) {
                console.error('Error fetching products:', error);
                alert('Failed to load products. Please try again.');
            }
        };

        fetchProducts();
        setLoading(false);
        
    }, []); 

    const handleDeleteClick = (item) => {
        setProductToDelete(item);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosService.delete(`products/${productToDelete.id}`);
            setProducts(products.filter(product => product.id !== productToDelete.id));
            setShowDeleteModal(false);
           
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete the product. Please try again.');
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    return (
        <>
            <table className="manage-table">
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
                                <button className='btn-edit' onClick={() => {
                                    setIsEdit(true);
                                    setItem(item);
                                }}>
                                    <FontAwesomeIcon icon={faEdit} />
                                    EDIT
                                </button>
                                <button className='btn-del' onClick={() => handleDeleteClick(item)}>
                                    <FontAwesomeIcon icon={faTrashCan} />
                                    DELETE
                                </button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>

            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete {productToDelete?.product_name}?</p>
                        <div className="modal-actions">
                            <button onClick={handleConfirmDelete}>Yes, Delete</button>
                            <button onClick={handleCancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
