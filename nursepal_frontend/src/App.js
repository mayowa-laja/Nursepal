import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import {HomePage} from './components/Pages/HomePage';
import {PatientsPage} from './components/Pages/PatientsPage';
import {Login} from './components/Login';
import {Logout} from './components/Logout';
import {Navigation} from './components/Navigations';

function App() {
  return (
    <BrowserRouter>
      <Navigation></Navigation>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/patients' element={<PatientsPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/logout' element={<Logout/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
