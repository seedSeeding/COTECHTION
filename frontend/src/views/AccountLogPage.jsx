import { useEffect, useState } from "react"
import Loader from "../Loader/Loader";
import axiosService from "./axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
export default function AccountLogPage() {
    
    const [isLoading, setIsloading] = useState(true);
    const [users, setUsers] = useState([]);
    
    const {user} = useStateContext();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(user.position != "COOPERATIVE HEAD"){
            return navigate("/login");
        }
       },[])
        
    useEffect(() => {
        setIsloading(true);
        axiosService.get('acc-log').
            then((response) => {
                console.log("datas",response.data);
                setUsers(response.data)
               
                setIsloading(false);
            }).catch(({ message }) => {
                alert(message);
                setIsloading(false);
            })
            setIsloading(false);
    }, []);
    
    return (
        <>
            <div className="container">
                {isLoading && (<Loader />)}
                <table className="acc-log-table">
                    <thead>
                    <tr>
                        <th className="table-header ">DATE</th>
                        <th className="table-header ">TIME</th>
                        <th className="table-header ">ACCOUNT</th>
                        <th className="table-header ">ACTIVITY</th>
                        <th className="table-header ">LOGOUT</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                            {
                            users.map((data) => (
                                <tr key={data.id}>
                                    <td className="table-d">{data.login_time.split(" ")[0]}</td>
                                    <td className="table-d">{data.login_time.split(" ")[1]}</td>
                                    <td className="table-d">{data.account} </td>
                                    <td className="table-d">{ data.activity}</td>
                                    <td className="table-d">{data.logout_time != null ? data.logout_time.split(" ")[1] : "????-??-??" }</td>
                                </tr>
                            ))
                            
                      
                        }
                    </tbody>
                                   </table>
            </div>
        </>
    )
}