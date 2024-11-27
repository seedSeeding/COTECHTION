import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function getDays(startDate, endDate) {
    const differenceInMilliseconds = endDate - startDate;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.floor(differenceInMilliseconds / millisecondsPerDay);
}

function getDaysPer(currentVsExp, differenceInDays) {
    return Math.min((currentVsExp / differenceInDays) * 100, 100);
}

function get_status(current, limit) {
    return (current / limit) * 100;
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

export default function ProductRow({ product }) {
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [batchNumber, setBatchNumber] = useState(product.batch[0]?.batch || 0); 
    
    function getDaysLeft(exp) {
        const expDate = new Date(exp);
        const currentTime = new Date().getTime();
        const differenceInTime = expDate.getTime() - currentTime;
        return Math.ceil(differenceInTime / (1000 * 3600 * 24));
    }

    const getDaysPercentage = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const differenceInDays = getDays(start, end);
        const currentVsExp = getDays(new Date(), end) + 1;
        return Math.floor(getDaysPer(currentVsExp, differenceInDays));
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
        if (product.batch.length > 0) {
            const selectedItem = product.batch.find((data) => Number(data.batch) === Number(batchNumber));
            setSelectedBatch(selectedItem || product.batch[0]);
        }
    }, [batchNumber, product.batch]);

    if (!selectedBatch) return <tr><td colSpan="5">Loading batch data...</td></tr>;

    const daysLeft = getDaysLeft(selectedBatch.expiration_date);
    const daysPercentage = getDaysPercentage(selectedBatch.product_date, selectedBatch.expiration_date);

    return (
        <tr>
            <td className="table-d rel">{formatID(selectedBatch.id)}</td>
            <td className="table-d rel">{selectedBatch.product_name}</td>
            <td className="table-d rel">{selectedBatch.product_quantity} pcs</td>
            
            <td className="table-d">
                {selectedBatch.product_quantity <= 20 && (
                    <div className="tooltip">
                        <span className="tooltiptext">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="stock-alert-icon" /><br />
                            <span className="text-alert"> Need to re-stock</span>
                        </span>
                    </div>
                )}
                <div className="status-bar-container">
                    <div
                        className="status-bar"
                        style={{
                            width: `${get_status(selectedBatch.product_quantity, selectedBatch.stock_limit)}%`,
                            backgroundColor: `${get_stock_color(selectedBatch.product_quantity)}`
                        }}
                    />
                </div>
            </td>

            <td className="table-d select rel">
                <select value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} className="select-batch">
                    {product.batch.length ? product.batch.map((data) => (
                        <option value={data.batch} key={data.id}>Batch {data.batch}</option>
                    )) : <option>No batches available</option>}
                </select>
                <div className="status-bar-container">
                    <div
                        className="status-bar"
                        style={{
                            width: `${daysPercentage}%`,
                            backgroundColor: `${daysLeft < 30 ? "#ff914d"
                                : daysLeft < 60 ? "#ffde59"
                                    : daysLeft < 100 ? "#c1ff72"
                                        : "#0bcc0d"}`
                        }}
                    >
                        {Math.abs(daysLeft)} days left
                    </div>
                </div>
            </td>
        </tr>
    );
}
