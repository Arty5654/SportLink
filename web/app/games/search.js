import React, { useState } from 'react';
import './gamesStyles.css'; // Assuming you've named the CSS file TeamPage.css

const Search = ({maxPlayers, setMaxPlayers, sport, setSport, skill, setSkill, location, setLocation}) => {
 
  return (
    <div className="header-container">
        <label>Max Players:</label>
        <input 
            type="number" 
            value={maxPlayers} 
            onChange={e => setMaxPlayers(e.target.value)} 
        />

        <label>Sport:</label>
        <input 
            type="text" 
            value={sport} 
            onChange={e => setSport(e.target.value)} 
        />

        <label>Location:</label>
        <input 
            type="text" 
            value={location} 
            onChange={e => setLocation(e.target.value)} 
        />

        <label>Skill (ELO):</label>
        <input 
            type="number" 
            value={skill} 
            onChange={e => setSkill(e.target.value)} 
        />

    </div>
  );
}

export default Search;
