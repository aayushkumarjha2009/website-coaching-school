import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/nav";
import Footer from "./components/footer";

import Home from "./pages/home";
// import Login from "./pages/Login";
// import Admin from "./pages/Admin";
import EducationPolicy from "./pages/EducationPolicy.jsx";
import Login from "./pages/Login.jsx";
import AdminPage from "./pages/Admin-Landing.jsx";
import NotFoundPage from "./pages/Four04.jsx";
import PrivacyPolicy from "./pages/Privacy.jsx";
import MasterAdmin from "./pages/MasterAdmin.jsx";
import InputWithResultModal from "./pages/Dummy.jsx";
import AdminPageDashboard from "./pages/MasterAdminDashboard.jsx";
import AdmintRoute from "./AdmintRoute.jsx";

export default function App() {
  return (
    <Router>
      <div className="bg-gray-950 text-white font-[Poppins,sans-serif] min-h-screen flex flex-col">

        {/* <div className="pt-[72px] flex-grow"> */}
        <Routes>
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          {/* <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} /> */}
          <Route path="/education-policy" element={<><Navbar /><EducationPolicy /><Footer /></>} />
          <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
          <Route path="/master-admin" element={<MasterAdmin />} />
          <Route path="/master-admin/dashboard" element={<><Navbar /><AdminPageDashboard /><Footer /></>} />
          <Route path="/input" element={<><Navbar /><InputWithResultModal /><Footer /></>} />
          <Route path="/privacy" element={<><Navbar /><PrivacyPolicy /><Footer /></>} />
          <Route path="/admin" element={<><Navbar /><AdminPage /><Footer /></>} />
          <Route path="/admin/:id" element={<AdmintRoute/>} />
          <Route path="*" element={<><Navbar /><NotFoundPage /><Footer /></>} />


        </Routes>
        {/* </div> */}


      </div>
    </Router>
  );
}
