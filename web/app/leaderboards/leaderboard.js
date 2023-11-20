import React from 'react';
import axios from 'axios';

const Leaderboard = ({ scores, mode, setMode, friends , setScores}) => {
    const handleUpdateStats = (user, deltaWins, deltaLosses) => {
        const updatedStats = {
            user: user._id,
            wins: user.wins + deltaWins,
            losses: user.losses + deltaLosses,
            elo: (user.elo) + (20 * deltaWins) - (20 * deltaLosses)
        };

        axios.post('http://localhost:5000/update_stats', updatedStats)
            .then(response => {
                console.log(response.data);
                deltaLosses = 0
                deltaWins = 0

            })
            .catch(error => {
                console.error('Error making the API call:', error);
            });

        axios.post('http://localhost:5000/stats', {

            friends: friends
        })
            .then(response => {
                setScores(response.data);
                console.log(scores)
                console.log('Data received:', response.data);
            })
            .catch(error => {
                console.error('Error making the API call:', error);
            });
    };

    return (
        <div className="leaderboard">
            <h2>Leaderboard</h2>
            <div className="switch-buttons">
                <button onClick={() => setMode('ELO')} className={mode === 'ELO' ? 'active' : ''}>ELO</button>
                <button onClick={() => setMode('Win Record')} className={mode === 'Win Record' ? 'active' : ''}>Win Record</button>
            </div>
            <ul>
                {mode === 'ELO'
                    ? scores.sort((a, b) => b.elo - a.elo).map(player => (
                        <li key={player._id}>
                            <span className="name">{player._id}</span>
                            <span className="elo">{player.elo}</span>
                            <button onClick={() => handleUpdateStats(player, 1, 0)} style={{ backgroundColor: 'green' }}>+W</button>
                            <button onClick={() => handleUpdateStats(player, 0, 1)} style={{ backgroundColor: 'red' }}>-L</button>

                        </li>
                    ))
                    : scores.map(player => (
                        <li key={player._id}>
                            <span className="name">{player._id}</span>
                            <span className="elo">{player.wins}W - {player.losses}L</span>
                            <button onClick={() => handleUpdateStats(player, 1, 0)} style={{ backgroundColor: 'green' }}>+W</button>
                            <button onClick={() => handleUpdateStats(player, 0, 1)} style={{ backgroundColor: 'red' }}>-L</button>

                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default Leaderboard;