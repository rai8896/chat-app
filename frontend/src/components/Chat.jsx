import { useEffect, useState } from "react";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // SEND MESSAGE
  const sendMessage = () => {
    if (currentMessage.trim() === "") return;

    const messageData = {
      room,
      username,
      message: currentMessage,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);
    setCurrentMessage("");
  };

  // RECEIVE MESSAGE + USERS (FIXED + CLEAN)
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((prev) => [...prev, data]);
    };

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users.filter((u) => u.room === room));
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("online_users", handleOnlineUsers);

    // cleanup (IMPORTANT FIX)
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("online_users", handleOnlineUsers);
    };
  }, [socket, room]);

  return (
    <div className="chat-window">

      {/* CHAT SECTION */}
      <div className="chat-section">

        {/* HEADER */}
        <div className="chat-header">
          Room: {room}
        </div>

        {/* CHAT BODY */}
        <div className="chat-body">

          {messageList.map((msg, index) => (
            <div
              key={index}
              className={
                msg.username === username
                  ? "message own"
                  : "message"
              }
            >
              <div className="message-content">
                <p>{msg.message}</p>
              </div>

              <div className="message-meta">
                <span>{msg.username}</span>
                <span>{msg.time}</span>
              </div>
            </div>
          ))}

        </div>

        {/* FOOTER */}
        <div className="chat-footer">

          <input
            type="text"
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(e) =>
              setCurrentMessage(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

      {/* ONLINE USERS */}
      <div className="online-users">

        <h3>Online Users</h3>

        {onlineUsers.map((user, index) => (
          <p key={index}>{user.username}</p>
        ))}

      </div>

    </div>
  );
}

export default Chat;
