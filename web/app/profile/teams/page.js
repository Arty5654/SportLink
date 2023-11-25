"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@components/profileSidebar';

const TeamCard = ({ team }) => {
    return (
        <div className="relative border border-gray-400 rounded-xl px-4 py-6 mb-4 h-64 shadow-lg">
            <h1 className="font-semibold cursor-pointer">
                {team.name}
            </h1>
            <p className="text-sm text-gray-500 pb-4 cursor-pointer">
                Leader: {team.leader}
            </p>
            <p className="text-sm pb-4 cursor-pointer">
                Members: {team.members}
            </p>
            <p className="text-sm pb-4 cursor-pointer">
                Size: {team.size}
            </p>
            <p className="text-sm pb-4 cursor-pointer">
                Max Team Size: {team.maxSize}
            </p>
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

    return (
        <div className="w-full">
            <div className="flex gap-8">
                <div className="w-1/4">
                    <Sidebar active="teams_and_tourneys"/>
                </div>
                <div className="w-3/4">
                    <h1 className="font-semibold text-3xl pb-8">Public Teams</h1>
                    <div className="grid grid-cols-3 gap-4">
                        {teams.map((curr_team, index) => (
                            <TeamCard key={index} team={curr_team} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamsPage;
