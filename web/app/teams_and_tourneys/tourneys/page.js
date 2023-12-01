"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";

const TournamentCard = ({ tournament }) => {
    const router = useRouter();
    const handleTournamentClick = () => {
        // Navigate to the tournament detail page or handle click
        router.push(`/teams_and_tourneys/tourneyDetails?id=${tournament._id}`);
    };

    return (
        <div className="relative border border-gray-400 rounded-xl px-4 py-6 mb-4 h-64 shadow-lg">
            <h1 className="font-semibold cursor-pointer" onClick={handleTournamentClick}>
                {tournament.sport} - Skill Level: {tournament.skillLevel}
            </h1>
            <p className="text-sm text-gray-500 pb-4 cursor-pointer" onClick={handleTournamentClick}>
                Number of Teams: {tournament.teamCount}
            </p>
            <p className="text-sm pb-4 cursor-pointer" onClick={handleTournamentClick}>
                Tournament Duration: {tournament.tournamentDuration} days
            </p>
            <p className="text-sm pb-4 cursor-pointer" onClick={handleTournamentClick}>
                Match Duration: {tournament.matchDuration} minutes
            </p>
            <p className="text-sm pb-4 cursor-pointer" onClick={handleTournamentClick}>
                Location: {tournament.location}
            </p>
        </div>
    );
};

function TournamentsPage() {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        async function fetchTournaments() {
            try {
                const response = await axios.get('http://localhost:5000/get_tournaments');
                setTournaments(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        }
        fetchTournaments();
    }, []);

    return (
        <div className="w-full flex pb-64">
            <div className="w-full text-left pl-16 border rounded-2xl px-8 py-10 border-gray-300">
                <h1 className="font-semibold text-3xl pb-8">Tournaments</h1>
                <div className="grid grid-cols-3 gap-4">
                    {tournaments.map((tournament, index) => (
                        <TournamentCard key={index} tournament={tournament} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TournamentsPage;
