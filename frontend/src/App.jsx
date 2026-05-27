import { useState } from "react";
import io from "socket.io-client";

import JoinRoom from "./components/JoinRoom";
import Chat from "./components/Chat";

const socket = io("http://localhost:5000");

function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {

    if (username !== "" && room !== "") {

      socket.emit("join_room", {
        username,
        room,
      });

      setShowChat(true);
    }
  };

  return (
    <div className="app">

      {!showChat ? (

        <JoinRoom
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
          joinRoom={joinRoom}
        />

      ) : (

        <Chat
          socket={socket}
          username={username}
          room={room}
        />

      )}

    </div>
  );
}

export default App;