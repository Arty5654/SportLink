import React, { useState, useEffect } from 'react';

function IP() {
    const [ip, setIp] = useState('');

    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => setIp(data.ip))
            .catch(error => console.error('Error fetching IP:', error));
    }, []);

    return (
        <div>
            <h1>Your IP Address:</h1>
            <p>{ip}</p>
        </div>
    );
}

export default IP;