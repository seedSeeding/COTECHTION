import { Outlet, Navigate } from "react-router-dom"; // Combine imports
import { useStateContext } from '../contexts/ContextProvider';

export default function GuestLayout() {
    const { token } = useStateContext();

    // Redirect to /products if the user is already authenticated
    if (token) {
        return <Navigate to="/products/faultry" />;
    }

    return (
        <section className="login-container">
            <Outlet />
        </section>
    );
}
