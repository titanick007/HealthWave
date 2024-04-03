const express =require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes/index.js');



const app=express();
const port=4000;

// Configure express-session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));



//Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Parse JSON bodies
app.use('/',routes.router);



//Creating an express server
app.listen(port,()=>{
  console.log(`listening on port number ${port}`);
})

