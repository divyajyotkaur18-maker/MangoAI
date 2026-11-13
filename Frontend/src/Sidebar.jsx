
import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

const API_URL = "https://mangoai-backend.onrender.com";

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats
    } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${API_URL}/api/chat/thread`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const res = await response.json();

            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setAllThreads(filteredData);
        } catch (err) {
            console.error("Error fetching threads:", err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(
                `${API_URL}/api/chat/thread/${newThreadId}`
            );

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const res = await response.json();

            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.error("Error changing thread:", err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(
                `${API_URL}/api/chat/thread/${threadId}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const res = await response.json();

            console.log(res);

            setAllThreads(prev =>
                prev.filter(thread => thread.threadId !== threadId)
            );

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.error("Error deleting thread:", err);
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img
                    src="/MangoAI.png"
                    alt="MangoAI logo"
                    className="logo"
                />
                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li
                        key={idx}
                        onClick={() => changeThread(thread.threadId)}
                        className={
                            thread.threadId === currThreadId
                                ? "highlighted"
                                : ""
                        }
                    >
                        {thread.title}

                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>By Sneh &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;
