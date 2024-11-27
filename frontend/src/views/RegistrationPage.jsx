import { useState } from 'react';
import axiosService from './axios-client';
import { useNavigate } from 'react-router-dom';
import './register.css';

export default function RegistrationPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [position, setPosition] = useState('COOPERATIVE HEAD');
    const [message, setMessage] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false); 
    const [inputPassword, setInputPassword] = useState(''); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
    
        try {
            const response = await axiosService.post('register', {
                name,
                email,
                password,
                position,
            });
            
            if (response.status === 201) {
                navigate(`/verify-email/${response.data.user_id}`);
                return;
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error("Validation Errors:", error.response.data.errors);
                setMessage("Validation error. Please check your input.");
            } else {
                console.error("Error:", error);
                setMessage("An error occurred during registration.");
            }
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        
       axiosService.post("register-access",{
        "password":inputPassword,
       }).
       then((response) => {
            console.log("response",response)
            if (response.status === 200) {

                setIsAuthorized(true);
            } else {
                setMessage('Incorrect password. Please try again.');
            }
       }).catch( (error) =>  {
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        }
        setMessage("An error occurred during registration.");
       
    });

    };

    return (
        <div className="container-register">
            {!isAuthorized ? (
                <form onSubmit={handlePasswordSubmit} className="password-prompt-form">
                    <input
                        type="password"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                        placeholder="Enter password to access registration"
                        required
                        className="input-field"
                    />
                      <button className='register-btn' type='submit'>
                            <span class="circle1"></span>
                            <span class="circle2"></span>
                            <span class="circle3"></span>
                            <span class="circle4"></span>
                            <span class="circle5"></span>
                            <span class="text">Check</span>
                        </button>
                </form>
            ) : (
                <>
                    <h1 className="register-title">Register</h1>
                    <form onSubmit={handleSubmit} className="register-form">
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Name" 
                            required 
                            className="input-field"
                        />
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
                            required 
                            className="input-field"
                        />
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password" 
                            required 
                            className="input-field"
                        />
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="Confirm Password" 
                            required 
                            className="input-field"
                        />
                        <select 
                            value={position} 
                            onChange={(e) => setPosition(e.target.value)} 
                            className="select-field"
                        >
                            <option value="COOPERATIVE HEAD">COOPERATIVE HEAD</option>
                            <option value="CASHIER">CASHIER</option>
                            <option value="INVENTORY MANAGER">INVENTORY MANAGER</option>
                        </select>
                        
                        <button className='register-btn' type='submit'>
                            <span class="circle1"></span>
                            <span class="circle2"></span>
                            <span class="circle3"></span>
                            <span class="circle4"></span>
                            <span class="circle5"></span>
                            <span class="text">Register</span>
                        </button>
                       
                    </form>
                </>
            )}
            {message && <p className="message">{message}</p>}
        </div>
    );
}
