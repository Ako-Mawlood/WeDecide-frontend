"use client";

import React, { useState, useEffect } from "react";
import { pusherClient } from "../../lib/pusher";
import { FaHandSparkles } from "react-icons/fa";
import Link from "next/link";

const Poll = ({ params }) => {
  const [currentPoll, setCurrentPoll] = useState(null);

  useEffect(() => {
    const fetchCurrentPoll = () => {
      try {
        fetch(`${process.env.NEXT_BACKEND_URL}/polls/${params.id}`)
          .then((res) => {
            return res.json();
          })
          .then((poll) => {
            setCurrentPoll(poll);
          });
      } catch (error) {
        console.error("Error fetching current poll:", error);
      }
    };

    fetchCurrentPoll();
  }, [params.id]);

  useEffect(() => {
    pusherClient.subscribe(`poll-${params.id}`);

    pusherClient.bind("votes", (vote) => {
      console.log(vote);
    });

    return () => {
      pusherClient.unsubscribe(`poll-${params.id}`);
    };
  }, []);

  return (
    <div className="poll-room-wraper">
      <Link className="logo" href="/">
        <FaHandSparkles size={25} />
        <span>WeDecide</span>
      </Link>
      {currentPoll && (
        <>
          <aside className="poll-aside">
            <h1 className="poll-question">{currentPoll.question}</h1>
            {currentPoll.options.map((option, index) => (
              <div key={index}>
                <button>{option}</button>
              </div>
            ))}
          </aside>
          <aside className="result-aside"></aside>
        </>
      )}
    </div>
  );
};

export default Poll;
