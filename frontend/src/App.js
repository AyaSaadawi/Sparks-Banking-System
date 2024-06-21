import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import CustomerList from './components/CustomerList';
import CustomerDetails from './components/CustomerDetails';
import Navigation from './components/Navigation';
import './styles/App.css';

function App() {
    return (
        <Router>
            <div>
                <div id="header">
                    <Link to="/" className="home-link">
                        <img src="/images/picture.jpg" alt="Bank Icon" className="bank-icon" />
                    </Link>
                    <h1>The Sparks Bank</h1>
                </div>
                <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/customer/:id" element={<CustomerDetails />} />
            </Routes>
            </div>
        </Router>
    );
}

export default App;
