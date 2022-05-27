import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./messageForm.css";
const MessageForm = () => {
  const user = useSelector((state) => state.user);

  const handleSubmit = () => {};
  return (
    <>
      <div className="message-output">
        {!user && (
          <div className="alert alert-danger">
            Please Login To Access This resource
          </div>
        )}
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter Your Message Here"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="Submit"
              style={{ width: "100%", backgroundColor: "orange" }}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default MessageForm;
