const db=require("./db/db");

db.query("update users set username='admin12' where userid=5")
.then((data)=>{
    console.log(data);
})

// rowCount; delete



