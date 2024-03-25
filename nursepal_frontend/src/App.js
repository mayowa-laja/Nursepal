import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './css/App.css';
import {HomePage} from './components/Pages/HomePage';
import {PatientsPage} from './components/Pages/PatientsPage';
import { PatientDetailPage } from './components/Pages/PatientDetailPage';
import { PatientHealthPage } from './components/Pages/PatientHealthPage';
import {Login} from './components/Pages/Login';
import {Logout} from './components/Logout';
import { About } from './components/Pages/About';
import { Help } from './components/Pages/Help';
import {Navigation} from './components/Navigations';

function App() {
  return (
    <Router>
      <div className="bg">
      <Navigation/>
        <div className="content-container">
          <Routes>
            <Route path='/' element={<HomePage/>} />
            <Route path='/patients' element={<PatientsPage/>} />
            <Route path='/patient' element={<PatientDetailPage/>} />
            <Route path='/health' element={<PatientHealthPage/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/logout' element={<Logout/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/help' element={<Help/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
