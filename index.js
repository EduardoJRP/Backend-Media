const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const database = module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }

    try {
        mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});
        console.log('Connected to the database')
    } catch (error) {
        console.log('Error on database')
    }
}

dotenv.config();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan());


app.listen(8800, () => {
    console.log("Connected to the server")
})

database();