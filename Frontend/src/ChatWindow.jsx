import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {RingLoader} from "react-spinners";


function ChatWindow(){
    const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat, navigate}= useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // set default false value 
    const getReply = async ()=> {
        setLoading(true);
        setNewChat(false);
        console.log("message ", prompt, " threadId ", currThreadId);
        const options={
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })

    };
    try{
       const response = await fetch("http://localhost:8080/api/chat",options);
       const res = await response.json();
       console.log(res);
       setReply(res.reply);
    } catch(err) {
        console.log(err);
    }
    setLoading(false);
}
//Append new chat to prevChats
useEffect(() => {
    if (prompt && reply) {
        setPrevChats(prevChats => ([
            ...prevChats, 
            { role: "user", content: prompt },
            { role: "assistant", content: reply }
        ]));
        setPrompt(""); // 👈 Put setPrompt inside the if block!
    }
}, [reply]);
const handleProfileClick = () =>{
    setIsOpen(!isOpen);
}
const goToSettings = () => { setIsOpen(false); navigate("/settings"); }
const goToUpgrade = () => { setIsOpen(false); navigate("/upgrade"); }
const handleLogoutClick = () => { setIsOpen(false); setShowLogoutConfirm(true); }
const confirmLogout = () => { setShowLogoutConfirm(false); navigate("/logged-out"); }

    return(
        <div className="chatWindow">
            <div className="navbar">
                <span>MangoAI <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
    isOpen &&
    <div className="dropDown">
        <div className="dropDownItem" onClick={goToSettings}><i className="fa-solid fa-gear"></i>Settings</div>
        <div className="dropDownItem" onClick={goToUpgrade}><i className="fa-solid fa-arrow-up-right-from-square"></i>Upgrade plan</div>
        <div className="dropDownItem dropDownItemDanger" onClick={handleLogoutClick}><i className="fa-solid fa-arrow-right-from-bracket"></i>Log out</div>
    </div>
}
{
    showLogoutConfirm &&
    <div className="modalOverlay" onClick={() => setShowLogoutConfirm(false)}>
        <div className="confirmModal" onClick={(e) => e.stopPropagation()}>
            <h3>Log out of MangoAI?</h3>
            <p>Are you sure you want to log out?</p>
            <div className="confirmModalActions">
                <button className="btnGhost" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                <button className="btnDanger" onClick={confirmLogout}>Log Out</button>
            </div>
        </div>
    </div>
}
            <Chat></Chat>
            <RingLoader color="#fff" loading={loading}>

            </RingLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                       value={prompt}
                       onChange={(e) => setPrompt(e.target.value)}
                       onKeyDown={(e) => e.key ==='Enter'? getReply() : ''}
                    >
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    MangoAI can make mistakes. check important info. See Cookie Preferences.
                </p>
              
            </div>
         </div>
    )
}

export default ChatWindow;