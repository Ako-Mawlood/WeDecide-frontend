import AddPoll from "./components/pages/home/AddPoll";
import Link from "next/link";
import { FaHandSparkles } from "react-icons/fa";

const getPolls = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/poll`);
  const polls = await res.json();
  return polls;
};
const HomePage = async () => {
  const polls = await getPolls();
  return (
    <>
      <Link className="logo" href="/">
        <FaHandSparkles size={25} />
        <span>WeDecide</span>
      </Link>

      <main className="home-wraper">
        <div className="polls-header">
          <h1>{polls ? "Current polls:" : "No available polls"}</h1>
          <AddPoll />
        </div>

        <div className="poll-list">
          {polls.map((poll) => (
            <div key={poll.id} className="poll">
              <h1>{poll.name}</h1>
              <Link href={`/poll/${poll.id}`}>Enter poll</Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default HomePage;
