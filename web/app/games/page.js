/* 
Author: Anirudh Hemige
Created: Oct 9, 2023
@ahemige, Purdue University
*/


"use client"

import { useState, useEffect, useContext } from "react";
import { UserContext } from "@app/UserContext";
import Selection from "./selectionTool"
import Search from "./search"

export default function Games() {

    /* Selection Tool */
    const [alignment, setAlignment] = useState("Teams");

    /* Fields */
    const [maxPlayers, setMaxPlayers] = useState('');
    const [sport, setSport] = useState('');
    const [location, setLocation] = useState('');
    const [skill, setSkill] = useState('');

    /* User */

    /* API Calls */
    const createTeam = async () => {

        const Query = { maxPlayers: maxPlayers, sport: sport, location: location, skill: skill};

        try {
            const response = await axios.post('http://localhost:5000/', Query);

            // Handle success (e.g., show a message or update state)
            console.log(response.data);
        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error("Error creating team:", error);
        }
    };
    const createEvent = async () => {

        const Query = { maxPlayers: maxPlayers, sport: sport, location: location, skill: skill};

        try {
            const response = await axios.post('http://localhost:5000/', Query);

            // Handle success (e.g., show a message or update state)
            console.log(response.data);
        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error("Error creating event:", error);
        }
    };
    const joinTeam = async () => {

        const Query = { maxPlayers: maxPlayers, sport: sport, location: location, skill: skill};

        try {
            const response = await axios.post('http://localhost:5000/', Query);

            // Handle success (e.g., show a message or update state)
            console.log(response.data);
        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error("Error joining team:", error);
        }
    };
    const joinEvent = async () => {

        const Query = { maxPlayers: maxPlayers, sport: sport, location: location, skill: skill};

        try {
            const response = await axios.post('http://localhost:5000/', Query);

            // Handle success (e.g., show a message or update state)
            console.log(response.data);
        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error("Error joining event:", error);
        }
    };
    return (
        <div className="wrap-all">
            <br/>

            <div className="padding-containers">
                <Selection setAlignment={setAlignment} alignment={alignment} /> 
            </div>
            <br/>
            <div className="padding-containers">
                <Search setMaxPlayers={setMaxPlayers} maxPlayers={maxPlayers} sport={sport} setSport={setSport} location={location} setLocation={setLocation} skill={skill} setSkill={setSkill}/>
            </div>
            <br/>

            <div className="button-group padding-containers">
                { alignment == "Teams" && <button className="create-btn" >Create Team</button>}
                { alignment == "Teams" && <button className="join-btn">Search Teams</button>}
                { alignment == "Events" && <button className="create-btn">Create Event</button>}
                { alignment == "Events" && <button className="join-btn">Search Event</button>}
            </div>
            <br/>

        </div>
    );
}