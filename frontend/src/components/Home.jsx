import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import '../styles/general.css';

function Home() {
    return (
        <div className="container">
            <main>
               <div class="grid container">
                <div class="grid-item">
                <section id="about">
                    <h2>About Us</h2>
                    <p>At The Sparks Bank, we're committed to providing a safe and secure banking experience for individuals and families. With a variety of accounts, mobile banking options, and helpful resources, we're here to assist you with your financial goals.</p>
                </section>
                </div>

                <div class="grid-item">
                <section id="services">
                    <h2>Our Services</h2>
                    <ul>
                        <li><strong>Effortless Transfers :</strong> Make quick and convenient transfers between your accounts and accounts of other users within our secure system.</li>
                        <li><strong>Send & Receive :</strong> Send or receive money anytime, all within a single platform.</li>
                        <li><strong>Secure & Reliable :</strong> Our robust security measures ensure your transfers are completed safely and efficiently.</li>
                    </ul>
                </section>
                </div>

                <div class="grid-item">
                <section id="customer-list">
                    <h2>Customer List</h2>
                    <p>See the list of our valued customers.</p>
                    <Link to="/customers" className="customer-link">View All Customers</Link>
                </section>
                </div>
               </div>
            </main>
        </div>
    );
}

export default Home;
