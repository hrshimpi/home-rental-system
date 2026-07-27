const express = require('express')
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const PORT  = process.env.PORT;
const dbURI = process.env.db_URI;
const dbURI2 = process.env.db_URI2;

const app = express();

var corsOptions = {
    origin:['http://localhost:3001', 'http://localhost:4200'],
    optionsSuccessStatus:200,
}

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.set("strictQuery", false);

// mongoose.connect('mongodb://127.0.0.1/test')
//     .then(()=> console.log("this is creating!"))
//     .catch(err => console.log("err:",err));
mongoose.connect(dbURI2)
    .then(()=> app.listen(PORT, ()=> console.log(`App listening on port ${PORT}!`)))
    .catch(err=> console.log(err) );

app.use(authRoutes);
app.use(chatRoutes);
// app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app;
