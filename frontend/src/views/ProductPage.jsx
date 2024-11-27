import {  useState , useEffect} from "react";
import { Outlet,Link, useNavigate } from "react-router-dom";
import Cart from "../ProductComponents/Cart";
import { useStateContext } from "../contexts/ContextProvider";
export default function ProductPage() {
    const { user } = useStateContext();
    const navigate = useNavigate();
    useEffect(() => {
        if(user.position != "CASHIER"){
            return navigate("/");
        }
       },[])
        
    
        return (
            <>      
    
                <div className="container">
                    <div className="product-nav-con">
                        <div className="products-nav">
                            <Link className="items-nav" to='/products/faultry'>Feed Items</Link>
                        </div>
                        <div className="products-nav">
                            <Link  className="items-nav" to='/products/household'>Household Items</Link>
                        </div>
                        <div className="products-nav">
                            <Link className="items-nav" to='/products/laundry'>Luandry items</Link>
                        </div>
                        <div className="products-nav">
                            <Link className="items-nav" to='/products/personal'>Personal Care</Link>
                        </div>
                        </div>
                        <Cart/>
                    <div className="product-sec">
                        <Outlet />
                    </div>
                        
                </div>
            </>
        );
    
       
}