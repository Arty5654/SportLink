/* 
Author: Anirudh Hemige
Created: Oct 9, 2023
@ahemige, Purdue University
*/


"use client"
import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { UserContext } from "@app/UserContext";
import Selection from "./selectionTool"
import Search from "./search"

export default function Games() {
    /* Selection Tool */
    const [alignment, setAlignment] = useState("Teams");

    /* Fields */
    const [sport, setSport] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [location, setLocation] = useState('');
    const [skill, setSkill] = useState(0);

    const [EventList, setEventList] = useState([]);

    const [TeamList, setTeamList] = useState([]);


    /* User */

    /* API Calls */
    const createTeam = async () => {

        const Query = { maxPlayers: parseInt(maxPlayers, 10), sport: sport, location: location, skill: parseInt(skill, 10), gameID: 0};
        console.log(typeof(skill));
        try {
            const response = await axios.post('http://localhost:5000/update_games', Query);

            // Handle success (e.g., show a message or update state)
        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error("Error creating team:", error);
        }
    };
    function handleJoinTeam(team) {
        console.log(`Joining team: ${team}`);
        // Here, you can handle the logic for joining a team
        // This could involve updating state, making an API call, etc.
    }
    const createEvent = async () => {

        const Query = { maxPlayers: parseInt(maxPlayers, 10), sport: sport, location: location, skill: parseInt(skill, 10), gameID: 1};

        try {
            const response = await axios.post('http://localhost:5000/update_games', Query);
            console.log("Creating Event");

            // Handle success (e.g., show a message or update state)
        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error("Error creating event:", error);
        }
    };
    const searchTeam = async () => {

        const Query = { maxPlayers: parseInt(maxPlayers, 10), sport: sport, location: location, skill: parseInt(skill, 10), gameID: 2};

        try {
            const response = await axios.post('http://localhost:5000/update_games', Query);

            // Handle success

            const objectsArray = response.data.data.map(item => ({
                gameID: item.gameID,
                location: response.data._id,
                maxPlayers: item.maxPlayers,
                skill: item.skill,
                sport: item.sport
            }));

            console.log("Joining Team");
            setTeamList(objectsArray);

        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error("Error joining team:", error);
        }
    };
    const searchEvent = async () => {

        const Query = { maxPlayers: parseInt(maxPlayers, 10), sport: sport, location: location, skill: parseInt(skill, 10), gameID: 3};

        try {
            const response = await axios.post('http://localhost:5000/update_games', Query);

            // Handle success
            const objectsArray = response.data.data.map(item => ({
                gameID: item.gameID,
                location: response.data._id,
                maxPlayers: item.maxPlayers,
                skill: item.skill,
                sport: item.sport
            }));

            console.log("Joining Event");
            setEventList(objectsArray);

        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error("Error joining event:", error);
        }
    };
    return (
        <div>
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
                { alignment === "Teams" && <button className="create-btn" onClick={createTeam}>Create Team</button>}
                { alignment === "Teams" && <button className="join-btn" onClick={searchTeam}>Search Teams</button>}
                { alignment === "Events" && <button className="create-btn" onClick={createEvent}>Create Event</button>}
                { alignment === "Events" && <button className="join-btn" onClick={searchEvent}>Search Event</button>}
            </div>
            <br/>
        </div>

            <div>

                {alignment=="Events" &&
                    EventList.map((team, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ flex: 1 }}>Location: {team.location}</span>
                            <span style={{ flex: 1 }}>Max Players: {team.maxPlayers}</span>
                            <span style={{ flex: 1 }}>Skill: {team.skill}</span>
                            <span style={{ flex: 1 }}>Sport: {team.sport}</span>
                            <button onClick={() => handleJoinTeam(team)}>Join Team</button>
                        </div>
                    ))
                }
            </div>
            <div>
                {alignment=="Teams" &&
                    TeamList.map((team, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ flex: 1 }}>Location: {team.location}</span>
                            <span style={{ flex: 1 }}>Max Players: {team.maxPlayers}</span>
                            <span style={{ flex: 1 }}>Skill: {team.skill}</span>
                            <span style={{ flex: 1 }}>Sport: {team.sport}</span>
                            <button onClick={() => handleJoinTeam(team)}>Join Team</button>
                        </div>
                    ))
                }
            </div>


        </div>


    );
}
