const express = require("express")

const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const app = express()
require("dotenv").config()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())

app.use(cookieParser())
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }),
)
const mongoUri = process.env.MONGO_URI

app.use("/api/auth", require("./routes/auth"))
app.use("/api/vote", require("./routes/vote"))
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB database Connected..."))
  .catch((err) => console.log(err))

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
