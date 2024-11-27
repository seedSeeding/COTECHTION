import { createBrowserRouter } from 'react-router-dom';
import Login from './views/Login.jsx';
import DefaultLayout from './components/DefaultLayout.jsx'; 
import GuestLayout from './components/GuestLayout.jsx';
import AccountLogPage from './views/AccountLogPage.jsx';
import LogOutPage from './views/LogOutPage.jsx';
import ProductPage from './views/ProductPage.jsx';
import StatisticsPage from './views/StatisticsPage.jsx';
import SettingsPage from './views/SettingsPage.jsx';
import ManagePage from './views/ManagePage.jsx';
import Faultry from './components/Faultry.jsx';
import Personal from './components/Personal.jsx';
import Household from './components/Household.jsx';
import Laundry from './components/Laundry.jsx';
import ProductSales from './views/ProductSales.jsx';
import ProductListPage from './views/ProductListPage.jsx';
import NotFound from './notFound/NotFound.jsx';
import Verification from './views/Verification.jsx';
import RegistrationPage from './views/RegistrationPage.jsx';
import Food from './components/Food.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />, 
        children: [
            {
                path: 'products',
                element: <ProductPage />,
                children: [
                    { path: 'foods', element: <Food /> },
                    { path: 'faultry', element: <Faultry /> },
                    { path: 'household', element: <Household /> },
                    { path: 'laundry', element: <Laundry /> },
                    { path: 'personal', element: <Personal /> },
                ],
            },
            { path: 'sales', element: <ProductSales /> },
            { path: 'statistics', element: <StatisticsPage /> },
            { path: 'accounts', element: <AccountLogPage /> },
            { path: 'manage', element: <ManagePage /> },
            { path: 'settings', element: <SettingsPage /> },
            { path: 'logout', element: <LogOutPage /> },
            { path: 'product-list', element: <ProductListPage /> },
        ],
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            { path: 'login', element: <Login /> },
        ],
    },
    {
        path: '/verify-email/:id',
        element: <Verification />,
    },
    {
        path: '/register',
        element: <RegistrationPage />,
    },
    {
        path: '*',
        element: <NotFound />,
    },
    
]);

export default router;
