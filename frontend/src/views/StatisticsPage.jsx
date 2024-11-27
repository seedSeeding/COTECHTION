import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import ProductRow from "../ProductStatusComponents/ProductRow";
import axiosService from "./axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
function getDays(startDate, endDate) {
    const differenceInMilliseconds = endDate - startDate;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.floor(differenceInMilliseconds / millisecondsPerDay);
}

function getDaysPer(currentVsExp, differenceInDays) {
    return Math.min((currentVsExp / differenceInDays) * 100, 100);
}

function get_status(current,limit) {
    const calculated = (current / limit) * 100;

    return calculated;
}
function get_stock_color(current) {

    if (current <= 20) {
        return "#ff914d";
    } else if (current < 40) {
        return "#ffde59";
    } else if (current < 60) {
        return "#c1ff72";
    } else {
        return "#0bcc0d";
    }
}

export default function StatisticsPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsloading] = useState(true);
    const [productsByBatch,setProductsByBatch] = useState([]);
    const {user} = useStateContext();
    const navigate = useNavigate();
    useEffect(() => {
        if(user.position != "COOPERATIVE HEAD"){
            return navigate("/404 not found");
        }
       },[])
        
    function getDaysLeft(exp) {
        exp = new Date(exp);
        const differenceInTime = exp.getTime() - new Date().getTime();
        const differenceInDays = Math.ceil(Math.abs(differenceInTime) / (1000 * 3600 * 24));
        return differenceInDays;
    }

    const getDaysPercentage = (_startDate, _endDate) => {
        const startDate = new Date(_startDate); 
        const endDate = new Date(_endDate);   
        const differenceInDays = getDays(startDate, endDate);
        const currentVsExp = getDays(new Date(), endDate) + 1;    
        //console.log("start date: ", startDate, " enddate: ", endDate, "differenceInDays: ", differenceInDays);
        //console.log(getDaysPer(currentVsExp, differenceInDays));
        const percentage = Math.floor(getDaysPer(currentVsExp, differenceInDays));
        //alert(differenceInDays);
        return percentage;
    }

    const formatID = (id) => {
        id = String(id);
        if (id.length === 2) {
            return "0" + id;
        } else if (id.length === 1) {
            return "00" + id;
        } else {
            return id;
        }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            setIsloading(true)
            try {
                const response = await axiosService.get('products', {});
                setProducts(response.data); 
                //console.log('Products fetched:', response.data);
                setIsloading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                alert('Failed to load products. Please try again.');
            }
        };

        fetchProducts();
        setIsloading(false);
    }, []); 

    useEffect(() => {
        const fetchProducts = async () => {
           
            try {
                const response = await axiosService.get('product-by-batch', {});
                setProductsByBatch(response.data);
                //sconsole.log('Products by batch fetched:', response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                alert('Failed to load products. Please try again.');
            }
        };

        fetchProducts();
       
    }, []); 

    return (
        <div className="container">
            {isLoading && (
                <Loader/>
            )}
            <table className="stat-table">
                <thead>
                    <tr>
                        <th className="table-header id">ID</th>
                        <th className="table-header product">Product</th>
                        <th className="table-header quan">Quantity</th>
                        <th className="table-header stat">Status</th>
                        <th className="table-header exp">Exp Date</th>
                    </tr>
                </thead>
                <tbody>
                    {/*products.map((item) => (
                        <tr key={item.id}>
                            <td className="table-d">{formatID(item.id)}</td>
                            <td className="table-d">{item.product_name}</td>
                            <td className="table-d">{item.product_quantity} pcs</td>
                            <td className="table-d">
                                <div className="status-bar-container">
                                    <div className="status-bar" style={{
                                        width: `${getDaysPercentage(item.product_date, item.expiration_date)}%`,
                                        backgroundColor: `${getDaysLeft(item.expiration_date) < 30 ? "#ff914d"
                                            : getDaysLeft(item.expiration_date) < 60 ? "#ffde59"
                                                : getDaysLeft(item.expiration_date) < 100 ? "#c1ff72"
                                                    : "#0bcc0d"
                                            }`
                                    }}>
                                        {getDaysLeft(item.expiration_date)} days left
                                    </div>
                                </div>  
                            </td>
                            <td className="table-d">
                                { 
                                    item.product_quantity <= 20 && (
                                        <div className="tooltip">
                                            <span className="tooltiptext">
                                                <FontAwesomeIcon icon={faExclamationTriangle} className="stock-alert-icon"/><br/>
                                                Need to re-stock</span>
                                        </div>
                                    )
                                }
                                <div className="status-bar-container">
                                
                                    <div className="status-bar" style={{
                                        width: `${get_status(item.product_quantity, item.stock_limit)}%`,
                                        backgroundColor: `${get_stock_color(item.product_quantity)}`
                                    }}></div>
                                </div> 
                            </td>
                        </tr>
                    ))*/
                    productsByBatch.map((data) => (
                        <ProductRow key={data.product_name} product={data}/>
                    ))
                    }
                </tbody>
            </table>
        </div>
    )
}
