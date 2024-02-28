import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import {HomePage} from './components/Pages/HomePage';
import {PatientsPage} from './components/Pages/PatientsPage';
import { PatientDetailPage } from './components/Pages/PatientDetailPage';
import { AdmissionPage } from './components/Pages/AdmissionPage';
import {Login} from './components/Login';
import {Logout} from './components/Logout';
import {Navigation} from './components/Navigations';

function App() {
  return (
    <Router>
      <Navigation></Navigation>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/patients' element={<PatientsPage/>} />
        <Route path='/patient' element={<PatientDetailPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/logout' element={<Logout/>} />
        <Route path='/admission' element={<AdmissionPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
