import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage'
import AnimatedContent from './components/AnimatedContent'
import PatientSignup from './pages/PatientSignUp'
import DoctorSignup from './pages/DoctorSignUp'

function App() {

  return(

    <><AnimatedContent
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
            <Route path="/PatientSignUp" element={<PatientSignup/>}/>
            <Route path="/DoctorSignUp" element={<DoctorSignup/>}/>
          </Routes>
        </Router>
      </div>
    </AnimatedContent></>
  )
  
}

export default App
