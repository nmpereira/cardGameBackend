const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const dbUri = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine
app.set("view engine", "ejs");

// static files
app.use(express.static("public"));

// Import routes
const prompts = require("./routes/prompts/prompts");

// routes
app.use("/api", prompts);

app.get("/", (req, res) => {
  res.status(200).render("index");
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
    }
  }
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to cardGameBackend" });
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
