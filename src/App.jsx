import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation,useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from './components/Layout';
import Analytics from './pages/newdashboard';
import Index from './pages/Index';
import AddClientForm from './pages/addClientForm';
import AllClients from './pages/allClient';
import AllCollectors from './pages/AllCollectors';
import AddCollectorForm from './pages/addCollectorForm';
import ClientHub from './pages/ClientHub';
import Patient from './pages/Patients';
import Screen4TestForm from './pages/FSForm';
import Screen4Details from './pages/clientDetails';
import Report from './pages/report';
import JobRequestForm from './pages/jobRequestForm';
import JobRequests from './pages/jobRequest';
// import BarcodeImageScanner from './components/test';
import RefusalForm from './pages/refusalform/RefusalForm';




function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <ScrollToTop /> */}

        <Routes>
          <Route path='/' element={<Index />} />
          <Route path="/dashboard" element={<Layout><Analytics /></Layout>} />
          <Route path="/clients" element={<Layout><AllClients /></Layout>} />
          <Route path="/clients/:id" element={<Layout><ClientHub /></Layout>} />
          <Route path="/clients/overview" element={<Layout><ClientHub /></Layout>} />
          <Route path="/collectors" element={<Layout><AllCollectors /></Layout>} />
          <Route path="/addclient" element={<Layout><AddClientForm /></Layout>} />
          <Route path="/addcollector" element={<Layout><AddCollectorForm /></Layout>} />
          <Route path="/addclient/:id" element={<Layout><AddClientForm /></Layout>} />
          <Route path="/addcollector/:id" element={<Layout><AddCollectorForm /></Layout>} />
          <Route path='/data' element={<Layout><Patient /></Layout>} />
          <Route path='/jobrequests' element={<Layout><JobRequests /></Layout>} />
          <Route path="/refusalform" element={<Layout><RefusalForm /></Layout>} />
          <Route path="/refusalform/:jobId" element={<Layout><RefusalForm /></Layout>} />
         {/* / <Route path='/dashboard/profile' element={<Layout><Profile /></Layout>} /> */}
          <Route path='/screen4testform' element={<Layout><Screen4TestForm /></Layout>} />
          <Route path='/screen4testform2' element={<Layout><JobRequestForm /></Layout>} />
          <Route path="/dashboard/:id" element={<Layout><Screen4Details /></Layout>} />
          <Route path="/jobrequest/:id" element={<Layout><JobRequestForm /></Layout>} />
          <Route path="/report" element={<Layout><Report /></Layout>} />
          {/* <Route path="/test" element={<BarcodeImageScanner />} /> */}
           <Route path="/coc-form" element={<JobRequestForm />} />

          {/* Fallback - catch-all to avoid 'No routes matched' messages */}
          <Route path="*" element={<Index />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;