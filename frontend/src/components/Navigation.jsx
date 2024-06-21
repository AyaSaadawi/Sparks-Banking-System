import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
    const location = useLocation();
    const hideNav = location.pathname !== '/';

    if (hideNav) {
        return null;
    }

    return (
        <nav>
            <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Our Services</a></li>
                <li><a href="#customer-list">Customer List</a></li>
                <li><a href="#contact">Contact Us</a></li>
            </ul>
        </nav>
    );
}

export default Navigation;
