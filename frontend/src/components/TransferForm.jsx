import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/animations.css';
import './TransferForm.css';


const TransferForm = ({ customerId, onTransferSuccess }) => {
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
    const [customers, setCustomers] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [message, setMessage] = useState('');
   

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('https://nameless-ravine-70714-09e99584a93d.herokuapp.com/customers');
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    
    useEffect(() => {
        console.log('Message state updated:', message);
    }, [message]);


    const handleSubmit = (event) => {
        event.preventDefault();
        if (amount <= 0) {
            setMessage('Amount must be greater than zero.');
            return;
        }
        setShowConfirmation(true);
    };

    const handleConfirmTransfer = async () => {
        try {
            const response = await axios.post('https://nameless-ravine-70714-09e99584a93d.herokuapp.com/transfer', {
                sender_id: customerId,
                receiver_id: receiverId,
                amount: parseFloat(amount),
            });
            if (response.status === 200) {
                console.log('Transfer successful:', response.data);
                setShowConfirmation(false);
                setMessage('Transfer successful!');

                if (onTransferSuccess) {
                    onTransferSuccess();
                }

                setReceiverId('');
                setAmount('');
            } else {
                console.error('Transfer failed with status:', response.status);
                setMessage('Transfer failed.');
            }    
        } catch (error) {
            console.error('Error making transfer:', error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.error);
            } else {
                setMessage('An unexpected error occurred.');
            }
        }
    };

    const handleCancelTransfer = () => {
        setShowConfirmation(false);
        setMessage('Transfer cancelled.');
    };

    return (
        <div className="transfer-form-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Receiver:</label>
                    <select value={receiverId} onChange={(e) => setReceiverId(e.target.value)} required>
                        <option value="">Select a receiver</option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Amount:</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
                <button type="submit">Transfer</button>
            </form>

            {showConfirmation && (
                <div className="popup slide-in">
                    <p>Are you sure you want to transfer ${amount} to {customers.find(c => c.id === receiverId)?.name}?</p>
                    <button onClick={handleConfirmTransfer}>Confirm</button>
                    <button onClick={handleCancelTransfer}>Cancel</button>
                </div>
            )}


            {message && (
                <div className={`message ${message.includes('successful') ? 'success' : 'error'} fade-in`}>
                    {message}
                </div>
            )}

            
        </div>
    );
};

export default TransferForm;
