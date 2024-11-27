import { Navigate, Outlet, Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useStateContext } from '../contexts/ContextProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faGear, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from "react";
import axiosService from "../views/axios-client";
import Loader from "../Loader/Loader";
import Notication from "../Notification/Notification.jsx";
import SearchBox from "../Search/SearchBox.jsx";
export default function DefaultLayout() {
    const { user, setUser, token, setToken } = useStateContext();
    const [notifVisible, setNotifVisible] = useState(false);
    const [notifChecked, setNotifChecked] = useState(false);
    const [hasNotif, setHasNotif] = useState(false);
    const navigate = useNavigate(); 
    const [search, setSearch] = useState("");
    if (!token) {
        return <Navigate to="/login" />;
    }
    useEffect(() => {
        axiosService.get("/user")
            .then(({ data }) => {
                setUser(data);
            });
    }, []);
    
    return (
        <>
            <header className="headerDiv">
                <div className="headOne">
                    <img src="/Image/New-Logo.png" alt="COTECHTION Logo" />
                    COTECHTION 
                </div>
                <div className="headTwo">
                    <div className="searchBar">
                        <div className="searchIcon">
                            <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} color="white" />
                        </div>
                        <div className="search">
                            <input type="search" onChange={(e) => setSearch(e.target.value)} placeholder="Search For Anything" className="sBar" />
                        </div>
                        {search && (
                            <SearchBox search={search} />
                        )}        
                    </div>
                </div>
                <div className="headThree">
                    <div className="circleIcon">
                        <FontAwesomeIcon icon={faEnvelope} onClick={() => navigate("/settings")} />
                    </div>
                    <div className="circleIcon">
                        <FontAwesomeIcon icon={faBell} onClick={() => setNotifVisible(true)} />
                        {notifVisible && (
                            <Notication setNotifVisible={setNotifVisible} notifVisible={notifVisible} setHasNotif={setHasNotif} />
                        )}

                        {hasNotif && (<span className="notif-red-dot"></span>)}
                    </div>
                    <div className="circleIcon">
                        <FontAwesomeIcon icon={faUser} onClick={() => navigate("/settings")} />
                    </div>
                    <div className="circleIcon">
                      
                        <FontAwesomeIcon icon={faGear} onClick={() => navigate("/settings")} />
                    </div>
                </div>
            </header>
            <section>
                <div className="side-section">
                    <div className="user-profile">
                        <img src="/Image/user-logo.png" alt="User Profile" /><br/>
                        <span>{user.position}</span>
                    </div>
                    <nav>
                    {user.position === "CASHIER" && (<>
                        <Link to="/products/faultry" className="navigations">POS</Link>
                        <Link to="/product-list" className="navigations">List</Link>
                    </>
                    )}
                    {user.position === "COOPERATIVE HEAD" && (<>
                         <Link to="/statistics" className="navigations">Product Status</Link>
                          <Link to="/sales" className="navigations">Product Sales</Link>
                          <Link to="/accounts" className="navigations">Acc log</Link>
                    </>
                    )}
                    {user.position === "INVENTORY MANAGER" && (<>
                        <Link to="/manage" className="navigations">Manage</Link>
                    </>
                    )}
                        
                        
                         
                      
                    </nav>
                </div>
                <main className="main-cotainer">
                    <Outlet />
                </main>
            </section>
        </>
    );
}
