import { useState } from 'react';
import axiosService from './axios-client';
import { useNavigate, useParams } from 'react-router-dom';

export default function Verification() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const sendVerificationCode = async () => {
        setLoading(true);
       
        try {
            const response = await axiosService.post('send-verification-code', { id });
            setMessage(response.data.message);
            setIsCodeSent(true);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const resendVerificationCode = async () => {
        setLoading(true);
        try {
            const response = await axiosService.post('resend-verification-code', { id });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        setLoading(true);
        try {
            const response = await axiosService.post('verify-code', { id, code });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
            navigate("/login");
        }
    };

    return (
        <div className="container-verify">
        <h2>Email Verification</h2>
        {isCodeSent && (
            <div>
                <input
                    type="text"
                    placeholder="Enter verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="input-code"
                />
                <button onClick={resendVerificationCode} disabled={loading} className="verify-btn resend">
                    Resend Verification Code
                </button>
            </div>
        )}
        <button onClick={isCodeSent ? verifyCode : sendVerificationCode} disabled={loading} className="verify-btn send">
            {loading ? 'Loading...' : (isCodeSent ? 'Verify Code' : 'Send Verification Code')}
        </button>
        {message && <p>{message}</p>}
    </div>
    
    );
    
}
