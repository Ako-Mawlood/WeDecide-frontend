import AddPoll from "./components/pages/home/AddPoll";
import Link from "next/link";
import { FaHandSparkles } from "react-icons/fa";
import DeletePollButton from "./components/pages/home/DeletePollButton";

const getPolls = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/poll`, { cache: "no-store" });
  const polls = await res.json();
  return polls;
};
const HomePage = async () => {
  const polls = await getPolls();
  console.log(polls)
  return (
    <>
      <Link className="logo" href="/">
        <FaHandSparkles size={25} />
        <span>WeDecide</span>
      </Link>

      <main className="home-wraper">
        <div className="polls-header">
          <h1>{polls.length !== 0 ? "Current polls:" : "No available polls"}</h1>
          <AddPoll />
        </div>

        <div className="poll-list">
          {polls.map((poll) => (
            <div key={poll.id} className="poll">
              <h1>{poll.name}</h1>
              <div className="poll-buttons-container">
                <Link href={`/poll/${poll.id}`}>Enter poll</Link>
                <DeletePollButton id={poll.id} />
              </div>
            </div>
          ))}
        </div>
      </main >
    </>
  );
};

export default HomePage;
