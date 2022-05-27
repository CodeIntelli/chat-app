// const e = require("express");
const routes = require("express").Router();
const UserModel = require("../Models/UserModel");

routes.post("/", async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    console.log(req.body);
    const user = await UserModel.create({ name, email, password, picture });
    res.status(201).json(user);
  } catch (err) {
    let msg;
    if (err.code === 11000) {
      msg = "User Already Exist";
    } else {
      msg = err.message;
    }
    res.status(500).json(msg);
  }
});

routes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByCredentials(email, password);
    user.status = "online";
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
module.exports = routes;
