"use client"
import React, {useEffect, useState} from 'react';
import './leadercss.css';
import Leaderboard from './leaderboard';
import axios from "@node_modules/axios/index";
import User from "@app/User";

function App() {
    const [user, setUser] = useState(new User());
    const [friends, setFriends] = useState([]);

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
                })
                .catch(error => {
                    console.error('Error making the API call:', error);
                });
        }
    },[user])
    useEffect(() => {
        if (friends !== [] || friends !== undefined) {
            axios.post('http://localhost:5000/stats', {

                friends: friends
            })
                .then(response => {
                    setScores(response.data);
                    console.log('Data received:', response.data);
                })
                .catch(error => {
                    console.error('Error making the API call:', error);
                });
        }

    }, [friends]);
    const [scores, setScores] = useState([]);

    const [mode, setMode] = useState('ELO');

    return (
        <div className="App">
            <Leaderboard scores={scores} mode={mode} setMode={setMode} />
        </div>
    );
}

export default App;
