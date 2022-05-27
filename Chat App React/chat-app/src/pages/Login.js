import React, { useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";

import { useLoginUserMutation } from "../Services/addApi";
function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { socket } = useContext(AppContext);
  const navigate = useNavigate();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const handleLogin = (e) => {
    e.preventDefault();
    //TODO: LOgin Logic
    loginUser({ email, password }).then((data) => {
      if (data) {
        navigate("/chat");
      }
    });
  };
  return (
    <div>
      <Container>
        <Form style={{ margin: 250 }} onSubmit={handleLogin}>
          <h1 style={{ textAlign: "center" }}>Login to your account</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="d-grid gap-2 mt-5">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
          <div className="py-4">
            <p className="">
              Don't have an account please <Link to="/signup">Signup</Link>
            </p>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default Login;
