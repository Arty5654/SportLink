import React from 'react';

const Leaderboard = ({ scores, mode, setMode }) => {
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
                        <li key={player._id['friend']}>
                            <span className="name">{player._id['friend']}</span>
                            <span className="elo">{player.elo}</span>
                        </li>
                    ))
                    : scores.map(player => (
                        <li key={player._id['friend']}>
                            <span className="name">{player._id['friend']}</span>
                            <span className="elo">{player.wins}W - {player.losses}L</span>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default Leaderboard;