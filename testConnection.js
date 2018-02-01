var mysql = require("mysql");
var Table = require("cli-table");
var inquirer=require("inquirer");

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
  var query=connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",
        [30,890],
        function(err,res){
            console.log(query.)
            connection.end();
        }
    );
});
