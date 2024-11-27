import { useEffect, useState } from "react";
import apiService from "../components/Services/apiService";
import axiosService from "../views/axios-client";

export default function Notication({setNotifVisible,setHasNotif,notifVisible}) {
    
    const [notifications ,setNotifications] = useState(null);
    const formatDate =(date) => {
        date = String(new Date(date)).split(" ");
        console.log(date);
        return `${date[0]} ${date[4].slice(0,-3)} ${date[7] == "Daylight" ? "AM" : "PM"}`;
    }
    useEffect(() => {
        axiosService.get("notifications")
            .then(({ data }) => {
                console.log("Fetched Notifications:", data);  
                const newNotifications = data;
                if (newNotifications) {
                    const filtered = newNotifications.filter(
                        (notification) => notification.seen === null && notification.percentage != null
                    );
                    setNotifications(filtered);
                    setHasNotif(filtered.length > 0);
                } else {
                    setHasNotif(false);
                }
            })
            .catch((error) => {
                alert(error.message);
            });
    }, [setNotifVisible]);
    
    
    
    const markSeen = (id) => {
        axiosService.post("mark-seen", {
            "id":id
        }).then((response) => {
            if (response.status === 200) {
                setNotifVisible(true);
                return;
            }
            alert("Something went wrong")
        })
        //setNotifVisible(false);
    }
    return (
        <>
            {notifications && (
                <div  className="notif-section">
                    <div className="notif-container">
                        <div className="notif-header">
                            <span >ALERTS!</span><button onClick={() => setNotifVisible(false)}>HIDE</button>
                        </div>
                        <div className="notifications">
                            {notifications.map((data) => (
                                <div className="notification" key={data.id}>
                                    <div className="percentage" style={{ color: data.percentage <= 30 ? 'red' : 'yellow' ,
                                                        borderColor:data.percentage <= 30 ? 'red' : 'yellow' }}>
                                        <span>{Math.floor(data.percentage)}%</span>

                                    </div>
                                    <div className="notification-content">
                                        <span className="notif-date">{formatDate(data.created_at)}</span>
                                        <span className="notif-message">{ data.message }</span>
                                    </div>
                                    <div className="notif-x-btn">
                                        <button onClick={() => markSeen(data.id)}>
                                            X
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}