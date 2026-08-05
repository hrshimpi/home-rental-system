require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// Split out of this file (into app.js) so tests can require the
// configured Express app directly and point it at a MongoDB Memory
// Server instance, without this file's side effects (loading real
// .env values, connecting to the real MONGODB_URI, binding a real
// port via app.listen).
const PORT = process.env.PORT || 3001;
const dbURI = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(dbURI)
    .then(()=> app.listen(PORT, ()=> console.log(`App listening on port ${PORT}!`)))
    .catch(err=> console.log(err) );
