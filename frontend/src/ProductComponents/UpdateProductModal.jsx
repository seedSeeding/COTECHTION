import { useState, useEffect } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import apiService from '../components/Services/apiService';
import { useStateContext } from '../contexts/ContextProvider';
import axiosService from '../views/axios-client';

export default function UpdateProductModal({ item, closeModal, setCloseModal }) {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productDate, setProductDate] = useState('');
    const [productExpDate, setProductExpDate] = useState('');
    const [productType, setProductType] = useState('FAULTRY');
    const [organization, setOrganization] = useState(item.product_type == "FAULTRY" ? item.product_category : "NONE");
    const [error, setError] = useState('');
    const [stockLimit, setStockLimit] = useState('');
    const { user } = useStateContext();

    useEffect(() => {
        if (item) {
            setProductName(item.product_name || '');
            setProductPrice(item.product_price || '');
            setProductQuantity(item.product_quantity || '');
            setProductDate(item.product_date || '');
            setProductExpDate(item.expiration_date || '');
            setProductType(item.product_type || 'FAULTRY');
            setStockLimit(item.stock_limit || '');
            setOrganization(item.product_type == "FAULTRY" ? item.product_category : "NONE");
        }
    }, [item]);

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        if (!productName || !stockLimit || !productPrice || !productQuantity || !productExpDate || !productDate) {
            setError('All fields are required!');
            return;
        }

        setError(''); 

        const formattedDate = moment(productDate).format("YYYY-MM-DD");
        const formattedExpDate = moment(productExpDate).format("YYYY-MM-DD");

        const formData = {
            product_type: productType,
            product_name: productName,
            product_price: Number(productPrice),
            product_quantity: Number(productQuantity),
            product_date: formattedDate,
            stock_limit: Number(stockLimit),
            expiration_date: formattedExpDate,
            product_catigory: organization,
            user_email: user.email
        };

        try {
            const response = await axiosService.put(`products/${Number(item.id)}`, formData);

            alert('Product Updated Successfully');
            console.log('Product Updated:', response.data);

            setProductName('');
            setProductPrice('');
            setProductQuantity('');
            setProductDate('');
            setProductExpDate('');
            setProductType('FAULTRY');
            setOrganization('NONE');

            setCloseModal(false);
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

    return (
        <div className='modal-overlay'>
            <div className='update-modal-form'>
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
                        type="number"
                        placeholder="Stocks"
                        value={stockLimit}
                        onChange={(e) => setStockLimit(e.target.value)}
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

                    <select
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                    >
                        <option value="SIDC">SIDC</option>
                        <option value="LIMCOMA">LIMCOMA</option>
                        <option value="NONE">NONE</option>
                    </select>

                    <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                    >
                        <option value="FAULTRY">FAULTRY</option>
                        <option value="HOUSEHOLD">HOUSEHOLD</option>
                        <option value="LUANDRY">LAUNDRY</option>
                        <option value="PERSONAL">PERSONAL</option>
                    </select>

                    <div className="edit-btn">
                        <button type="submit" className="update-btn">UPDATE</button>
                        <button type="button" className="cancel-btn" onClick={() => setCloseModal(false)}>
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

UpdateProductModal.propTypes = {
    item: PropTypes.shape({
        product_name: PropTypes.string,
        product_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        product_quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        product_date: PropTypes.string,
        expiration_date: PropTypes.string,
        product_image: PropTypes.any,
        product_type: PropTypes.string,
        product_category: PropTypes.string,
        id: PropTypes.number.isRequired,
        stock_limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }).isRequired,
    setCloseModal: PropTypes.func.isRequired,
    closeModal: PropTypes.bool.isRequired
};
