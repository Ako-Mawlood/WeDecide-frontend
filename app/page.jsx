import AddPoll from "./components/pages/home/AddPoll";
import Link from "next/link";
const getPolls = async () => {
  const res = await fetch("http://localhost:3001/polls");
  const polls = await res.json();
  return polls;
};
const HomePage = async () => {
  const polls = await getPolls();
  console.log(polls);
  return (
    <>
      <main className="home-wraper">
        <div className="polls-header">
          <h1>{polls ? "Current polls:" : "No available polls "}</h1>
          <AddPoll />
        </div>

        <div className="poll-list">
          {polls.map((poll) => (
            <div key={poll.id} className="poll">
              <h1>{poll.question}</h1>
              <Link href={`/${poll.id}`}>Enter poll</Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default HomePage;
