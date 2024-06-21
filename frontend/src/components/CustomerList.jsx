import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Tooltip from './Tooltip';
import './CustomerList.css';
import '../styles/animations.css';
import BackButton from './BackButton';

function CustomerList() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get('https://nameless-ravine-70714-09e99584a93d.herokuapp.com/customers')
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                console.error('Error fetching customers:', error);
            });
    }, []);

    return (
      <div className="container">
        <div className="customers-list">
            <h1>All Customers</h1>
            <div className="customer-items">
                {customers.map(customer => (
                    <Tooltip
                        key={customer.id}
                        text={`Email: ${customer.email}\nBalance: ${customer.current_balance}`}
                    >
                        <Link to={`/customer/${customer.id}`} className="customer-link">
                            <div className="customer-item slide-in">
                                <img 
                                    src={`./images/customer${customer.id}.jpg`} 
                                    alt={customer.name} 
                                    className="customer-image" 
                                    onError={(e) => { e.target.onerror = null; e.target.src = './images/default-avatar.png'; }} 
                                />
                                <span className="customer-name">{customer.name}</span>
                            </div>
                        </Link>
                    </Tooltip>
                ))}
            </div>
        </div>
        <BackButton />
      </div>
    );
}

export default CustomerList;


