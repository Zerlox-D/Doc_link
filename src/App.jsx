import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage'
import SignUpChoice from "./pages/SignUpChoice";
import PatientSignup from './pages/PatientSignUp'
import DoctorSignup from './pages/DoctorSignUp'
import Login from "./pages/Login";
import Home from "./pages/Home";
import VerificationPending from "./pages/VerificationPending";
import PatientProfile from "./pages/PatientProfile";
import SearchDoctors from "./pages/SearchDoctors";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorProfileViewer from "./pages/DoctorProfileViewer";
import BookAppointment from "./pages/BookAppointment";
import AdminDashboard from "./pages/AdminDashboard";
import './index.css'


function App() {

  return(

    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/SignUpChoice" element={<SignUpChoice/>}/>
            <Route path="/PatientSignUp" element={<PatientSignup/>}/>
            <Route path="/DoctorSignUp" element={<DoctorSignup/>}/>
            <Route path="/Login" element={<Login/>}/>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/VerificationPending" element={<VerificationPending/>}/>
            <Route path="/PatientProfile" element={<PatientProfile/>}/>
            <Route path="/SearchDoctors" element={<SearchDoctors/>}/>
            <Route path="/DoctorProfile" element={<DoctorProfile/>}/>
            <Route path="/doctor/:id" element={<DoctorProfileViewer/>}/>
            <Route path="/Book" element={<BookAppointment/>}/>
            <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
          </Routes>
        </Router>
      </div>
    </>
  )
  
}

export default App
