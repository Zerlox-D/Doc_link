import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage'
import AnimatedContent from './components/AnimatedContent'
import SignUpChoice from "./pages/SignUpChoice";
import PatientSignup from './pages/PatientSignUp'
import DoctorSignup from './pages/DoctorSignUp'
import Login from "./pages/Login";
import Home from "./pages/Home";
import PatientProfile from "./pages/PatientProfile";
import SearchDoctors from "./pages/SearchDoctors";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorProfileViewer from "./pages/DoctorProfileViewer";
import AdminDashboard from "./pages/AdminDashboard";
import './index.css'


function App() {

  return(

    <>
    <AnimatedContent
      distance={150}
      direction="vertical"
      reverse={true}
      duration={1.2}
      
      initialOpacity={0.2}
      animateOpacity
      scale={1.0}
      threshold={0.2}
      delay={0.3}
    >
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/SignUpChoice" element={<SignUpChoice/>}/>
            <Route path="/PatientSignUp" element={<PatientSignup/>}/>
            <Route path="/DoctorSignUp" element={<DoctorSignup/>}/>
            <Route path="/Login" element={<Login/>}/>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/PatientProfile" element={<PatientProfile/>}/>
            <Route path="/SearchDoctors" element={<SearchDoctors/>}/>
            <Route path="/DoctorProfile" element={<DoctorProfile/>}/>
            <Route path="/DoctorProfileViewer" element={<DoctorProfileViewer/>}/>
            <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
          </Routes>
        </Router>
      </div>
    </AnimatedContent>
    </>
  )
  
}

export default App
