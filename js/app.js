//expense.js

var express = require('express');
//Routes for API
var router = express.Router();

//Get ExpensesTracker model
var Expense = require('../models/Expense');

//Add middleware for all requests
router.use(function(req, res, next){
    //do logging
    console.log('request is coming in');
    next(); //proceed to the next routes
});

////landing page
router.get('/', function(req, res){
    res.json({message: 'Hooray! Welcome to Expenses Tracker API!'});
});


//get all expenses
function getExpenses(res){
    Expense.find(function(err, expenses){
            if(err)
                res.send(err);
            res.json(expenses); 
        });
    return res;
}

//add routes that end in /expenses
router.route('/expenses')

    //get all expenses
    .get(function(req, res){
        getExpenses(res);
    })
        
    //create an expense (accessed at POST http://localhost:3000/api/expenses)
    .post(function(req, res){
        var expense = new Expense(); // create a new instance of the ExpensesTracker model
        expense.description = req.body.description; // set the expenses amount (comes from the request)
        expense.amount      = req.body.amount;
        expense.when        = req.body.when;
        
        expense.save(function(err){
            if(err)
                res.send(err);
            //get and return all expenses
            getExpenses(res);
        }); 
        
    });

//add routes that end in /expenses/:expense_id
router.route('/expenses/:expense_id')

    //get the expense with id (accessed at GET http://localhost:8080/api/expenses/:expense_id)
    .get(function(req, res){
        Expense.findById(req.params.expense_id, function(err, expense){
            if (err)
                res.send(err);
            res.json(expense);
        });
    })
    
    //update the expense with id (accessed at GET http://localhost:8080/api/expenses/:expense_id)
    .put(function(req, res){
        
        //use expense model to find the expense we want
        Expense.findByIdAndUpdate(req.params.expense_id, req.body, function(err){
            if (err)
                res.send(err);
            //get and return all expenses
            getExpenses(res);
            
        });
    })

    //delete the expense with id (accessed at GET http://localhost:8080/api/expenses/:expense_id)
    .delete(function(req, res){
        Expense.findByIdAndRemove(req.params.expense_id, req.body, function(err){
            if (err)
                res.send(err);
            //get and return all expenses
            getExpenses(res);
            
        });
        //Expense.remove({
        //    _id: req.params.expense_id
        //}, function(err){ //function(err, expenses){
        //    if (err)
        //        res.send(err);
        //    //get and return all expenses
        //    getExpenses(res);
        //});
    });

//Export Routes =================================================
    
module.exports = router;