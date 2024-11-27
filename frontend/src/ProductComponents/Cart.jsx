import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import apiService from "../components/Services/apiService";
import axiosService from "../views/axios-client";
export default function Cart() {
    const {cart,clearCart} = useStateContext();
    
    const [cartOpen, setCartOpen] = useState(false);

    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        setTotalPrice(0);
        const totalPriceArray = cart.map(item => item.product_quantity * item.product_price);
        totalPriceArray.forEach((price) => setTotalPrice(price + totalPrice));
        console.log(totalPrice);
    }, [cart])
    
    const handleSaveSale = () => {
        cart.forEach((item) => {
            axiosService.post('store', {
                'product_id': item.id,
                'quantity': item.product_quantity 
            })
            .then((response) => {
                if (response.status === 201) {
                    alert('Done');
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .catch((error) => {
                alert(error.message);
            });
        });
        clearCart();
    };
    
        
    return (
        <>
            <div  className="cart">
                <button className="cart-open-btn" onClick={() => setCartOpen(!cartOpen)}>
                        <FontAwesomeIcon icon={faListAlt}/>
                </button>
                {cartOpen && (
                     <div className="cart-container">
                                <div className="cart-items">
                                <table className="cart-table">
                                    <thead>
                                        <tr>
                                            <td >Image</td>
                                            <td>Product Name</td>
                                            <td>Product Price</td>
                                            <td>Product Quantity</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map((data) => (
                                            <tr key={data.id}>
                                                <td className="image-row"><img src={`${import.meta.env.VITE_IMAGE_API_URL}/${data.product_image}`} alt="" /></td>
                                                <td>{ data.product_name}</td>
                                                <td>{ data.product_price}</td>
                                                <td>{ data.product_quantity }</td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                        </div>
                        <div className="cart-footer">
                            <div className="cart-total-price">
                                { totalPrice }&#8369;
                            </div>
                            <div className="cart-btn">
                                <button onClick={handleSaveSale}>CONFRIM</button>
                            </div> 
                        </div>
                        </div>        
                        )}
                </div>
                    
                

            
        </>
    );
}