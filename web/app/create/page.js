"use client"
import React, { useState } from 'react';
import './creating.css';
import axios from 'axios';

const createPage = () => {
    const [selected, setSelected] = useState('team'); // 'team' or 'event'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeamData(prevState => ({ ...prevState, [name]: value }));
    }
    const [teamData, setTeamData] = useState({
        title: "",
        desc: "",
        city: "",
        open: true,
        sport: "",
        currentParticipants: 0,
        maxParticipants: 0
    });
    const handleSubmit = () => {
        // Logic to handle data submission (e.g., API call) can go here
        console.log(teamData);
        axios.post('http://localhost:5000/create', {
            data: teamData
        })
            .then(response => {
                console.log('Data received:', response.data);
                setResponseData(response.data);
            })
            .catch(error => {
                console.error('Error making the API call:', error);
            });
    }
    return (
     <div>
        <div className={`switch-container ${selected === 'team' ? 'team-selected' : 'event-selected'}`}>
            <div
                className="switch-option"
                onClick={() => setSelected('team')}
            >
                Create a Team
            </div>
            <div
                className="switch-option"
                onClick={() => setSelected('event')}
            >
                Create an Event
            </div>

        </div>
         <div className={"team-container"}>
             <div className="team-card">
                 <input type="text" name="title" placeholder="Title" onChange={handleChange} />
                 <textarea name="desc" placeholder="Description" onChange={handleChange}></textarea>
                 <input type="text" name="city" placeholder="City" onChange={handleChange} />
                 <label>
                     Open:
                     <input type="checkbox" name="open" checked={teamData.open} onChange={() => setTeamData(prevState => ({ ...prevState, open: !prevState.open }))} />
                 </label>
                 <input type="text" name="sport" placeholder="Sport" onChange={handleChange} />
                 <input type="number" name="currentParticipants" placeholder="Current Participants" onChange={handleChange} />
                 <input type="number" name="maxParticipants" placeholder="Max Participants" onChange={handleChange} />
                 <button onClick={handleSubmit}>Create Team</button>
             </div>
         </div>
     </div>

    );
}

export default createPage;
