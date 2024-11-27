import { createContext, useState, useContext } from "react";

const stateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
    cart: [],
    setCart: () => { },
    clearCart: () => {},
    imageServerPath: `http://localhost:8000/storage`
});

export const ContextProvider = ({ children }) => {

    const [user, setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem("token") || null);
    const [cart, _setCart] = useState([]);
    const setToken = (token) => {
        _setToken(token);
        if (token) {

            localStorage.setItem("token", token);
            
        } else {
            localStorage.removeItem("token");
            
        }
    };
    const setCart = (newItem) => {
        const existingProduct = cart.find(item => item.id === newItem.id);
        if (existingProduct) {
            _setCart(cart.map(item =>
                item.id === newItem.id ? { ...item, product_quantity: item.product_quantity + 1 }:item
            ));
        } else
            {
            _setCart([...cart, { ...newItem, product_quantity: 1 }]);
        }
        console.log(cart);
    };
    const clearCart = () => {
        _setCart([]);
    }

    return (
        <stateContext.Provider value={{ user, token, setUser, setToken,clearCart, setCart, cart }}>
            {children}
        </stateContext.Provider>
    );
};

export const useStateContext = () => useContext(stateContext);
