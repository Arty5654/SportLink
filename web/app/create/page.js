"use client"
import React, {useEffect, useState} from 'react';
import './creating.css';
import axios from 'axios';
import User from "@app/User";

const createPage = () => {

    const [user, setUser] = useState(new User());
    const [friends, setFriends] = useState([]);
    const [checkedFriends, setCheckedFriends] = useState({});
    const [currentParticipants, setCurrentParticipants] = useState(1);
    const [participants, setParticipants] = useState([]); // New state to track participants' email
    const [value, setValue] = useState(1);  // Initial value for the slider

    useEffect(() => {
        const currentUser = JSON.parse(sessionStorage.getItem("user"));
        setUser(currentUser);

    }, []);


    useEffect( () => {
        if (user['email'] !== undefined) {
            axios.post('http://localhost:5000/fetch_friends', {

                email: user['email']
            })
                .then(response => {
                    setFriends(response.data.friends);
                    console.log('Data received:', response.data);
                    const initialCheckedState = response.data.friends.reduce((acc, friend) => {
                        acc[friend._id] = false;
                        return acc;
                    }, {});
                    setCheckedFriends(initialCheckedState);
                })
                .catch(error => {
                    console.error('Error making the API call:', error);
                });
        }
    },[user])
    useEffect(() => {

            if (user["email"] !== undefined) {

                setParticipants([...participants, user["email"]]);
            }
        }
    , [user])
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
        currentParticipants: currentParticipants,
        maxParticipants: 0,
    });
    const handleCheckboxChange = (friendId, friendEmail) => {
        const updatedState = { ...checkedFriends, [friendId]: !checkedFriends[friendId] };

        // Directly set the updated state without a function callback
        setCheckedFriends(updatedState);

        // Update current participants count and participants' email list outside the setState callback
        if (updatedState[friendId]) {
            setCurrentParticipants(currentParticipants + 1);
            setParticipants([...participants, friendEmail]);
        } else {
            setCurrentParticipants(currentParticipants - 1);
            setParticipants(participants.filter(email => email !== friendEmail));
        }
    };
    const handleSubmit = () => {
        // Logic to handle data submission (e.g., API call) can go here
        console.log(teamData);
        axios.post('http://localhost:5000/create', {
            title: teamData['title'],
            description: teamData['description'],
            city: teamData['city'],
            open: teamData['open'],
            sport: teamData['sport'],
            currentParticipants: teamData['currentPartipants'],
            maxParticipants: teamData['maxParticipants'],
            type: selected,
            participants: participants,
            skill: value
        })
            .then(response => {
                console.log('Data received:', response.data);
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
         <div>
             <h2>Friends List</h2>
             <ul>
                 {friends.map(friend => (
                     <li key={friend._id}>

                         <div>Email: {friend.friend}</div>
                         <input
                             type="checkbox"
                             checked={checkedFriends[friend._id] || false}
                             onChange={() => handleCheckboxChange(friend._id, friend.friend)}                         />
                     </li>
                 ))}
             </ul>
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
                 <div>
                     Current Participants: {currentParticipants}
                 </div>
                 <input type="number" name="maxParticipants" placeholder="Max Participants" onChange={handleChange} />
                 <div>
                     <input
                         type="range"
                         min="1"
                         max="1000"
                         value={value}
                         onChange={(e) => setValue(e.target.value)}
                     />
                     <p>Skill Cap: {value}</p>
                </div>
                 <button onClick={handleSubmit}>Create Team</button>
             </div>
         </div>
     </div>

    );
}

export default createPage;
