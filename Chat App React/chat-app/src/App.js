import "./App.css";
import Navigation from "./components/Navigation";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useSelector } from "react-redux";
import { useState } from "react";
import { AppContext, socket } from "./context/appContext";
function App() {
  const user = useSelector((state) => state.user);
  // Ganesha Mahadev
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setcurrentRoom] = useState([]);
  const [member, setMember] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessage, setNewMessage] = useState({});

  return (
    <AppContext.Provider
      value={{
        socket,
        rooms,
        setRooms,
        currentRoom,
        setcurrentRoom,
        member,
        setMember,
        messages,
        setMessages,
        privateMemberMsg,
        setPrivateMemberMsg,
        newMessage,
        setNewMessage,
      }}
    >
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          {!user ? (
            <>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
            </>
          ) : (
            <Route path="/chat" element={<Chat />}></Route>
          )}
          <Route
            path="/login"
            element={<Navigate to="/chat" replace />}
          ></Route>
          <Route
            path="/signup  "
            element={<Navigate to="/chat" replace />}
          ></Route>
          <Route path="/chat" element={<Chat />}></Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
