var mysql = require("mysql");
var Table = require('cli-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  readProducts();
});

function readProducts() {
  connection.query("SELECT item_id,product_name, price FROM products", function(err, res) {
    if (err) throw err;

    // instantiate 
    var table = new Table({
    head: ["#",'ItemID', 'Name','Price'],
    colWidths: [5,10, 25 ,20],
    });
 
    // table is an Array, so you can `push`, `unshift`, `splice` and friends 
    for(var i=0;i<res.length;i++){
        table.push(
        [(i+1),res[i].item_id,res[i].product_name,res[i].price]
    );
}

 
console.log(table.toString());
connection.end();


  });
}


 
