const mongoose = require("mongoose");
const { DB_URL } = require("../Config");
const consola = require("consola");
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    consola.success(`Mongo DB Connected`);
  })
  .catch((error) => {
    consola.error(error);
  });
