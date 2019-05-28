const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const passport = require("passport");
const users = require("./routes/api/users");
const courses = require("./routes/api/courses");
const requests = require("./routes/api/requests");
const feedbacks = require("./routes/api/feedbacks");
const enterprises = require("./routes/api/enterprises");

// Bodyparser middleware
app.use(
  cors({
    origin: "http://localhost:8000",
    credentials: true
  })
);

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/users", users);
app.use("/courses", courses);
app.use("/requests", requests);
app.use("/feedbacks", feedbacks);
app.use("/enterprises", enterprises);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
