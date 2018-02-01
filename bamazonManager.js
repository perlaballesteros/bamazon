var mysql = require("mysql");
var Table = require("cli-table");
var inquirer=require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazon"
  });
function addNewInventory(ans){
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
          item_id: ans.item_id,
          product_name: ans.item_name,
          department_name:ans.item_department,
          price:ans.item_price,
          stock_quantity:ans.item_quantity
        },
        function(err, res) {
            if (err) throw err;
            connection.end();
        }
      );
}

function newInventoryprompt(){
    inquirer.prompt([{
        name: "item_id",
        type: "input",
        message: "Enter the new ItemID: ",
    },
    {
        name: "item_name",
        type: "input",
        message: "Enter the Item Name: ",
    },
    {
        name: "item_price",
        type: "input",
        message: "Enter the Item Price: ",
    },
    {
        name: "item_quantity",
        type: "input",
        message: "Enter the Item Stock Quantity: ",
    },
    {
        name: "item_department",
        type: "input",
        message: "Enter the Item Department: ",
    }
    ]).then(function(ans){
        //console.log(ans);
        addNewInventory(ans);
    });

}  

function addInventory(item_id,newQuantity){
    var query=connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",
    [newQuantity,item_id],
    function(err,res){
        if (err) throw err;
        //console.log(connection.query);
        connection.end();
    }
);
}
  function addInventoryprompt(){
    inquirer.prompt([{
        name: "item_id",
        type: "input",
        message: "Enter the ItemID for which You Wish to Add More Inventory",
    },
    {
        name: "newQuantity",
        type: "input",
        message: "Enter the New Stock Quantity"
    },
    {
        name:"confirm",
        type:"confirm",
        message:"ARE YOU SURE YOU WANT TO ENTER THE NEW INVENTORY?"
    }]
    )
    .then(function(ans) {
        console.log(ans);
        if(ans.confirm===true){
            addInventory(ans.item_id,ans.newQuantity);
        }
    });
  }

  function lowInventory(){
    var query= connection.query("SELECT item_id,product_name, price,stock_quantity FROM products WHERE stock_quantity<5", function(err, res) {
        if (err) throw err;
        displayTable(res);
        
    }); 
  }

  function displayTable(res){ 
    var table = new Table({
        head: ["ItemID", "Name","Price","Quantity"],
        colWidths: [10, 50 ,20,10],
    });

    // table is an Array, so you can `push`, `unshift`, `splice` and friends 
    for(var i=0;i<res.length;i++){
        table.push([res[i].item_id,res[i].product_name,res[i].price,res[i].stock_quantity]);
    }  
    console.log(table.toString()); 
    
}

  function readProducts() {
    var query= connection.query("SELECT id,item_id,product_name, price,stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        displayTable(res);
    });   
}
  
function mainOptions(){
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "Your Options: ",
        choices:
            ["View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
            ]
    })
    .then(function(ans) {
        switch(ans.options){
            case "View Products for Sale":
                readProducts();
                connection.end();
            break;
            case "View Low Inventory":
                lowInventory();
                connection.end();
            break;
            case "Add to Inventory":
                addInventoryprompt();
            break;
            case "Add New Product":
                newInventoryprompt();
            break;
        }
        
    });
}
//RUN THE PROGRAM
mainOptions();