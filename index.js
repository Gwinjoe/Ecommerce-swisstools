if (process.env.NODE_ENV != "production") require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;
const path = require("path");
const DATABASE_URI = process.env.DATABASE_URI;
const connectDB = require("./config/connectDB");
const passport = require("passport");
const session = require("express-session");
const adminRoutes = require("./routes/admin");
const rootRoutes = require("./routes/root")
const cors = require("cors");

const MongoStore = require("connect-mongo");

const sessionStore = MongoStore.create({ mongoUrl: DATABASE_URI, collectionName: "sessions" });
connectDB(DATABASE_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/", express.static(path.join(__dirname, "frontend")));
app.use("/admin", express.static(path.join(__dirname, "frontend")));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  }
}))

require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());
//app.use((req, res, next) => {
//  console.log(req.session);
//  console.log(req.user);
// next();
//})


app.use("/admin", adminRoutes);
app.use("/", rootRoutes);
app.use("/api", require("./routes/api/routes"))

app.all("/{*splat}", (req, res) => {
  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, "frontend", "404.html"));
  } else if (req.accepts("json")) {
    res.status(404).json({ "message": "JSON specific resource can't be found" })
  }
})

app.use((err, req, res, next) => {
  if (err) {
    res.sendStatus(500);
    console.log(`${err.name} : ${err.message}`)
  }

})
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
})
