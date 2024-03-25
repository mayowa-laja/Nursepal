import React, { useState, useEffect} from 'react';
import '../css/Navigation.css';
import { useLocation } from 'react-router-dom';
import image from '../Images/nursePal_log.png';

export function Navigation() {
    const [isAuth, setIsAuth] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (localStorage.getItem('loggedIn') !== null) {
            setIsAuth(true);
        }
    }, [isAuth]);

    return (
        <nav className="navbar sticky-top">
            <a href="/" className="ms-3 navbar-link"><img src={image} alt="Webisite logo" style={{ width: '50px', height: 'auto' }}/></a>
            <ul id = "navbar-custom" className="nav nav-underline me-3">
                {isAuth ? (
                    <>
                        <li className="nav-item">
                            <a href="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>home</a>
                        </li>
                        <li className="nav-item">
                            <a href="/patients" className={`nav-link ${location.pathname === '/patients' ? 'active' : ''}`}>patients</a>
                        </li>
                        <li className="nav-item">
                            <a href="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>about</a>
                        </li>
                        <li className="nav-item">
                            <a href="/help" className={`nav-link ${location.pathname === '/help' ? 'active' : ''}`}>help</a>
                        </li>
                    </>
                ) : (null)}
                <li className="nav-item">
                    {isAuth ? (
                        <a href="/logout" className={`nav-link ${location.pathname === '/logout' ? 'active' : ''}`}>logout</a>
                    ) : (
                        <a href="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>login</a>
                    )}
                </li>
            </ul>
        </nav>
    )
}