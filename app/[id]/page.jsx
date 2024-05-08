"use client"
import React, { useState, useEffect } from 'react';

const Poll = ({ params }) => {
    const [currentPoll, setCurrentPoll] = useState(null);

    useEffect(() => {
        const fetchCurrentPoll = async () => {
            try {
                const response = await fetch(`http://localhost:3000/polls/${params.id}`);
                const data = await response.json();
                setCurrentPoll(data);
            } catch (error) {
                console.error('Error fetching current poll:', error);
            }
        };

        fetchCurrentPoll();
    }, [params.id]);

    return (
        <div>
            {currentPoll && (
                <div>
                    <h1>{currentPoll.question}</h1>
                    {currentPoll.options.map((option, index) => (
                        <button key={index}>{option}</button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Poll;
