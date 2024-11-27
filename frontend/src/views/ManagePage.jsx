
import AddProductForm from '../ProductComponents/AddProductForm';
import ProductTable from '../ProductComponents/ProductTable.jsx';
import {  useEffect, useState } from 'react';
import UpdateProductForm from '../ProductComponents/UpdateProductForm';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import { useNavigate } from 'react-router-dom';

export default function ManagePage() {
    const [products, setProducts] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [item, setItem] = useState({});
    
    const { user } = useStateContext();

    const navigate = useNavigate();

    useEffect(() => {
       
        if(user.position != "INVENTORY MANAGER"){
            return navigate("/");
        }
       },[])

       return (
        <>
            <div className="container manage">
                <div className="add-product-con">
                    
                    {isEdit ? <UpdateProductForm item = {item} setItem /> : <AddProductForm/>}
                </div>
                <div className='table-container'>
                    <ProductTable setIsEdit={setIsEdit} setItem={setItem} setProducts ={setProducts} products ={products}/>    
                </div>
            </div>
        </>
    );
}
