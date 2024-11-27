import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import apiService from "../components/Services/apiService";
import CircleLoader from "../Loader/CircleLoader.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import axiosService from "./axios-client.js";

export default function SettingsPage() {
    const { user, setUser, setToken , token} = useStateContext();

    const emailRef = useRef();
    const oldPasswordRef = useRef();
    const newPasswordRef = useRef();
    const confirmPasswordRef = useRef();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); 
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(false); 
    const navigate = useNavigate();
    useEffect(() => {
        axiosService.get("/user")
            .then(({ data }) => {
                setUser(data);
            })
            .catch(err => setError("Failed to fetch user data"));
    }, [setUser]);

   

    const formatDate = (date) => {
        date = String(new Date(date)).split(" ");
        return `${date[1]} ${date[0]} ${date[4].slice(0,-3)} ${date[7] === "Daylight" ? "AM" : "PM"}`;
    };

    useEffect(() => { 
        axiosService.get("notifications")
            .then(({ data }) => {
                setNotifications(data);
            })
            .catch((error) => {
                alert(error.message);
            });
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(""); 

        const id = user.id;
        const oldPassword = oldPasswordRef.current.value;
        const newPassword = newPasswordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;
        
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        axiosService.put("/update-password", {
            id: id,
            current_password: oldPassword,
            new_password: newPassword,
        })
        .then((response) => {
            setSuccess(response.data.message); 
            setError(""); 
            
            oldPasswordRef.current.value = "";
            newPasswordRef.current.value = "";
            confirmPasswordRef.current.value = "";
        })
        .catch((error) => {
            setError(error.response?.data?.message || "Failed to update password");
        })
        .finally(() => setLoading(false));
    };
  
    const onLogout = () => {
        const logout = async () => {
            try{
                const response = await axiosService.post("logout");
                if(response.status === 200){
                    setUser({});
                    setToken(null);

                }
                navigate("/login");
            } catch (error){
                console.error('Error fetching products:', error);
                alert('Failed to load products. Please try again.');
            }
            
        };
        logout();

        /*axiosService.post("/logout")
            .then(() => {
                setUser({});
                setToken(null);
                
            })
            .catch(err => setError("Failed to log out"))
            .finally(() => setOpenModal(false));
*/
            
    };
    return (
        <>
            <div className="container setting">
                <div className="setting-profile">
                    <img src="../../public/Image/user-logo.png" alt="" />
                    <span className="sett-prof-detail">
                        <span className="sett-prof-position">{user.position}</span><br />
                        <span className="sett-prof-email">{user.email}</span>
                    </span>
                </div>
                <div className="setting-content">
                    <form onSubmit={onSubmit}>
                        <strong>Change Password</strong>
                        <label htmlFor="com-email">Email:</label>
                        <input type="text" ref={emailRef} id="com-email" disabled placeholder="email address." value={user.email} />

                        <label htmlFor="com-old-pass">Old Password:</label>
                        <input type="password" id="com-old-pass" ref={oldPasswordRef} placeholder="old password." />
                        
                        <label htmlFor="com-new-pass">New Password:</label>
                        <input type="password" id="com-new-pass" ref={newPasswordRef} placeholder="new password." />

                        <label htmlFor="com-confirm-pass">Confirm Password:</label>
                        <input type="password" id="com-confirm-pass" ref={confirmPasswordRef} placeholder="confirm password." />

                        {error && <span className="setting-error">{error}</span>}
                        {success && <span className="setting-success">{success}</span>} 
                        
                        <div className="submit-btns">
                            <button type="submit" disabled={loading}>
                                {loading ? "Updating..." : "UPDATE"}
                            </button>
                        </div>
                    </form>
                    <div className="setting-main">
                        <div className="notif-content">
                            <div className="messages-list">
                            <strong>Emails</strong>
                            { notifications ? notifications.map((msg) => (
                                    <div className="message-item" key={msg.id}>
                                    <span className="star">★</span>
                                    <div className="message-info">
                                        <span className="subject">{msg.subject}</span>-
                                        <span className="snippet">{ msg.message}</span>
                                    </div>
                                    <span className="date">{ formatDate(msg.created_at)}</span>
                                </div>
                            )) : (
                                    <CircleLoader message="Load messages.." />
                                )}
                            </div>
                        </div>
                        <div className="notif-foot">
                            <button onClick={() => setOpenModal(true)}>Log Out</button>
                        </div>
                        {openModal && (
                            <div className="logout-modal">
                                <div className="logout-modal-content">
                                    <h2>Are you sure you want to log out?</h2>
                                    <div className="modal-actions">
                                        <button className="confirm-logout" onClick={onLogout} >Yes, Log Out</button>
                                        <button className="cancel-logout" onClick={() => setOpenModal(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
