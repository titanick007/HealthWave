const mysql= require('mysql');




// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',     
    user: 'root', 
    password: 'user123', 
    database: 'test_db_Hospital' 
  });
  
  // Connect to the database
  connection.connect((error)=>{
    if(!!error){
      console.log(error);
    }else{
      console.log('Connected to MySQL database');
    }
  });

  module.exports=connection;