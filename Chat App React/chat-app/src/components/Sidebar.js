import React from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const rooms = ["First-room", "Second-room", "Third-room"];
  const user = useSelector((state) => state.user);
  if (!user) {
    return <></>;
  } else {
    return (
      <>
        <h2>Available Rooms</h2>
        <ListGroup>
          {rooms.map((room, idx) => {
            return <ListGroup.Item key={idx}>{room}</ListGroup.Item>;
          })}
        </ListGroup>
        <h2>Online Users</h2>
      </>
    );
  }
};

export default Sidebar;
