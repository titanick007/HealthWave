const express =require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes/index.js');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');


const app=express();
const port=4000;

// Configure express-session
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/session-store',
  collection: 'sessions'
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day (adjust as needed)
    secure: false, // Set to true in production if using HTTPS
    httpOnly: true,
    sameSite: 'strict'
  }
}));



//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Parse JSON bodies
app.use('/',routes.router);


app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');


//Creating an express server
app.listen(port,()=>{
  console.log(`listening on port number ${port}`);
})

