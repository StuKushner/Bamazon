// Initialize npm packages used
var mysql = require("mysql");
var inquirer = require("inquirer");

// Uses the connection variable to connect to a MySQL Database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Username
	user: "root",

	// Password
	password: "",
	database: "bamazon_DB"
});

// If connection is successful, load the menu
connection.connect(function(err){
	if (err) throw err;
	runSearch();
});

// Load the manager options and pass in the products data from the database
function runSearch() {
	inquirer.prompt({
		name: "action",
		type: "list",
		message: "What would you like to do?",
		choices: [
		"View Products For Sale",
		"View Low Inventory",
		"Add To Inventory",
		"Add New Product",
		]
	})
	.then(function(answer){
		switch(answer.action) {
			case "View Products For Sale":
			productsForSale();
			break;

			case "View Low Inventory":
			lowInventory();
			break;

			case "Add To Inventory":
			addToInventory();
			break;

			case "Add New Product":
			addNewProduct();
			break;
		}
	});
}

// Get all product data from the database
function productsForSale() {
	var query = "SELECT * FROM products HAVING stock_quantity > 0";
	connection.query(query, function(err, res){
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
			console.log("-----------------------------");
		}
	runSearch();
	});
}

// Check all of the products with less than 5 items
function lowInventory() {
	var query = "SELECT * FROM products HAVING stock_quantity < 5";
	connection.query(query, function(err, res){
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
			console.log("-----------------------------");
		}
	runSearch();
	});
}

// Add an item to the inventory
function addToInventory() {
	inquirer.prompt([
		{
			name: "item",
			type: "input",
			message: "What would you like to add more of?"
		},
		{
			name: "quantity",
			type: "input",
			message: "How much of this product would you like to add?",
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}
	]).then(function(answer){
		connection.query(
			"UPDATE products SET ? WHERE ?",
			[
				{
					product_name: answer.item,
				},
				{
					stock_quantity: answer.quantity
				},
			],
			function(error) {
				if (error) throw err;
				console.log("Product successfully updated!");
				connection.query("SELECT * FROM products", function(err, res) {
					for (var i = 0; i < res.length; i++) {
						console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
						console.log("-----------------------------");
					}
					runSearch();
				});
			}
		);
	});
}

// Add a new product to the store
function addNewProduct() {
	inquirer.prompt([
		{
			name: "item",
			type: "input",
			message: "What item would you like to put into the store?"
		},
		{
			name: "department",
			type: "input",
			message: "What department is this item in?"
		},
		{
			name: "price",
			type: "input",
			message: "How much does this item cost?"
		},
		{
			name: "quantity",
			type: "input",
			message: "How much of this product would you like to add?",
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}
	]).then(function(answer){
		connection.query(
			"INSERT INTO products SET ?",
			{
				product_name: answer.item,
				department_name: answer.department,
				price: answer.price,
				stock_quantity: answer.quantity
			},
			function(err) {
				if (err) throw err;
				console.log("Item successfully added!");
				connection.query("SELECT * FROM products", function(err, res) {
					for (var i = 0; i < res.length; i++) {
						console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
						console.log("-----------------------------");
					}
					runSearch();
				});
			}
		);
	});
}
