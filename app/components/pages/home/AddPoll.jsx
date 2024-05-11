"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { MdOutlineClose } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { GoTrash } from "react-icons/go";
import { ImSpinner8 } from "react-icons/im";

const AddPollModule = () => {
  const [showAddPollModal, setShowAddPollModal] = useState(false);
  const [pollName, setPollName] = useState("");
  const [pollTime, setPollTime] = useState(60);
  const [options, setOptions] = useState(["", ""]);
  const [isPending, setIsPending] = useState(false);

  const [token, setToken] = useState(null);

  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  function toggleModal() {
    setShowAddPollModal((prevShowAddPollModal) => !prevShowAddPollModal);
  }
  function addOption(e) {
    e.preventDefault();
    setOptions((prevOptions) => [...prevOptions, ""]);
  }
  function handleRemoveOption(index) {
    const newOptions = options.filter((option, i) => {
      return i !== index;
    });
    setOptions(newOptions);
  }
  function handleOptionChange(index, value) {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }
  async function handleSubmit(e) {
    e.preventDefault();

    const time = new Date();
    time.setSeconds(time.getSeconds() + parseInt(pollTime));

    const payload = {
      name: pollName,
      endAt: time,
      options: options,
      token: localStorage.getItem("token"),
    };

    setIsPending(true);

    await axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/poll`, payload)
      .then(() => {
        router.refresh();
      })
      .finally(() => {
        setIsPending(false);
        setOptions(["", ""]);
        setPollName("");
        setShowAddPollModal(false);
      });
  }

  // Don't show the button if the user is not logged in
  if (token) {
    return <></>;
  }

  return (
    <>
      <button
        onClick={toggleModal}
        disabled={showAddPollModal}
        className="add-poll-button"
      >
        Add poll
      </button>
      {showAddPollModal && (
        <>
          <div onClick={toggleModal} className="modal-background"></div>
          <main className="modal-container">
            <button onClick={toggleModal} className="close-modal-button">
              <MdOutlineClose size={25} />
            </button>
            <h1>Add new poll</h1>

            <form
              disabled={isPending}
              onSubmit={handleSubmit}
              style={{
                opacity: isPending ? 0.8 : 1,
                cursor: isPending ? "not-alowed" : "default",
              }}
              className="add-poll-form"
            >
              <label>
                <span>Question</span>
                <input
                  onChange={(e) => setPollName(e.target.value)}
                  value={pollName}
                  type="text"
                  required
                  placeholder="What is your favorate color"
                />
              </label>

              <span>Options</span>
              <div className="option-container">
                {options.map((option, index) => (
                  <div key={index} className="option">
                    <input
                      className="option-input"
                      placeholder={`Option ${index + 1}`}
                      type="text"
                      required
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleRemoveOption(index);
                      }}
                      className="remove-option-button"
                    >
                      <GoTrash size={25} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addOption} className="add-option-button">
                <IoAdd size={20} />
                Add option
              </button>
              <label>
                <span>Time (In seconds)</span>
                <input
                  onChange={(e) => setPollTime(e.target.value)}
                  value={pollTime}
                  type="number"
                  required
                />
              </label>
              <button
                onSubmit={handleSubmit}
                type="submit"
                className="create-option-button"
              >
                {isPending ? <ImSpinner8 className="spinner" size={25} /> : "Create poll"}
              </button>
            </form>
          </main>
        </>
      )}
    </>
  );
};

export default AddPollModule;
