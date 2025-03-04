const mysql=require("mysql2");

const connectionString={
    host:"localhost",
    user:"root",
    password: "Mehak@1607",
    database:"florela"
}
let connection = mysql.createConnection(connectionString);

connection.connect((err)=>{
    if(err){
        console.log("Error!",err);
    }else{
        console.log("Database connected successfully");
    }
})
module.exports=connection;