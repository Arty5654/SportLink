/*
Author: Anirudh Hemige
Created: Oct 9
@ahemige, Purdue University
*/

import React, { useState } from 'react';

export default function GamesPage() {
    return (
        <div className="games-page">
            <h1>Games</h1>
            <button onClick={() => console.log('Create Team Clicked')}>Create Team</button>
            <button onClick={() => console.log('Join Team Clicked')}>Join Team</button>
            <button onClick={() => console.log('Create Event Clicked')}>Create Event</button>
            <button onClick={() => console.log('Join Event Clicked')}>Join Event</button>
        </div>
    );
}


