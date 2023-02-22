const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const dbUri = process.env.MONGODB_URI;
const User = require("./models/users/users");
const { addUserToDb } = require("./routes/user/user");
const morgan = require("morgan");

app.use(morgan("dev"));

app.use(require("./routes/admin/admin"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine
app.set("view engine", "ejs");

// static files
app.use(express.static("public"));

// Import routes
const prompts = require("./routes/prompts/prompts");
const randomCard = require("./routes/convoCards/randomCard");
// const admin = require("./routes/admin/admin");

const { auth } = require("express-openid-connect");

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "a long, randomly-generated string stored in env",
  baseURL: "http://localhost:3000",
  clientID: "oVjtFSudUMlxc5tuA0hKGEo4MiVmYYwW",
  issuerBaseURL: "https://cardgamedev.us.auth0.com",
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// routes

app.use("/api", prompts);
app.use("/random", randomCard);

app.get("/", addUserToDb, async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.status(200).render("index", { userData: req.oidc.user });
  }
  return res.status(200).render("index", { userData: null });
});

app.get("/addcontent", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // find user in users db, if not found, create user
    // find user in db
    const user = await User.findOne({ email: req.oidc.user.email });
    if (!user) {
      // create user in db
      const newUser = new User({ ...req.oidc.user, role: "user" });
      console.log("req.oidc.user", newUser);
      await newUser.save();
    }

    res.status(200).render("cardInputIndex", { userData: req.oidc.user });
  } else {
    res.status(200).redirect("/login");
  }
});

mongoose.set("strictQuery", false);

// Connect to mongoose
mongoose.connect(
  dbUri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "cardGame",
  },
  (err) => {
    if (err) {
      console.log("Error connecting to database: ", err);
    } else {
      console.log(
        `Connected to database: ${mongoose.connection.host}:${mongoose.connection.name}`
      );
      app.listen(port, () =>
        console.log(`Server is running on http://localhost:${port}`)
      );
    }
  }
);
