import { useEffect, useState } from "react";
import BarGraph from "../ProductComponents/BarGraph";
import apiService from "../components/Services/apiService";
import CircleLoader from "../Loader/CircleLoader";
import Loader from "../Loader/Loader";
import axiosService from "./axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
export default function ProductSales() {
  const [dataImages, setDataImages] = useState({});
  const [data, setData] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [productData, setProductData] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [width, setWidth] = useState(200);
  const [productType, setProductType] = useState('FEED');
  const [isLoading, setIsloading] = useState(true);
  const {user} = useStateContext();
  const navigate = useNavigate();
  
  useEffect(() => {
      if(user.position != "COOPERATIVE HEAD"){
          return navigate("/");
      }
     },[])
    
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  useEffect(() => {
    setIsloading(true);
    axiosService.get('products')
      .then(({ data }) => {
        setProductData(data);
        setIsloading(false);
        
      })
      .catch((error) => {
        console.error(error.message);
      });
    setIsloading(false);
  }, []);

  useEffect(() => {
    setIsloading(true);
    setData(null);
    if (productData.length > 0) {
      axiosService.get("sales-report", { params: { filter_date: date } })
        .then(({ data }) => {
          setData(data.sales);
          
        })
        .catch((error) => {
          console.error(error.message);
        });

      const imageMap = {};
      let newWidth = 200;
      productData.forEach((element) => {
        if (element.product_type === productType) {
          newWidth += 100;
          imageMap[element.product_name] = "http://localhost:8000/storage/" + element.product_image;
        }
      });
      setWidth(newWidth);
      setDataImages(imageMap);
    }
    setIsloading(false);
  }, [date, productData, productType]);

  useEffect(() => {
    setFilteredSales([]);
    if (data) {
      
      const salesData = data
        .filter(element => element.product_type === productType)
        .map(element => ({
          name: element.product_name,
          value: element.total_quantity,
          product_id: element.product_id,
        }));
      setFilteredSales(salesData);
    
    }
  }, [data, productType]);

  return (
    <div className="container product-sales">
      {isLoading && (<Loader/>)}
      <div className="sales-nav">
        <button className="food-sale-btn" onClick={() => setProductType('FOOD')}>FOOD</button>
        <button className="food-sale-btn" onClick={() => setProductType('FEED')}>PIG FEEDS</button>
        <button className="food-sale-btn" onClick={() => setProductType('HOUSEHOLD')}>HOUSEHOLD ITEMS</button>
        <button className="food-sale-btn" onClick={() => setProductType('PERSONAL')}>PERSONAL CARE ITEMS</button>
        <button className="food-sale-btn" onClick={() => setProductType('LAUNDRY')}>LAUNDRY ITEMS</button>
        <input 
          type="date" 
          className="food-sale-date" 
          onChange={handleDateChange} 
          value={date} 
        />
      </div>
      {isLoading ? (
        <CircleLoader message="Fetching data..."/>
      ): (
        <div className="graph-container">
        {filteredSales ? (
           <BarGraph className="bargraph" img={dataImages} data={filteredSales} width={width} />
        ):
          (<>
              <h1 >No Records</h1>
          </>)}
      </div>
      )}
    </div>
  );
}
