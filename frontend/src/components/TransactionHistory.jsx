import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TransactionHistory.css';

const TransactionHistory = ({ customerId }) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`https://nameless-ravine-70714-09e99584a93d.herokuapp.com/customer/${customerId}/transactions`);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transaction history:', error);
            }
        };

        fetchTransactions();
    }, [customerId]);

    return (
        <div className="transaction-history">
            <h2>Transaction History</h2>
            <ul>
                {transactions.map((transaction, index) => (
                    <li key={index}>
                        <strong>{transaction.sender_name}</strong> sent {transaction.amount} to <strong>{transaction.receiver_name}</strong> on {new Date(transaction.transaction_date).toLocaleString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionHistory;
