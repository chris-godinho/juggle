import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Auth from './utils/auth.js';

import App from './App.jsx'
import ErrorPage from './pages/ErrorPage';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import Donate from './pages/Donate';
import UserProfile from './pages/UserProfile';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: Auth.loggedIn() ? <Dashboard /> : <Home />
      }, {
        path: '/login',
        element: <Login />
      }, {
        path: '/signup',
        element: <Signup />
      }, {
        path: '/settings',
        element: <Settings />
      }, {
        path: '/donate',
        element: <Donate />
      }, {
        path: '/userprofile',
        element: <UserProfile />
      }, 
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
