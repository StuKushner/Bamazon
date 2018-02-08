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

// If connection is successful, show the id of the person connected
connection.connect(function(err){
	if (err) throw err;
	console.log("Connected as id " + connection.threadId + "\n");
});

// Displays all of the items
function displayItems() {
	connection.query("SELECT * FROM products", function(err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		}
	console.log("-----------------------------");
	prompts();
	});
};
displayItems();

// Prompts the user what he or she would like to buy, and how many of it.
function prompts() {
	inquirer.prompt([
		{
			name: "itemid",
			type: "input",
			message: "What is the ID of the item you would like to buy?",
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		},
		{
			name: "productquantity",
			type: "input",
			message: "How many units of this item would you like to buy?",
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}
	]).then(function(answer) {
		// If the person asks for more of what is in stock, a message will appear saying they don't have that much.
		connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?", { item_id: answer.itemid }, function(err, res) {
			if (res[0].stock_quantity < answer.productquantity) {
				console.log("I'm sorry, but we don't have " + answer.productquantity + " of that item.");
				prompts();
			} else {
				// If the purchase is successful, the tabe will be updated, and the price will be given.
				console.log("The total cost of your purchase is $" + (res[0].price * answer.productquantity));
				connection.query("UPDATE products SET ? WHERE ?",
					[
						{
							stock_quantity: (res[0].stock_quantity - answer.productquantity)
						},
						{
							item_id: answer.itemid
						}
					],
					function(err, res) {
						if (err) throw err;
						console.log("Transaction successful.");
						// Display items again to reflect the changes
						displayItems();
					}
				);
			}
		});
	});
}
