import React, { useState } from 'react';
import './Tooltip.css';

const Tooltip = ({ text, children }) => {
    const [show, setShow] = useState(false);

    return (
        <div
            className="tooltip-container"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div className="tooltip-box">
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
