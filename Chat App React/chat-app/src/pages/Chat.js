import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import MessageForm from "../components/MessageForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Chat() {
  // const user = useSelector((state) => state.user);
  // console.log(user);
  // const navigate = useNavigate();
  // if (!user) {
  //   navigate("/login");
  // }
  return (
    <Container>
      <Row>
        <Col md={4}>
          <Sidebar />
        </Col>
        <Col md={8}>
          <MessageForm />
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;
