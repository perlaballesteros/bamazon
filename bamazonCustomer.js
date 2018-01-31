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
function enterOrder(newQuantity,item_id){
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                quantity:newQuantity
            },
            {
                item_id:item_id
            }
        ],function(err,res){
            console.log(res);
    
        });

}

function productAvail(ans){
    connection.query("SELECT stock_quantity FROM products WHERE ?",{item_id: ans.item_id}, function(err, res) {
        if (err) throw err;
        var newQuantity=res[0].stock_quantity-ans.quantity;
        console.log(res[0].stock_quantity);
        console.log("ans"+ans.quantity);
        console.log(newQuantity);
        console.log(res);

        if(newQuantity>0){
            
            console.log("enough quantity!");
            enterOrder(newQuantity,res.item_id);
        }
        else{
            console.log("Insufficient quantity!");
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
        table.push([(i+1),res[i].item_id,res[i].product_name,res[i].price]);
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
        //console.log(ans)
        productAvail(ans);
        connection.end();
        
    });
}

function readProducts() {
  connection.query("SELECT item_id,product_name, price FROM products", function(err, res) {
        if (err) throw err;
        displayTable(res);
    });   
}


 
