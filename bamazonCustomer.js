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
  readProducts();
});
//------------------------------------------------------------------
function enterOrder(newQuantity,item_id){
    var query=connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",
        [newQuantity,item_id],
        function(err,res){
        }
    );
}

function productAvail(ans){
    var query=connection.query("SELECT price,stock_quantity,item_id FROM products WHERE ?",{item_id: ans.item_id}, function(err, res) {
        if (err) throw err;
        var newQuantity=res[0].stock_quantity-ans.quantity;
        var orderTotal=ans.quantity*res[0].price;
        if(newQuantity>0){  
            console.log("Your Total for this Order is:$"+orderTotal);
            enterOrder(newQuantity,res[0].item_id);
            connection.end();
        }
        else{
            console.log("Insufficient quantity!");
            console.log("Quantity: "+ res[0].stock_quantity);
        }
       
    });
}

function displayTable(res){ 
    var table = new Table({
        head: ["#",'ItemID', 'Name','Price'],
        colWidths: [5,10, 50 ,20],
    });
     
    // table is an Array, so you can `push`, `unshift`, `splice` and friends 
    for(var i=0;i<res.length;i++){
        table.push([res[i].id,res[i].item_id,res[i].product_name,res[i].price]);
    }  
    console.log(table.toString()); 
    promptUser();
}

function promptUser(){
    inquirer.prompt([
        {name: "item_id",
        type: "input",
        message: "Enter the ItemID of the Product You Wish to Purchase: "
        },
        {
        name: "quantity",
        type: "list",
        message: "Quantity",
        choices:["1","2","3","4","5","6","7","8","9","10"]
        }
    ])
    .then(function(ans){
        productAvail(ans);
    });
}

function readProducts() {
    var query= connection.query("SELECT id,item_id,product_name, price FROM products", function(err, res) {
        if (err) throw err;
        displayTable(res);
    });   
}


 
