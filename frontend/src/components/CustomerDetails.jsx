import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TransferForm from './TransferForm';
import TransactionHistory from './TransactionHistory';
import LoadingSpinner from './LoadingSpinner'; 
import BackButton from './BackButton';
import './CustomerDetails.css';


function CustomerDetails() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true); 

    const fetchCustomerDetails = async () => {
        try {
            setLoading(true); 
            const response = await axios.get(`https://nameless-ravine-70714-09e99584a93d.herokuapp.com/customer/${id}`);
            setCustomer(response.data);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchCustomerDetails();
    }, [id]);

    if (loading) {
        return <LoadingSpinner />; 
    }

    if (!customer) {
        return <div>Loading...</div>;
    }

    

    return (
        <div className="customer-details container">
            <header className="customer-header">
               <h1>{customer.name}</h1>
            </header>

            <div className="customer-profile">
                    
                <p>Email: {customer.email}</p>
                <p>Current Balance: ${customer.current_balance}</p>
                    
                <TransactionHistory customerId={customer.id} />
                <TransferForm customerId={customer.id} onTransferSuccess={fetchCustomerDetails} />
                <BackButton />
  
            </div>
            
        </div>
       
    );
}

export default CustomerDetails;

