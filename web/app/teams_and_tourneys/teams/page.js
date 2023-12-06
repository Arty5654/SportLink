"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";

const TeamCard = ({ team, currUser }) => {
    const router = useRouter();
    const isLeaderOrMember = team.leader === currUser.username || team.members.includes(currUser.username);
    console.log(isLeaderOrMember)
    const join_team = async () => {
        if (isLeaderOrMember) {

            alert("Already a part of this Team!")
        } else {

            team.size = team.size + 1
            axios.post('http://localhost:5000/join_team', {
                user: currUser.email,
                _id: team._id,
                num: team.size
            })
                .then(response => {
                    alert("Joined Team!");
                    router.push("/");
                })
                .catch(error => {
                    console.error('Error making the API call:', error);
                });
        }
    };

    return (
        <div className="relative border border-gray-400 rounded-xl px-4 py-6 mb-4 h-64 shadow-lg">
            <h1 className="font-semibold cursor-pointer">
                {team.name}
            </h1>
            <p className="text-sm text-gray-500 pb-4 cursor-pointer">
                Leader: {team.leader}
            </p>
            <p className="text-sm pb-4 cursor-pointer">
                Members: {team.members.map((member, index) => (
                <span key={index}>{member}{index < team.members.length - 1 ? ', ' : ''}</span>
            ))}
            </p>
            <p className="text-sm pb-4 cursor-pointer">
                Size: {team.size}
            </p>
            <p className="text-sm pb-4 cursor-pointer">
                Max Team Size: {team.maxSize}
            </p>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={join_team}
            >
                Join Team
            </button>
        </div>
    );
};

function TeamsPage() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        async function fetchTournaments() {
            try {
                const response = await axios.get('http://localhost:5000/get_public_teams');
                setTeams(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        }
        fetchTournaments();
    }, []);

    const currentUser = JSON.parse(sessionStorage.getItem("user"));

    return (
        <div className="w-full flex pb-64">
            <div className="w-full text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
                <div className="w-full">
                    <h1 className="font-semibold text-3xl pb-8">Public Teams</h1>
                    <div className="grid grid-cols-3 gap-4">
                        {teams.map((curr_team, index) => (
                            <TeamCard key={index} team={curr_team} currUser={currentUser} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamsPage;
