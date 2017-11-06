var mysql = require('mysql');
var keys = require("./MySQLInformation.js");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: keys.MySQLInformation.host,
    user: keys.MySQLInformation.user,
    password: keys.MySQLInformation.password,
    database: keys.MySQLInformation.database
});


var productsArray = [];
var productToBuyID = 0;
var productToBuyQuantity = 0;
var newProductQuantity = 0;

connection.connect();

connection.query("SELECT * FROM bamazon_db.products;", function(error, results, fields) {
    if (error) throw error;
    for (key in results) {
        var productInformationArray = [];
        productInformationArray.push(results[key].item_id);
        productInformationArray.push(results[key].product_name);
        productInformationArray.push(results[key].department_name);
        productInformationArray.push(results[key].price);
        productInformationArray.push(results[key].stock_quantity);
        productsArray.push(productInformationArray);


    }
    console.log(productsArray);
});


inquirer.prompt([{
    type: "input",
    name: "id",
    message: "What is the item id of the product you would like to buy? First item in the bracket is the ID",
}]).then(function(answers) {
    productToBuyID = parseInt(answers.id);
    inquirer.prompt([{
        type: "input",
        name: "quantity",
        message: "How many units of this product would you like to buy?",
        choices: productsArray
    }]).then(function(answers) {
        if (answers.quantity <= parseInt(productsArray[productToBuyID-1][4])) {
            productToBuyQuantity = parseInt(answers.quantity);
            newProductQuantity = parseInt(productsArray[productToBuyID-1][4]) - productToBuyQuantity;
            let query = connection.query("UPDATE bamazon_db.products SET stock_quantity = ? WHERE item_id = ? AND stock_quantity >=1", [newProductQuantity, productToBuyID], function(error, results, fields) {
                if (error) throw error;
                console.log(results.affectedRows + " record(s) updated");
                totalCost = productToBuyQuantity*productsArray[productToBuyID-1][3];
                console.log(`The total will be $ ${totalCost}`);

            })
            console.log(query.sql);


        } else {
        	console.log("Insufficient quantity!");
        }
    });

});