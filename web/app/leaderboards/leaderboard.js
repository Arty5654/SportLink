import React, { useEffect, useState } from "react";
import axios from 'axios';

const Leaderboard = ({ scores, mode, setMode, friends, setScores}) => {

    const [sortedScores, setSortedScores] = useState([]);

    useEffect(() => {
        fetchAndUpdateScores();
    }, [friends]); // Only refetch when friends change

    const fetchAndUpdateScores = () => {
        axios.post('http://localhost:5000/stats', { friends })
            .then(response => {
                setScores(response.data);
            })
            .catch(error => {
                console.error('Error making the API call:', error);
            });
    };

    useEffect(() => {
        const sorted = [...scores];
        if (mode === 'ELO') {
            sorted.sort((a, b) => b.elo - a.elo);
        } else if (mode === 'Win Record') {
            // Sort by wins in descending order
            sorted.sort((a, b) => b.wins - a.wins);
        }
        setSortedScores(sorted);
    }, [mode, scores]);

    return (
        <div className="leaderboard">
            <h2>Leaderboard</h2>
            <div className="switch-buttons">
                <button onClick={() => setMode('ELO')} className={mode === 'ELO' ? 'active' : ''}>ELO</button>
                <button onClick={() => setMode('Win Record')} className={mode === 'Win Record' ? 'active' : ''}>Win Record</button>
            </div>
            <ul>
                {sortedScores.map(player => (
                    <li key={player._id}>
                        <span className="name">{player._id}</span>
                        <span className="elo">{mode === 'ELO' ? player.elo : `${player.wins}W - ${player.losses}L`}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Leaderboard;