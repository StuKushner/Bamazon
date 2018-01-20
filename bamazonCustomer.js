var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",

	password: "",
	database: "bamazon_DB"
});

connection.connect(function(err){
	if (err) throw err;
	console.log("Connected as id " + connection.threadId + "\n");
});

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
		connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?", { item_id: answer.itemid }, function(err, res) {
			if (res[0].stock_quantity < answer.productquantity) {
				console.log("I'm sorry, but we don't have " + answer.productquantity + " of that item.");
				prompts();
			} else {
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
						displayItems();
					}
				);
			}
		});
	});
}
