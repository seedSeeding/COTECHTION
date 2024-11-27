import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-regular-svg-icons';

import UpdateProductModal from "../ProductComponents/UpdateProductModal";
import apiService from "../components/Services/apiService";
import axiosService from "../views/axios-client";

export default function SearchBox({ search }) {
    const [searchedData, setSearchedData] = useState([]);
    const [closeModal, setCloseModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const openFormModal = (item) => {
        setSelectedItem(item);
        setCloseModal(true);
    };

    useEffect(() => {
        if (search) {
            axiosService.get("search", {
                params: { search: search }
            })
            .then(({ data }) => {
                setSearchedData(data);
            })
            .catch((err) => {
                console.error("Something went wrong", err);
            });
        } else {
            setSearchedData([]); 
        }
    }, [search]);

    return (
        <>
            <div className="search-box">
                {searchedData.length > 0 ? (
                    <div className="searched-container">
                        <div className="searched-header">
                            <span>Results for &#34;{search}&#34;</span>        
                        </div>
                        {searchedData.map((item) => (
                            <div key={item.id} className="searched-item" onClick={() => openFormModal(item)}>
                                <span>{item.product_name}</span>
                                <span>{item.product_price} PHP</span>
                                <span>{item.product_type}</span>
                                {
                                    item.product_catigory != "NONE" && (
                                        <span>{item.product_catigory}</span>
                                    )
                                }
                            </div>
                        ))}
                    </div>
                ) : (
                    <span>No results for &#34;{search}&#34;</span>
                )}
                {closeModal && (
                    <UpdateProductModal item={selectedItem} setCloseModal={setCloseModal} closeModal={closeModal} />
                )}
            </div>    
        </>
    );
}
