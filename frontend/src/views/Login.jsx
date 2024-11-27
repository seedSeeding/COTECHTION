import  { useState ,useRef, useEffect} from 'react';
import { Navigate, useNavigate } from 'react-router-dom'; 
import { useStateContext } from '../contexts/ContextProvider';
import axiosService from './axios-client';
import { Link } from 'react-router-dom';
export default function Login() {
    
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [redirect, setRedirect] = useState(false); 
    const { token,setToken , setUser , user} = useStateContext();
    const [position,setPosition] = useState(null);
    console.log(token);
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
        
            
            const response = await axiosService.post("login",{
                
                    email: emailRef.current.value,
                    password: passwordRef.current.value
                });

            const data = response.data;

            if (response.status === 200 ) {
                if(!data.isVerified){
                    alert("Verify Your Email");
                     navigate(`/verify-email/${data.user_id}`);
                    return;
                }

                    console.log("Login Successful:", data);
                    setToken(data.token);
                    setRedirect(true);
                    setPosition(data.position);   
                 
               
                
                return  data.position == "COOPERATIVE HEAD" ?   navigate("/accounts") :
                        data.position == "CASHIER" ? navigate("/products/faultry") :  
                        data.position == "INVENTORY MANAGER" ? navigate("/manage"):
                        navigate("/") ;
            } else {
                console.error("Error:", data.message);
                setError(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while logging in.");
        }
    };

  
   

    return (
        <>
            <div className='login-form-container'>
                <form onSubmit={handleLogin} className='login-form'>
                    <h2 className='login-title'>Log In</h2>
                   
                    <div className='login-input-row'>
                        <input
                            placeholder='Email'
                            type="email"
                            ref = {emailRef}
                            required
                        />
                    </div>
                    <div className='login-input-row'>
                        <input
                            placeholder='Password'
                            type="password"
                            ref = {passwordRef}
                            required
                        />
                        <span className='text-small forget-pass'>Forget Your Password?</span>
                    </div>
                    <button type="submit">Log in</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <span className='text-small email-pass'> <Link to="/register">Register</Link></span>
                </form>

                <div className='welcome-message'>
                    <div>
                        <h1>WELCOME TO<br />
                            COTECHTION:AIMS!
                        </h1>
                        <span>
                            Register with your personal details to<br /> use all of site features
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
