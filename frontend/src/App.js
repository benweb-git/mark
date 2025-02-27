import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_general_home_details } from './store/reducers/homeReducer';
import { HomeDetailsContext } from './context/HomeContext'; 

// Page imports
import Home from './pages/Home';
import Detailscurrency from './pages/Detailscurrency';
import Payment from './pages/Payment';
import Login from './pages/Admindashboard/Auth/Login';
import Dashboard from './pages/Admindashboard/Dashboard';
import NotFound from './pages/NotFound';

// Component imports
import Index from './components/Dashboardcomp/Index';
import CreateAd from './components/Dashboardcomp/CreateAd';
import HomeDetails from './components/Dashboardcomp/HomeDetails';
import Socials from './components/Dashboardcomp/Socials';
import Coins from './components/Dashboardcomp/Coins';
import CoinDetails from './components/Dashboardcomp/CoinDetails';
import Participant from './components/Dashboardcomp/Participant';
import CoinNetwork from './components/Dashboardcomp/CoinNetwork';
import Createnetwork from './components/Dashboardcomp/Createnetwork';
import ProtectUser from './utilities/ProtectUser';
import ContactDashboard from './components/Dashboardcomp/ContactDashboard';

// Create a context for homeDetails



const App = () => {
  const dispatch = useDispatch();
  const { loading, error,generalhomeDetails } = useSelector(state => state.home);

  const config = {
    frontendHost: process.env.REACT_APP_FRONTEND_HOST || 'http://localhost:8000',
    dashboardRoute: process.env.REACT_APP_DASHBOARD_ROUTE || 'dashboard',
    loginRoute: process.env.REACT_APP_LOGIN_ROUTE || 'login',
    backendHost: process.env.REACT_APP_BACKEND_HOST || 'http://localhost:9000'
};



  useEffect(() => {
    dispatch(get_general_home_details()); // Remove the conditional check
  }, [dispatch]); 

  // You might want to show a loading state while fetching initial data
  if (loading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  if (error) {
    return <div>Error loading data: {error}</div>; // Replace with your error component
  }

  return (
    <HomeDetailsContext.Provider value={generalhomeDetails}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/giveaway/:coinsym" element={<Detailscurrency />} />
          <Route path="/giveaway/participation/:coinsym" element={<Payment />} />
          <Route path={`/${config.loginRoute}`} element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route path={`/${config.dashboardRoute}`} element={<ProtectUser />}>
            <Route element={<Dashboard />}>
              <Route index element={<Index />} />
              <Route path="create" element={<CreateAd />} />
              <Route path="home/info" element={<HomeDetails />} />
              <Route path="socials" element={<Socials />} />
              <Route path="coin" element={<Coins />} />
              <Route path="coin/:id" element={<CoinDetails />} />
              <Route path="token" element={<CoinNetwork />} />
              <Route path="token/:coinName/:networkId" element={<Createnetwork />} />
              <Route path="participant" element={<Participant />} />
              <Route path="contacts" element={<ContactDashboard />} />
            </Route>
          </Route>

          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </HomeDetailsContext.Provider>
  );
};

export default App;