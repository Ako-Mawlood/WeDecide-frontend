"use client";

import React, { useState, useEffect } from "react";
import { pusherClient } from "../../lib/pusher";
import { FaHandSparkles } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";

const Poll = ({ params }) => {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    fetchCurrentPoll();
  }, [params.id]);

  const fetchCurrentPoll = async () => {
    try {
      await axios.get(`${process.env.BACKEND_URL}/poll/${params.id}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: "no-cors",
          credentials: 'include'
        }).then((response) => {
          setCurrentPoll(response.data);
        })
      // fetch(`https://2e15-185-240-17-50.ngrok-free.app/poll/${params.id}`,
      //   {
      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json'
      //     },
      //     mode: "no-cors",
      //     credentials: 'include'
      //   })
      //   .then((res) => {
      //     return res.json();
      //   })
      //   .then((poll) => {
      //     setCurrentPoll(poll);
      //   });
    } catch (error) {
      console.error("Error fetching current poll:", error);
    }
  };

  useEffect(() => {
    pusherClient.subscribe(`poll-${params.id}`);

    pusherClient.bind("votes", (vote) => {
      fetchCurrentPoll();
    });

    return () => {
      pusherClient.unsubscribe(`poll-${params.id}`);
    };
  }, []);

  async function vote(id) {
    setVoted(true);
    await fetch(`${process.env.BACKEND_URL}/poll/${params.id}/vote/${id}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        mode: "no-cors",
        credentials: 'include'
      })
  }

  return (
    <div className="poll-room-wraper">
      <Link className="logo" href="/">
        <FaHandSparkles size={25} />
        <span>WeDecide</span>
      </Link>
      {currentPoll && (
        <>
          <aside className="poll-aside" style={{ opacity: voted ? 0.5 : 1 }}>
            <h1 className="poll-question">{currentPoll.name}</h1>
            {currentPoll.options.map((option, index) => (
              <div style={{ width: '100%' }} key={option.id}>
                option.id
                <button onClick={() => vote(option.id)} disabled={voted} className="option-button" style={{ cursor: voted ? 'default' : "pointer" }}>
                  {option.name}
                  <span> ({option.votes ? Math.floor((option.votes / currentPoll.totalVotes) * 100) : 0}%)</span>
                  <div className="progress" style={{ width: `${(option.votes / currentPoll.totalVotes) * 100}%` }} />
                </button>
              </div>
            ))}
          </aside>
        </>
      )
      }
    </div >
  );
};

export default Poll;
