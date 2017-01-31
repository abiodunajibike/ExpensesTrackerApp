//Model definition for Expenses

//Database config =================================================
var mongoose = require('mongoose');   // mongoose for mongodb

//create a schema
var ExpenseSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    when: {type: Date, default: Date.now},
});

//create a model based on the schema
module.exports = mongoose.model('Expense', ExpenseSchema);