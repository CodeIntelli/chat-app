import React, { useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import botimg from "../assets/botImg.png";
import { useSignupUserMutation } from "../Services/addApi";
import { AppContext } from "../context/appContext";

function Signup() {
  const { socket } = useContext(AppContext);
  const [name, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [image, setImage] = React.useState("");
  const [uploadImage, setUploadImage] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState("");
  const navigate = useNavigate();
  const [signupUser, { isLoading, error }] = useSignupUserMutation();
  socket.off("new-user").on("new-user", (payload) => {
    console.log(payload);
  });
  function validateImage(e) {
    console.log(e.target.files);
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }
  async function uploadImageCloud() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "latbknla");
    try {
      setUploadImage(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dsidb5jqw/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadImage(false);
      return urlData.url;
    } catch (error) {
      setUploadImage(false);
    }
  }

  let handleSignup = async (e) => {
    e.preventDefault();
    if (!image) {
      return alert("please upload profile image first");
    }
    const url = await uploadImageCloud(image);
    console.log(url);
    // TODO Signup The User Here

    if ((name !== "", email !== "", password !== "", url !== "")) {
      signupUser({ name, email, password, picture: url }).then((data) => {
        if (data) {
          console.log(data);
          navigate("/chat");
        }
      });
    } else {
      alert("Please fill the form");
    }
  };
  return (
    <div>
      <Container>
        <Form
          style={{ marginTop: 150, marginLeft: 150, marginRight: 150 }}
          onSubmit={handleSignup}
        >
          <h1 style={{ textAlign: "center" }}>Create an account</h1>
          <div className="signup_profile-pic__container">
            <img
              src={imagePreview || botimg}
              alt="profile"
              className="signup-profile-pic"
            />
            <label htmlFor="image-upload" className="image-upload-label">
              <i className="fas fa-plus-circle add-picture-icon"></i>
            </label>
            <input
              type="file"
              id="image-upload"
              hidden
              accept="image/png, image/jpg, image/jpeg"
              onChange={validateImage}
            />
          </div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
              value={name}
            />
          </Form.Group>
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
            <Button
              variant="primary"
              type="submit"
              disabled={uploadImage ? true : false}
            >
              {uploadImage ? "Signin you up....." : "Signin"}
            </Button>
          </div>
          <div className="py-4">
            <p className="">
              If you have an account please <Link to="/login">Login</Link>
            </p>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default Signup;
