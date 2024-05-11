"use client";

import React, { useState, useEffect } from "react";
import { pusherClient } from "../../../lib/pusher";
import { FaHandSparkles } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { GoCheckCircleFill } from "react-icons/go";

const Poll = ({ params }) => {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [votePending, setVotePending] = useState(false);
  const [voted, setVoted] = useState(null);

  function format(seconds) {
    if (seconds <= 0) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    var formattedTime =
      minutes.toString().padStart(2, "0") +
      ":" +
      remainingSeconds.toString().padStart(2, "0");

    return formattedTime;
  }

  useEffect(() => {
    fetchCurrentPoll();
  }, [params.id]);

  const fetchCurrentPoll = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/poll/${params.id}`;
      if (localStorage.getItem("id")) {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/poll/${params.id
          }?id=${localStorage.getItem("id")}`;
      }

      await axios.get(url).then((res) => {
        localStorage.setItem("id", res.data.voterId);
        setCurrentPoll(res.data);
        setVoted(res.data.voted);
      });
    } catch (error) {
      console.error("Error fetching current poll:", error);
    }
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(Math.floor((new Date(currentPoll?.endAt) - new Date()) / 1000));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [currentPoll]);

  useEffect(() => {
    pusherClient.subscribe(`poll-${params.id}`);

    pusherClient.bind("votes", (vote) => {
      setCurrentPoll((prevPoll) => {
        const updatedOptions = prevPoll.options.map((option) => {
          if (option.id === vote.id) {
            // Increment the votes for the voted option
            return { ...option, votes: option.votes + 1 };
          }
          return option;
        });

        // Update the totalVotes
        const updatedTotalVotes = prevPoll.totalVotes + 1;

        return {
          ...prevPoll,
          options: updatedOptions,
          totalVotes: updatedTotalVotes,
        };
      });
    });

    return () => {
      pusherClient.unsubscribe(`poll-${params.id}`);
    };
  }, [params.id]);

  async function vote(id) {
    setVotePending(true);
    await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/poll/${params.id}/vote/${id}`, {
        id: localStorage.getItem("id"),
      })
      .then((res) => {
        localStorage.setItem("id", res.data.voterId);
        setVoted(res.data.id)
      });
  }

  return (
    <div className="poll-room-wrapper">
      <Link className="logo" href="/">
        <FaHandSparkles size={25} />
        <span>WeDecide</span>
      </Link>
      {currentPoll && timeLeft != null && (
        <div className="poll-container">
          <div id="qrcode" style={{ marginTop: 32 }}>
            <QRCodeSVG size={256} value={window.location.href} />
          </div>
          <aside className="poll-aside">
            <h1
              className="poll-question"
              style={{ textDecoration: timeLeft <= 0 ? "line-through" : "none" }}
            >
              {currentPoll.name}
            </h1>
            <p className="votes-number">Time left: {format(timeLeft)}</p>
            <p className="votes-number">Total Votes: {currentPoll?.totalVotes}</p>
            {currentPoll.options.map((option) => (
              <div style={{ width: "100%" }} key={option.id}>
                <button
                  onClick={() => vote(option.id)}
                  disabled={voted || timeLeft <= 0 || votePending}
                  className={
                    voted || timeLeft <= 0 || votePending
                      ? "option-button"
                      : "option-button option-button-hover"
                  }
                  style={{
                    cursor: voted || timeLeft <= 0 || votePending ? "default" : "pointer",
                    border: voted === option.id ? "1.5px solid #331ab0" : "",
                  }}
                >
                  <div>
                    {voted === option.id && (
                      <GoCheckCircleFill className="check" size={15} />
                    )}
                    {option.name}
                  </div>
                  <span>
                    ({option.votes}) (
                    {option.votes
                      ? Math.floor((option.votes / currentPoll.totalVotes) * 100)
                      : 0}
                    %)
                  </span>
                  <div
                    className="progress"
                    style={{ width: `${(option.votes / currentPoll.totalVotes) * 100}%` }}
                  />
                </button>
              </div>
            ))}
          </aside>
        </div>
      )}
    </div>
  );
};

export default Poll;
