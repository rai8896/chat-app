function JoinRoom({
  username,
  setUsername,
  room,
  setRoom,
  joinRoom,
}) {

  return (
    <div className="joinChatContainer">

      <h2>Join Chat</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <input
        type="text"
        placeholder="Room ID"
        value={room}
        onChange={(e) =>
          setRoom(e.target.value)
        }
      />

      <button onClick={joinRoom}>
        Join Room
      </button>

    </div>
  );
}

export default JoinRoom;