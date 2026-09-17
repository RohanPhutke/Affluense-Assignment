const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")

dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const startServer = async () => {
    await connectDB();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server started listening on port ${PORT}`)
    })
}


startServer()
