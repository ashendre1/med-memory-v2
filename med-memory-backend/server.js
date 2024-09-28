require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const registerRoutes = require('./routes/register');
const reportsRoutes = require('./routes/reports');
const prescriptionRoutes = require('./routes/prescription');
const userSession = require('./routes/userSession');

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's origin
    credentials: true
}));

const port = 9090;

app.use(session({
    secret: 'reallysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use('/register', registerRoutes);
app.use('/reports', reportsRoutes);
app.use('/prescription', prescriptionRoutes);
app.use('/userSession', userSession);


app.listen(port, () => {
    console.log('server is running on port ' + port)
});