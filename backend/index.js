const express = require('express')
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const dbURI = process.env.MONGODB_URI;

const app = express();

var corsOptions = {
    origin:['http://localhost:3001', 'http://localhost:4200'],
    optionsSuccessStatus:200,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.set("strictQuery", false);

mongoose.connect(dbURI)
    .then(()=> app.listen(PORT, ()=> console.log(`App listening on port ${PORT}!`)))
    .catch(err=> console.log(err) );

app.use(authRoutes);
app.use(chatRoutes);

module.exports = app;
