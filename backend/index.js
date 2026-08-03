const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const dbURI = process.env.MONGODB_URI;

const app = express();

// A real CSP, not helmet's permissive default. This API only ever
// serves its own JSON and the /uploads static folder - no inline
// scripts/styles and no third-party origins are ever loaded by it, so
// everything is locked to 'self'. (If this Express app ever also
// serves the Angular frontend's HTML directly, which currently loads
// Google Fonts, scriptSrc/styleSrc would need to expand to include
// fonts.googleapis.com/fonts.gstatic.com.)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", 'data:'],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
        },
    },
}));

// Comma-separated list, e.g. ALLOWED_ORIGINS=https://app.example.com,https://admin.example.com
// Falls back to the local dev origins if unset.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3001,http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

var corsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
    // Auth here is Bearer tokens, not cookies, so credentials:true is
    // deliberately left off - it isn't needed, and turning it on is
    // one more thing that can be misconfigured (it also forces CORS
    // to echo a specific origin instead of allowing '*').
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// Strips any request key starting with $ or containing . from body/
// query/params (e.g. a login payload of {"email": {"$gt": ""}}) -
// closes NoSQL query-operator injection. Global and before routes so
// nothing downstream ever sees an unsanitized key.
app.use(mongoSanitize());
// Uploaded property photos were saved to disk but never actually
// served - there was no static route for them at all, so every photo
// URL the API returned 404'd. addProperty's photos never worked end
// to end without this.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.set("strictQuery", false);

mongoose.connect(dbURI)
    .then(()=> app.listen(PORT, ()=> console.log(`App listening on port ${PORT}!`)))
    .catch(err=> console.log(err) );

app.use(authRoutes);
app.use(chatRoutes);

// Without this, Express's default error handler took over for
// anything thrown/passed to next(err) below this point - including
// multer hitting its new file-size/count limits - and returned a raw
// HTML page with a full stack trace and internal filesystem paths.
// Discovered while testing the multer limits added above. Never leak
// error internals to the client; log them server-side instead.
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
});

module.exports = app;
