import { useStateContext } from "../contexts/ContextProvider";

export default function Product({ product_image, product_name, id, product_quantity, product_price, expiration_date }) {
    const { setCart } = useStateContext();
    const updateCartHandler = () => {
        setCart({
            id,
            product_name,
            product_price,
            product_image, 
            product_quantity
        });
    };
    return (
        <div className="item" key={id}>
            <img src={`${import.meta.env.VITE_IMAGE_API_URL}/${product_image}`} alt="item-img" className="item-img" />
            <div className="item-content">
                <span className="item-text"><strong>Name: </strong>{product_name}</span>
                <span className="item-text"><strong>Quantity: </strong>{product_quantity}</span>
                <span className="item-text"><strong>Price: </strong>{product_price} Php</span>
                <span className="item-text"><strong>Expiration date: </strong>{expiration_date}</span>
                <div className="item-add-btn">
                    <button onClick={updateCartHandler}>Add</button>
                </div>
            </div>
        </div>
    );
}
