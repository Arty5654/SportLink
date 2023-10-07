/*
Author: Anirudh Hemige
Created: Oct 1
@ahemige, Purdue University
This will serve as the Events/Teams Page
*/
import React, { useState } from 'react';

function CreateEvent() {
    const [formData, setFormData] = useState({
        event_name: '',
        location: '',
        sport: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-4 p-4 bg-white shadow-lg">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Event Name:
                </label>
                <input
                    type="text"
                    name="event_name"
                    onChange={handleInputChange}
                    value={formData.event_name}
                    className="w-full p-2 border rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Location:
                </label>
                <input
                    type="text"
                    name="location"
                    onChange={handleInputChange}
                    value={formData.location}
                    className="w-full p-2 border rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Sport:
                </label>
                <input
                    type="text"
                    name="sport"
                    onChange={handleInputChange}
                    value={formData.sport}
                    className="w-full p-2 border rounded-md"
                    required
                />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
                Create Event
            </button>
        </form>
    );
}

export default CreateEvent;
