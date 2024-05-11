"use client"
import axios from "axios";
import { useState } from "react";
import { GoTrash } from "react-icons/go";
import { ImSpinner8 } from "react-icons/im";
import { useRouter } from "next/navigation";
const DeletePollButton = ({ id }) => {
    const [isPending, setIsPending] = useState(false);
    const token = localStorage.getItem("token");
    const router = useRouter()
    async function handleDelete() {
        try {
            setIsPending(true);
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/poll/${id}`, { data: { token } })
            router.refresh()
            setIsPending(false);
        } catch (err) {
            console.log(err);
            setIsPending(false);
        }
    }
    return (
        token && (
            <button disabled={isPending} style={{ cursor: isPending ? "default" : "pointer" }} className="delete-poll-button" onClick={handleDelete}>
                {isPending ? <ImSpinner8 className="spinner" size={20} /> : <GoTrash size={20} />}
            </button>
        )
    );
};

export default DeletePollButton;