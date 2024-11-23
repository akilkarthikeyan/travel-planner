import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import UserPlans from './Components/UserPlans';
import UserPlanDetails from './Components/UserPlanDetails';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route exact path="/users/:id/plans" element={<UserPlans/>}/>
        <Route exact path="/plans/:id" element={<UserPlanDetails/>}/>
      </Routes>
    </div>

  );
}

export default App;
